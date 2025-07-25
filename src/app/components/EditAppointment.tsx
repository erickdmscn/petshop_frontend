'use client'

import { useEffect } from 'react'
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
import InputForm from './InputForm'

interface EditAppointmentProps {
  isOpen: boolean
  onClose: () => void
  appointment: {
    appointmentId: number
    userId: number
    petId: number
    appointmentDate: string
    statusAppointments: number
    totalPrice: number
    paymentStatus: number
    paymentMethod: number
    notes: string
  } | null
}

export default function EditAppointment({
  isOpen,
  onClose,
  appointment,
}: EditAppointmentProps) {
  const methods = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      userId: appointment?.userId ?? null,
      petId: appointment?.petId ?? 1,
      appointmentDate: appointment?.appointmentDate ?? '',
      statusAppointments:
        appointment?.statusAppointments ?? StatusAppointments.SCHEDULED,
      totalPrice: appointment?.totalPrice ?? 0,
      paymentStatus: appointment?.paymentStatus ?? PaymentStatus.PENDING,
      paymentMethod: appointment?.paymentMethod ?? PaymentMethod.CASH,
      notes: appointment?.notes ?? '',
    },
  })

  useEffect(() => {
    if (appointment) {
      methods.reset({
        userId: appointment.userId,
        petId: appointment.petId,
        appointmentDate: appointment.appointmentDate,
        statusAppointments: appointment.statusAppointments,
        totalPrice: appointment.totalPrice,
        paymentStatus: appointment.paymentStatus,
        paymentMethod: appointment.paymentMethod,
        notes: appointment.notes,
      })
    }
  }, [appointment, methods])

  const onSubmit = (data: AppointmentFormData) => {
    console.log('Dados do agendamento atualizados:', data)
    onClose()
  }

  if (!isOpen || !appointment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-4 md:p-8">
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h3 className="text-lg font-bold text-gray-800 md:text-xl">
            Editar Agendamento
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
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
                >
                  <option value="1">Rex - Cão</option>
                  <option value="2">Mimi - Gato</option>
                  <option value="3">Bolt - Cão</option>
                  <option value="4">Luna - Gato</option>
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
                type="date"
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
                  <option value={StatusAppointments.SCHEDULED}>Agendado</option>
                  <option value={StatusAppointments.IN_PROGRESS}>
                    Em Andamento
                  </option>
                  <option value={StatusAppointments.COMPLETED}>
                    Concluído
                  </option>
                  <option value={StatusAppointments.CANCELED}>Cancelado</option>
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
                  <option value={PaymentStatus.PENDING}>Pendente</option>
                  <option value={PaymentStatus.PAID}>Pago</option>
                  <option value={PaymentStatus.CANCELED}>Cancelado</option>
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
                  <option value={PaymentMethod.NONE}>Nenhum</option>
                  <option value={PaymentMethod.CASH}>Dinheiro</option>
                  <option value={PaymentMethod.DEBIT_CARD}>
                    Cartão de Débito
                  </option>
                  <option value={PaymentMethod.CREDIT_CARD}>
                    Cartão de Crédito
                  </option>
                  <option value={PaymentMethod.PIX}>PIX</option>
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
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 md:py-3 md:text-base"
              >
                Salvar Alterações
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 md:py-3 md:text-base"
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
