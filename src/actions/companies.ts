'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch } from './utils'

interface ActionResult {
  error?: string
  success?: boolean
  data?: any
}

export async function getCompaniesAction(pageIndex = 1, pageSize = 10) {
  try {
    const response = await authenticatedFetch(
      `/v1/companies?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar empresas')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar empresas:', error)
    throw new Error('Erro ao buscar empresas')
  }
}

export async function createCompanyAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const companyData = {
      name: formData.get('name') as string,
      cnpj: formData.get('cnpj') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    }

    if (!companyData.name || !companyData.cnpj) {
      return { error: 'Nome e CNPJ são obrigatórios' }
    }

    const response = await authenticatedFetch('/v1/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao criar empresa' }
    }

    const data = await response.json()
    revalidatePath('/companies')

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao criar empresa:', error)
    return { error: 'Erro interno do servidor' }
  }
}

export async function getCompanyByIdAction(id: number) {
  try {
    const response = await authenticatedFetch(`/v1/companies/${id}`)

    if (!response.ok) {
      throw new Error('Empresa não encontrada')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar empresa:', error)
    throw new Error('Erro ao buscar empresa')
  }
}

export async function updateCompanyAction(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const companyData = {
      name: formData.get('name') as string,
      cnpj: formData.get('cnpj') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    }

    const response = await authenticatedFetch(`/v1/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao atualizar empresa' }
    }

    const data = await response.json()
    revalidatePath('/companies')
    revalidatePath(`/companies/${id}`)

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error)
    return { error: 'Erro interno do servidor' }
  }
}

export async function deleteCompanyAction(
  companyId: string,
): Promise<ActionResult> {
  try {
    const response = await authenticatedFetch(`/v1/companies/${companyId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return { error: 'Erro ao deletar empresa' }
    }

    revalidatePath('/companies')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar empresa:', error)
    return { error: 'Erro interno do servidor' }
  }
}

export async function getCompanyByCnpjAction(cnpj: string) {
  try {
    const response = await authenticatedFetch(`/v1/companies/cnpj/${cnpj}`)

    if (!response.ok) {
      throw new Error('Empresa não encontrada')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar empresa por CNPJ:', error)
    throw new Error('Erro ao buscar empresa')
  }
}
