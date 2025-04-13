'use client'

import { NextPage } from 'next'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  petSchema,
  type PetFormData,
  Species,
  Gender,
} from '../schemas/petSchema'
import InputForm from '../components/InputForm'
import { useState } from 'react'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import Footer from '../components/Footer'

const PetRegister: NextPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean
    message?: string
  }>({})

  const methods = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      petsId: null,
      userId: null,
      fullName: '',
      species: 1,
      breed: '',
      age: 0,
      birthDate: '',
      gender: 1,
      needAttention: false,
    },
  })

  const onSubmit = async (data: PetFormData) => {
    setIsSubmitting(true)
    setSubmitStatus({})

    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(
          responseData.message || 'Ocorreu um erro ao cadastrar o pet',
        )
      }

      setSubmitStatus({
        success: true,
        message: 'Pet cadastrado com sucesso!',
      })

      methods.reset()
    } catch (error) {
      console.error('Erro ao enviar dados:', error)
      setSubmitStatus({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Ocorreu um erro ao cadastrar o pet',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <div className="flex h-screen w-full overflow-hidden bg-white">
          {/* Lado da Imagem */}
          <div className="hidden h-full items-center justify-center bg-gradient-to-br from-green-400 to-teal-500 md:flex md:w-1/2">
            <div className="relative h-full w-full">
              <Image
                src="/images/bg-pets.png"
                alt="pets"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                quality={100}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex h-full w-full flex-col items-center justify-center p-10 md:w-1/2">
            <div className="w-full max-w-md">
              <h2 className="text-center font-poppins text-4xl font-bold text-green-700">
                Cadastro de Pet
              </h2>

              {submitStatus.message && (
                <div
                  className={`mb-6 mt-4 rounded-md p-4 ${
                    submitStatus.success
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(onSubmit)}
                  className="mt-8 space-y-6"
                >
                  <div className="space-y-4">
                    <InputForm
                      label="Nome do Pet"
                      name="fullName"
                      placeholder="Digite o nome do pet"
                    />

                    <div className="space-y-2">
                      <label className="block text-gray-700">
                        Espécie <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...methods.register('species')}
                        className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        <option value={Species.CACHORRO}>Cachorro</option>
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
                      placeholder="Digite a raça do pet"
                      required={false}
                    />

                    <InputForm
                      label="Idade"
                      name="age"
                      placeholder="Digite a idade do pet"
                      type="number"
                    />

                    <InputForm
                      label="Data de Nascimento"
                      name="birthDate"
                      placeholder="Digite a data de nascimento"
                      type="date"
                    />

                    <div className="space-y-2">
                      <label className="block text-gray-700">
                        Gênero <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...methods.register('gender')}
                        className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
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

                    <div className="flex items-center">
                      <label className="inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          {...methods.register('needAttention')}
                          className="peer sr-only"
                        />
                        <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-0 rtl:peer-checked:after:-translate-x-full"></div>
                        <span className="ms-3 text-gray-700">
                          Precisa de atenção especial
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full rounded-md py-3 text-white transition-colors ${
                      isSubmitting
                        ? 'bg-gray-400'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <Loader className="h-6 w-6 animate-spin" />
                      </div>
                    ) : (
                      'Cadastrar'
                    )}
                  </button>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PetRegister
