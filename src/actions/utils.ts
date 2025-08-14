'use server'

import { cookies } from 'next/headers'
import { buildApiUrl, ENDPOINTS } from '@/config/api'

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
  options: RequestInit & { body?: BodyInit | any } = {},
) {
  try {
    const token = await getAuthToken()
    let body = options.body
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
      ...(options.headers as any),
    }

    if (body && !(body instanceof FormData)) {
      if (typeof body !== 'string') {
        body = JSON.stringify(body)
      }
      headers['Content-Type'] = 'application/json'
    }

    const url = buildApiUrl(endpoint)

    const response = await fetch(url, {
      ...options,
      headers,
      body,
    })

    if (response.status === 401) {
      const cookieStore = await cookies()
      cookieStore.delete('auth_token')
      cookieStore.delete('user_data')
      cookieStore.delete('client_user_data')

      throw new Error('UNAUTHORIZED')
    }

    return response
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Token de autenticação não encontrado'
    ) {
      throw new Error('UNAUTHORIZED')
    }
    throw error
  }
}

export async function getUserData() {
  const raw = (await cookies()).get('user_data')?.value
  if (!raw) return null
  try {
    return JSON.parse(raw)
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

export const fetchAddressByCEP = async (cep: string) => {
  try {
    const response = await fetch(
      buildApiUrl(`${ENDPOINTS.BRASIL_API_CEP}/${cep}`),
    )
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do CEP')
    }
    return await response.json()
  } catch {
    throw new Error('Erro ao buscar dados do CEP')
  }
}
