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
  console.log('Token recebido:', token)
  console.log('Tipo do token:', typeof token)
  console.log('Comprimento do token:', token ? token.length : 'null/undefined')

  if (!token) {
    console.error('Token não encontrado na resposta da API')
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

  // Processar o token JWT
  const tokenParts = token.split('.')
  console.log('Número de partes do token:', tokenParts.length)
  console.log('Partes do token:', tokenParts)

  if (tokenParts.length !== 3) {
    console.warn('Token não parece ser um JWT válido (não tem 3 partes)')
    console.log('Estrutura do token recebido:', tokenParts)
    redirect('/user_register')
  }

  console.log('Token JWT válido detectado')
  console.log('Header (parte 1, tokenParts[0])')
  console.log('Payload (parte 2, tokenParts[1])')
  console.log('Signature (parte 3, tokenParts[2])')

  const payload = JSON.parse(atob(tokenParts[1]))
  console.log('Payload decodificado:', payload)
  console.log('Chaves do payload:', Object.keys(payload))

  const userData = {
    id: payload.user_id,
    email: payload.email,
    username: payload.nameid,
    role: payload.role,
    registrationNumber: payload.RegistrationNumber,
  }

  console.log('Dados do usuário extraídos:', userData)

  cookieStore.set('user_data', JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  // Redirecionar com base no role do usuário
  if (userData.role === 'Admin') {
    redirect('/admin')
  } else {
    redirect(`/${userData.id}/home`)
  }
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
