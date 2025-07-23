'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getUserData } from '@/actions/utils'
import Header from '../components/Header'

interface UserLayoutProps {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const currentUserData = await getUserData()

        if (!currentUserData?.id) {
          router.replace('/login')
          return
        }

        // Verificar se o userId na URL corresponde ao usuário logado
        const urlUserId = Number(params.userId)
        if (currentUserData.id !== urlUserId.toString()) {
          router.replace(`/${currentUserData.id}/home`)
          return
        }

        setUserData(currentUserData)
      } catch (error) {
        console.error('Erro ao verificar usuário:', error)
        router.replace('/login')
      } finally {
        setIsLoading(false)
      }
    }

    verifyUser()
  }, [params.userId, router])

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

  if (!userData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userId={params.userId as string} />
      <main className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  )
}
