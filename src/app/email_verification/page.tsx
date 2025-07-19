'use client'

import { NextPage } from 'next'
import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import InputForm from '../components/InputForm'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'
import {
  emailSchema,
  codeSchema,
  type EmailFormData,
  type CodeFormData,
} from '../schemas/emailVerificationSchema'
import { sendEmailAction, verifyEmailAction } from '@/actions/email'

const EmailVerification: NextPage = () => {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const emailMethods = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  })

  const codeMethods = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: '',
    },
  })

  const handleSendEmail = async (data: EmailFormData) => {
    setIsLoading(true)
    setError('')
    setMessage('')

    const result = await sendEmailAction(data.email)

    if (result.success) {
      setEmail(data.email)
      setStep('code')
      setMessage(result.message || 'Código enviado para seu e-mail!')
    } else {
      setError(result.error || 'Erro ao enviar e-mail')
    }

    setIsLoading(false)
  }

  const handleVerifyCode = async (data: CodeFormData) => {
    setIsLoading(true)
    setError('')
    setMessage('')

    const result = await verifyEmailAction(email, data.code)

    if (result.success) {
      setMessage(result.message || 'E-mail verificado com sucesso!')
      localStorage.setItem('verifiedEmail', email)
      setTimeout(() => {
        router.push('/company_register')
      }, 1500)
    } else {
      setError(result.error || 'Código inválido')
    }

    setIsLoading(false)
  }

  const handleBack = () => {
    setStep('email')
    setError('')
    setMessage('')
  }

  return (
    <>
      <main className="flex min-h-screen w-full flex-col">
        <div className="flex flex-1">
          <section className="w-[30%] bg-gradient-to-b from-emerald-400 to-cyan-400">
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-white">
                <h2 className="mb-4 text-2xl font-bold">
                  {step === 'email'
                    ? 'Verificação de E-mail'
                    : 'Código de Verificação'}
                </h2>
                <p className="text-lg">
                  {step === 'email'
                    ? 'Digite seu e-mail para receber o código de verificação'
                    : 'Digite o código enviado para seu e-mail'}
                </p>
              </div>
            </div>
          </section>

          <div className="w-[70%] p-8">
            <h1 className="mb-8 text-3xl font-bold text-emerald-800">
              {step === 'email'
                ? 'VERIFICAÇÃO DE E-MAIL'
                : 'CÓDIGO DE VERIFICAÇÃO'}
            </h1>

            {message && (
              <div className="mb-6 rounded-md bg-green-100 p-4 text-green-800">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-md bg-red-100 p-4 text-red-800">
                {error}
              </div>
            )}

            {step === 'email' ? (
              <FormProvider {...emailMethods}>
                <form
                  onSubmit={emailMethods.handleSubmit(handleSendEmail)}
                  className="space-y-8"
                >
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h2 className="mb-4 text-xl text-emerald-700">
                      Informe seu E-mail
                    </h2>
                    <InputForm
                      label="E-mail"
                      name="email"
                      placeholder="seu@email.com"
                      type="email"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md bg-emerald-400 py-3 text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Código'}
                  </button>
                </form>
              </FormProvider>
            ) : (
              <FormProvider {...codeMethods}>
                <form
                  onSubmit={codeMethods.handleSubmit(handleVerifyCode)}
                  className="space-y-8"
                >
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h2 className="mb-4 text-xl text-emerald-700">
                      Código de Verificação
                    </h2>
                    <p className="mb-4 text-gray-600">
                      Código enviado para: <strong>{email}</strong>
                    </p>
                    <InputForm
                      label="Código"
                      name="code"
                      placeholder="Digite o código"
                      type="text"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 rounded-md border border-gray-300 py-3 text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 rounded-md bg-emerald-400 py-3 text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? 'Verificando...' : 'Verificar Código'}
                    </button>
                  </div>
                </form>
              </FormProvider>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default EmailVerification
