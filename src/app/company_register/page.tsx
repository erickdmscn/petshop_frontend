'use client'

import { NextPage } from 'next'
import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companySchema, type CompanyFormData } from '../schemas/companySchema'
import InputForm from '../components/InputForm'

const CompanyRegister: NextPage = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitStatus, setSubmitStatus] = React.useState<{
    success?: boolean
    message?: string
  }>({})

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

  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true)
    setSubmitStatus({})

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(
          responseData.message ||
            'An error occurred while registering the company',
        )
      }

      setSubmitStatus({
        success: true,
        message: 'Company registered successfully!',
      })

      methods.reset({
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
      })
    } catch (error) {
      console.error('An error occurred while sending data:', error)
      setSubmitStatus({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred while registering',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen w-full">
      <section className="w-[30%] bg-gradient-to-b from-emerald-400 to-cyan-400">
        <div className="flex h-full items-center justify-center"></div>
      </section>

      <div className="w-[70%] p-8">
        <h1 className="mb-8 text-3xl font-bold text-emerald-800">
          CADASTRE SUA EMPRESA
        </h1>

        {submitStatus.message && (
          <div
            className={`mb-6 rounded-md p-4 ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {submitStatus.message}
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
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
                <InputForm label="Cidade" name="city" placeholder="Cidade" />
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
              disabled={isSubmitting}
              className={`w-full rounded-md py-3 text-white transition-colors ${isSubmitting ? 'bg-gray-400' : 'bg-emerald-400 hover:bg-emerald-500'}`}
            >
              {isSubmitting ? 'ENVIANDO...' : 'CADASTRAR'}
            </button>
          </form>
        </FormProvider>
      </div>
    </main>
  )
}

export default CompanyRegister
