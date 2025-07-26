'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Header from '../components/Header'

interface UserLayoutProps {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, isLoading, userData, error } = useAuth(true)

  // Verificar se o userId na URL corresponde ao usuário logado
  if (isAuthenticated && userData?.id) {
    const urlUserId = Number(params.userId)
    if (userData.id !== urlUserId.toString()) {
      router.replace(`/${userData.id}/home`)
      return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error || !isAuthenticated || !userData) {
    return null // O useAuth já redireciona para /unauthorized
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userId={params.userId as string} />
      <main className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  )
}
