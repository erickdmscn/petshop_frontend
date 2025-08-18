'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getCompaniesAction } from '@/actions/companies'
import { getUsersAction, deleteUserAction } from '@/actions/users'
import DeleteModal from '../components/DeleteModal'
import EditUser from '../components/EditUser'
import { Edit, Trash2, LogOut } from 'lucide-react'

interface Company {
  companyId: number
  companyName: string
  tradeName: string
  registrationNumber: string
  email: string
  phoneNumber: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
}

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

interface UsersResponse {
  items: User[]
  totalCount: number
  pageIndex: number
  pageSize: number
  totalPages: number
}

export default function AdminDashboard() {
  const { isLoading, userData, logout } = useAuth()
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [companiesLoading, setCompaniesLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteUser, setShowDeleteUser] = useState(false)
  const [selectedUserForDelete, setSelectedUserForDelete] =
    useState<User | null>(null)
  const pageSize = 10

  useEffect(() => {
    if (!isLoading && userData) {
      if (userData.role !== 'Admin') {
        router.replace('/unauthorized')
      }
    }
  }, [isLoading, userData, router])

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setCompaniesLoading(true)
        setError(null)

        const companiesData = await getCompaniesAction(1, 10)
        const finalCompanies = companiesData?.items || []

        setCompanies(finalCompanies)
      } catch {
        setError('Erro ao carregar informações das empresas')
      } finally {
        setCompaniesLoading(false)
      }
    }

    if (!isLoading && userData?.role === 'Admin') {
      fetchCompanies()
    }
  }, [isLoading, userData])

  useEffect(() => {
    const fetchUsers = async () => {
      if (companies.length === 0) return

      try {
        setUsersLoading(true)
        setError(null)
        const usersData: UsersResponse = await getUsersAction(
          currentPage,
          pageSize,
        )

        const usersList = usersData?.items || []

        setUsers(usersList)
        setTotalRecords(usersData?.totalCount || 0)
        setTotalPages(usersData?.totalPages || 1)
      } catch {
        setError('Erro ao carregar usuários')
      } finally {
        setUsersLoading(false)
      }
    }

    fetchUsers()
  }, [companies, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleCompanyRegister = () => {
    router.push('/company_register')
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUserForDelete(user)
    setShowDeleteUser(true)
  }

  const handleCloseDeleteUser = () => {
    setShowDeleteUser(false)
    setSelectedUserForDelete(null)
  }

  const reloadUsers = async () => {
    try {
      const usersData: UsersResponse = await getUsersAction(
        currentPage,
        pageSize,
      )
      const usersList = usersData?.items || []
      setUsers(usersList)
      setTotalRecords(usersData?.totalCount || 0)
      setTotalPages(usersData?.totalPages || 1)
    } catch {
      setError('Erro ao recarregar lista de usuários')
    }
  }

  const handleCloseEditUser = () => {
    setEditModalOpen(false)
    setSelectedUser(null)
  }

  if (isLoading || companiesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (userData?.role !== 'Admin') {
    return null
  }

  if (companies.length === 0) {
    return (
      <>
        <main className="flex min-h-screen flex-col bg-gray-50">
          <header className="flex justify-end p-6">
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </header>
          <div className="flex flex-1 items-center justify-center px-6">
            <div className="max-w-md text-center">
              <div className="mb-8">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
                  <svg
                    className="h-12 w-12 text-emerald-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h1 className="mb-4 text-3xl font-bold text-gray-900">
                  Bem-vindo ao Sistema
                </h1>
                <p className="mb-8 text-lg text-gray-600">
                  Para começar a usar o sistema, você precisa registrar sua
                  empresa primeiro.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-lg border border-red-300 bg-red-100 p-4 text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={handleCompanyRegister}
                className="w-full rounded-lg bg-emerald-700 px-6 py-4 font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-emerald-700"
              >
                REGISTRAR EMPRESA
              </button>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Dashboard Administrativo
              </h1>
              <p className="text-gray-600">
                Gerencie os usuários da sua empresa
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </header>

          {error && (
            <div className="mb-6 rounded-lg border border-red-300 bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          <section>
            <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Empresa Registrada
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">Nome da Empresa</p>
                  <p className="font-medium">{companies[0]?.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CNPJ</p>
                  <p className="font-medium">
                    {companies[0]?.registrationNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{companies[0]?.email}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Usuários ({totalRecords})
                  </h2>
                  <button
                    onClick={() => router.push('/email_verification')}
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-white transition-colors hover:bg-emerald-700"
                  >
                    Novo Usuário
                  </button>
                </div>
              </div>

              {usersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent"></div>
                </div>
              ) : users.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500">Nenhum usuário encontrado</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Nome
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Telefone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            CPF
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.fullName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  @{user.userName}
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {user.email}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {user.phone}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {user.registrationNumber}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
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
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                              {user.userType !== 'Admin' ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditUser(user)}
                                    className="rounded-md p-1 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-900"
                                    title="Editar tipo de usuário"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user)}
                                    className="rounded-md p-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-900"
                                    title="Deletar usuário"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                      <div className="flex flex-1 justify-between sm:hidden">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage <= 1}
                          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Anterior
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Próxima
                        </button>
                      </div>
                      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Mostrando{' '}
                            <span className="font-medium">
                              {(currentPage - 1) * pageSize + 1}
                            </span>{' '}
                            até{' '}
                            <span className="font-medium">
                              {Math.min(currentPage * pageSize, totalRecords)}
                            </span>{' '}
                            de{' '}
                            <span className="font-medium">{totalRecords}</span>{' '}
                            resultados
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage <= 1}
                              className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              ‹
                            </button>
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1,
                            ).map((page) => (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                                  page === currentPage
                                    ? 'z-10 border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage >= totalPages}
                              className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              ›
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      {showDeleteUser && selectedUserForDelete && (
        <DeleteModal
          isOpen={showDeleteUser}
          onClose={handleCloseDeleteUser}
          onSuccess={reloadUsers}
          title="Deletar Usuário"
          confirmationMessage="Tem certeza que deseja deletar este usuário?"
          itemName={selectedUserForDelete.fullName}
          itemDetails={[
            {
              label: 'Email',
              value: selectedUserForDelete.email,
            },
            {
              label: 'Tipo',
              value: selectedUserForDelete.userType,
            },
          ]}
          deleteAction={() =>
            deleteUserAction(selectedUserForDelete.id.toString())
          }
          successMessage={`Usuário "${selectedUserForDelete.fullName}" deletado com sucesso!`}
        />
      )}

      {editModalOpen && selectedUser && (
        <EditUser
          isOpen={editModalOpen}
          onClose={handleCloseEditUser}
          onSuccess={reloadUsers}
          user={selectedUser}
        />
      )}
    </>
  )
}
