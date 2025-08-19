'use client'

import { useState } from 'react'
import { XCircle, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import FocusTrap from 'focus-trap-react'
import { useEscapeKey } from '@/hooks/useEscapeKey'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  title: string
  confirmationMessage: string
  itemName: string
  itemDetails?: Array<{ label: string; value: string }>
  deleteAction: () => Promise<{ error?: string; success?: boolean }>
  successMessage: string
}

export default function DeleteModal({
  isOpen,
  onClose,
  onSuccess,
  title,
  confirmationMessage,
  itemName,
  itemDetails = [],
  deleteAction,
  successMessage,
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEscapeKey(isOpen, onClose, !isDeleting)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const result = await deleteAction()

      if (result.error) {
        setError(result.error)
        toast.error(`Erro: ${result.error}`)
        return
      }

      toast.success(successMessage)
      onSuccess?.()
      setTimeout(() => {
        onClose()
      }, 300)
    } catch {
      const errorMsg = 'Erro interno do servidor'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <FocusTrap>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isDeleting}
              aria-label="Fechar modal"
              title="Fechar"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>

            <div className="text-center">
              <p className="mb-2 text-gray-900">{confirmationMessage}</p>
              <p className="mb-1 text-lg font-semibold text-gray-900">
                {itemName}
              </p>
              {itemDetails.map((detail, index) => (
                <p key={index} className="mb-2 text-sm text-gray-600">
                  {detail.label}: {detail.value}
                </p>
              ))}
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
    </FocusTrap>
  )
}
