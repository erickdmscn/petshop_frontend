'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch } from './utils'

interface ActionResult {
  error?: string
  success?: boolean
  data?: any
}

export async function createServiceAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const serviceData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      duration: Number(formData.get('duration')),
      category: formData.get('category') as string,
    }

    if (!serviceData.name || !serviceData.price) {
      return { error: 'Nome e preço são obrigatórios' }
    }

    const response = await authenticatedFetch('/v1/services/CreateService', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao criar serviço' }
    }

    const data = await response.json()
    revalidatePath('/services')

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao criar serviço:', error)
    return { error: 'Erro interno do servidor' }
  }
}

export async function updateServiceAction(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const serviceData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      duration: Number(formData.get('duration')),
      category: formData.get('category') as string,
    }

    const response = await authenticatedFetch(`/v1/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao atualizar serviço' }
    }

    const data = await response.json()
    revalidatePath('/services')
    revalidatePath(`/services/${id}`)

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error)
    return { error: 'Erro interno do servidor' }
  }
}

export async function deleteServiceAction(
  serviceId: string,
): Promise<ActionResult> {
  try {
    const response = await authenticatedFetch(`/v1/services/${serviceId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return { error: 'Erro ao deletar serviço' }
    }

    revalidatePath('/services')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar serviço:', error)
    return { error: 'Erro interno do servidor' }
  }
}

export async function getAllServicesAction() {
  try {
    const response = await authenticatedFetch('/v1/services/GetAllServices')

    if (!response.ok) {
      console.warn(`API retornou status ${response.status} para serviços`)
      return []
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
    return []
  }
}

export async function getServiceByIdAction(serviceId: number) {
  try {
    const response = await authenticatedFetch(
      `/v1/services/GetServicesById/${serviceId}`,
    )

    if (!response.ok) {
      throw new Error('Serviço não encontrado')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar serviço:', error)
    throw new Error('Erro ao buscar serviço')
  }
}

export async function getServicesByNameAction(name: string) {
  try {
    const response = await authenticatedFetch(
      `/v1/services/GetServicesByName/${encodeURIComponent(name)}`,
    )

    if (!response.ok) {
      throw new Error('Serviços não encontrados')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar serviços por nome:', error)
    throw new Error('Erro ao buscar serviços')
  }
}
