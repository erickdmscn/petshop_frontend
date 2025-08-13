'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch } from './utils'
import { ENDPOINTS } from '@/config/api'

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
      descripton: formData.get('description') as string,
      price: Number(formData.get('price')),
      duration: Number(formData.get('duration')),
    }

    if (!serviceData.name || !serviceData.price) {
      return { error: 'Nome e preço são obrigatórios' }
    }

    const response = await authenticatedFetch(ENDPOINTS.SERVICES_CREATE, {
      method: 'POST',
      body: JSON.stringify(serviceData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao criar serviço' }
    }

    let data = null
    const contentType = response.headers.get('content-type')

    if (contentType && contentType.includes('application/json')) {
      const text = await response.text()
      if (text) {
        try {
          data = JSON.parse(text)
        } catch {
          data = null
        }
      }
    }

    revalidatePath('/services')

    return { success: true, data }
  } catch {
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
      descripton: formData.get('description') as string,
      price: Number(formData.get('price')),
      duration: Number(formData.get('duration')),
    }

    const response = await authenticatedFetch(`${ENDPOINTS.SERVICES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao atualizar serviço' }
    }

    let data = null
    const contentType = response.headers.get('content-type')

    if (contentType && contentType.includes('application/json')) {
      const text = await response.text()
      if (text) {
        try {
          data = JSON.parse(text)
        } catch {
          data = null
        }
      }
    }

    revalidatePath('/services')
    revalidatePath(`/services/${id}`)

    return { success: true, data }
  } catch {
    return { error: 'Erro interno do servidor' }
  }
}

export async function deleteServiceAction(
  serviceId: string,
): Promise<ActionResult> {
  try {
    const response = await authenticatedFetch(
      `${ENDPOINTS.SERVICES}/${serviceId}`,
      {
        method: 'DELETE',
      },
    )

    if (!response.ok) {
      return { error: 'Erro ao deletar serviço' }
    }

    revalidatePath('/services')
    return { success: true }
  } catch {
    return { error: 'Erro interno do servidor' }
  }
}

export async function getAllServicesAction(
  pageIndex: number = 1,
  pageSize: number = 10,
) {
  try {
    const params = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
    })

    const url = `${ENDPOINTS.SERVICES_GET_ALL}?${params.toString()}`
    const response = await authenticatedFetch(url)

    if (!response.ok) {
      return {
        data: [],
        totalCount: 0,
        pageIndex,
        pageSize,
        totalPages: 0,
      }
    }

    const result = await response.json()

    const mapService = (service: any) => ({
      ...service,
      description: service.descripton || null,
    })

    if (Array.isArray(result)) {
      const mappedData = result.map(mapService)
      return {
        data: mappedData,
        totalCount: result.length,
        pageIndex,
        pageSize,
        totalPages: Math.ceil(result.length / pageSize),
      }
    }

    if (result.items) {
      const mappedData = result.items.map(mapService)
      return {
        data: mappedData,
        totalCount: result.totalCount || result.items.length,
        pageIndex: result.pageIndex || pageIndex,
        pageSize: result.pageSize || pageSize,
        totalPages:
          result.totalPages ||
          Math.ceil((result.totalCount || result.items.length) / pageSize),
      }
    }

    return result
  } catch {
    return {
      data: [],
      totalCount: 0,
      pageIndex,
      pageSize,
      totalPages: 0,
    }
  }
}

export async function getServiceByIdAction(serviceId: number) {
  try {
    const response = await authenticatedFetch(
      `${ENDPOINTS.SERVICES_GET_BY_ID}/${serviceId}`,
    )

    if (!response.ok) {
      throw new Error('Serviço não encontrado')
    }

    const service = await response.json()

    return {
      ...service,
      description: service.descripton || null,
    }
  } catch {
    throw new Error('Erro ao buscar serviço')
  }
}

export async function getServicesByNameAction(name: string) {
  try {
    const response = await authenticatedFetch(
      `${ENDPOINTS.SERVICES_GET_BY_NAME}/${encodeURIComponent(name)}`,
    )

    if (!response.ok) {
      throw new Error('Serviços não encontrados')
    }

    const services = await response.json()

    const mapService = (service: any) => ({
      ...service,
      description: service.descripton || null,
    })

    if (Array.isArray(services)) {
      return services.map(mapService)
    }

    return mapService(services)
  } catch {
    throw new Error('Erro ao buscar serviços')
  }
}
