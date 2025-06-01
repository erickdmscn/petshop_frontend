'use client'

import {
  Calendar,
  Heart,
  Users,
  Wrench,
  Plus,
  Clock,
  User,
  Activity,
  Phone,
} from 'lucide-react'
import Header from '../components/Header'
import CreateAppointment from '../components/CreateAppointment'
import CreatePet from '../components/CreatePet'
import CreateService from '../components/CreateService'
import { useState } from 'react'

export default function Home() {
  const [showCreateAppointment, setShowCreateAppointment] = useState(false)
  const [showCreatePet, setShowCreatePet] = useState(false)
  const [showCreateService, setShowCreateService] = useState(false)

  const stats = [
    {
      title: 'Agendamentos',
      value: '12',
      icon: Calendar,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: '+2 hoje',
    },
    {
      title: 'Pets',
      value: '24',
      icon: Heart,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: '+3 este mês',
    },
    {
      title: 'Clientes',
      value: '18',
      icon: Users,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      trend: '+1 esta semana',
    },
    {
      title: 'Serviços',
      value: '6',
      icon: Wrench,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: 'Ativos',
    },
  ]

  const appointments = [
    {
      client: 'João Silva',
      pet: 'Rex',
      service: 'Banho e Tosa',
      date: '25/04/2024',
      time: '09:00',
      phone: '(11) 99999-9999',
      status: 'confirmado',
    },
    {
      client: 'Maria Oliveira',
      pet: 'Mimi',
      service: 'Consulta',
      date: '25/04/2024',
      time: '10:30',
      phone: '(11) 88888-8888',
      status: 'pendente',
    },
    {
      client: 'Ana Souza',
      pet: 'Bob',
      service: 'Vacinação',
      date: '27/04/2024',
      time: '14:00',
      phone: '(11) 77777-7777',
      status: 'confirmado',
    },
    {
      client: 'Carlos Pereira',
      pet: 'Luna',
      service: 'Banho',
      date: '28/04/2024',
      time: '16:00',
      phone: '(11) 66666-6666',
      status: 'pendente',
    },
  ]

  const recentActivities = [
    { action: 'Usuário logado', date: '24/04/2024', time: '08:30', icon: User },
    {
      action: 'Alteração em cadastro de cliente',
      date: '23/04/2024',
      time: '15:20',
      icon: Users,
    },
    {
      action: 'Criação de novo serviço',
      date: '22/04/2024',
      time: '11:45',
      icon: Plus,
    },
    {
      action: 'Agendamento cancelado',
      date: '21/04/2024',
      time: '13:10',
      icon: Calendar,
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800'
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado'
      case 'pendente':
        return 'Pendente'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
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
            <div className="mb-4 flex items-center justify-between md:mb-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 md:text-xl">
                <Calendar className="h-4 w-4 text-blue-600 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Próximos Agendamentos</span>
                <span className="sm:hidden">Agendamentos</span>
              </h3>
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700 md:text-sm">
                Ver todos
              </button>
            </div>

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
                  {appointments.map((appointment, index) => (
                    <tr
                      key={index}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="py-4 font-medium text-gray-800">
                        {appointment.client}
                      </td>
                      <td className="py-4 text-gray-600">{appointment.pet}</td>
                      <td className="py-4 text-gray-600">
                        {appointment.service}
                      </td>
                      <td className="py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-800">
                            {appointment.date}
                          </div>
                          <div className="text-gray-500">
                            {appointment.time}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(appointment.status)}`}
                        >
                          {getStatusText(appointment.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {appointments.map((appointment, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-medium text-gray-800">
                        {appointment.client}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Pet:{' '}
                        <span className="font-medium">{appointment.pet}</span>
                      </p>
                    </div>
                    <span
                      className={`ml-2 inline-flex flex-shrink-0 items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(appointment.status)}`}
                    >
                      {getStatusText(appointment.status)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Wrench className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{appointment.service}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {appointment.date} às {appointment.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{appointment.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <div className="rounded-xl border bg-white p-4 shadow-sm md:p-6">
              <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-800 md:mb-4 md:text-lg">
                <Plus className="h-4 w-4 text-green-600 md:h-5 md:w-5" />
                Ações Rápidas
              </h3>
              <div className="space-y-2 md:space-y-3">
                <button
                  onClick={() => setShowCreateAppointment(true)}
                  className="flex w-full items-center gap-3 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-all hover:scale-105 hover:bg-blue-100 md:px-4 md:py-3 md:text-base"
                >
                  <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">Criar Agendamento</span>
                  <span className="sm:hidden">Agendamento</span>
                </button>
                <button
                  onClick={() => setShowCreatePet(true)}
                  className="flex w-full items-center gap-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-all hover:scale-105 hover:bg-green-100 md:px-4 md:py-3 md:text-base"
                >
                  <Heart className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">Cadastrar Pet</span>
                  <span className="sm:hidden">Cadastrar</span>
                </button>
                <button
                  onClick={() => setShowCreateService(true)}
                  className="flex w-full items-center gap-3 rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 transition-all hover:scale-105 hover:bg-purple-100 md:px-4 md:py-3 md:text-base"
                >
                  <Wrench className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">Novo Serviço</span>
                  <span className="sm:hidden">Serviço</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm md:p-6">
              <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-800 md:mb-4 md:text-lg">
                <Clock className="h-4 w-4 text-orange-600 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Atividades Recentes</span>
                <span className="sm:hidden">Atividades</span>
              </h3>
              <div className="space-y-3 md:space-y-4">
                {recentActivities.map((activity, index) => {
                  const IconComponent = activity.icon
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50 md:p-3"
                    >
                      <div className="flex-shrink-0 rounded-full bg-gray-100 p-1.5 md:p-2">
                        <IconComponent className="h-3 w-3 text-gray-600 md:h-4 md:w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-gray-800 md:text-sm">
                          {activity.action}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {activity.date}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <CreateAppointment
          isOpen={showCreateAppointment}
          onClose={() => setShowCreateAppointment(false)}
        />
        <CreatePet
          isOpen={showCreatePet}
          onClose={() => setShowCreatePet(false)}
        />
        <CreateService
          isOpen={showCreateService}
          onClose={() => setShowCreateService(false)}
        />
      </main>
    </div>
  )
}
