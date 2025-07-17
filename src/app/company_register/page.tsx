'use client'

import { NextPage } from 'next'
import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companySchema, type CompanyFormData } from '../schemas/companySchema'
import InputForm from '../components/InputForm'
import Footer from '../components/Footer'
import { createCompanyAction } from '@/actions/companies'
import { useFormState } from 'react-dom'

// Garante que o tipo inicial tem as mesmas propriedades do ActionResult
const initialState = {
  success: false,
  message: '',
  error: undefined as string | undefined,
  data: undefined as any,
}

type ActionResult = typeof initialState

const CompanyRegister: NextPage = () => {
  // Adapta a server action para assinatura do useFormState
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
                    label="Número de registro"
                    name="registrationNumber"
                    placeholder="Rº"
                  />
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <h2 className="mb-4 text-xl text-emerald-700">
                    Informações de Contato
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InputForm
                      label="E-mail"
                      name="email"
                      placeholder="E-mail"
                      type="email"
                    />
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
                    <InputForm
                      label="Código Postal"
                      name="postalCode"
                      placeholder="CEP"
                    />
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
