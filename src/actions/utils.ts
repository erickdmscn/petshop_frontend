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
  const token = await getAuthToken()
  let body = options.body
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: '*/*',
    ...(options.headers as any),
  }

  // Se tiver body e NÃO for FormData, asseguramos JSON
  if (body && !(body instanceof FormData)) {
    if (typeof body !== 'string') {
      body = JSON.stringify(body)
    }
    headers['Content-Type'] = 'application/json'
  }

  const url = buildApiUrl(endpoint)

  return fetch(url, {
    ...options,
    headers,
    body,
  })
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

// Função para buscar dados de endereço pelo CEP
export const fetchAddressByCEP = async (cep: string) => {
  try {
    const response = await fetch(
      buildApiUrl(`${ENDPOINTS.BRASIL_API_CEP}/${cep}`),
    )
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do CEP')
    }
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    throw error
  }
}
