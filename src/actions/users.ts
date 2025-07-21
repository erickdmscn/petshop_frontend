'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch } from './utils'

interface ActionResult {
  error?: string
  success?: boolean
  data?: any
}

// Função para limpar CPF removendo formatação
function cleanCPF(value: string): string {
  return value.replace(/\D/g, '')
}

export async function createUserAction(
  formData: FormData,
  code: string,
): Promise<ActionResult> {
  try {
    const userData = {
      fullName: formData.get('name') as string,
      registrationNumber: cleanCPF(
        formData.get('registrationNumber') as string,
      ),
      userName: formData.get('userName') as string,
      companyId: parseInt(formData.get('companyId') as string) || 0,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phone: formData.get('phoneNumber') as string,
      postalCode: formData.get('postalCode') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      country: formData.get('country') as string,
    }

    console.log('=== DEBUG: Dados do usuário a serem enviados ===')
    console.log('userData:', userData)
    console.log('code:', code)

    if (!userData.fullName || !userData.email || !userData.registrationNumber) {
      return {
        error: 'Nome completo, email e número de registro são obrigatórios',
      }
    }

    const url = `/v1/users/CreateUser?code=${encodeURIComponent(code)}`
    console.log('=== DEBUG: URL da requisição ===')
    console.log('URL:', url)

    const response = await authenticatedFetch(url, {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    console.log('=== DEBUG: Resposta da API ===')
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      console.log('=== DEBUG: Erro na resposta ===')

      // Clonar a resposta para poder ler o corpo múltiplas vezes
      const responseClone = response.clone()
      let errorData: any = {}
      let responseText = ''

      try {
        errorData = await responseClone.json()
        console.log('Erro JSON:', errorData)
      } catch (jsonError) {
        console.log('Erro ao ler JSON:', jsonError)

        try {
          responseText = await response.text()
          console.log('Erro como texto:', responseText)
        } catch (textError) {
          console.log('Erro ao ler texto:', textError)
        }
      }

      const errorMessage =
        errorData.message ||
        errorData.error ||
        responseText ||
        `Erro ${response.status}: ${response.statusText}`
      console.log('Mensagem de erro final:', errorMessage)

      return { error: errorMessage }
    }

    const data = await response.json()
    console.log('=== DEBUG: Sucesso ===')
    console.log('Dados retornados:', data)

    revalidatePath('/users')

    return { success: true, data }
  } catch (error) {
    console.error('=== DEBUG: Erro na execução ===')
    console.error('Erro completo:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A')
    return { error: 'Erro interno do servidor' }
  }
}

export async function getAllUsersAction() {
  try {
    const response = await authenticatedFetch('/v1/users')

    if (!response.ok) {
      throw new Error('Erro ao buscar usuários')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    throw new Error('Erro ao buscar usuários')
  }
}

export async function getUserByIdAction(userId: number) {
  try {
    const response = await authenticatedFetch(`/v1/users/GetById/${userId}`)

    if (!response.ok) {
      throw new Error('Usuário não encontrado')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    throw new Error('Erro ao buscar usuário')
  }
}

export async function getUserByRegistrationAction(registrationNumber: string) {
  try {
    const response = await authenticatedFetch(
      `/v1/users/GetByRegistrationNumber/${registrationNumber}`,
    )

    if (!response.ok) {
      throw new Error('Usuário não encontrado')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    throw new Error('Erro ao buscar usuário')
  }
}

export async function getUserByEmailAction(email: string) {
  try {
    const response = await authenticatedFetch(
      `/v1/users/GetByEmail/${encodeURIComponent(email)}`,
    )

    if (!response.ok) {
      throw new Error('Usuário não encontrado')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error)
    throw new Error('Erro ao buscar usuário')
  }
}

export async function getUserByPhoneAction(phoneNumber: string) {
  try {
    const response = await authenticatedFetch(
      `/v1/users/GetByPhoneNumber/${encodeURIComponent(phoneNumber)}`,
    )

    if (!response.ok) {
      throw new Error('Usuário não encontrado')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar usuário por telefone:', error)
    throw new Error('Erro ao buscar usuário')
  }
}

export async function deleteUserAction(userId: string): Promise<ActionResult> {
  try {
    const response = await authenticatedFetch(`/v1/users/${userId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return { error: 'Erro ao deletar usuário' }
    }

    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    return { error: 'Erro interno do servidor' }
  }
}

export async function updateUserPatchAction(
  userId: number,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const userData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      role: formData.get('role') as string,
    }

    const response = await authenticatedFetch(`/v1/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao atualizar usuário' }
    }

    const data = await response.json()
    revalidatePath('/users')
    revalidatePath(`/users/${userId}`)

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return { error: 'Erro interno do servidor' }
  }
}

export async function updateUserWithCodeAction(
  code: string,
  userId: number,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const userData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      role: formData.get('role') as string,
    }

    const response = await authenticatedFetch(`/v1/users/${code}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao atualizar usuário' }
    }

    const data = await response.json()
    revalidatePath('/users')
    revalidatePath(`/users/${userId}`)

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return { error: 'Erro interno do servidor' }
  }
}
