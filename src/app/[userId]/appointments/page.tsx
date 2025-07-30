'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Plus, Trash2, DollarSign } from 'lucide-react'
import { getAppointmentServicesAction } from '@/actions/appointments'
import { getPetsByUserAction } from '@/actions/pets'
import CreateAppointment from '../../components/CreateAppointment'
import DeleteAppointmentModal from '../../components/DeleteAppointmentModal'

interface AppointmentService {
  serviceId: number
  name: string
  descripton: string | null
  price: number
  duration: number
}

interface Pet {
  petsId: number
  fullName: string
  species: number
  breed: string
  age: number
  birthDate: string
  gender: number
  needAttention: boolean
}

interface Appointment {
  appointmentId: number
  userId: number
  petId: number
  appointmentDate: string
  statusAppointments: number
  totalPrice: number
  paymentStatus: number
  paymentMethod: number
  notes: string
  services: AppointmentService[]
}

const PaymentStatus = {
  1: 'Pendente',
  2: 'Pago',
  3: 'Cancelado',
} as const

const PaymentMethod = {
  1: 'Dinheiro',
  2: 'Cartão',
  3: 'Débito',
  4: 'Crédito',
  5: 'PIX',
} as const

const AppointmentStatus = {
  1: 'Agendado',
  2: 'Confirmado',
  3: 'Em andamento',
  4: 'Concluído',
  5: 'Cancelado',
} as const

export default function AppointmentsPage() {
  const params = useParams()
  const userId = Number(params.userId)

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateAppointment, setShowCreateAppointment] = useState(false)
  const [showDeleteAppointment, setShowDeleteAppointment] = useState(false)
  const [selectedAppointmentForDelete, setSelectedAppointmentForDelete] =
    useState<{
      appointmentId: number
      petName: string
      appointmentDate: string
    } | null>(null)

  const safeAppointments = appointments || []

  const getPetName = (petId: number): string => {
    const pet = pets.find((p) => p.petsId === petId)
    return pet ? pet.fullName : `Pet ${petId}`
  }

  const loadAppointments = useCallback(async () => {
    setLoading(true)

    try {
      const [appointmentsResponse, petsData] = await Promise.all([
        getAppointmentServicesAction(1, 20),
        getPetsByUserAction(userId),
      ])

      // Se o retorno tiver a estrutura com items, usar items, senão usar data
      const appointmentsData =
        appointmentsResponse.items || appointmentsResponse.data || []

      setAppointments(appointmentsData)
      setPets(petsData || [])
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      // Se for erro de autenticação, o layout já vai redirecionar
      if (err instanceof Error && err.message === 'UNAUTHORIZED') {
        // Deixar o layout/middleware lidar com o redirecionamento
        return
      }
    } finally {
      setLoading(false)
    }
  }, [userId])

  const handleDeleteAppointment = (appointment: Appointment) => {
    setSelectedAppointmentForDelete({
      appointmentId: appointment.appointmentId,
      petName: getPetName(appointment.petId),
      appointmentDate: appointment.appointmentDate,
    })
    setShowDeleteAppointment(true)
  }

  const handleCloseDeleteAppointment = () => {
    setShowDeleteAppointment(false)
    setSelectedAppointmentForDelete(null)
  }

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando agendamentos...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-gray-800 md:text-3xl">
            Agendamentos
          </h1>
          <p className="text-sm text-gray-600 md:text-base">
            Gerencie os agendamentos de seus pets.
          </p>
        </div>
        <button
          onClick={() => setShowCreateAppointment(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 md:px-6 md:py-3 md:text-base"
        >
          <Plus className="h-4 w-4 md:h-5 md:w-5" />
          Novo Agendamento
        </button>
      </div>

      <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm md:p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-emerald-50 p-3">
            <DollarSign className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 md:text-base">
              Receita Total dos Agendamentos
            </h3>
            <p className="text-2xl font-bold text-gray-800 md:text-3xl">
              R${' '}
              {safeAppointments
                .reduce(
                  (sum, appointment) => sum + (appointment?.totalPrice || 0),
                  0,
                )
                .toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              {safeAppointments.length} agendamento
              {safeAppointments.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {safeAppointments.length === 0 ? (
          <div className="rounded-lg border bg-white p-6 text-center shadow-sm md:p-8">
            <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-base font-medium text-gray-800 md:text-lg">
              Nenhum agendamento encontrado
            </h3>
            <p className="text-sm text-gray-600 md:text-base">
              Você ainda não possui agendamentos cadastrados.
            </p>
          </div>
        ) : (
          safeAppointments.map((appointment, index) => (
            <div
              key={appointment.appointmentId || index}
              className="rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md md:p-8"
            >
              <div className="mb-4 flex items-start justify-between md:mb-6">
                <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-6">
                  <div className="flex-shrink-0 rounded-full bg-blue-50 p-2 md:p-4">
                    <svg
                      className="h-5 w-5 text-blue-600 md:h-8 md:w-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2 md:mb-2">
                      <h3 className="truncate text-base font-bold text-gray-800 md:text-xl">
                        {getPetName(appointment.petId)}
                      </h3>
                      <span
                        className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium md:px-3 md:text-sm ${
                          appointment.statusAppointments === 2
                            ? 'bg-green-100 text-green-800'
                            : appointment.statusAppointments === 4
                              ? 'bg-blue-100 text-blue-800'
                              : appointment.statusAppointments === 5
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {AppointmentStatus[
                          appointment.statusAppointments as keyof typeof AppointmentStatus
                        ] || 'Desconhecido'}
                      </span>
                    </div>
                    {appointment.notes && (
                      <p className="mb-1 line-clamp-2 text-sm text-gray-600 md:text-base">
                        {appointment.notes}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.appointmentDate).toLocaleDateString(
                        'pt-BR',
                      )}
                    </p>
                  </div>
                </div>
                <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800 md:gap-2 md:px-4 md:py-2 md:text-base">
                  R$ {appointment.totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-3 md:mb-6 md:grid-cols-3 md:gap-6">
                <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <svg
                      className="h-4 w-4 md:h-5 md:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">
                      Pagamento
                    </p>
                    <p className="font-semibold">
                      {PaymentStatus[
                        appointment.paymentStatus as keyof typeof PaymentStatus
                      ] || 'Desconhecido'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <svg
                      className="h-4 w-4 md:h-5 md:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">
                      Método
                    </p>
                    <p className="font-semibold">
                      {PaymentMethod[
                        appointment.paymentMethod as keyof typeof PaymentMethod
                      ] || 'Desconhecido'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <svg
                      className="h-4 w-4 md:h-5 md:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14-4H3m18-2H3m16 2V9a4 4 0 00-4-4H7a4 4 0 00-4 4v2m12 4v6a4 4 0 01-4 4H9a4 4 0 01-4-4v-6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">
                      Serviços
                    </p>
                    <p className="font-semibold">
                      {appointment.services.length} serviço(s)
                    </p>
                  </div>
                </div>
              </div>

              {appointment.services.length > 0 && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 md:p-4">
                  <p className="mb-2 text-xs font-medium text-blue-800 md:text-sm">
                    Serviços inclusos:
                  </p>
                  <div className="space-y-1">
                    {appointment.services.map((service, serviceIndex) => (
                      <div
                        key={service.serviceId || serviceIndex}
                        className="flex items-center justify-between text-sm text-blue-700"
                      >
                        <span>
                          {service.name} ({service.duration}min)
                        </span>
                        <span className="font-medium">
                          R$ {service.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botão de deletar no canto inferior direito */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => handleDeleteAppointment(appointment)}
                  className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-red-600 transition-colors hover:bg-red-100 md:gap-2 md:px-3 md:py-2"
                  title="Deletar agendamento"
                >
                  <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden text-sm font-medium md:inline">
                    Deletar
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showCreateAppointment && (
        <CreateAppointment
          isOpen={showCreateAppointment}
          onClose={() => setShowCreateAppointment(false)}
          userId={userId}
          onSuccess={loadAppointments}
        />
      )}

      {showDeleteAppointment && selectedAppointmentForDelete && (
        <DeleteAppointmentModal
          isOpen={showDeleteAppointment}
          onClose={handleCloseDeleteAppointment}
          onSuccess={loadAppointments}
          appointment={selectedAppointmentForDelete}
        />
      )}
    </>
  )
}
