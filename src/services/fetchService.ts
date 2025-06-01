import { buildApiUrl } from '@/config/api'
import { getToken } from './authService'

interface FetchOptions extends RequestInit {
  params?: Record<string, string>
}

const isLocalApiRoute = (endpoint: string): boolean => {
  return endpoint.startsWith('/api/')
}

export const apiRequest = async <T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const { params, ...fetchOptions } = options

  const isLocal = isLocalApiRoute(endpoint)

  let url = isLocal ? endpoint : buildApiUrl(endpoint)

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value)
    })
    url = `${url}?${searchParams.toString()}`
  }

  const token = getToken()

  const headers = new Headers(fetchOptions.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message ||
          `Erro na requisição: ${response.status} ${response.statusText}`,
      )
    }

    return response.json() as Promise<T>
  } catch (error) {
    console.error('Erro na requisição:', error)
    throw error
  }
}

export const get = <T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  return apiRequest<T>(endpoint, { ...options, method: 'GET' })
}

export const post = <T>(
  endpoint: string,
  data: any,
  options: FetchOptions = {},
): Promise<T> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const put = <T>(
  endpoint: string,
  data: any,
  options: FetchOptions = {},
): Promise<T> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const patch = <T>(
  endpoint: string,
  data: any,
  options: FetchOptions = {},
): Promise<T> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export const del = <T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  return apiRequest<T>(endpoint, { ...options, method: 'DELETE' })
}
