'use client'

import { useEffect, useState } from 'react'
import { XCircle } from 'lucide-react'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceSchema, type ServiceFormData } from '../schemas/serviceSchema'
import { updateServiceAction } from '@/actions/services'
import InputForm from './InputForm'
import toast from 'react-hot-toast'

interface EditServiceProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  service: {
    serviceId: number
    name: string
    description: string
    price: number
    duration: number
  } | null
}

export default function EditService({
  isOpen,
  onClose,
  onSuccess,
  service,
}: EditServiceProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const methods = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceId: service?.serviceId ?? null,
      name: service?.name ?? '',
      description: service?.description ?? '',
      price: service?.price ?? 0,
      duration: service?.duration ?? 1,
    },
  })

  useEffect(() => {
    if (service) {
      methods.reset({
        serviceId: service.serviceId,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
      })
    }
  }, [service, methods])

  const onSubmit = async (data: ServiceFormData) => {
    if (!service?.serviceId) return

    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('price', data.price.toString())
      formData.append('duration', data.duration.toString())

      const result = await updateServiceAction(service.serviceId, formData)

      if (result.error) {
        setError(result.error)
        toast.error(`Erro ao atualizar serviço: ${result.error}`)
        return
      }

      toast.success('Serviço atualizado com sucesso!')
      onSuccess?.()
      onClose()
    } catch {
      const errorMsg = 'Erro interno do servidor'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !service) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Editar Serviço</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <InputForm
              label="Nome do Serviço"
              name="name"
              placeholder="Ex: Banho e Tosa Completo"
              disabled={isSubmitting}
            />
            <div className="space-y-2">
              <label htmlFor="description" className="block text-gray-700">
                Descrição <span className="text-red-500">*</span>
              </label>
              <Controller
                name="description"
                control={methods.control}
                render={({ field }) => (
                  <textarea
                    id="description"
                    {...field}
                    className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
                    placeholder="Descreva o serviço..."
                    rows={3}
                    disabled={isSubmitting}
                  />
                )}
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
                disabled={isSubmitting}
              />
              <InputForm
                label="Preço (R$)"
                name="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                disabled={isSubmitting}
              />
            </div>
            <div className="mt-6 flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
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
