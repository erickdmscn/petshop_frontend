'use client'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../schemas/loginSchema'
import { loginAction } from '@/actions'
import InputForm from '../components/InputForm'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'

interface LoginState {
  error?: string
  success?: boolean
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className="mt-6 flex w-full items-center justify-center rounded-lg bg-green-700 py-3 text-lg font-semibold text-white transition hover:bg-green-800 disabled:opacity-50"
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

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state?.error])

  useEffect(() => {
    if (state?.success) {
      const cookies = document.cookie.split(';')
      const userDataCookie = cookies.find((c) =>
        c.trim().startsWith('client_user_data='),
      )

      if (userDataCookie) {
        try {
          const cookieValue = userDataCookie.split('=')[1]
          const userData = JSON.parse(decodeURIComponent(cookieValue))

          if (userData.role === 'Admin') {
            window.location.href = '/admin'
          } else {
            window.location.href = `/${userData.id}/home`
          }
        } catch (error) {
          console.error(
            'Erro ao ler dados do usuário para redirecionamento:',
            error,
          )
          window.location.href = '/unauthorized'
        }
      }
    }
  }, [state?.success])

  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center bg-gray-100">
        <div className="flex h-screen w-full overflow-hidden bg-white">
          <aside
            className="hidden h-full items-center justify-center bg-gradient-to-br from-green-400 to-teal-500 md:flex md:w-1/2"
            aria-label="Imagem decorativa de pets"
          >
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
          </aside>

          <section className="mt-10 flex h-full w-full flex-col items-center justify-center p-10 md:w-1/2">
            <div className="w-full max-w-md">
              <h1 className="text-center font-poppins text-4xl font-bold text-green-700">
                LOGIN ADMINISTRADOR
              </h1>

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

                  <SubmitButton />

                  <div className="mt-4 text-center">
                    <span className="cursor-pointer text-sm text-green-700 transition-colors hover:text-green-800 hover:underline">
                      Esqueceu sua senha?
                    </span>
                  </div>
                </form>
              </FormProvider>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
