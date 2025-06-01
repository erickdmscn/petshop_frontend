'use client'

import { useState } from 'react'
import Header from '../components/Header'
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Clock,
  Edit,
  Trash2,
  Eye,
  Scissors,
  Bath,
  Package,
  XCircle,
  Calendar,
} from 'lucide-react'
import CreateService from '../components/CreateService'
import EditService from '../components/EditService'

// Componente personalizado para o ícone R$
const RealSign = () => <span className="font-bold text-gray-600">R$</span>

interface Service {
  serviceId: number
  name: string
  descripton: string
  price: number
  duration: number
  category: 'banho' | 'tosa' | 'outros'
  isActive: boolean
  monthlyBookings: number
  lastBooking?: string
}

const mockServices: Service[] = [
  {
    serviceId: 1,
    name: 'Banho e Tosa Completo',
    descripton: 'Banho, tosa higiênica, corte de unhas e limpeza de ouvidos',
    duration: 120,
    price: 85,
    category: 'banho',
    isActive: true,
    monthlyBookings: 24,
    lastBooking: '2024-03-19',
  },
  {
    serviceId: 2,
    name: 'Tosa Higiênica',
    descripton: 'Tosa focinho, patas e região íntima',
    duration: 60,
    price: 50,
    category: 'tosa',
    isActive: true,
    monthlyBookings: 18,
    lastBooking: '2024-03-20',
  },
  {
    serviceId: 3,
    name: 'Banho Simples',
    descripton: 'Banho com shampoo especial e secagem',
    duration: 60,
    price: 40,
    category: 'banho',
    isActive: true,
    monthlyBookings: 15,
    lastBooking: '2024-03-18',
  },
  {
    serviceId: 4,
    name: 'Tosa na Máquina',
    descripton: 'Tosa completa com máquina, incluindo corpo e patas',
    duration: 90,
    price: 60,
    category: 'tosa',
    isActive: true,
    monthlyBookings: 12,
    lastBooking: '2024-03-17',
  },
  {
    serviceId: 5,
    name: 'Banho com Hidratação',
    descripton:
      'Banho com shampoo especial, condicionador e máscara hidratante',
    duration: 90,
    price: 55,
    category: 'banho',
    isActive: true,
    monthlyBookings: 10,
    lastBooking: '2024-03-16',
  },
  {
    serviceId: 6,
    name: 'Tosa na Tesoura',
    descripton: 'Tosa artística com tesoura, ideal para raças específicas',
    duration: 120,
    price: 90,
    category: 'tosa',
    isActive: true,
    monthlyBookings: 8,
    lastBooking: '2024-03-15',
  },
  {
    serviceId: 7,
    name: 'Banho com Perfumação',
    descripton: 'Banho com shampoo especial e perfume para pets',
    duration: 60,
    price: 45,
    category: 'banho',
    isActive: false,
    monthlyBookings: 5,
    lastBooking: '2024-03-10',
  },
  {
    serviceId: 8,
    name: 'Tosa de Filhotes',
    descripton: 'Tosa especial para filhotes, com cuidado redobrado',
    duration: 60,
    price: 70,
    category: 'tosa',
    isActive: true,
    monthlyBookings: 7,
    lastBooking: '2024-03-14',
  },
]

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [sortBy, setSortBy] = useState('name')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const getCategoryIcon = (category: Service['category']) => {
    switch (category) {
      case 'banho':
        return <Bath className="h-4 w-4 md:h-5 md:w-5" />
      case 'tosa':
        return <Scissors className="h-4 w-4 md:h-5 md:w-5" />
      default:
        return <Package className="h-4 w-4 md:h-5 md:w-5" />
    }
  }

  const getCategoryColor = (category: Service['category']) => {
    switch (category) {
      case 'banho':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'tosa':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryText = (category: Service['category']) => {
    switch (category) {
      case 'banho':
        return 'Banho'
      case 'tosa':
        return 'Tosa'
      default:
        return 'Outros'
    }
  }

  const filteredServices = mockServices
    .filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.descripton.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        categoryFilter === 'all' || service.category === categoryFilter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && service.isActive) ||
        (statusFilter === 'inactive' && !service.isActive)
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price
        case 'bookings':
          return b.monthlyBookings - a.monthlyBookings
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const categoryCounts = {
    all: mockServices.length,
    banho: mockServices.filter((s) => s.category === 'banho').length,
    tosa: mockServices.filter((s) => s.category === 'tosa').length,
    outros: mockServices.filter((s) => s.category === 'outros').length,
  }

  const activeServices = mockServices.filter((s) => s.isActive).length
  const totalRevenue = mockServices.reduce(
    (sum, s) => sum + s.price * s.monthlyBookings,
    0,
  )
  const totalBookings = mockServices.reduce(
    (sum, s) => sum + s.monthlyBookings,
    0,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-8">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-gray-800 md:text-3xl">
              Serviços
            </h1>
            <p className="text-sm text-gray-600 md:text-base">
              Gerencie os serviços oferecidos pelo seu petshop
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700 md:px-4 md:text-base"
          >
            <Plus className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">Novo Serviço</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>

        {/* Cards de Estatísticas - Responsivos */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mb-8 md:gap-6 lg:grid-cols-3">
          <div className="rounded-lg border bg-white p-4 shadow-sm md:p-6">
            <div className="mb-2 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-blue-100 p-2">
                <Wrench className="h-4 w-4 text-blue-600 md:h-5 md:w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-600 md:text-sm">
                  Serviços Ativos
                </p>
                <p className="text-lg font-bold text-gray-800 md:text-2xl">
                  {activeServices}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              de {mockServices.length} total
            </p>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm md:p-6">
            <div className="mb-2 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-green-100 p-2">
                <RealSign />
              </div>
              <div>
                <p className="text-xs text-gray-600 md:text-sm">
                  Receita Mensal
                </p>
                <p className="text-lg font-bold text-gray-800 md:text-2xl">
                  {totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">baseado nos agendamentos</p>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm sm:col-span-2 md:p-6 lg:col-span-1">
            <div className="mb-2 flex items-center gap-3 md:mb-4">
              <div className="rounded-full bg-purple-100 p-2">
                <Calendar className="h-4 w-4 text-purple-600 md:h-5 md:w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-600 md:text-sm">Agendamentos</p>
                <p className="text-lg font-bold text-gray-800 md:text-2xl">
                  {totalBookings}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">este mês</p>
          </div>
        </div>

        {/* Filtros e Busca - Responsivos */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:w-auto md:text-base"
              >
                <option value="all">Todas ({categoryCounts.all})</option>
                <option value="banho">Banho ({categoryCounts.banho})</option>
                <option value="tosa">Tosa ({categoryCounts.tosa})</option>
                <option value="outros">Outros ({categoryCounts.outros})</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:w-auto md:text-base"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:w-auto md:text-base"
            >
              <option value="name">Ordenar por nome</option>
              <option value="price">Maior preço</option>
              <option value="bookings">Mais agendados</option>
            </select>
          </div>
        </div>

        {/* Lista de Serviços - Responsivos */}
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <div className="rounded-lg border bg-white p-6 text-center shadow-sm md:p-8">
              <Wrench className="mx-auto mb-4 h-8 w-8 text-gray-400 md:h-12 md:w-12" />
              <h3 className="mb-2 text-base font-medium text-gray-800 md:text-lg">
                Nenhum serviço encontrado
              </h3>
              <p className="text-sm text-gray-600 md:text-base">
                Tente ajustar os filtros ou criar um novo serviço.
              </p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <div
                key={service.serviceId}
                className={`cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md md:p-8 ${
                  !service.isActive ? 'opacity-75' : ''
                }`}
                onClick={() => setSelectedService(service)}
              >
                <div className="mb-4 flex items-start justify-between md:mb-6">
                  <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-6">
                    <div
                      className={`flex-shrink-0 rounded-full p-2 md:p-4 ${service.isActive ? 'bg-blue-50' : 'bg-gray-100'}`}
                    >
                      {getCategoryIcon(service.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2 md:mb-2">
                        <h3 className="truncate text-base font-bold text-gray-800 md:text-xl">
                          {service.name}
                        </h3>
                        {!service.isActive && (
                          <span className="whitespace-nowrap rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 md:px-3 md:text-sm">
                            Inativo
                          </span>
                        )}
                      </div>
                      <p className="mb-1 line-clamp-2 text-sm text-gray-600 md:text-base">
                        {service.descripton}
                      </p>
                      <p className="text-sm font-semibold text-blue-600 md:text-base">
                        {getCategoryText(service.category)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold md:gap-2 md:px-4 md:py-2 md:text-base ${getCategoryColor(
                      service.category,
                    )}`}
                  >
                    {getCategoryIcon(service.category)}
                    <span className="hidden md:inline">
                      {getCategoryText(service.category)}
                    </span>
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-3 md:mb-6 md:grid-cols-3 md:gap-6">
                  <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <Clock className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 md:text-sm">
                        Duração
                      </p>
                      <p className="font-semibold">
                        {service.duration} minutos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <RealSign />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 md:text-sm">
                        Preço
                      </p>
                      <p className="font-semibold">
                        R$ {service.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 md:text-sm">
                        Agendamentos
                      </p>
                      <p className="font-semibold">
                        {service.monthlyBookings} este mês
                      </p>
                    </div>
                  </div>
                </div>

                {service.lastBooking && (
                  <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 md:mb-6 md:p-4">
                    <p className="mb-1 text-xs font-medium text-amber-800 md:text-sm">
                      Último agendamento:
                    </p>
                    <p className="text-sm text-amber-700 md:text-base">
                      {new Date(service.lastBooking).toLocaleDateString(
                        'pt-BR',
                      )}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 md:gap-3 md:pt-4">
                  <button
                    className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:p-3"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedService(service)
                    }}
                  >
                    <Eye className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                  <button
                    className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 md:p-3"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedService(service)
                      setShowEditModal(true)
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

        {/* Modal de Detalhes - Responsivo */}
        {selectedService && !showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-4 md:p-6">
              <div className="mb-4 flex items-center justify-between md:mb-6">
                <h3 className="text-lg font-semibold md:text-xl">
                  Detalhes do Serviço
                </h3>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <div>
                    <p className="text-xs text-gray-600 md:text-sm">Nome</p>
                    <p className="text-sm font-medium md:text-base">
                      {selectedService.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 md:text-sm">
                      Categoria
                    </p>
                    <p className="text-sm font-medium md:text-base">
                      {getCategoryText(selectedService.category)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600 md:text-sm">Descrição</p>
                  <p className="text-sm font-medium md:text-base">
                    {selectedService.descripton}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <div>
                    <p className="text-xs text-gray-600 md:text-sm">Duração</p>
                    <p className="text-sm font-medium md:text-base">
                      {selectedService.duration} minutos
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 md:text-sm">Preço</p>
                    <p className="text-sm font-medium text-green-600 md:text-base">
                      R$ {selectedService.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <div>
                    <p className="text-xs text-gray-600 md:text-sm">
                      Agendamentos/mês
                    </p>
                    <p className="text-sm font-medium md:text-base">
                      {selectedService.monthlyBookings}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 md:text-sm">Status</p>
                    <p
                      className={`text-sm font-medium md:text-base ${selectedService.isActive ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {selectedService.isActive ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                </div>

                {selectedService.lastBooking && (
                  <div>
                    <p className="text-xs text-gray-600 md:text-sm">
                      Último agendamento
                    </p>
                    <p className="text-sm font-medium md:text-base">
                      {new Date(selectedService.lastBooking).toLocaleDateString(
                        'pt-BR',
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2 md:mt-6">
                <button
                  className="flex-1 rounded-lg bg-blue-600 py-2 text-sm text-white transition-colors hover:bg-blue-700 md:text-base"
                  onClick={() => {
                    setShowEditModal(true)
                  }}
                >
                  Editar Serviço
                </button>
                <button
                  className={`flex-1 rounded-lg border py-2 text-sm transition-colors md:text-base ${
                    selectedService.isActive
                      ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
                      : 'border-green-300 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {selectedService.isActive ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Criação */}
        <CreateService
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />

        {/* Modal de Edição */}
        <EditService
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedService(null)
          }}
          service={selectedService}
        />
      </main>
    </div>
  )
}
