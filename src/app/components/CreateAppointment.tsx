'use client'

import { useState, useEffect } from 'react'
import { XCircle } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  appointmentSchema,
  type AppointmentFormData,
  StatusAppointments,
  PaymentStatus,
  PaymentMethod,
} from '../schemas/appointmentSchema'
import { createAppointmentAction } from '@/actions/appointments'
import { getPetsByUserAction } from '@/actions/pets'
import InputForm from './InputForm'

interface Pet {
  petsId: number
  userId: number
  fullName: string
  species: number
  breed: string
  age: number
  birthDate: string
  gender: number
  needAttention: boolean
}

interface CreateAppointmentProps {
  isOpen: boolean
  onClose: () => void
  userId: number
  onSuccess?: () => void
}

export default function CreateAppointment({
  isOpen,
  onClose,
  userId,
  onSuccess,
}: CreateAppointmentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [loadingPets, setLoadingPets] = useState(true)

  const methods = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      userId: userId,
      petId: 0, // Será selecionado pelo usuário
      appointmentDate: '',
      statusAppointments: StatusAppointments.AGENDADO,
      totalPrice: 0,
      paymentStatus: PaymentStatus.PENDENTE,
      paymentMethod: PaymentMethod.DINHEIRO,
      notes: '',
    },
  })

  // Carregar pets do usuário
  useEffect(() => {
    const loadPets = async () => {
      if (!userId) return

      setLoadingPets(true)
      try {
        const petsData = await getPetsByUserAction(userId)
        setPets(petsData || [])
      } catch (err) {
        console.error('Erro ao carregar pets:', err)
      } finally {
        setLoadingPets(false)
      }
    }

    if (isOpen) {
      loadPets()
    }
  }, [userId, isOpen])

  const onSubmit = async (data: AppointmentFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('userId', userId.toString())
      formData.append('petId', data.petId.toString())
      formData.append('appointmentDate', data.appointmentDate)
      formData.append('statusAppointments', data.statusAppointments.toString())
      formData.append('totalPrice', data.totalPrice.toString())
      formData.append('paymentStatus', data.paymentStatus.toString())
      formData.append('paymentMethod', data.paymentMethod.toString())
      formData.append('notes', data.notes || '')

      const result = await createAppointmentAction(formData)

      if (result.error) {
        setError(result.error)
      } else {
        // Sucesso - resetar form e fechar modal
        methods.reset()
        if (onSuccess) {
          onSuccess()
        }
        onClose()
      }
    } catch (err) {
      console.error('Erro ao criar agendamento:', err)
      setError('Erro interno do servidor')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-4 md:p-8">
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h3 className="text-lg font-bold text-gray-800 md:text-xl">
            Novo Agendamento
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="petId" className="block text-gray-700">
                  Pet <span className="text-red-500">*</span>
                </label>
                <select
                  id="petId"
                  {...methods.register('petId')}
                  className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
                  disabled={loadingPets}
                >
                  <option value="">
                    {loadingPets ? 'Carregando pets...' : 'Selecione um pet'}
                  </option>
                  {pets.map((pet) => (
                    <option key={pet.petsId} value={pet.petsId}>
                      {pet.fullName} - {pet.breed}
                    </option>
                  ))}
                </select>
                {methods.formState.errors.petId && (
                  <p className="text-sm text-red-500">
                    {methods.formState.errors.petId.message}
                  </p>
                )}
              </div>
              <InputForm
                label="Data do Agendamento"
                name="appointmentDate"
                type="datetime-local"
                placeholder=""
              />
              <div className="space-y-2">
                <label
                  htmlFor="statusAppointments"
                  className="block text-gray-700"
                >
                  Status do Agendamento <span className="text-red-500">*</span>
                </label>
                <select
                  id="statusAppointments"
                  {...methods.register('statusAppointments')}
                  className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value={StatusAppointments.AGENDADO}>Agendado</option>
                  <option value={StatusAppointments.EM_ANDAMENTO}>
                    Em Andamento
                  </option>
                  <option value={StatusAppointments.CONCLUIDO}>
                    Concluído
                  </option>
                  <option value={StatusAppointments.CANCELADO}>
                    Cancelado
                  </option>
                </select>
                {methods.formState.errors.statusAppointments && (
                  <p className="text-sm text-red-500">
                    {methods.formState.errors.statusAppointments.message}
                  </p>
                )}
              </div>
              <InputForm
                label="Preço Total (R$)"
                name="totalPrice"
                type="number"
                placeholder="0.00"
              />
              <div className="space-y-2">
                <label htmlFor="paymentStatus" className="block text-gray-700">
                  Status do Pagamento <span className="text-red-500">*</span>
                </label>
                <select
                  id="paymentStatus"
                  {...methods.register('paymentStatus')}
                  className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value={PaymentStatus.PENDENTE}>Pendente</option>
                  <option value={PaymentStatus.PAGO}>Pago</option>
                  <option value={PaymentStatus.CANCELADO}>Cancelado</option>
                  <option value={PaymentStatus.REEMBOLSADO}>Reembolsado</option>
                </select>
                {methods.formState.errors.paymentStatus && (
                  <p className="text-sm text-red-500">
                    {methods.formState.errors.paymentStatus.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="paymentMethod" className="block text-gray-700">
                  Método de Pagamento <span className="text-red-500">*</span>
                </label>
                <select
                  id="paymentMethod"
                  {...methods.register('paymentMethod')}
                  className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value={PaymentMethod.DINHEIRO}>Dinheiro</option>
                  <option value={PaymentMethod.DEBITO}>Cartão de Débito</option>
                  <option value={PaymentMethod.CREDITO}>
                    Cartão de Crédito
                  </option>
                  <option value={PaymentMethod.PIX}>PIX</option>
                  <option value={PaymentMethod.TRANSFERENCIA}>
                    Transferência Bancária
                  </option>
                </select>
                {methods.formState.errors.paymentMethod && (
                  <p className="text-sm text-red-500">
                    {methods.formState.errors.paymentMethod.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                {...methods.register('notes')}
                className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
                rows={3}
                placeholder="Informações adicionais sobre o agendamento..."
              />
              {methods.formState.errors.notes && (
                <p className="text-sm text-red-500">
                  {methods.formState.errors.notes.message}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400 md:py-3 md:text-base"
              >
                {isLoading ? 'Criando...' : 'Criar Agendamento'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 md:py-3 md:text-base"
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
