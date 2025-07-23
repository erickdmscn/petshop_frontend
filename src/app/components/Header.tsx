'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Wrench, LogOut } from 'lucide-react'

interface HeaderProps {
  userId: string
}

const Header = ({ userId }: HeaderProps) => {
  const pathname = usePathname()

  const menuItems = [
    {
      name: 'Home',
      path: `/${userId}/home`,
      icon: Home,
    },
    {
      name: 'Serviços',
      path: `/${userId}/pet_services`,
      icon: Wrench,
    },
    {
      name: 'Agendamentos',
      path: `/${userId}/appointments`,
      icon: Calendar,
    },
  ]

  const handleLogout = () => {
    window.location.href = '/login'
  }

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4">
      {/* Logo - esconde em telas muito pequenas */}
      <h1 className="hidden text-xl font-bold text-gray-800 sm:text-2xl md:block">
        PetCare
      </h1>
      {/* Logo mobile - apenas ícone ou versão reduzida */}
      <div className="block md:hidden">
        <span className="text-lg font-bold text-gray-800"></span>
      </div>

      <nav className="flex flex-1 justify-center">
        <div className="flex items-center gap-2 sm:gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 rounded-lg px-2 py-2 transition-colors sm:px-3 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={item.name} // Tooltip para acessibilidade
              >
                <Icon size={20} />
                {/* Texto aparece apenas em telas médias e maiores */}
                <span className="hidden font-medium md:inline">
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg px-2 py-2 text-red-600 transition-colors hover:bg-red-50 sm:px-4"
        title="Sair" // Tooltip para acessibilidade
      >
        <LogOut size={20} />
        {/* Texto "Sair" aparece apenas em telas médias e maiores */}
        <span className="hidden font-medium md:inline">Sair</span>
      </button>
    </header>
  )
}

export default Header
