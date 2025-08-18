'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateUserTypeAction } from '@/actions/users'

interface User {
  id: number
  fullName: string
  userName: string
  userType: string
  registrationNumber: string
  email: string
  phone: string
  postalCode: string | null
  state: string | null
  city: string | null
  country: string | null
}

interface EditUserProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  user: User | null
}

interface UserFormData {
  userType: string
}

export default function EditUser({
  isOpen,
  onClose,
  onSuccess,
  user,
}: EditUserProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const methods = useForm<UserFormData>({
    defaultValues: {
      userType: user?.userType ?? '',
    },
  })

  useEffect(() => {
    if (user) {
      methods.reset({
        userType: user.userType,
      })
    }
  }, [user, methods])

  const onSubmit = async () => {
    if (!user?.id) return

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await updateUserTypeAction(user.id)

      if (result.error) {
        setError(result.error)
        toast.error(`Erro ao atualizar usuário: ${result.error}`)
        return
      }

      toast.success('Tipo de usuário atualizado com sucesso!')
      onSuccess?.()
      setTimeout(() => {
        onClose()
      }, 300)
    } catch {
      const errorMsg = 'Erro interno do servidor'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-title"
    >
      <section className="w-full max-w-lg rounded-lg bg-white p-6">
        <header className="mb-6 flex items-center justify-between">
          <h3 id="edit-user-title" className="text-xl font-semibold">
            Editar Tipo de Usuário
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
            aria-label="Fechar modal"
            title="Fechar"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </header>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="mb-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Nome do Usuário</p>
            <p className="font-medium text-gray-900">{user.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tipo Atual</p>
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                user.userType === 'Admin'
                  ? 'bg-purple-100 text-purple-800'
                  : user.userType === 'Employer'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
              }`}
            >
              {user.userType}
            </span>
          </div>
        </div>

        {user.userType === 'Costumer' ? (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Esta ação irá promover o usuário de <strong>Costumer</strong> para{' '}
              <strong>Employer</strong>.
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Este usuário já é do tipo {user.userType} e não pode ser alterado.
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Cancelar
          </button>
          {user.userType === 'Costumer' && (
            <button
              onClick={methods.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Atualizando...' : 'Promover para Employer'}
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
