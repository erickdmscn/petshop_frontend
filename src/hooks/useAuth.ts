'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserData } from '@/actions/utils'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  userData: any | null
  error: string | null
}

export function useAuth(requireAuth: boolean = true) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userData: null,
    error: null,
  })

  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUserData()

        if (!userData?.id) {
          if (requireAuth) {
            router.replace('/unauthorized')
            return
          }

          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            userData: null,
            error: 'Usuário não autenticado',
          })
          return
        }

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userData,
          error: null,
        })
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)

        const errorMessage =
          error instanceof Error ? error.message : 'Erro de autenticação'

        if (requireAuth) {
          router.replace('/unauthorized')
          return
        }

        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          userData: null,
          error: errorMessage,
        })
      }
    }

    checkAuth()
  }, [router, requireAuth])

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      userData: null,
      error: null,
    })
    router.replace('/login')
  }

  return {
    ...authState,
    logout,
    refetch: () => {
      setAuthState((prev) => ({ ...prev, isLoading: true }))
    },
  }
}
