'use client'

import Link from 'next/link'
import { AlertCircle, LogIn } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-md text-center">
        <header className="mb-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Acesso Negado</h1>
          <p className="mb-8 text-gray-600">
            Você precisa estar logado para acessar esta página. Sua sessão pode
            ter expirado ou você não tem permissão para visualizar este conteúdo.
          </p>
        </header>

        <div className="space-y-4">
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <LogIn className="h-5 w-5" />
            Fazer Login
          </Link>
        </div>

        <footer className="mt-8 text-sm text-gray-500">
          <p>
            Se você acredita que isso é um erro, entre em contato com o suporte.
          </p>
        </footer>
      </section>
    </main>
  )
}
