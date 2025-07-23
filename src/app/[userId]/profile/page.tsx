'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getUserData } from '@/actions/utils'

interface UserData {
  id: string
  name: string
  email: string
  role: string
  companyId?: string
}

export default function ProfilePage() {
  const params = useParams()
  const userId = Number(params.userId)

  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true)

      try {
        const data = await getUserData()
        setUserData(data)
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="mb-2 text-base font-medium text-gray-800 md:text-lg">
            Erro ao carregar perfil
          </h3>
          <p className="text-sm text-gray-600 md:text-base">
            Não foi possível carregar os dados do usuário.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-gray-800 md:text-3xl">
            Perfil do Usuário
          </h1>
          <p className="text-sm text-gray-600 md:text-base">
            Visualize e gerencie suas informações pessoais
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 md:text-2xl">
                {userData.name}
              </h2>
              <p className="text-sm text-gray-600 md:text-base">
                ID: {userData.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-gray-900">{userData.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-gray-900">{userData.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Função
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    userData.role === 'Employer' ? 'bg-green-100 text-green-800' :
                    userData.role === 'Costumer' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {userData.role === 'Employer' ? 'Funcionário' :
                     userData.role === 'Costumer' ? 'Cliente' :
                     userData.role}
                  </span>
                </div>
              </div>

              {userData.companyId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID da Empresa
                  </label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="text-gray-900">{userData.companyId}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm md:p-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 md:text-xl">
            Informações da Conta
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <p className="font-medium text-gray-900">Status da Conta</p>
                <p className="text-sm text-gray-600">Conta ativa</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                Ativo
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <p className="font-medium text-gray-900">Tipo de Usuário</p>
                <p className="text-sm text-gray-600">
                  {userData.role === 'Employer' ? 'Funcionário do petshop' :
                   userData.role === 'Costumer' ? 'Cliente' :
                   'Usuário'}
                </p>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 