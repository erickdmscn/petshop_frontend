'use client'

import { useState, useEffect } from 'react'
import { XCircle, Check, Loader2 } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import {
  appointmentSchema,
  type AppointmentFormData,
  StatusAppointments,
  PaymentStatus,
  PaymentMethod,
} from '../schemas/appointmentSchema'
import {
  createAppointmentOnlyAction,
  addServicesOnlyAction,
} from '@/actions/appointments'
import { getAllPetsAction } from '@/actions/pets'
import { getAllServicesAction } from '@/actions/services'
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

interface Service {
  serviceId: number
  name: string
  description: string | null
  price: number
  duration: number
  isActive?: boolean
}

interface CreateAppointmentProps {
  isOpen: boolean
  onClose: () => void
  userId: number
  onSuccess?: () => void
}

type ModalState = 'creating' | 'success' | 'services'

export default function CreateAppointment({
  isOpen,
  onClose,
  userId,
  onSuccess,
}: CreateAppointmentProps) {
  const [modalState, setModalState] = useState<ModalState>('creating')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [loadingPets, setLoadingPets] = useState(true)
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(false)
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([])
  const [createdAppointmentId, setCreatedAppointmentId] = useState<
    number | null
  >(null)

  const methods = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      userId,
      petId: 0,
      appointmentDate: '',
      statusAppointments: StatusAppointments.SCHEDULED,
      totalPrice: 0,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.CASH,
      notes: '',
    },
  })

  useEffect(() => {
    const loadPets = async () => {
      if (!userId || !isOpen) return

      setLoadingPets(true)
      try {
        const petsData = await getAllPetsAction(1, 50)
        setPets(petsData?.items || [])
      } catch {
        setPets([])
      } finally {
        setLoadingPets(false)
      }
    }

    if (isOpen) {
      loadPets()
      setModalState('creating')
      setIsProcessing(false)
      setError(null)
      setSelectedServiceIds([])
      setCreatedAppointmentId(null)
    }
  }, [userId, isOpen])

  const loadServices = async () => {
    setLoadingServices(true)
    try {
      const servicesResponse = await getAllServicesAction(1, 50)
      setServices(servicesResponse?.data || [])
    } catch {
    } finally {
      setLoadingServices(false)
    }
  }

  const onSubmit = async (data: AppointmentFormData) => {
    setIsProcessing(true)
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

      const result = await createAppointmentOnlyAction(formData)

      if (result.error) {
        setError(result.error)
        toast.error(`Erro ao criar agendamento: ${result.error}`)
        setIsProcessing(false)
        return
      }

      const appointmentId = result.data?.appointmentId
      if (!appointmentId) {
        const errorMsg = 'Erro: ID do agendamento não foi retornado'
        setError(errorMsg)
        toast.error(errorMsg)
        setIsProcessing(false)
        return
      }

      setCreatedAppointmentId(appointmentId)
      methods.reset()
      setModalState('success')
      setIsProcessing(false)
      toast.success('Agendamento criado com sucesso!')
    } catch {
      const errorMsg = 'Erro interno do servidor'
      setError(errorMsg)
      toast.error(errorMsg)
      setIsProcessing(false)
    }
  }

  const handleAssociateServices = async () => {
    if (!createdAppointmentId || selectedServiceIds.length === 0) {
      const errorMsg = 'Selecione pelo menos um serviço'
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await addServicesOnlyAction(
        createdAppointmentId,
        selectedServiceIds,
      )

      if (result.error) {
        setError(result.error)
        toast.error(`Erro ao associar serviços: ${result.error}`)
        setIsProcessing(false)
        return
      }

      toast.success('Serviços associados com sucesso!')
      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch {
      const errorMsg = 'Erro interno do servidor'
      setError(errorMsg)
      toast.error(errorMsg)
      setIsProcessing(false)
    }
  }

  const handleShowServices = async () => {
    setModalState('services')
    await loadServices()
  }

  const handleFinishWithoutServices = () => {
    if (onSuccess) {
      onSuccess()
    }
    onClose()
  }

  const handleClose = () => {
    if (!isProcessing) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-4 md:p-8">
        {modalState === 'creating' && (
          <>
            <div className="mb-4 flex items-center justify-between md:mb-6">
              <h3 className="text-lg font-bold text-gray-800 md:text-xl">
                Novo Agendamento
              </h3>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
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
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                        {loadingPets
                          ? 'Carregando pets...'
                          : 'Selecione um pet'}
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
                    type="date"
                    placeholder=""
                  />

                  <div className="space-y-2">
                    <label
                      htmlFor="statusAppointments"
                      className="block text-gray-700"
                    >
                      Status do Agendamento{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="statusAppointments"
                      {...methods.register('statusAppointments')}
                      className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value={StatusAppointments.SCHEDULED}>
                        Agendado
                      </option>
                      <option value={StatusAppointments.IN_PROGRESS}>
                        Em Andamento
                      </option>
                      <option value={StatusAppointments.COMPLETED}>
                        Concluído
                      </option>
                      <option value={StatusAppointments.CANCELED}>
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
                    <label
                      htmlFor="paymentStatus"
                      className="block text-gray-700"
                    >
                      Status do Pagamento{' '}
                      <span className="text-red-500">*</span>
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
                    <label
                      htmlFor="paymentMethod"
                      className="block text-gray-700"
                    >
                      Método de Pagamento{' '}
                      <span className="text-red-500">*</span>
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
                    disabled={isProcessing}
                    className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400 md:py-3 md:text-base"
                  >
                    {isProcessing ? 'Criando...' : 'Criar Agendamento'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isProcessing}
                    className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 md:py-3 md:text-base"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </FormProvider>
          </>
        )}

        {modalState === 'success' && (
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">
                Agendamento criado com sucesso!
              </h3>
              <p className="text-gray-600">Deseja associá-lo a serviço(s)?</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleShowServices}
                className="flex-1 rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 md:text-base"
              >
                Sim, associar serviços
              </button>
              <button
                onClick={handleFinishWithoutServices}
                className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 md:text-base"
              >
                Não, finalizar
              </button>
            </div>
          </>
        )}

        {modalState === 'services' && (
          <>
            <div className="mb-4 flex items-center justify-between md:mb-6">
              <h3 className="text-lg font-bold text-gray-800 md:text-xl">
                Associar Serviços
              </h3>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <p className="mb-4 text-sm text-gray-600">
                Selecione os serviços que deseja associar ao agendamento:
              </p>

              <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                {loadingServices ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">
                      Carregando serviços...
                    </span>
                  </div>
                ) : services.length === 0 ? (
                  <p className="text-center text-sm text-gray-500">
                    Nenhum serviço disponível
                  </p>
                ) : (
                  <div className="max-h-60 space-y-3 overflow-y-auto">
                    {services.map((service) => (
                      <label
                        key={service.serviceId}
                        className="flex cursor-pointer items-start gap-3 rounded-lg bg-white p-3 transition-colors hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedServiceIds.includes(
                            service.serviceId,
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedServiceIds([
                                ...selectedServiceIds,
                                service.serviceId,
                              ])
                            } else {
                              setSelectedServiceIds(
                                selectedServiceIds.filter(
                                  (id) => id !== service.serviceId,
                                ),
                              )
                            }
                          }}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">
                              {service.name}
                            </span>
                            <span className="font-medium text-emerald-600">
                              R$ {service.price?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {service.description || 'Sem descrição'} •{' '}
                            {service.duration || 0} min
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {selectedServiceIds.length > 0 && (
                <p className="mt-2 text-sm text-emerald-600">
                  {selectedServiceIds.length} serviço
                  {selectedServiceIds.length > 1 ? 's' : ''} selecionado
                  {selectedServiceIds.length > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAssociateServices}
                disabled={isProcessing || selectedServiceIds.length === 0}
                className="flex-1 rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400 md:text-base"
              >
                {isProcessing ? 'Associando...' : 'Associar Serviços'}
              </button>
              <button
                onClick={handleFinishWithoutServices}
                disabled={isProcessing}
                className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
              >
                Pular
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
