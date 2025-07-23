'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getPetsByUserAction } from '@/actions/pets'

interface Pet {
  petsId: number
  userId: number
  fullName: string
  species: number
  breed: string
  age: number
  birthDate: string
  gender: number
  needAttention: boolean
}

export default function PetsPage() {
  const params = useParams()
  const userId = Number(params.userId)

  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  // Garantir que sempre seja um array válido
  const safePets = Array.isArray(pets) ? pets : []

  useEffect(() => {
    const loadPets = async () => {
      if (!userId) return

      setLoading(true)

      try {
        const petsData = await getPetsByUserAction(userId)
        setPets(petsData || [])
      } catch (err) {
        console.error('Erro ao carregar pets:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPets()
  }, [userId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando pets...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-gray-800 md:text-3xl">
            Meus Pets
          </h1>
          <p className="text-sm text-gray-600 md:text-base">
            Gerencie os pets cadastrados
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {safePets.length === 0 ? (
          <div className="rounded-lg border bg-white p-6 text-center shadow-sm md:p-8">
            <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-base font-medium text-gray-800 md:text-lg">
              Nenhum pet encontrado
            </h3>
            <p className="text-sm text-gray-600 md:text-base">
              Não há pets cadastrados para este usuário.
            </p>
          </div>
        ) : (
          safePets.map((pet, index) => (
            <div
              key={index}
              className="rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md md:p-8"
            >
              <div className="mb-4 flex items-start justify-between md:mb-6">
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="rounded-full bg-purple-50 p-2 md:p-4">
                    <svg className="h-5 w-5 text-purple-600 md:h-8 md:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-bold text-gray-800 md:mb-2 md:text-xl">
                      {pet.fullName}
                    </h3>
                    <p className="mb-1 text-sm text-gray-600 md:text-base">
                      Raça: <span className="font-semibold text-gray-800">{pet.breed}</span>
                    </p>
                    <p className="text-sm font-semibold text-purple-600 md:text-base">
                      Espécie: {pet.species === 1 ? 'Cão' : pet.species === 2 ? 'Gato' : 'Outro'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {pet.needAttention && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-2 py-1 text-sm font-semibold text-red-800 border border-red-200 md:px-4 md:py-2 md:text-base">
                      Precisa de Atenção
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-3 md:mb-6 md:grid-cols-3 md:gap-6">
                <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">Idade</p>
                    <p className="font-semibold">
                      {pet.age} anos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">Data de Nascimento</p>
                    <p className="font-semibold">
                      {pet.birthDate ? new Date(pet.birthDate).toLocaleDateString('pt-BR') : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">Gênero</p>
                    <p className="font-semibold">
                      {pet.gender === 1 ? 'Macho' : pet.gender === 2 ? 'Fêmea' : 'N/A'}
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