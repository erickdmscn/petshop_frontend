'use client'

import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { companySchema, type CompanyFormData } from '../schemas/companySchema'
import InputForm from '../components/InputForm'

import { createCompanyAction } from '@/actions/companies'
import { useFormState } from 'react-dom'
import { fetchAddressByCEP } from '@/actions/utils'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

const initialState = {
  success: false,
  message: '',
  error: undefined as string | undefined,
  data: undefined as any,
}

type ActionResult = typeof initialState

const CompanyRegister: NextPage = () => {
  const { isLoading, userData } = useAuth()
  const router = useRouter()
  const [isLoadingCEP, setIsLoadingCEP] = useState(false)
  const [cepMessage, setCepMessage] = useState('')

  useEffect(() => {
    if (!isLoading && userData) {
      if (userData.role !== 'Admin') {
        router.replace('/unauthorized')
      }
    }
  }, [isLoading, userData, router])

  const actionWithState = async (
    _prevState: ActionResult,
    formData: FormData,
  ): Promise<ActionResult> => {
    try {
      const result = await createCompanyAction(formData)

      if (result.success) {
        toast.success('Empresa cadastrada com sucesso!')
      } else if (result.error) {
        toast.error(`Erro ao cadastrar empresa: ${result.error}`)
      }

      return {
        success: result.success ?? false,
        message: result.error
          ? result.error
          : result.success
            ? 'Empresa cadastrada com sucesso!'
            : '',
        error: result.error,
        data: result.data,
      }
    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error)
      const errorMsg = 'Erro interno do servidor'
      toast.error(errorMsg)
      return {
        success: false,
        message: errorMsg,
        error: errorMsg,
        data: undefined,
      }
    }
  }
  const [state, formAction] = useFormState(actionWithState, initialState)

  const methods = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyId: null,
      companyName: '',
      tradeName: '',
      registrationNumber: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      status: '',
    },
  })

  useEffect(() => {
    const verifiedEmail = localStorage.getItem('verifiedEmail')
    if (verifiedEmail) {
      console.log('E-mail carregado do localStorage:', verifiedEmail)
      methods.setValue('email', verifiedEmail)
      localStorage.removeItem('verifiedEmail')
    }
  }, [methods])

  const handleCEPBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '')

    if (cep.length === 8) {
      setIsLoadingCEP(true)
      setCepMessage('')
      try {
        const addressData = await fetchAddressByCEP(cep)

        methods.setValue(
          'address',
          `${addressData.street || ''} ${addressData.neighborhood || ''}`.trim(),
        )
        methods.setValue('city', addressData.city || '')
        methods.setValue('state', addressData.state || '')
        methods.setValue('country', 'Brasil')
        methods.setValue('postalCode', cep)

        setCepMessage('Endereço carregado com sucesso!')
      } catch (error) {
        console.error('Erro ao buscar dados do CEP:', error)
        setCepMessage(
          'Erro ao buscar dados do CEP. Verifique se o número está correto.',
        )
      } finally {
        setIsLoadingCEP(false)
      }
    }
  }

  const applyCEPMask = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
  }

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyCEPMask(e.target.value)
    methods.setValue('postalCode', maskedValue)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (userData?.role !== 'Admin') {
    return null
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <svg
                  className="h-8 w-8 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Cadastro de Empresa
              </h1>
              <p className="text-gray-600">
                Preencha os dados da empresa para continuar
              </p>
            </div>

            {(state.message || state.error) && (
              <div
                className={`mb-6 rounded-md border p-4 ${
                  state.success
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <p
                  className={state.success ? 'text-green-800' : 'text-red-800'}
                >
                  {state.message}
                </p>
              </div>
            )}

            <FormProvider {...methods}>
              <form action={formAction} className="space-y-8">
                <input type="hidden" {...methods.register('email')} />

                {/* Informações da Empresa */}
                <div className="rounded-lg bg-gray-50 p-6">
                  <h2 className="mb-6 text-xl font-semibold text-gray-900">
                    Informações da Empresa
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <InputForm
                        label="Nome da empresa"
                        name="companyName"
                        placeholder="Nome da empresa"
                      />
                      <InputForm
                        label="Nome Comercial"
                        name="tradeName"
                        placeholder="Nome Comercial"
                        required={false}
                      />
                    </div>
                    <InputForm
                      label="CNPJ"
                      name="registrationNumber"
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                </div>

                {/* Informações de Contato */}
                <div className="rounded-lg bg-gray-50 p-6">
                  <h2 className="mb-6 text-xl font-semibold text-gray-900">
                    Informações de Contato
                  </h2>
                  <div className="space-y-6">
                    <InputForm
                      label="Telefone"
                      name="phoneNumber"
                      placeholder="(xx) xxxxx-xxxx"
                      type="tel"
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div className="rounded-lg bg-gray-50 p-6">
                  <h2 className="mb-6 text-xl font-semibold text-gray-900">
                    Endereço
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <InputForm
                        label="País"
                        name="country"
                        placeholder="País"
                      />
                      <InputForm label="Estado" name="state" placeholder="UF" />
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <InputForm
                        label="Cidade"
                        name="city"
                        placeholder="Cidade"
                      />
                      <div className="space-y-2">
                        <label
                          htmlFor="postalCode"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Código Postal <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="postalCode"
                            type="text"
                            placeholder="00000-000"
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            {...methods.register('postalCode')}
                            onBlur={handleCEPBlur}
                            onChange={handleCEPChange}
                          />
                          {isLoadingCEP && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent"></div>
                            </div>
                          )}
                        </div>
                        {cepMessage && (
                          <p
                            className={`text-sm ${
                              cepMessage.includes('sucesso')
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {cepMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    <InputForm
                      label="Endereço Completo"
                      name="address"
                      placeholder="Endereço"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Cadastrar Empresa
                </button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  )
}

export default CompanyRegister
