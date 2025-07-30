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
import { getAppointmentServicesAction } from '@/actions/appointments'
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
  services: any[]
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
  description: string | null
  price: number
  duration: number
  isActive?: boolean
}

interface ServicesResponse {
  data: Service[]
  totalCount: number
  pageIndex: number
  pageSize: number
  totalPages: number
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
  const [servicesData, setServicesData] = useState<ServicesResponse | null>(
    null,
  )

  const [loading, setLoading] = useState(true)

  const safeAppointments = Array.isArray(appointments) ? appointments : []
  const safePets = Array.isArray(pets) ? pets : []
  const safeServices = servicesData?.data || services || []

  const loadUserData = async () => {
    if (!userId) return

    setLoading(true)

    try {
      const appointmentsResponse = await getAppointmentServicesAction(1, 50)
      setAppointments(appointmentsResponse?.data || [])

      const petsData = await getPetsByUserAction(userId)
      setPets(petsData || [])

      const servicesResponse = await getAllServicesAction(1, 50)
      setServicesData(servicesResponse)
      setServices(servicesResponse?.data || [])
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [userId])

  const reloadServices = async () => {
    try {
      const servicesResponse = await getAllServicesAction(1, 50)
      setServicesData(servicesResponse)
      setServices(servicesResponse?.data || [])
    } catch (err) {
      console.error('Erro ao recarregar serviços:', err)
    }
  }

  const getStatusFromNumber = (statusNum: number): string => {
    switch (statusNum) {
      case 1:
        return 'pending'
      case 2:
        return 'confirmed'
      case 3:
        return 'completed'
      case 4:
        return 'cancelled'
      default:
        return 'pending'
    }
  }

  const getPetName = (petId: number): string => {
    const pet = safePets.find((p) => p.petsId === petId)
    return pet?.fullName || `Pet #${petId}`
  }

  const stats = [
    {
      title: 'Agendamentos',
      value: safeAppointments.length.toString(),
      icon: Calendar,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: `${safeAppointments.filter((a) => getStatusFromNumber(a.statusAppointments) === 'confirmed').length} confirmados`,
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
      trend: `${safeServices.filter((s: Service) => s.isActive !== false).length} ativos`,
    },
    {
      title: 'Receita Total',
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
      action: `Agendamento ${getStatusFromNumber(appointment.statusAppointments) === 'confirmed' ? 'confirmado' : 'pendente'}`,
      date: appointment.appointmentDate
        ? new Date(appointment.appointmentDate).toLocaleDateString('pt-BR')
        : '--/--/----',
      time: '--:--',
      icon: Calendar,
    })),
  ]

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
          <div className="mb-4 flex flex-col gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 md:text-xl">
              <Calendar className="h-4 w-4 text-blue-600 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Próximos Agendamentos</span>
              <span className="sm:hidden">Agendamentos</span>
            </h3>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={() => setShowCreateAppointment(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
                Cadastrar Agendamento
              </button>
              <button
                onClick={() => router.push(`/${userId}/appointments`)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Ver mais informações
              </button>
            </div>
          </div>

          {safeAppointments.length === 0 ? (
            <div className="py-8 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">Nenhum agendamento encontrado</p>
              <button
                onClick={() => setShowCreateAppointment(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
                Cadastrar Agendamento
              </button>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="pb-3 text-sm font-medium text-gray-600">
                        Pet
                      </th>
                      <th className="pb-3 text-sm font-medium text-gray-600">
                        Data do Agendamento
                      </th>
                      <th className="w-1/3 pb-3 text-sm font-medium text-gray-600">
                        Serviços
                      </th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-600">
                        Valor Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {safeAppointments.slice(0, 14).map((appointment) => (
                      <tr
                        key={appointment.appointmentId}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="py-4 font-medium text-gray-800">
                          {getPetName(appointment.petId)}
                        </td>
                        <td className="py-4 text-gray-600">
                          {appointment.appointmentDate
                            ? new Date(
                                appointment.appointmentDate,
                              ).toLocaleDateString('pt-BR')
                            : '--/--/----'}
                        </td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-1">
                            {appointment.services?.length > 0 ? (
                              appointment.services
                                .slice(0, 2)
                                .map((service, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                                  >
                                    {service.name}
                                  </span>
                                ))
                            ) : (
                              <span className="text-sm text-gray-500">
                                Nenhum serviço
                              </span>
                            )}
                            {appointment.services?.length > 2 && (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                +{appointment.services.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <span className="font-semibold text-emerald-600">
                            R$ {appointment.totalPrice.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 md:hidden">
                {safeAppointments.slice(0, 14).map((appointment) => (
                  <div
                    key={appointment.appointmentId}
                    className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h4 className="truncate font-medium text-gray-800">
                          {getPetName(appointment.petId)}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {appointment.appointmentDate
                            ? new Date(
                                appointment.appointmentDate,
                              ).toLocaleDateString('pt-BR')
                            : '--/--/----'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-emerald-600">
                          R$ {appointment.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {appointment.services?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {appointment.services
                          .slice(0, 3)
                          .map((service, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                            >
                              {service.name}
                            </span>
                          ))}
                        {appointment.services.length > 3 && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                            +{appointment.services.length - 3}
                          </span>
                        )}
                      </div>
                    )}
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
                  <p className="text-sm text-gray-500">Nenhum pet cadastrado</p>
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
                  <h4 className="font-medium text-gray-800">{service.name}</h4>
                  <span className="text-sm font-medium text-orange-600">
                    R$ {service.price ? service.price.toFixed(2) : '0.00'}
                  </span>
                </div>
                <p className="mb-3 text-sm text-gray-600">
                  {service.description || 'Sem descrição'}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
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
          userId={userId}
          onSuccess={loadUserData}
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
          onSuccess={reloadServices}
        />
      )}
    </>
  )
}
