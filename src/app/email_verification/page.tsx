'use client'

import { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import InputForm from '../components/InputForm'
import Footer from '../components/Footer'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  emailSchema,
  codeSchema,
  type EmailFormData,
  type CodeFormData,
} from '../schemas/emailVerificationSchema'
import { sendEmailAction, verifyEmailAction } from '@/actions/email'
import { useAuth } from '@/hooks/useAuth'

const EmailVerification: NextPage = () => {
  const { isLoading: authLoading, userData } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && userData) {
      if (userData.role !== 'Admin') {
        router.replace(`/${userData.id}/home`)
      }
    }
  }, [authLoading, userData, router])

  useEffect(() => {
    const codeFromUrl = searchParams.get('code')
    if (codeFromUrl) {
      console.log('Código recebido na URL:', codeFromUrl)
    }
  }, [searchParams])

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
        // Redirecionar para user_register passando o código que o usuário digitou
        const redirectUrl = `/user_register?code=${encodeURIComponent(data.code)}`
        console.log('Redirecionando para user_register com código:', data.code)
        router.push(redirectUrl)
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

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  // Só renderizar se for Admin
  if (userData?.role !== 'Admin') {
    return null
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
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
                    d="M3 8l7.89 4.26c.3.16.65.16.95 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {step === 'email'
                  ? 'Verificação de E-mail'
                  : 'Código de Verificação'}
              </h1>
              <p className="text-gray-600">
                {step === 'email'
                  ? 'Digite seu e-mail para receber o código de verificação'
                  : 'Digite o código enviado para seu e-mail'}
              </p>
            </div>

            {/* Messages */}
            {message && (
              <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4">
                <p className="text-green-800">{message}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Forms */}
            {step === 'email' ? (
              <FormProvider {...emailMethods}>
                <form
                  onSubmit={emailMethods.handleSubmit(handleSendEmail)}
                  className="space-y-6"
                >
                  <div className="rounded-lg bg-gray-50 p-6">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
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
                    className="w-full rounded-md bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Enviando...
                      </div>
                    ) : (
                      'Enviar Código'
                    )}
                  </button>
                </form>
              </FormProvider>
            ) : (
              <FormProvider {...codeMethods}>
                <form
                  onSubmit={codeMethods.handleSubmit(handleVerifyCode)}
                  className="space-y-6"
                >
                  <div className="rounded-lg bg-gray-50 p-6">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                      Código de Verificação
                    </h2>
                    <div className="mb-4 rounded-md bg-blue-50 p-3">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">
                          Código enviado para:
                        </span>{' '}
                        <span className="font-mono">{email}</span>
                      </p>
                    </div>
                    <InputForm
                      label="Código"
                      name="code"
                      placeholder="Digite o código recebido"
                      type="text"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 rounded-md bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Verificando...
                        </div>
                      ) : (
                        'Verificar Código'
                      )}
                    </button>
                  </div>
                </form>
              </FormProvider>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default EmailVerification
