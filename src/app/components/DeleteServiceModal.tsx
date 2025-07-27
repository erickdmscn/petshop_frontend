'use client'

import { useState } from 'react'
import { XCircle, AlertTriangle } from 'lucide-react'
import { deleteServiceAction } from '@/actions/services'

interface DeleteServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  service: {
    serviceId: number
    name: string
  } | null
}

export default function DeleteServiceModal({
  isOpen,
  onClose,
  onSuccess,
  service,
}: DeleteServiceModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!service?.serviceId) return

    setIsDeleting(true)
    setError(null)

    try {
      const result = await deleteServiceAction(service.serviceId.toString())

      if (result.error) {
        setError(result.error)
        return
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      setError('Erro interno do servidor')
      console.error('Erro ao deletar serviço:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen || !service) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            Deletar Serviço
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isDeleting}
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>

          <div className="text-center">
            <p className="mb-2 text-gray-900">
              Tem certeza que deseja deletar o serviço?
            </p>
            <p className="mb-2 text-lg font-semibold text-gray-900">
              &quot;{service.name}&quot;
            </p>
            <p className="text-sm text-gray-500">
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? 'Deletando...' : 'Deletar'}
          </button>
        </div>
      </div>
    </div>
  )
}
