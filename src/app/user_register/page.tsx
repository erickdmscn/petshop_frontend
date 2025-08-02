'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { userSchema, type UserFormData } from '../schemas/userSchema'
import { createUserAction } from '../../actions/users'
import { getCompaniesAction } from '../../actions/companies'
import { useAuth } from '@/hooks/useAuth'

interface Company {
  companyId: number
  companyName: string
  tradeName: string
  registrationNumber: string
  email: string
  phoneNumber: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  status: string
}

const UserRegisterContent: React.FC = () => {
  const { isLoading, userData } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [verificationCode, setVerificationCode] = useState<string>('')

  useEffect(() => {
    if (!isLoading && userData) {
      if (userData.role !== 'Admin') {
        router.replace('/unauthorized')
      }
    }
  }, [isLoading, userData, router])

  useEffect(() => {
    const codeFromUrl = searchParams.get('code')

    if (codeFromUrl) {
      setVerificationCode(codeFromUrl)
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      country: 'Brazil',
    },
  })

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getCompaniesAction(1, 100)
        setCompanies(response.items || [])
      } catch {
        setError('Erro ao carregar empresas')
      }
    }

    fetchCompanies()
  }, [])

  const onSubmit = async (data: UserFormData) => {
    setLoading(true)
    setError(null)

    try {
      const emailFromStorage = localStorage.getItem('verifiedEmail')
      if (!emailFromStorage) {
        const errorMsg =
          'Email não encontrado. Acesse através da verificação de email.'
        setError(errorMsg)
        toast.error(errorMsg)
        setLoading(false)
        return
      }

      const formData = new FormData()
      formData.append('name', data.fullName)
      formData.append('registrationNumber', data.registrationNumber)
      formData.append('userName', data.userName)
      formData.append('companyId', data.companyId.toString())
      formData.append('email', emailFromStorage)
      formData.append('password', data.password)
      formData.append('phoneNumber', data.phone)
      formData.append('postalCode', data.postalCode)
      formData.append('address', data.address)
      formData.append('city', data.city)
      formData.append('state', data.state)
      formData.append('country', data.country)

      if (!verificationCode) {
        const errorMsg =
          'Código de verificação não encontrado. Acesse através da verificação de email.'
        setError(errorMsg)
        toast.error(errorMsg)
        setLoading(false)
        return
      }

      const result = await createUserAction(formData, verificationCode)

      if (result.success) {
        setSuccess(true)
        reset()
        toast.success('Usuário criado com sucesso! Redirecionando...')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        const errorMsg = result.error || 'Erro ao criar usuário'
        setError(errorMsg)
        toast.error(`Erro ao criar usuário: ${errorMsg}`)
      }
    } catch {
      const errorMsg = 'Erro interno do servidor'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Cadastrar Novo Usuário
              </h1>
              <p className="text-gray-600">
                Preencha os dados abaixo para criar um novo usuário no sistema
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4">
                <p className="text-green-800">
                  Usuário criado com sucesso! Redirecionando...
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="rounded-lg bg-gray-50 p-6">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  Informações Pessoais
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Nome Completo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('fullName')}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        placeholder="Digite o nome completo"
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-600">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        CPF <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('registrationNumber')}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        placeholder="Digite o CPF (apenas números)"
                        maxLength={14}
                      />
                      {errors.registrationNumber && (
                        <p className="text-sm text-red-600">
                          {errors.registrationNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Nome de Usuário <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('userName')}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        placeholder="Digite o nome de usuário"
                      />
                      {errors.userName && (
                        <p className="text-sm text-red-600">
                          {errors.userName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Senha <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        {...register('password')}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        placeholder="Digite a senha"
                      />
                      {errors.password && (
                        <p className="text-sm text-red-600">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Telefone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('phone')}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                      placeholder="Digite o telefone"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-6">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  Empresa
                </h2>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Empresa <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('companyId', { valueAsNumber: true })}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    <option value="">Selecione uma empresa</option>
                    {companies.map((company) => (
                      <option key={company.companyId} value={company.companyId}>
                        {company.companyName} - {company.tradeName}
                      </option>
                    ))}
                  </select>
                  {errors.companyId && (
                    <p className="text-sm text-red-600">
                      {errors.companyId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-6">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  Endereço
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        CEP <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('postalCode')}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        placeholder="Digite o CEP"
                      />
                      {errors.postalCode && (
                        <p className="text-sm text-red-600">
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Endereço <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('address')}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        placeholder="Digite o endereço"
                      />
                      {errors.address && (
                        <p className="text-sm text-red-600">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Cidade <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('city')}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        placeholder="Digite a cidade"
                      />
                      {errors.city && (
                        <p className="text-sm text-red-600">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Estado <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('state')}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        placeholder="Digite o estado"
                      />
                      {errors.state && (
                        <p className="text-sm text-red-600">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      País <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('country')}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                      placeholder="Digite o país"
                    />
                    {errors.country && (
                      <p className="text-sm text-red-600">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-md bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Criando...
                    </div>
                  ) : (
                    'Criar Usuário'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

const UserRegisterLoading: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent"></div>
      <p className="text-gray-600">Carregando...</p>
    </div>
  </div>
)

export default function UserRegisterPage() {
  return (
    <Suspense fallback={<UserRegisterLoading />}>
      <UserRegisterContent />
    </Suspense>
  )
}
