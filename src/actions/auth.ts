'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { buildApiUrl } from '@/config/api'

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

  try {
    const authUrl = buildApiUrl('/v1/users/Authenticate')

    const response = await fetch(
      `${authUrl}?RegitrationNumber=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const data = await response.json()
    console.log('API Response:', data)
    const token = data.jwt_token || data.token
    console.log(token)

    if (!token) {
      return { error: 'Token não encontrado na resposta' }
    }

    const cookieStore = await cookies()

    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    try {
      const tokenParts = token.split('.')
      if (tokenParts.length === 3) {
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
      }
    } catch (error) {
      console.warn('Erro ao extrair dados do usuário:', error)
    }
  } catch (error) {
    console.error('Erro de autenticação:', error)
    return { error: 'Erro interno do servidor' }
  }

  redirect('/dashboard')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  cookieStore.delete('user_data')
  redirect('/login')
}

export async function checkAuthAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  return !!token
}
