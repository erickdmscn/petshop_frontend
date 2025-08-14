'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { buildApiUrl, ENDPOINTS } from '@/config/api'

interface LoginResult {
  error?: string
  success?: boolean
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Usuário e senha são obrigatórios' }
  }

  const authUrl = buildApiUrl(ENDPOINTS.AUTH)

  try {
    const response = await fetch(
      `${authUrl}?RegitrationNumber=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      return { error: 'Credenciais inválidas. Verifique seu usuário e senha.' }
    }

    const data = await response.json()
    const token = data.jwt_token || data.token

    if (!token) {
      return { error: 'Credenciais inválidas. Verifique seu usuário e senha.' }
    }

    const cookieStore = await cookies()

    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    const tokenParts = token.split('.')

    if (tokenParts.length !== 3) {
      return { error: 'Token inválido. Tente novamente.' }
    }

    const payload = JSON.parse(atob(tokenParts[1]))

    const userData = {
      id: payload.user_id,
      email: payload.email,
      username: payload.nameid,
      role: payload.role,
      registrationNumber: payload.RegistrationNumber,
    }

    cookieStore.set('user_data', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    const clientUserData = {
      id: userData.id,
      role: userData.role,
    }

    cookieStore.set('client_user_data', JSON.stringify(clientUserData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return {
      success: true,
      error: undefined,
    }
  } catch (error) {
    console.error('Erro durante o login:', error)
    return { error: 'Erro ao conectar com o servidor. Tente novamente.' }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  cookieStore.delete('user_data')
  cookieStore.delete('client_user_data')
  redirect('/login')
}

export async function checkAuthAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  return !!token
}
