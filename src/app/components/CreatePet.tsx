'use client'

import { XCircle } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import FocusTrap from 'focus-trap-react'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import {
  petSchema,
  type PetFormData,
  Species,
  Gender,
} from '../schemas/petSchema'
import InputForm from './InputForm'
import { createPetAction } from '@/actions/pets'

interface CreatePetProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreatePet({ isOpen, onClose }: CreatePetProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEscapeKey(isOpen, onClose, !isLoading)

  const methods = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      petsId: null,
      userId: null,
      fullName: '',
      species: Species.CACHORRO,
      breed: '',
      age: 0,
      birthDate: '',
      gender: Gender.MACHO,
      needAttention: false,
    },
  })

  const onSubmit = async (data: PetFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await createPetAction({
        fullName: data.fullName || '',
        species: data.species,
        breed: data.breed || '',
        age: data.age,
        birthDate: data.birthDate,
        gender: data.gender,
        needAttention: data.needAttention,
      })

      if (result.error) {
        setError(result.error)
        toast.error(`Erro ao cadastrar pet: ${result.error}`)
        return
      }

      if (result.success) {
        methods.reset()
        toast.success('Pet cadastrado com sucesso!')
        // Delay para permitir que revalidatePath termine antes de fechar o modal
        setTimeout(() => {
          onClose()
          window.location.reload()
        }, 300)
      }
    } catch (err) {
      const errorMsg = `Erro interno do servidor: ${err instanceof Error ? err.message : 'Erro desconhecido'}`
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <FocusTrap>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-4 md:p-8">
          <div className="mb-4 flex items-center justify-between md:mb-6">
            <h3 className="text-lg font-bold text-gray-800 md:text-xl">
              Cadastrar Novo Pet
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Fechar modal"
              title="Fechar"
            >
              <XCircle className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputForm
                  label="Nome do Pet"
                  name="fullName"
                  placeholder="Ex: Rex, Mimi, Luna"
                />

                <div className="space-y-2">
                  <label htmlFor="species" className="block text-gray-700">
                    Espécie <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="species"
                    className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
                    {...methods.register('species')}
                  >
                    <option value={Species.CACHORRO}>Cão</option>
                    <option value={Species.GATO}>Gato</option>
                    <option value={Species.AVE}>Ave</option>
                    <option value={Species.ROEDOR}>Roedor</option>
                    <option value={Species.REPTIL}>Réptil</option>
                    <option value={Species.PEIXE}>Peixe</option>
                    <option value={Species.OUTRO}>Outro</option>
                  </select>
                  {methods.formState.errors.species && (
                    <p className="text-sm text-red-500">
                      {methods.formState.errors.species.message}
                    </p>
                  )}
                </div>

                <InputForm
                  label="Raça"
                  name="breed"
                  placeholder="Ex: Golden Retriever, Persa, SRD"
                  required={false}
                />

                <InputForm
                  label="Idade (anos)"
                  name="age"
                  type="number"
                  placeholder="Ex: 2, 5, 10"
                />

                <InputForm
                  label="Data de Nascimento"
                  name="birthDate"
                  type="date"
                  placeholder="YYYY-MM-DD"
                />

                <div className="space-y-2">
                  <label htmlFor="gender" className="block text-gray-700">
                    Gênero <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
                    {...methods.register('gender')}
                  >
                    <option value={Gender.MACHO}>Macho</option>
                    <option value={Gender.FEMEA}>Fêmea</option>
                  </select>
                  {methods.formState.errors.gender && (
                    <p className="text-sm text-red-500">
                      {methods.formState.errors.gender.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="needAttention"
                    {...methods.register('needAttention')}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label
                    htmlFor="needAttention"
                    className="text-sm font-medium text-gray-700"
                  >
                    Precisa de atenção especial
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-emerald-700 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:bg-emerald-400 md:py-3 md:text-base"
                >
                  {isLoading ? 'Cadastrando...' : 'Cadastrar Pet'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:bg-gray-100 md:py-3 md:text-base"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </FocusTrap>
  )
}
