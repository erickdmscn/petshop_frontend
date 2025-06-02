'use client'

import { useState } from 'react'
import {
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  Filter,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react'
import Header from '../components/Header'
import CreateAppointment from '../components/CreateAppointment'
import EditAppointment from '../components/EditAppointment'

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

const mockAppointments: Appointment[] = [
  {
    appointmentId: 1,
    userId: 1,
    petId: 1,
    appointmentDate: '2025-03-20',
    statusAppointments: 2,
    totalPrice: 85,
    paymentStatus: 2,
    paymentMethod: 3,
    notes: 'Pet muito agitado, usar focinheira',
    clientName: 'Maria Silva',
    clientPhone: '(11) 99999-9999',
    clientEmail: 'maria@email.com',
    petName: 'Rex',
    petType: 'Cão',
    service: 'Banho e Tosa',
    time: '14:00',
    duration: '2h',
    status: 'confirmed',
  },
  {
    appointmentId: 2,
    userId: 2,
    petId: 2,
    appointmentDate: '2025-03-20',
    statusAppointments: 1,
    totalPrice: 40,
    paymentStatus: 1,
    paymentMethod: 1,
    notes: '',
    clientName: 'João Santos',
    clientPhone: '(11) 88888-8888',
    clientEmail: 'joao@email.com',
    petName: 'Mimi',
    petType: 'Gato',
    service: 'Banho Simples',
    time: '15:30',
    duration: '1h',
    status: 'pending',
  },
  {
    appointmentId: 3,
    userId: 3,
    petId: 3,
    appointmentDate: '2025-03-21',
    statusAppointments: 3,
    totalPrice: 50,
    paymentStatus: 2,
    paymentMethod: 4,
    notes: '',
    clientName: 'Ana Oliveira',
    clientPhone: '(11) 77777-7777',
    clientEmail: 'ana@email.com',
    petName: 'Bob',
    petType: 'Cão',
    service: 'Tosa Higiênica',
    time: '10:00',
    duration: '30min',
    status: 'completed',
  },
  {
    appointmentId: 4,
    userId: 4,
    petId: 4,
    appointmentDate: '2025-03-19',
    statusAppointments: 4,
    totalPrice: 55,
    paymentStatus: 3,
    paymentMethod: 2,
    notes: '',
    clientName: 'Carlos Pereira',
    clientPhone: '(11) 66666-6666',
    clientEmail: 'carlos@email.com',
    petName: 'Luna',
    petType: 'Gato',
    service: 'Banho com Hidratação',
    time: '16:00',
    duration: '1h',
    status: 'cancelled',
  },
]

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <AlertCircle className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado'
      case 'pending':
        return 'Pendente'
      case 'completed':
        return 'Concluído'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  const filteredAppointments = mockAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || appointment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: mockAppointments.length,
    pending: mockAppointments.filter((a) => a.status === 'pending').length,
    confirmed: mockAppointments.filter((a) => a.status === 'confirmed').length,
    completed: mockAppointments.filter((a) => a.status === 'completed').length,
    cancelled: mockAppointments.filter((a) => a.status === 'cancelled').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-gray-800 md:text-3xl">
              Agendamentos
            </h1>
            <p className="text-sm text-gray-600 md:text-base">
              Gerencie todos os agendamentos do seu petshop
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700 md:px-4 md:text-base"
          >
            <Plus className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">Novo Agendamento</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 md:text-base"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 md:text-base"
              >
                <option value="all">Todos ({statusCounts.all})</option>
                <option value="pending">
                  Pendente ({statusCounts.pending})
                </option>
                <option value="confirmed">
                  Confirmado ({statusCounts.confirmed})
                </option>
                <option value="completed">
                  Concluído ({statusCounts.completed})
                </option>
                <option value="cancelled">
                  Cancelado ({statusCounts.cancelled})
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <div className="rounded-lg border bg-white p-3 shadow-sm md:p-6">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-full bg-yellow-100 p-2 md:p-3">
                <AlertCircle className="h-4 w-4 text-yellow-600 md:h-6 md:w-6" />
              </div>
              <div>
                <p className="mb-1 hidden text-xs font-medium text-gray-600 md:block md:text-sm">
                  Pendente
                </p>
                <p className="text-xl font-bold text-gray-800 md:text-2xl">
                  {statusCounts.pending}
                </p>
                <p className="text-xs font-medium text-gray-600 md:hidden">
                  Pendente
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-3 shadow-sm md:p-6">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-full bg-green-100 p-2 md:p-3">
                <CheckCircle className="h-4 w-4 text-green-600 md:h-6 md:w-6" />
              </div>
              <div>
                <p className="mb-1 hidden text-xs font-medium text-gray-600 md:block md:text-sm">
                  Confirmado
                </p>
                <p className="text-xl font-bold text-gray-800 md:text-2xl">
                  {statusCounts.confirmed}
                </p>
                <p className="text-xs font-medium text-gray-600 md:hidden">
                  Confirmado
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-3 shadow-sm md:p-6">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-full bg-blue-100 p-2 md:p-3">
                <CheckCircle className="h-4 w-4 text-blue-600 md:h-6 md:w-6" />
              </div>
              <div>
                <p className="mb-1 hidden text-xs font-medium text-gray-600 md:block md:text-sm">
                  Concluído
                </p>
                <p className="text-xl font-bold text-gray-800 md:text-2xl">
                  {statusCounts.completed}
                </p>
                <p className="text-xs font-medium text-gray-600 md:hidden">
                  Concluído
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-3 shadow-sm md:p-6">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-full bg-red-100 p-2 md:p-3">
                <XCircle className="h-4 w-4 text-red-600 md:h-6 md:w-6" />
              </div>
              <div>
                <p className="mb-1 hidden text-xs font-medium text-gray-600 md:block md:text-sm">
                  Cancelado
                </p>
                <p className="text-xl font-bold text-gray-800 md:text-2xl">
                  {statusCounts.cancelled}
                </p>
                <p className="text-xs font-medium text-gray-600 md:hidden">
                  Cancelado
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          {filteredAppointments.length === 0 ? (
            <div className="rounded-lg border bg-white p-6 text-center shadow-sm md:p-8">
              <Calendar className="mx-auto mb-4 h-8 w-8 text-gray-400 md:h-12 md:w-12" />
              <h3 className="mb-2 text-base font-medium text-gray-800 md:text-lg">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-sm text-gray-600 md:text-base">
                Tente ajustar os filtros ou criar um novo agendamento.
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment.appointmentId}
                className="cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md md:p-8"
                onClick={() => setSelectedAppointment(appointment)}
              >
                <div className="mb-4 flex items-start justify-between md:mb-6">
                  <div className="flex items-center gap-3 md:gap-6">
                    <div className="rounded-full bg-blue-50 p-2 md:p-4">
                      <User className="h-5 w-5 text-blue-600 md:h-8 md:w-8" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-bold text-gray-800 md:mb-2 md:text-xl">
                        {appointment.clientName}
                      </h3>
                      <p className="mb-1 text-sm text-gray-600 md:text-base">
                        Pet:{' '}
                        <span className="font-semibold text-gray-800">
                          {appointment.petName}
                        </span>{' '}
                        ({appointment.petType})
                      </p>
                      <p className="text-sm font-semibold text-blue-600 md:text-base">
                        {appointment.service}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-sm font-semibold md:px-4 md:py-2 md:text-base ${getStatusColor(
                        appointment.status,
                      )}`}
                    >
                      {getStatusIcon(appointment.status)}
                      <span className="hidden md:inline">
                        {getStatusText(appointment.status)}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-3 md:mb-6 md:grid-cols-3 md:gap-6">
                  <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 md:text-sm">
                        Data
                      </p>
                      <p className="font-semibold">
                        {new Date(
                          appointment.appointmentDate,
                        ).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <Clock className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 md:text-sm">
                        Horário
                      </p>
                      <p className="font-semibold">
                        {appointment.time} ({appointment.duration})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <Phone className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 md:text-sm">
                        Telefone
                      </p>
                      <p className="font-semibold">{appointment.clientPhone}</p>
                    </div>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 md:mb-6 md:p-4">
                    <p className="mb-1 text-xs font-medium text-amber-800 md:text-sm">
                      Observações importantes:
                    </p>
                    <p className="text-sm text-amber-700 md:text-base">
                      {appointment.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 md:gap-3 md:pt-4">
                  <button
                    className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:p-3"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedAppointment(appointment)
                    }}
                  >
                    <Eye className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                  <button
                    className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 md:p-3"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedAppointment(appointment)
                      setIsEditModalOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                  <button
                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 md:p-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedAppointment && !isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-4 md:p-8">
              <div className="mb-4 flex items-center justify-between md:mb-6">
                <h3 className="text-lg font-bold text-gray-800 md:text-xl">
                  Detalhes do Agendamento
                </h3>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="rounded-lg bg-gray-50 p-3 md:p-4">
                  <p className="mb-1 text-xs font-medium text-gray-600 md:text-sm">
                    Cliente
                  </p>
                  <p className="text-base font-semibold text-gray-800 md:text-lg">
                    {selectedAppointment.clientName}
                  </p>
                  <p className="text-sm text-gray-600 md:text-base">
                    {selectedAppointment.clientPhone}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 md:p-4">
                  <p className="mb-1 text-xs font-medium text-gray-600 md:text-sm">
                    Pet
                  </p>
                  <p className="text-base font-semibold text-gray-800 md:text-lg">
                    {selectedAppointment.petName} ({selectedAppointment.petType}
                    )
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 md:p-4">
                  <p className="mb-1 text-xs font-medium text-gray-600 md:text-sm">
                    Serviço
                  </p>
                  <p className="text-base font-semibold text-gray-800 md:text-lg">
                    {selectedAppointment.service}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 md:p-4">
                  <p className="mb-1 text-xs font-medium text-gray-600 md:text-sm">
                    Data e Hora
                  </p>
                  <p className="text-base font-semibold text-gray-800 md:text-lg">
                    {new Date(
                      selectedAppointment.appointmentDate,
                    ).toLocaleDateString('pt-BR')}{' '}
                    às {selectedAppointment.time}
                  </p>
                  <p className="text-sm text-gray-600 md:text-base">
                    Duração: {selectedAppointment.duration}
                  </p>
                </div>
                {selectedAppointment.notes && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 md:p-4">
                    <p className="mb-1 text-xs font-medium text-amber-800 md:text-sm">
                      Observações
                    </p>
                    <p className="text-sm text-amber-700 md:text-base">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex gap-3 md:mt-8">
                <button
                  className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 md:py-3 md:text-base"
                  onClick={() => {
                    setIsEditModalOpen(true)
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 md:py-3 md:text-base"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        <CreateAppointment
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        <EditAppointment
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedAppointment(null)
          }}
          appointment={selectedAppointment}
        />
      </main>
    </div>
  )
}
