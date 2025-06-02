'use client'

import { NextPage } from 'next'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '../schemas/resetPasswordSchema'
import InputForm from '../components/InputForm'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Loader } from 'lucide-react'
import Footer from '../components/Footer'

const ResetPassword: NextPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean
    message?: string
  }>({})

  const methods = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true)
    setSubmitStatus({})

    try {
      const response = await fetch('/api/reset-password', {
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
            'Ocorreu um erro ao solicitar a redefinição de senha',
        )
      }

      setSubmitStatus({
        success: true,
        message: 'Email enviado com sucesso! Verifique sua caixa de entrada.',
      })

      methods.reset()
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error)
      setSubmitStatus({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Ocorreu um erro ao solicitar a redefinição de senha',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
        <div className="flex h-screen w-full overflow-hidden bg-white">
          <div className="h-full items-center justify-center bg-gradient-to-br from-green-400 to-teal-500 md:flex md:w-1/2">
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

          {/* Lado do Formulário */}
          <div className="flex h-full w-full flex-col items-center justify-center p-10 md:w-1/2">
            <div className="w-full max-w-md">
              <h2 className="text-center font-poppins text-4xl font-bold text-green-700">
                Redefinição de senha
              </h2>

              <p className="mt-4 text-center text-gray-600">
                Digite seu email nesse campo e te enviaremos uma nova senha
              </p>

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
                  <InputForm
                    label="Email"
                    name="email"
                    placeholder="Digite seu email"
                    type="email"
                  />

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
                      'Enviar'
                    )}
                  </button>

                  <p className="mt-6 text-center text-sm text-gray-600">
                    Já possui cadastro?{' '}
                    <Link href="/login" className="font-semibold text-blue-600">
                      Faça seu login
                    </Link>
                  </p>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ResetPassword
