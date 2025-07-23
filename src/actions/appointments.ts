'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch } from './utils'

interface ActionResult {
  error?: string
  success?: boolean
  data?: any
}

export async function createAppointmentAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const appointmentData = {
      petId: Number(formData.get('petId')),
      serviceId: Number(formData.get('serviceId')),
      appointmentDate: formData.get('appointmentDate') as string,
      appointmentTime: formData.get('appointmentTime') as string,
      notes: formData.get('notes') as string,
    }

    if (
      !appointmentData.petId ||
      !appointmentData.serviceId ||
      !appointmentData.appointmentDate
    ) {
      return { error: 'Pet, serviço e data são obrigatórios' }
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

    const data = await response.json()
    revalidatePath('/appointments')

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao criar agendamento:', error)
    return { error: 'Erro interno do servidor' }
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

export async function getAppointmentServicesAction() {
  try {
    const response = await authenticatedFetch('/v1/appointment/GetAllServices')

    if (!response.ok) {
      throw new Error('Erro ao buscar serviços')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
    throw new Error('Erro ao buscar serviços')
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

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
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

export async function addServicesAppointmentAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const serviceData = {
      appointmentId: Number(formData.get('appointmentId')),
      serviceIds: JSON.parse((formData.get('serviceIds') as string) || '[]'),
    }

    const response = await authenticatedFetch(
      '/v1/appointment/AddServicesAppointments',
      {
        method: 'PATCH',
        body: JSON.stringify(serviceData),
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao adicionar serviços' }
    }

    const data = await response.json()
    revalidatePath('/appointments')
    revalidatePath(`/appointments/${serviceData.appointmentId}`)

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao adicionar serviços:', error)
    return { error: 'Erro interno do servidor' }
  }
}
