'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch } from './utils'

interface ActionResult {
  error?: string
  success?: boolean
  data?: any
}

// Função para limpar CNPJ/CPF removendo formatação
function cleanRegistrationNumber(value: string): string {
  return value.replace(/[^\d]+/g, '')
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
    // IMPORTANTE: Usando os nomes corretos dos campos que a API espera
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

    console.log('Dados da empresa a serem enviados:', companyData)

    if (!companyData.companyName || !companyData.registrationNumber) {
      return { error: 'Nome da empresa e número de registro são obrigatórios' }
    }

    // Garantir que todos os campos string não sejam undefined
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

    console.log('Dados a serem enviados:', sanitizedData)

    const response = await authenticatedFetch('/v1/companies', {
      method: 'POST',
      body: sanitizedData as any,
    })

    console.log('Status da resposta:', response.status)
    console.log('Status text da resposta:', response.statusText)

    if (!response.ok) {
      console.error('Erro na resposta do servidor:')
      console.error('Status:', response.status)
      console.error('Status Text:', response.statusText)

      let errorMessage = 'Erro desconhecido do servidor'
      const responseClone = response.clone()

      try {
        const errorData = await response.json()
        console.error('Corpo da resposta de erro:', errorData)
        errorMessage = errorData.message || errorMessage
      } catch {
        try {
          const textResponse = await responseClone.text()
          console.error('Resposta como texto:', textResponse)
          errorMessage = textResponse || errorMessage
        } catch (textError) {
          console.error('Erro ao ler resposta como texto:', textError)
        }
      }

      return { error: errorMessage }
    }

    const data = await response.json()
    console.log('Resposta de sucesso:', data)
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

    // Garantir que todos os campos string não sejam undefined
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

    console.log('Dados a serem enviados para update:', sanitizedData)

    const response = await authenticatedFetch(`/v1/companies/${id}`, {
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
    // Limpa o CNPJ antes de enviar
    const cleanCnpj = cleanRegistrationNumber(cnpj)
    const response = await authenticatedFetch(`/v1/companies/cnpj/${cleanCnpj}`)

    if (!response.ok) {
      throw new Error('Empresa não encontrada')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar empresa por CNPJ:', error)
    throw new Error('Erro ao buscar empresa')
  }
}
