'use client'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction } from '@/actions'
import InputForm from '../components/InputForm'
import { useForm, FormProvider } from 'react-hook-form'
import Footer from '../components/Footer'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../schemas/loginSchema'

interface LoginState {
  error?: string
  success?: boolean
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className="mt-6 flex w-full items-center justify-center rounded-lg bg-green-500 py-3 text-lg font-semibold text-white transition hover:bg-green-600 disabled:opacity-50"
      disabled={pending}
    >
      {pending ? <Loader className="h-6 w-6 animate-spin" /> : 'ACESSAR'}
    </button>
  )
}

export default function Login() {
  const initialState: LoginState = { error: undefined, success: false }

  const handleLoginAction = async (
    state: LoginState,
    formData: FormData,
  ): Promise<LoginState> => {
    const result = await loginAction(formData)
    return result
  }

  const [state, formAction] = useActionState(handleLoginAction, initialState)

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

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
                <form className="mt-10 space-y-6" action={formAction}>
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

                  {state?.error && (
                    <p className="text-center text-red-500">{state.error}</p>
                  )}

                  <SubmitButton />

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
