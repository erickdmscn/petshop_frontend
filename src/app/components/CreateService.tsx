'use client'

import { useState } from 'react'
import { XCircle } from 'lucide-react'

interface CreateServiceProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateService({ isOpen, onClose }: CreateServiceProps) {
  const [formData, setFormData] = useState({
    name: '',
    descripton: '', // Mantendo o nome como está no JSON (com erro de digitação)
    price: '',
    duration: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Converter os dados para o formato esperado
    const serviceData = {
      serviceId: 0,
      name: formData.name,
      descripton: formData.descripton, // Mantendo conforme o JSON
      price: parseFloat(formData.price) || 0,
      duration: parseInt(formData.duration) || 0,
    }

    console.log('Dados do serviço:', serviceData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Criar Novo Serviço</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Nome do Serviço
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Ex: Banho e Tosa Completo"
              required
            />
          </div>

          <div>
            <label
              htmlFor="descripton"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Descrição
            </label>
            <textarea
              id="descripton"
              value={formData.descripton}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  descripton: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Descreva o serviço..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="duration"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Duração (minutos)
              </label>
              <input
                type="number"
                id="duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ex: 60, 90, 120"
                min="1"
                required
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Preço (R$)
              </label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Criar Serviço
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
