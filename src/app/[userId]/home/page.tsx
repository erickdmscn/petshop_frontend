'use client'

import {
  Calendar,
  Heart,
  Users,
  Wrench,
  Plus,
  User,
  Activity,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CreateAppointment from '../../components/CreateAppointment'
import CreatePet from '../../components/CreatePet'
import CreateService from '../../components/CreateService'
import { getAppointmentsByUserAction } from '@/actions/appointments'
import { getPetsByUserAction } from '@/actions/pets'
import { getAllServicesAction } from '@/actions/services'

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
  description: string
  price: number
  duration: number
  category: string
  isActive: boolean
}

export default function Home() {
  const params = useParams()
  const router = useRouter()
  const userId = Number(params.userId)

  const [showCreateAppointment, setShowCreateAppointment] = useState(false)
  const [showCreatePet, setShowCreatePet] = useState(false)
  const [showCreateService, setShowCreateService] = useState(false)

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  // Garantir que sempre sejam arrays válidos
  const safeAppointments = Array.isArray(appointments) ? appointments : []
  const safePets = Array.isArray(pets) ? pets : []
  const safeServices = Array.isArray(services) ? services : []

  // Carregar dados do usuário
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return

      setLoading(true)

      try {
        // Carregar agendamentos do usuário
        const appointmentsData = await getAppointmentsByUserAction(userId)
        setAppointments(appointmentsData || [])

        // Carregar pets do usuário
        const petsData = await getPetsByUserAction(userId)
        setPets(petsData || [])

        // Carregar todos os serviços
        const servicesData = await getAllServicesAction()
        setServices(servicesData || [])
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [userId])

  // Estatísticas baseadas nos dados reais
  const stats = [
    {
      title: 'Agendamentos',
      value: safeAppointments.length.toString(),
      icon: Calendar,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: `${safeAppointments.filter((a) => a?.status === 'confirmed').length} confirmados`,
    },
    {
      title: 'Pets',
      value: safePets.length.toString(),
      icon: Heart,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: `${safePets.filter((p: Pet) => p.needAttention).length} precisam de atenção`,
    },
    {
      title: 'Serviços',
      value: safeServices.length.toString(),
      icon: Wrench,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: `${safeServices.filter((s: Service) => s.isActive).length} ativos`,
    },
    {
      title: 'Total Investido',
      value: `R$ ${safeAppointments.reduce((sum, a) => sum + (a?.totalPrice || 0), 0).toFixed(2)}`,
      icon: Users,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      trend: 'Este mês',
    },
  ]

  const recentActivities = [
    {
      action: 'Usuário logado',
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      icon: User,
    },
    ...safeAppointments.slice(0, 3).map((appointment) => ({
      action: `Agendamento ${appointment?.status === 'confirmed' ? 'confirmado' : 'pendente'}`,
      date: appointment?.appointmentDate
        ? new Date(appointment.appointmentDate).toLocaleDateString('pt-BR')
        : '--/--/----',
      time: appointment?.time || '--:--',
      icon: Calendar,
    })),
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-8">
        <div>
          <h2 className="mb-1 text-2xl font-bold text-gray-800 md:text-3xl">
            PetCare Dashboard
          </h2>
          <p className="text-gray-600">Usuário ID: {userId}</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:mb-8 md:gap-6 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:p-6"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div
                  className={`rounded-lg ${stat.bgColor} flex-shrink-0 p-2 md:p-3`}
                >
                  <IconComponent
                    className={`h-5 w-5 md:h-6 md:w-6 ${stat.iconColor}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 hidden text-xs font-medium text-gray-600 md:block md:text-sm">
                    {stat.title}
                  </div>
                  <div className="text-xl font-bold text-gray-800 md:text-2xl">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">{stat.trend}</div>
                </div>
                <Activity className="h-3 w-3 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 md:h-4 md:w-4" />
              </div>
              <div className="mt-2 md:hidden">
                <div className="text-center text-xs font-medium text-gray-600">
                  {stat.title}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-sm md:p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between md:mb-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 md:text-xl">
              <Calendar className="h-4 w-4 text-blue-600 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Próximos Agendamentos</span>
              <span className="sm:hidden">Agendamentos</span>
            </h3>
            <button 
              onClick={() => router.push(`/${userId}/appointments`)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 md:text-sm"
            >
              Ver todos
            </button>
          </div>

          {safeAppointments.length === 0 ? (
            <div className="py-8 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">Nenhum agendamento encontrado</p>
              <button
                onClick={() => setShowCreateAppointment(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Novo Agendamento
              </button>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="pb-3 text-sm font-medium text-gray-600">
                        Cliente
                      </th>
                      <th className="pb-3 text-sm font-medium text-gray-600">
                        Pet
                      </th>
                      <th className="pb-3 text-sm font-medium text-gray-600">
                        Serviço
                      </th>
                      <th className="pb-3 text-sm font-medium text-gray-600">
                        Data/Hora
                      </th>
                      <th className="pb-3 text-sm font-medium text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {safeAppointments
                      .slice(0, 4)
                      .map((appointment, index) => (
                        <tr
                          key={index}
                          className="transition-colors hover:bg-gray-50"
                        >
                          <td className="py-4 font-medium text-gray-800">
                            {appointment?.clientName || 'N/A'}
                          </td>
                          <td className="py-4 text-gray-600">
                            {appointment?.petName || 'N/A'}
                          </td>
                          <td className="py-4 text-gray-600">
                            {appointment?.service || 'N/A'}
                          </td>
                          <td className="py-4">
                            <div className="text-sm">
                              <div className="font-medium text-gray-800">
                                {appointment?.appointmentDate
                                  ? new Date(
                                      appointment.appointmentDate,
                                    ).toLocaleDateString('pt-BR')
                                  : '--/--/----'}
                              </div>
                              <div className="text-gray-500">
                                {appointment?.time || '--:--'}
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(appointment?.status || '')}`}
                            >
                              {getStatusText(appointment?.status || '')}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 md:hidden">
                {safeAppointments.slice(0, 4).map((appointment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-medium text-gray-800">
                        {appointment?.clientName || 'N/A'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Pet:{' '}
                        <span className="font-medium">
                          {appointment?.petName || 'N/A'}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`ml-2 inline-flex flex-shrink-0 items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(appointment?.status || '')}`}
                    >
                      {getStatusText(appointment?.status || '')}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4 flex items-center justify-between md:mb-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 md:text-xl">
                <Activity className="h-4 w-4 text-green-600 md:h-5 md:w-5" />
                Atividades Recentes
              </h3>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const IconComponent = activity.icon
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="rounded-full bg-gray-100 p-2">
                        <IconComponent className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {activity.action}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <span>{activity.date}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4 flex items-center justify-between md:mb-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 md:text-xl">
                <Heart className="h-4 w-4 text-purple-600 md:h-5 md:w-5" />
                Meus Pets
              </h3>
              <button
                onClick={() => setShowCreatePet(true)}
                className="text-xs font-medium text-purple-600 hover:text-purple-700 md:text-sm"
              >
                Adicionar
              </button>
            </div>

            <div className="space-y-3">
              {safePets.length === 0 ? (
                <div className="py-4 text-center">
                  <Heart className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Nenhum pet cadastrado
                  </p>
                </div>
              ) : (
                safePets.map((pet: Pet, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-purple-100 p-2">
                        <Heart className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {pet.fullName}
                        </h4>
                        <p className="text-sm text-gray-600">{pet.breed}</p>
                      </div>
                    </div>
                    {pet.needAttention && (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        Atenção
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border bg-white p-4 shadow-sm md:p-6">
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 md:text-xl">
            <Wrench className="h-4 w-4 text-orange-600 md:h-5 md:w-5" />
            Serviços Disponíveis
          </h3>
          <button
            onClick={() => setShowCreateService(true)}
            className="text-xs font-medium text-orange-600 hover:text-orange-700 md:text-sm"
          >
            Adicionar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {safeServices.length === 0 ? (
            <div className="col-span-full py-8 text-center">
              <Wrench className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">Nenhum serviço disponível</p>
            </div>
          ) : (
            safeServices.map((service: Service, index: number) => (
              <div
                key={index}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">
                    {service.name}
                  </h4>
                  <span className="text-sm font-medium text-orange-600">
                    R$ {service.price.toFixed(2)}
                  </span>
                </div>
                <p className="mb-3 text-sm text-gray-600">
                  {service.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{service.category}</span>
                  <span>{service.duration} min</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showCreateAppointment && (
        <CreateAppointment
          isOpen={showCreateAppointment}
          onClose={() => setShowCreateAppointment(false)}
        />
      )}

      {showCreatePet && (
        <CreatePet
          isOpen={showCreatePet}
          onClose={() => setShowCreatePet(false)}
        />
      )}

      {showCreateService && (
        <CreateService
          isOpen={showCreateService}
          onClose={() => setShowCreateService(false)}
        />
      )}
    </>
  )
} 