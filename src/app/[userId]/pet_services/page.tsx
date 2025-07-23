'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getAllServicesAction } from '@/actions/services'

interface Service {
  serviceId: number
  name: string
  description: string
  price: number
  duration: number
  category: string
  isActive: boolean
}

export default function PetServicesPage() {
  const params = useParams()
  const userId = Number(params.userId)

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  // Garantir que sempre seja um array válido
  const safeServices = Array.isArray(services) ? services : []

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true)

      try {
        const servicesData = await getAllServicesAction()
        setServices(servicesData || [])
      } catch (err) {
        console.error('Erro ao carregar serviços:', err)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando serviços...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-gray-800 md:text-3xl">
            Serviços
          </h1>
          <p className="text-sm text-gray-600 md:text-base">
            Gerencie os serviços oferecidos pelo seu petshop
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {safeServices.length === 0 ? (
          <div className="rounded-lg border bg-white p-6 text-center shadow-sm md:p-8">
            <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-base font-medium text-gray-800 md:text-lg">
              Nenhum serviço encontrado
            </h3>
            <p className="text-sm text-gray-600 md:text-base">
              Não há serviços disponíveis no momento.
            </p>
          </div>
        ) : (
          safeServices.map((service, index) => (
            <div
              key={index}
              className={`rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md md:p-8 ${
                !service.isActive ? 'opacity-75' : ''
              }`}
            >
              <div className="mb-4 flex items-start justify-between md:mb-6">
                <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-6">
                  <div
                    className={`flex-shrink-0 rounded-full p-2 md:p-4 ${service.isActive ? 'bg-blue-50' : 'bg-gray-100'}`}
                  >
                    <svg
                      className="h-5 w-5 md:h-8 md:w-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2 md:mb-2">
                      <h3 className="truncate text-base font-bold text-gray-800 md:text-xl">
                        {service.name}
                      </h3>
                      {!service.isActive && (
                        <span className="whitespace-nowrap rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 md:px-3 md:text-sm">
                          Inativo
                        </span>
                      )}
                    </div>
                    <p className="mb-1 line-clamp-2 text-sm text-gray-600 md:text-base">
                      {service.description}
                    </p>
                    <p className="text-sm font-semibold text-blue-600 md:text-base">
                      {service.category}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold md:gap-2 md:px-4 md:py-2 md:text-base ${
                    service.category === 'banho'
                      ? 'border-blue-200 bg-blue-100 text-blue-800'
                      : service.category === 'tosa'
                        ? 'border-purple-200 bg-purple-100 text-purple-800'
                        : 'border-gray-200 bg-gray-100 text-gray-800'
                  }`}
                >
                  <span className="hidden md:inline">
                    {service.category === 'banho'
                      ? 'Banho'
                      : service.category === 'tosa'
                        ? 'Tosa'
                        : service.category}
                  </span>
                </span>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-3 md:mb-6 md:grid-cols-3 md:gap-6">
                <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <svg
                      className="h-4 w-4 md:h-5 md:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">
                      Duração
                    </p>
                    <p className="font-semibold">{service.duration} minutos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <span className="font-bold text-gray-600">R$</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">
                      Preço
                    </p>
                    <p className="font-semibold">
                      R$ {service.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <svg
                      className="h-4 w-4 md:h-5 md:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">
                      Status
                    </p>
                    <p className="font-semibold">
                      {service.isActive ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
