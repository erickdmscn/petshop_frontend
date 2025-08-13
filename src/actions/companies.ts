'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch } from './utils'
import { ENDPOINTS } from '@/config/api'

interface ActionResult {
  error?: string
  success?: boolean
  data?: any
}

function cleanRegistrationNumber(value: string): string {
  return value.replace(/[^\d]+/g, '')
}

export async function getCompaniesAction(pageIndex = 1, pageSize = 10) {
  try {
    const response = await authenticatedFetch(
      `${ENDPOINTS.COMPANIES}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar empresas')
    }

    return await response.json()
  } catch {
    throw new Error('Erro ao buscar empresas')
  }
}

export async function createCompanyAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const companyData = {
      companyName: formData.get('companyName') as string,
      tradeName: formData.get('tradeName') as string,
      registrationNumber: cleanRegistrationNumber(
        formData.get('registrationNumber') as string,
      ),
      email: formData.get('email') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      country: formData.get('country') as string,
      postalCode: formData.get('postalCode') as string,
    }

    if (!companyData.companyName || !companyData.registrationNumber) {
      return { error: 'Nome da empresa e número de registro são obrigatórios' }
    }

    const sanitizedData = {
      companyName: companyData.companyName || '',
      tradeName: companyData.tradeName || '',
      registrationNumber: companyData.registrationNumber || '',
      email: companyData.email || '',
      phoneNumber: companyData.phoneNumber || '',
      address: companyData.address || '',
      city: companyData.city || '',
      state: companyData.state || '',
      country: companyData.country || '',
      postalCode: companyData.postalCode || '',
    }

    const response = await authenticatedFetch(ENDPOINTS.COMPANIES, {
      method: 'POST',
      body: sanitizedData as any,
    })

    if (!response.ok) {
      let errorMessage = 'Erro desconhecido do servidor'
      const responseClone = response.clone()

      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        try {
          const textResponse = await responseClone.text()
          errorMessage = textResponse || errorMessage
        } catch {
          errorMessage = 'Erro ao ler resposta como texto'
        }
      }

      return { error: errorMessage }
    }

    const data = await response.json()
    revalidatePath('/companies')

    return { success: true, data }
  } catch {
    return { error: 'Erro interno do servidor' }
  }
}

export async function getCompanyByIdAction(id: number) {
  try {
    const response = await authenticatedFetch(`${ENDPOINTS.COMPANIES}/${id}`)

    if (!response.ok) {
      throw new Error('Empresa não encontrada')
    }

    return await response.json()
  } catch {
    throw new Error('Erro ao buscar empresa')
  }
}

export async function updateCompanyAction(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const companyData = {
      companyName: formData.get('companyName') as string,
      tradeName: formData.get('tradeName') as string,
      registrationNumber: cleanRegistrationNumber(
        formData.get('registrationNumber') as string,
      ),
      email: formData.get('email') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      country: formData.get('country') as string,
      postalCode: formData.get('postalCode') as string,
    }

    const sanitizedData = {
      companyName: companyData.companyName || '',
      tradeName: companyData.tradeName || '',
      registrationNumber: companyData.registrationNumber || '',
      email: companyData.email || '',
      phoneNumber: companyData.phoneNumber || '',
      address: companyData.address || '',
      city: companyData.city || '',
      state: companyData.state || '',
      country: companyData.country || '',
      postalCode: companyData.postalCode || '',
    }

    const response = await authenticatedFetch(`${ENDPOINTS.COMPANIES}/${id}`, {
      method: 'PUT',
      body: sanitizedData as any,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao atualizar empresa' }
    }

    const data = await response.json()
    revalidatePath('/companies')
    revalidatePath(`/companies/${id}`)

    return { success: true, data }
  } catch {
    return { error: 'Erro interno do servidor' }
  }
}

export async function deleteCompanyAction(
  companyId: string,
): Promise<ActionResult> {
  try {
    const response = await authenticatedFetch(
      `${ENDPOINTS.COMPANIES}/${companyId}`,
      {
        method: 'DELETE',
      },
    )

    if (!response.ok) {
      return { error: 'Erro ao deletar empresa' }
    }

    revalidatePath('/companies')
    return { success: true }
  } catch {
    return { error: 'Erro interno do servidor' }
  }
}

export async function getCompanyByCnpjAction(cnpj: string) {
  try {
    const cleanCnpj = cleanRegistrationNumber(cnpj)
    const response = await authenticatedFetch(
      `${ENDPOINTS.COMPANIES_BY_CNPJ}/${cleanCnpj}`,
    )

    if (!response.ok) {
      throw new Error('Empresa não encontrada')
    }

    return await response.json()
  } catch {
    throw new Error('Erro ao buscar empresa')
  }
}
