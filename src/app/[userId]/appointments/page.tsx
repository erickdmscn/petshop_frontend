'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getAppointmentsByUserAction } from '@/actions/appointments'

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
  clientName: string
  clientPhone: string
  clientEmail: string
  petName: string
  petType: string
  service: string
  time: string
  duration: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export default function AppointmentsPage() {
  const params = useParams()
  const userId = Number(params.userId)

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  // Garantir que sempre seja um array válido
  const safeAppointments = Array.isArray(appointments) ? appointments : []

  useEffect(() => {
    const loadAppointments = async () => {
      if (!userId) return

      setLoading(true)

      try {
        const appointmentsData = await getAppointmentsByUserAction(userId)
        setAppointments(appointmentsData || [])
      } catch (err) {
        console.error('Erro ao carregar agendamentos:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAppointments()
  }, [userId])

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
            Gerencie todos os agendamentos do seu petshop
          </p>
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
              Não há agendamentos para este usuário.
            </p>
          </div>
        ) : (
          safeAppointments.map((appointment, index) => (
            <div
              key={index}
              className="rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md md:p-8"
            >
              <div className="mb-4 flex items-start justify-between md:mb-6">
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="rounded-full bg-blue-50 p-2 md:p-4">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-bold text-gray-800 md:mb-2 md:text-xl">
                      {appointment?.clientName || 'N/A'}
                    </h3>
                    <p className="mb-1 text-sm text-gray-600 md:text-base">
                      Pet:{' '}
                      <span className="font-semibold text-gray-800">
                        {appointment?.petName || 'N/A'}
                      </span>{' '}
                      ({appointment?.petType || 'N/A'})
                    </p>
                    <p className="text-sm font-semibold text-blue-600 md:text-base">
                      {appointment?.service || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-sm font-semibold md:px-4 md:py-2 md:text-base ${
                      appointment?.status === 'confirmed'
                        ? 'border-green-200 bg-green-100 text-green-800'
                        : appointment?.status === 'pending'
                          ? 'border-yellow-200 bg-yellow-100 text-yellow-800'
                          : appointment?.status === 'completed'
                            ? 'border-blue-200 bg-blue-100 text-blue-800'
                            : appointment?.status === 'cancelled'
                              ? 'border-red-200 bg-red-100 text-red-800'
                              : 'border-gray-200 bg-gray-100 text-gray-800'
                    }`}
                  >
                    {appointment?.status === 'confirmed'
                      ? 'Confirmado'
                      : appointment?.status === 'pending'
                        ? 'Pendente'
                        : appointment?.status === 'completed'
                          ? 'Concluído'
                          : appointment?.status === 'cancelled'
                            ? 'Cancelado'
                            : appointment?.status || 'N/A'}
                  </span>
                </div>
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">
                      Data
                    </p>
                    <p className="font-semibold">
                      {appointment?.appointmentDate
                        ? new Date(
                            appointment.appointmentDate,
                          ).toLocaleDateString('pt-BR')
                        : '--/--/----'}
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">
                      Horário
                    </p>
                    <p className="font-semibold">
                      {appointment?.time || '--:--'} (
                      {appointment?.duration || 'N/A'})
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">
                      Telefone
                    </p>
                    <p className="font-semibold">
                      {appointment?.clientPhone || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {appointment?.notes && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 md:mb-6 md:p-4">
                  <p className="mb-1 text-xs font-medium text-amber-800 md:text-sm">
                    Observações importantes:
                  </p>
                  <p className="text-sm text-amber-700 md:text-base">
                    {appointment.notes}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  )
}
