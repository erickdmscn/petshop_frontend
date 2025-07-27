'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserData } from '@/actions/utils'

export default function AppointmentsRedirect() {
  const router = useRouter()

  useEffect(() => {
    const redirectToUserAppointments = async () => {
      try {
        const userData = await getUserData()
        if (userData?.id) {
          router.replace(`/${userData.id}/appointments`)
        } else {
          // Se não conseguir obter o ID do usuário, redirecionar para login
          router.replace('/login')
        }
      } catch (error) {
        console.error('Erro ao obter dados do usuário:', error)
        router.replace('/login')
      }
    }

    redirectToUserAppointments()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Redirecionando para agendamentos...</p>
      </div>
    </div>
  )
}
