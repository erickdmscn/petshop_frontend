'use client'

import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companySchema, type CompanyFormData } from '../schemas/companySchema'
import InputForm from '../components/InputForm'
import Footer from '../components/Footer'
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
        router.replace(`/${userData.id}/home`)
      }
    }
  }, [isLoading, userData, router])

  const actionWithState = async (
    _prevState: ActionResult,
    formData: FormData,
  ): Promise<ActionResult> => {
    try {
      const result = await createCompanyAction(formData)
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
      return {
        success: false,
        message: 'Erro interno do servidor',
        error: 'Erro interno do servidor',
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
      <main className="flex min-h-screen w-full flex-col">
        <div className="flex flex-1">
          <section className="w-[30%] bg-gradient-to-b from-emerald-400 to-cyan-400">
            <div className="flex h-full items-center justify-center"></div>
          </section>

          <div className="w-[70%] p-8">
            <h1 className="mb-8 text-3xl font-bold text-emerald-800">
              CADASTRE SUA EMPRESA
            </h1>

            {(state.message || state.error) && (
              <div
                className={`mb-6 rounded-md p-4 ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {state.message}
              </div>
            )}

            <FormProvider {...methods}>
              <form action={formAction} className="space-y-8">
                <input type="hidden" {...methods.register('email')} />

                <div className="rounded-lg border border-gray-200 p-4">
                  <h2 className="mb-4 text-xl text-emerald-700">
                    Informações da Empresa
                  </h2>
                  <div className="mb-4 grid grid-cols-2 gap-4">
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

                <div className="rounded-lg border border-gray-200 p-4">
                  <h2 className="mb-4 text-xl text-emerald-700">
                    Informações de Contato
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <InputForm
                      label="Telefone"
                      name="phoneNumber"
                      placeholder="(xx) xxxxx-xxxx"
                      type="tel"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <h2 className="mb-4 text-xl text-emerald-700">Endereço</h2>
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <InputForm label="País" name="country" placeholder="País" />
                    <InputForm label="Estado" name="state" placeholder="UF" />
                  </div>
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <InputForm
                      label="Cidade"
                      name="city"
                      placeholder="Cidade"
                    />
                    <div className="relative">
                      <div className="space-y-2">
                        <label
                          htmlFor="postalCode"
                          className="block text-gray-700"
                        >
                          Código Postal <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="postalCode"
                          type="text"
                          placeholder="00000-000"
                          className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
                          {...methods.register('postalCode')}
                          onBlur={handleCEPBlur}
                          onChange={handleCEPChange}
                        />
                      </div>
                      {isLoadingCEP && (
                        <div className="absolute right-3 top-8">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent"></div>
                        </div>
                      )}
                      {cepMessage && (
                        <p
                          className={`mt-1 text-sm ${cepMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}
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

                <button
                  type="submit"
                  className="w-full rounded-md bg-emerald-400 py-3 text-white transition-colors hover:bg-emerald-500"
                >
                  CADASTRAR
                </button>
              </form>
            </FormProvider>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CompanyRegister
