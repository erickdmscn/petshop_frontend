'use client'

import { XCircle } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  petSchema,
  type PetFormData,
  Species,
  Gender,
} from '../schemas/petSchema'
import InputForm from './InputForm'

interface CreatePetProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreatePet({ isOpen, onClose }: CreatePetProps) {
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
    console.log('Dados do pet:', data)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-4 md:p-8">
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h3 className="text-lg font-bold text-gray-800 md:text-xl">
            Cadastrar Novo Pet
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
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
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 md:py-3 md:text-base"
              >
                Cadastrar Pet
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 md:py-3 md:text-base"
              >
                Cancelar
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
