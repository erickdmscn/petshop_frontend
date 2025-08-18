'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Filter, Search } from 'lucide-react'
import { deleteServiceAction, getAllServicesAction } from '@/actions/services'
import CreateService from '../../components/CreateService'
import EditService from '../../components/EditService'
import DeleteModal from '../../components/DeleteModal'
import FilterModal from '../../components/FilterModal'

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

export default function PetServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [servicesData, setServicesData] = useState<ServicesResponse | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [showCreateService, setShowCreateService] = useState(false)
  const [showEditService, setShowEditService] = useState(false)
  const [showDeleteService, setShowDeleteService] = useState(false)
  const [selectedService, setSelectedService] = useState<{
    serviceId: number
    name: string
    description: string
    price: number
    duration: number
  } | null>(null)
  const [selectedServiceForDelete, setSelectedServiceForDelete] = useState<{
    serviceId: number
    name: string
  } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})

  const serviceFilters = [
    {
      key: 'priceRange',
      label: 'Faixa de Preço',
      type: 'select' as const,
      options: [
        { value: '0-50', label: 'Até R$ 50' },
        { value: '50-100', label: 'R$ 50 - R$ 100' },
        { value: '100-200', label: 'R$ 100 - R$ 200' },
        { value: '200+', label: 'Acima de R$ 200' },
      ],
    },
    {
      key: 'duration',
      label: 'Duração',
      type: 'select' as const,
      options: [
        { value: '0-30', label: 'Até 30 min' },
        { value: '30-60', label: '30 - 60 min' },
        { value: '60-120', label: '1 - 2 horas' },
        { value: '120+', label: 'Mais de 2 horas' },
      ],
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'checkbox' as const,
      placeholder: 'Mostrar apenas serviços ativos',
    },
  ]

  const handleApplyFilters = (filters: Record<string, any>) => {
    setActiveFilters(filters)
    // Aqui você pode implementar a lógica de filtragem
  }

  const safeServices = servicesData?.data || services || []

  // Filtrar services baseado no termo de busca e filtros ativos
  const filteredServices = safeServices.filter((service) => {
    // Filtro por nome do serviço
    if (!service.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Filtro por faixa de preço
    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange.split('-').map(Number)
      if (max) {
        if (service.price < min || service.price > max) {
          return false
        }
      } else {
        // Caso seja "200+" por exemplo
        if (service.price < min) {
          return false
        }
      }
    }

    // Filtro por duração
    if (activeFilters.duration) {
      const [min, max] = activeFilters.duration.split('-').map(Number)
      if (max) {
        if (service.duration < min || service.duration > max) {
          return false
        }
      } else {
        // Caso seja "120+" por exemplo
        if (service.duration < min) {
          return false
        }
      }
    }

    // Filtro por status (ativo/inativo)
    if (activeFilters.isActive) {
      if (service.isActive === false) {
        return false
      }
    }

    return true
  })

  const loadServices = async () => {
    setLoading(true)

    try {
      const servicesResponse = await getAllServicesAction(1, 50)
      setServicesData(servicesResponse)
      setServices(servicesResponse?.data || [])
    } catch {
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const handleEditService = (service: Service) => {
    const serviceForEdit = {
      ...service,
      description: service.description || '',
    }
    setSelectedService(serviceForEdit)
    setShowEditService(true)
  }

  const handleCloseEditService = () => {
    setShowEditService(false)
    setSelectedService(null)
  }

  const handleDeleteService = (service: Service) => {
    setSelectedServiceForDelete({
      serviceId: service.serviceId,
      name: service.name,
    })
    setShowDeleteService(true)
  }

  const handleCloseDeleteService = () => {
    setShowDeleteService(false)
    setSelectedServiceForDelete(null)
  }

  useEffect(() => {
    loadServices()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando serviços...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Cabeçalho reorganizado */}
      <div className="mb-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-gray-800 md:text-3xl">
                Serviços
              </h1>
              <p className="text-sm text-gray-600 md:text-base">
                Gerencie todos os serviços do seu petshop
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateService(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 md:px-6 md:py-3 md:text-base"
          >
            <Plus className="h-4 w-4 md:h-5 md:w-5" />
            Novo Serviço
          </button>
        </div>

        {/* Barra de busca e filtro */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            Filtrar
          </button>

          <div className="relative max-w-md flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredServices.length === 0 ? (
          <div className="rounded-lg border bg-white p-6 text-center shadow-sm md:p-8">
            <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-base font-medium text-gray-800 md:text-lg">
              {searchTerm
                ? 'Nenhum serviço encontrado para a busca'
                : 'Nenhum serviço encontrado'}
            </h2>
            <p className="text-sm text-gray-600 md:text-base">
              {searchTerm
                ? 'Tente buscar por outro nome de serviço.'
                : 'Não há serviços disponíveis no momento.'}
            </p>
          </div>
        ) : (
          filteredServices.map((service, index) => (
            <div
              key={index}
              className={`rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md md:p-8 ${
                service.isActive === false ? 'opacity-75' : ''
              }`}
            >
              <div className="mb-4 flex items-start justify-between md:mb-6">
                <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-6">
                  <div
                    className={`flex-shrink-0 rounded-full p-2 md:p-4 ${service.isActive !== false ? 'bg-blue-50' : 'bg-gray-100'}`}
                  >
                    <svg
                      className="h-5 w-5 md:h-8 md:w-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2 md:mb-2">
                      <h2 className="truncate text-base font-bold text-gray-800 md:text-xl">
                        {service.name}
                      </h2>
                      {service.isActive === false && (
                        <span className="whitespace-nowrap rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 md:px-3 md:text-sm">
                          Inativo
                        </span>
                      )}
                    </div>
                    <p className="mb-1 line-clamp-2 text-sm text-gray-600 md:text-base">
                      {service.description || 'Sem descrição'}
                    </p>
                  </div>
                </div>
                <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800 md:gap-2 md:px-4 md:py-2 md:text-base">
                  <span className="hidden md:inline">
                    {service.duration || 0} min
                  </span>
                  <span className="md:hidden">{service.duration || 0}m</span>
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">
                      Duração
                    </p>
                    <p className="font-semibold">
                      {service.duration || 0} minutos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 md:text-base">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <span className="font-bold text-gray-600">R$</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">
                      Preço
                    </p>
                    <p className="font-semibold">
                      R$ {service.price ? service.price.toFixed(2) : '0.00'}
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 md:text-sm">
                      Status
                    </p>
                    <p className="font-semibold">
                      {service.isActive !== false ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => handleEditService(service)}
                  className="flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-blue-600 transition-colors hover:bg-blue-100 md:gap-2 md:px-3 md:py-2"
                  title="Editar serviço"
                >
                  <Edit2 className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden text-sm font-medium md:inline">
                    Editar
                  </span>
                </button>
                <button
                  onClick={() => handleDeleteService(service)}
                  className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-red-700 transition-colors hover:bg-red-100 md:gap-2 md:px-3 md:py-2"
                  title="Deletar serviço"
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

      {showCreateService && (
        <CreateService
          isOpen={showCreateService}
          onClose={() => setShowCreateService(false)}
          onSuccess={loadServices}
        />
      )}

      {showEditService && selectedService && (
        <EditService
          isOpen={showEditService}
          onClose={handleCloseEditService}
          onSuccess={loadServices}
          service={selectedService}
        />
      )}

      {showDeleteService && selectedServiceForDelete && (
        <DeleteModal
          isOpen={showDeleteService}
          onClose={handleCloseDeleteService}
          onSuccess={loadServices}
          title="Deletar Serviço"
          confirmationMessage="Tem certeza que deseja deletar este serviço?"
          itemName={selectedServiceForDelete.name}
          deleteAction={() =>
            deleteServiceAction(selectedServiceForDelete.serviceId.toString())
          }
          successMessage="Serviço deletado com sucesso"
        />
      )}

      <FilterModal
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleApplyFilters}
        filters={serviceFilters}
        title="Filtrar Serviços"
        initialValues={activeFilters}
      />
    </>
  )
}
