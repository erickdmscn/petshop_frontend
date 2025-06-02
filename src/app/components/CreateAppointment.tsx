'use client'

import { useState } from 'react'
import { XCircle } from 'lucide-react'

interface CreateAppointmentProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateAppointment({
  isOpen,
  onClose,
}: CreateAppointmentProps) {
  const [formData, setFormData] = useState({
    petId: '',
    appointmentDate: '',
    statusAppointments: '',
    totalPrice: '',
    paymentStatus: '',
    paymentMethod: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const appointmentData = {
      appointmentId: 0,
      userId: 0,
      petId: parseInt(formData.petId) || 0,
      appointmentDate: formData.appointmentDate,
      statusAppointments: parseInt(formData.statusAppointments) || 1,
      totalPrice: parseFloat(formData.totalPrice) || 0,
      paymentStatus: parseInt(formData.paymentStatus) || 1,
      paymentMethod: parseInt(formData.paymentMethod) || 1,
      notes: formData.notes,
    }

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-4 md:p-8">
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h3 className="text-lg font-bold text-gray-800 md:text-xl">
            Novo Agendamento
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Pet
              </label>
              <select
                value={formData.petId}
                onChange={(e) =>
                  setFormData({ ...formData, petId: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              >
                <option value="">Selecione o pet...</option>
                <option value="1">Rex - Cão</option>
                <option value="2">Mimi - Gato</option>
                <option value="3">Bolt - Cão</option>
                <option value="4">Luna - Gato</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Data do Agendamento
              </label>
              <input
                type="datetime-local"
                value={formData.appointmentDate}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentDate: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status do Agendamento
              </label>
              <select
                value={formData.statusAppointments}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    statusAppointments: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              >
                <option value="">Selecione o status...</option>
                <option value="1">Agendado</option>
                <option value="2">Em Andamento</option>
                <option value="3">Concluído</option>
                <option value="4">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Preço Total (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.totalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, totalPrice: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status do Pagamento
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) =>
                  setFormData({ ...formData, paymentStatus: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              >
                <option value="">Selecione...</option>
                <option value="1">Pendente</option>
                <option value="2">Pago</option>
                <option value="3">Cancelado</option>
                <option value="4">Reembolsado</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Método de Pagamento
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMethod: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              >
                <option value="">Selecione...</option>
                <option value="1">Dinheiro</option>
                <option value="2">Cartão de Débito</option>
                <option value="3">Cartão de Crédito</option>
                <option value="4">PIX</option>
                <option value="5">Transferência Bancária</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              rows={3}
              placeholder="Informações adicionais sobre o agendamento..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 md:py-3 md:text-base"
            >
              Criar Agendamento
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 md:py-3 md:text-base"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
