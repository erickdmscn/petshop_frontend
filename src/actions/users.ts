'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch, getAuthToken } from './utils'

interface ActionResult {
  error?: string
  success?: boolean
  data?: any
}

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

    if (!userData.fullName || !userData.email || !userData.registrationNumber) {
      return {
        error: 'Nome completo, email e número de registro são obrigatórios',
      }
    }

    const url = `/v1/users/CreateUser?code=${encodeURIComponent(code)}`

    const response = await authenticatedFetch(url, {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      // Clonar a resposta para poder ler o corpo múltiplas vezes
      const responseClone = response.clone()
      let errorData: any = {}
      let responseText = ''

      try {
        errorData = await responseClone.json()
      } catch {
        try {
          responseText = await response.text()
        } catch {
          // Ignorar erro de leitura do texto
        }
      }

      const errorMessage =
        errorData.message ||
        errorData.error ||
        responseText ||
        `Erro ${response.status}: ${response.statusText}`

      return { error: errorMessage }
    }

    // Verificar se a resposta tem conteúdo antes de tentar fazer parse do JSON
    const contentLength = response.headers.get('content-length')
    const hasContent = contentLength && parseInt(contentLength) > 0

    let data = null
    if (hasContent) {
      try {
        data = await response.json()
      } catch {
        // Se não conseguir fazer parse do JSON, mas o status é 200, ainda é sucesso
        data = null
      }
    }

    revalidatePath('/users')

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
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

export async function getUsersAction(pageIndex = 1, pageSize = 10) {
  try {
    const response = await authenticatedFetch(
      `/v1/users?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    )

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

    revalidatePath('/login')
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

export async function updateUserTypeAction(
  userId: number,
): Promise<ActionResult> {
  try {
    const endpoint = `/updetaUserType/${userId}`

    const token = await getAuthToken()

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')
    const url = `${baseUrl}${endpoint}`

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        accept: '*/*',
      },
    })

    if (response.status === 401) {
      const cookieStore = await import('next/headers').then((m) => m.cookies())
      ;(await cookieStore).delete('auth_token')
      ;(await cookieStore).delete('user_data')
      return { error: 'Sessão expirada. Faça login novamente.' }
    }

    if (!response.ok) {
      const responseClone = response.clone()
      let errorData: any = {}
      let errorText = ''

      try {
        errorData = await response.json()
      } catch {
        errorText = await responseClone.text().catch(() => '')
      }

      const errorMessage =
        errorData.message ||
        errorText ||
        `Erro ${response.status}: ${response.statusText}`
      return { error: errorMessage }
    }

    const contentLength = response.headers.get('content-length')
    let responseData = null

    if (contentLength && parseInt(contentLength) > 0) {
      responseData = await response.json().catch(() => null)
    }

    revalidatePath('/admin')
    return { success: true, data: responseData }
  } catch (error) {
    console.error('Erro ao atualizar tipo de usuário:', error)
    return {
      error: `Erro interno: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
    }
  }
}
