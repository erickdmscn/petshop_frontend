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

    // Verificar se há conteúdo para parsear
    let data = null
    const contentType = response.headers.get('content-type')

    if (contentType && contentType.includes('application/json')) {
      const text = await response.text()
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (e) {
          console.warn('Resposta não é JSON válido:', text)
        }
      }
    }

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
    }

    const response = await authenticatedFetch(`/v1/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao atualizar serviço' }
    }

    // Verificar se há conteúdo para parsear
    let data = null
    const contentType = response.headers.get('content-type')

    if (contentType && contentType.includes('application/json')) {
      const text = await response.text()
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (e) {
          console.warn('Resposta não é JSON válido:', text)
        }
      }
    }

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

export async function getAllServicesAction(
  pageIndex: number = 1,
  pageSize: number = 10,
) {
  try {
    const params = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
    })

    const url = `/v1/services/GetAllServices?${params.toString()}`
    const response = await authenticatedFetch(url)

    if (!response.ok) {
      console.warn(`API retornou status ${response.status} para serviços`)
      return {
        data: [],
        totalCount: 0,
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalPages: 0,
      }
    }

    const result = await response.json()

    // Se a API retornar apenas um array, mantemos compatibilidade
    if (Array.isArray(result)) {
      return {
        data: result,
        totalCount: result.length,
        pageIndex: pageIndex,
        pageSize: pageSize,
        totalPages: Math.ceil(result.length / pageSize),
      }
    }

    // Se a API retornar um objeto com paginação
    // A API retorna "items" em vez de "data"
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
    console.error('Erro ao buscar serviços:', error)
    return {
      data: [],
      totalCount: 0,
      pageIndex: pageIndex,
      pageSize: pageSize,
      totalPages: 0,
    }
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
