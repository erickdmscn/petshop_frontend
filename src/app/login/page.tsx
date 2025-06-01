'use client'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InputForm from '../components/InputForm'
import { useForm, FormProvider } from 'react-hook-form'
import Footer from '../components/Footer'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../schemas/loginSchema'
import { login } from '@/services/authService'

export default function Login() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const handleSubmit = async (data: LoginFormData) => {
    setError('')
    setLoading(true)

    try {
      await login({
        registrationNumber: data.username, // Supondo que o username é o número de registro
        password: data.password,
      })

      router.push('/home')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login')
      router.push('/home')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
        <div className="flex h-screen w-full overflow-hidden bg-white">
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

          <div className="mt-10 flex h-full w-full flex-col items-center justify-center p-10 md:w-1/2">
            <div className="w-full max-w-md">
              <h2 className="text-center font-poppins text-4xl font-bold text-green-700">
                LOGIN ADMINISTRADOR
              </h2>

              <FormProvider {...methods}>
                <form
                  className="mt-10 space-y-6"
                  onSubmit={methods.handleSubmit(handleSubmit)}
                >
                  <InputForm
                    label="Nome de Usuário"
                    name="username"
                    placeholder="Usuário"
                    type="text"
                  />

                  <InputForm
                    label="Senha"
                    name="password"
                    placeholder="Senha"
                    type="password"
                  />

                  {error && <p className="text-center text-red-500">{error}</p>}

                  <button
                    type="submit"
                    className="mt-6 flex w-full items-center justify-center rounded-lg bg-green-500 py-3 text-lg font-semibold text-white transition hover:bg-green-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader className="h-6 w-6 animate-spin" />
                    ) : (
                      'ACESSAR'
                    )}
                  </button>

                  <p className="mt-6 text-center text-sm text-gray-600">
                    Esqueceu sua senha?{' '}
                    <Link
                      href="/reset_password"
                      className="font-semibold text-blue-600"
                    >
                      Recuperar
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
