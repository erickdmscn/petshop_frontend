'use server'

import { cookies } from 'next/headers'
import { buildApiUrl } from '@/config/api'

export async function getAuthToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) {
    throw new Error('Token de autenticação não encontrado')
  }
  return token
}

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {},
) {
  const token = await getAuthToken()

  return fetch(buildApiUrl(endpoint), {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

export async function getUserData() {
  const cookieStore = await cookies()
  const userDataCookie = cookieStore.get('user_data')?.value
  if (!userDataCookie) return null

  try {
    return JSON.parse(userDataCookie)
  } catch {
    return null
  }
}

export async function requireAuth() {
  try {
    await getAuthToken()
    return true
  } catch {
    return false
  }
}
