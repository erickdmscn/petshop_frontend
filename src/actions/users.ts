'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch } from './utils'

interface ActionResult {
  error?: string
  success?: boolean
  data?: any
}

export async function createUserAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const userData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      registrationNumber: formData.get('registrationNumber') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      password: formData.get('password') as string,
      role: formData.get('role') as string,
    }

    if (!userData.name || !userData.email || !userData.registrationNumber) {
      return { error: 'Nome, email e número de registro são obrigatórios' }
    }

    const response = await authenticatedFetch('/v1/users/CreateUser', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao criar usuário' }
    }

    const data = await response.json()
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
