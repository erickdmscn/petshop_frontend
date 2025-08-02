'use client'

import { useState } from 'react'
import { XCircle } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { serviceSchema, type ServiceFormData } from '../schemas/serviceSchema'
import { createServiceAction } from '@/actions/services'
import InputForm from './InputForm'

interface CreateServiceProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreateService({
  isOpen,
  onClose,
  onSuccess,
}: CreateServiceProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const methods = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceId: null,
      name: '',
      description: '',
      price: 0,
      duration: 1,
    },
  })

  const onSubmit = async (data: ServiceFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Criar FormData para enviar para a action
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('price', data.price.toString())
      formData.append('duration', data.duration.toString())

      const result = await createServiceAction(formData)

      if (result.error) {
        setError(result.error)
        toast.error(`Erro ao criar serviço: ${result.error}`)
      } else {
        // Sucesso - resetar form e fechar modal
        methods.reset()
        toast.success('Serviço criado com sucesso!')
        if (onSuccess) {
          onSuccess()
        }
        onClose()
      }
    } catch {
      const errorMsg = 'Erro inesperado ao criar serviço'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Criar Novo Serviço</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <InputForm
              label="Nome do Serviço"
              name="name"
              placeholder="Ex: Banho e Tosa Completo"
            />
            <div className="space-y-2">
              <label htmlFor="description" className="block text-gray-700">
                Descrição <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                {...methods.register('description')}
                className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Descreva o serviço..."
                rows={3}
              />
              {methods.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {methods.formState.errors.description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputForm
                label="Duração (minutos)"
                name="duration"
                type="number"
                placeholder="Ex: 60, 90, 120"
              />
              <InputForm
                label="Preço (R$)"
                name="price"
                type="number"
                placeholder="0.00"
              />
            </div>
            <div className="mt-6 flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
              >
                {isLoading ? 'Criando...' : 'Criar Serviço'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                Cancelar
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
