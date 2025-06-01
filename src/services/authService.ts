interface LoginCredentials {
  registrationNumber: string
  password: string
}

interface AuthResponse {
  jwt_token?: string
  token?: string
}

interface UserData {
  id: string
  email: string
  username?: string
  fullName?: string
  role: string
  registrationNumber?: string
}

export const login = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: credentials.registrationNumber,
      password: credentials.password,
    }),
  })

  if (!response.ok) {
    throw new Error('Falha na autenticação')
  }

  const data = await response.json()
  const token = data.jwt_token || data.token

  if (token) {
    localStorage.setItem('auth_token', token)
  }

  if (data.user) {
    localStorage.setItem('user_data', JSON.stringify(data.user))
  } else {
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

        localStorage.setItem('user_data', JSON.stringify(userData))
      }
    } catch {
      console.warn('Erro ao extrair dados do usuário')
    }
  }

  return data
}

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

export const isAuthenticated = (): boolean => {
  const token = getToken()
  return !!token
}

export const getUserData = (): UserData | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user_data')

    if (!userData) {
      try {
        const token = getToken()
        if (token) {
          const tokenParts = token.split('.')
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]))

            const extractedUserData = {
              id: payload.user_id,
              email: payload.email,
              fullName: payload.nameid || 'Usuário',
              role: payload.role,
            }

            return extractedUserData
          }
        }
      } catch {
        console.warn('Erro ao extrair dados')
      }

      return null
    }

    try {
      return JSON.parse(userData)
    } catch {
      console.warn('Erro ao parsear dados do usuário')
    }
  }
  return null
}

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    window.location.href = '/login'
  }
}
