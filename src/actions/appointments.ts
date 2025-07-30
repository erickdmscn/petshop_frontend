'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch } from './utils'

interface ActionResult {
  error?: string
  success?: boolean
  data?: any
}

export async function createAppointmentOnlyAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const appointmentData = {
      userId: Number(formData.get('userId')),
      petId: Number(formData.get('petId')),
      appointmentDate: formData.get('appointmentDate') as string,
      statusAppointments: Number(formData.get('statusAppointments')),
      totalPrice: Number(formData.get('totalPrice')),
      paymentStatus: Number(formData.get('paymentStatus')),
      paymentMethod: Number(formData.get('paymentMethod')),
      notes: (formData.get('notes') as string) || '',
    }
    if (
      !appointmentData.userId ||
      !appointmentData.petId ||
      !appointmentData.appointmentDate
    ) {
      return { error: 'Usuário, pet e data são obrigatórios' }
    }

    const response = await authenticatedFetch(
      '/v1/appointment/CreateAppointment',
      {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao criar agendamento' }
    }

    let appointmentId = null
    try {
      const data = await response.json()
      appointmentId = data.appointmentId || data.id
    } catch (error) {
      console.error(
        'Erro ao processar resposta da criação de agendamento:',
        error,
      )

      const locationHeader = response.headers.get('location')
      if (locationHeader) {
        const idMatch = locationHeader.match(/\/(\d+)$/)
        if (idMatch) {
          appointmentId = parseInt(idMatch[1])
        }
      }
    }

    if (!appointmentId) {
      return { error: 'Agendamento criado mas ID não foi retornado pela API' }
    }

    revalidatePath('/appointments')

    return {
      success: true,
      data: { appointmentId },
    }
  } catch (error) {
    console.error('Erro ao criar agendamento:', error)
    return { error: 'Erro interno do servidor' }
  }
}

export async function addServicesOnlyAction(
  appointmentId: number,
  serviceIds: number[],
): Promise<ActionResult> {
  try {
    if (!appointmentId) {
      return { error: 'ID do agendamento é obrigatório' }
    }

    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return { error: 'Pelo menos um serviço deve ser selecionado' }
    }

    try {
      await getAppointmentByIdAction(appointmentId)
    } catch {
      return { error: `Agendamento ${appointmentId} não encontrado` }
    }

    const endpoint = `/v1/appointment/AddServicesAppointments?aptId=${appointmentId}`

    const response = await authenticatedFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(serviceIds),
    })

    if (!response.ok) {
      let errorData: { message?: string } = {}
      try {
        errorData = await response.json()
      } catch {
        console.error('Erro ao processar resposta da API:', Error)
      }

      return {
        error:
          errorData.message || `Erro ${response.status} ao associar serviços`,
      }
    }

    revalidatePath('/appointments')
    revalidatePath(`/appointments/${appointmentId}`)

    return {
      success: true,
      data: {
        appointmentId,
        serviceIds,
        message: 'Serviços associados com sucesso!',
      },
    }
  } catch (error) {
    console.error('Erro ao associar serviços:', error)
    return { error: 'Erro interno do servidor' }
  }
}

export async function createAppointmentAction(
  formData: FormData,
): Promise<ActionResult> {
  return await createAppointmentOnlyAction(formData)
}

export async function addServicesAppointmentAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const appointmentId = Number(formData.get('appointmentId'))
    const serviceIds = JSON.parse(
      (formData.get('serviceIds') as string) || '[]',
    )

    return await addServicesOnlyAction(appointmentId, serviceIds)
  } catch (error) {
    console.error('❌ Erro ao processar FormData:', error)
    return { error: 'Erro ao processar dados do formulário' }
  }
}

export async function deleteAppointmentAction(
  appointmentId: string,
): Promise<ActionResult> {
  try {
    const response = await authenticatedFetch(
      `/v1/appointment/${appointmentId}`,
      {
        method: 'DELETE',
      },
    )

    if (!response.ok) {
      return { error: 'Erro ao deletar agendamento' }
    }

    revalidatePath('/appointments')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error)
    return { error: 'Erro interno do servidor' }
  }
}

export async function getAppointmentServicesAction(
  pageIndex: number = 1,
  pageSize: number = 10,
) {
  try {
    const params = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
    })

    const url = `/v1/appointment/GetAllServices?${params.toString()}`
    const response = await authenticatedFetch(url)

    if (!response.ok) {
      console.warn(
        `API retornou status ${response.status} para serviços de appointment`,
      )
      return {
        data: [],
        totalCount: 0,
        pageIndex,
        pageSize,
        totalPages: 0,
      }
    }

    const result = await response.json()
    if (Array.isArray(result)) {
      return {
        data: result,
        totalCount: result.length,
        pageIndex,
        pageSize,
        totalPages: Math.ceil(result.length / pageSize),
      }
    }

    if (result.items) {
      return {
        data: result.items,
        totalCount: result.totalCount || result.items.length,
        pageIndex: result.pageIndex || pageIndex,
        pageSize: result.pageSize || pageSize,
        totalPages:
          result.totalPages ||
          Math.ceil((result.totalCount || result.items.length) / pageSize),
      }
    }

    return result
  } catch (error) {
    console.error('Erro ao buscar serviços de appointment:', error)
    return {
      data: [],
      totalCount: 0,
      pageIndex,
      pageSize,
      totalPages: 0,
    }
  }
}

export async function getAppointmentByIdAction(appointmentId: number) {
  try {
    const response = await authenticatedFetch(
      `/v1/appointment/GetAppointmentById/${appointmentId}`,
    )

    if (!response.ok) {
      throw new Error('Agendamento não encontrado')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error)
    throw new Error('Erro ao buscar agendamento')
  }
}

export async function getAppointmentsByUserAction(userId: number) {
  try {
    const response = await authenticatedFetch(
      `/v1/appointment/GetAppointmentByUser/${userId}`,
    )

    if (!response.ok) {
      console.warn(
        `API retornou status ${response.status} para agendamentos do usuário ${userId}`,
      )
      return []
    }

    const result = await response.json()

    if (result && result.items && Array.isArray(result.items)) {
      return result.items
    }

    if (Array.isArray(result)) {
      return result
    }

    return []
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      throw error
    }
    return []
  }
}

export async function getAppointmentsByPetAction(petId: number) {
  try {
    const response = await authenticatedFetch(
      `/v1/appointment/GetAppointmentByPet/${petId}`,
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar agendamentos do pet')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar agendamentos do pet:', error)
    throw new Error('Erro ao buscar agendamentos do pet')
  }
}

export async function getAppointmentsByStatusAction(status?: string) {
  try {
    const url = status
      ? `/v1/appointment/GetAppointmentByStatus?status=${encodeURIComponent(status)}`
      : '/v1/appointment/GetAppointmentByStatus'

    const response = await authenticatedFetch(url)

    if (!response.ok) {
      throw new Error('Erro ao buscar agendamentos por status')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar agendamentos por status:', error)
    throw new Error('Erro ao buscar agendamentos por status')
  }
}
