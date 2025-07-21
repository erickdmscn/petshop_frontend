'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema, type UserFormData } from '../schemas/userSchema'
import { createUserAction } from '../../actions/users'
import { getCompaniesAction } from '../../actions/companies'

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

export default function UserRegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [verificationCode, setVerificationCode] = useState<string>('')

  // Capturar o código da URL e email do localStorage
  useEffect(() => {
    const codeFromUrl = searchParams.get('code')
    const emailFromStorage = localStorage.getItem('verifiedEmail')

    if (codeFromUrl) {
      setVerificationCode(codeFromUrl)
      console.log('Código capturado na página user_register:', codeFromUrl)
    } else {
      console.log('Nenhum código encontrado na URL')
    }

    if (emailFromStorage) {
      console.log('Email capturado do localStorage:', emailFromStorage)
    } else {
      console.log('Nenhum email encontrado no localStorage')
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
        const response = await getCompaniesAction(1, 100) // Buscar todas as empresas
        setCompanies(response.items || [])
      } catch (error) {
        console.error('Erro ao buscar empresas:', error)
        setError('Erro ao carregar empresas')
      }
    }

    fetchCompanies()
  }, [])

  const onSubmit = async (data: UserFormData) => {
    setLoading(true)
    setError(null)

    try {
      // Pegar email do localStorage
      const emailFromStorage = localStorage.getItem('verifiedEmail')
      if (!emailFromStorage) {
        setError(
          'Email não encontrado. Acesse através da verificação de email.',
        )
        setLoading(false)
        return
      }

      // Criar FormData para enviar para a action
      const formData = new FormData()
      formData.append('name', data.fullName)
      formData.append('registrationNumber', data.registrationNumber)
      formData.append('userName', data.userName)
      formData.append('companyId', data.companyId.toString())
      formData.append('email', emailFromStorage) // Usar email do localStorage
      formData.append('password', data.password)
      formData.append('phoneNumber', data.phone)
      formData.append('postalCode', data.postalCode)
      formData.append('address', data.address)
      formData.append('city', data.city)
      formData.append('state', data.state)
      formData.append('country', data.country)

      // Usar o código capturado da URL
      if (!verificationCode) {
        setError(
          'Código de verificação não encontrado. Acesse através da verificação de email.',
        )
        setLoading(false)
        return
      }

      const result = await createUserAction(formData, verificationCode)

      if (result.success) {
        setSuccess(true)
        reset()
        setTimeout(() => {
          router.push('/users') // Redirecionar para lista de usuários
        }, 2000)
      } else {
        setError(result.error || 'Erro ao criar usuário')
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      setError('Erro interno do servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Cadastrar Novo Usuário
            </h1>
            <p className="text-gray-600">
              Preencha os dados abaixo para criar um novo usuário no sistema.
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Pessoais */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Informações Pessoais
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o nome completo"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    CPF *
                  </label>
                  <input
                    type="text"
                    {...register('registrationNumber')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o CPF (apenas números)"
                    maxLength={14}
                  />
                  {errors.registrationNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.registrationNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nome de Usuário *
                  </label>
                  <input
                    type="text"
                    {...register('userName')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o nome de usuário"
                  />
                  {errors.userName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.userName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Senha *
                  </label>
                  <input
                    type="password"
                    {...register('password')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite a senha"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Telefone *
                  </label>
                  <input
                    type="text"
                    {...register('phone')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o telefone"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Empresa */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Empresa
              </h3>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Empresa *
                </label>
                <select
                  {...register('companyId', { valueAsNumber: true })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma empresa</option>
                  {companies.map((company) => (
                    <option key={company.companyId} value={company.companyId}>
                      {company.companyName} - {company.tradeName}
                    </option>
                  ))}
                </select>
                {errors.companyId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.companyId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Endereço */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Endereço
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    CEP *
                  </label>
                  <input
                    type="text"
                    {...register('postalCode')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o CEP"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Endereço *
                  </label>
                  <input
                    type="text"
                    {...register('address')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o endereço"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite a cidade"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Estado *
                  </label>
                  <input
                    type="text"
                    {...register('state')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o estado"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    País *
                  </label>
                  <input
                    type="text"
                    {...register('country')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o país"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Criar Usuário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
