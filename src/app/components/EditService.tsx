'use client'

import { useEffect } from 'react'
import { XCircle } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceSchema, type ServiceFormData } from '../schemas/serviceSchema'
import InputForm from './InputForm'

interface EditServiceProps {
  isOpen: boolean
  onClose: () => void
  service: {
    serviceId: number
    name: string
    descripton: string
    price: number
    duration: number
  } | null
}

export default function EditService({
  isOpen,
  onClose,
  service,
}: EditServiceProps) {
  const methods = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceId: service?.serviceId ?? null,
      name: service?.name ?? '',
      descripton: service?.descripton ?? '',
      price: service?.price ?? 0,
      duration: service?.duration ?? 1,
    },
  })

  useEffect(() => {
    if (service) {
      methods.reset({
        serviceId: service.serviceId,
        name: service.name,
        descripton: service.descripton,
        price: service.price,
        duration: service.duration,
      })
    }
  }, [service, methods])

  const onSubmit = (data: ServiceFormData) => {
    console.log('Dados do serviço atualizados:', data)
    onClose()
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
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <InputForm
              label="Nome do Serviço"
              name="name"
              placeholder="Ex: Banho e Tosa Completo"
            />
            <div className="space-y-2">
              <label htmlFor="descripton" className="block text-gray-700">
                Descrição <span className="text-red-500">*</span>
              </label>
              <textarea
                id="descripton"
                {...methods.register('descripton')}
                className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Descreva o serviço..."
                rows={3}
              />
              {methods.formState.errors.descripton && (
                <p className="text-sm text-red-500">
                  {methods.formState.errors.descripton.message}
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
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-white transition-colors hover:bg-emerald-700"
              >
                Salvar Alterações
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-gray-700 transition-colors hover:bg-gray-50"
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
