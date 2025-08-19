'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface FilterOption {
  value: string | number
  label: string
  count?: number
}

interface FilterField {
  key: string
  label: string
  type: 'select' | 'date' | 'dateRange' | 'checkbox' | 'search'
  options?: FilterOption[]
  placeholder?: string
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: Record<string, any>) => void
  filters: FilterField[]
  title?: string
  initialValues?: Record<string, any>
}

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
  filters,
  title = 'Filtros',
  initialValues = {},
}: FilterModalProps) {
  const [filterValues, setFilterValues] =
    useState<Record<string, any>>(initialValues)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFilterValues(initialValues)
      setHasChanges(false)
    }
  }, [isOpen, initialValues])

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }))
    setHasChanges(true)
  }

  const handleClearAll = () => {
    const clearedFilters = filters.reduce(
      (acc, filter) => {
        acc[filter.key] = filter.type === 'checkbox' ? false : ''
        return acc
      },
      {} as Record<string, any>,
    )

    setFilterValues(clearedFilters)
    setHasChanges(true)
  }

  const handleApply = () => {
    onApply(filterValues)
    onClose()
  }

  const renderFilterInput = (filter: FilterField) => {
    const value =
      filterValues[filter.key] || (filter.type === 'checkbox' ? false : '')

    switch (filter.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">{filter.placeholder || 'Selecione...'}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}{' '}
                {option.count !== undefined ? `(${option.count})` : ''}
              </option>
            ))}
          </select>
        )

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
          />
        )

      case 'dateRange':
        return (
          <div className="flex gap-2">
            <input
              type="date"
              value={value.start || ''}
              onChange={(e) =>
                handleFilterChange(filter.key, {
                  ...value,
                  start: e.target.value,
                })
              }
              placeholder="Data inicial"
              className="flex-1 rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <input
              type="date"
              value={value.end || ''}
              onChange={(e) =>
                handleFilterChange(filter.key, {
                  ...value,
                  end: e.target.value,
                })
              }
              placeholder="Data final"
              className="flex-1 rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        )

      case 'checkbox':
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleFilterChange(filter.key, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-emerald-700 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700">
              {filter.placeholder || 'Ativo'}
            </span>
          </label>
        )

      case 'search':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            placeholder={filter.placeholder || 'Digite para buscar...'}
            className="w-full rounded-md bg-gray-100 p-2 outline-none focus:ring-2 focus:ring-emerald-400"
          />
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-4 md:p-8">
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h3 className="text-lg font-bold text-gray-800 md:text-xl">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fechar modal"
            title="Fechar"
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        <div className="mb-6 space-y-4">
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-2">
              <label className="block text-gray-700">{filter.label}</label>
              {renderFilterInput(filter)}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClearAll}
            className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 md:py-3 md:text-base"
          >
            Limpar
          </button>
          <button
            onClick={handleApply}
            disabled={!hasChanges}
            className="flex-1 rounded-lg bg-emerald-700 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400 md:py-3 md:text-base"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}
