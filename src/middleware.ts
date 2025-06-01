// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que não precisam de autenticação
const publicRoutes = ['/', '/login', '/reset_password']

export function middleware(request: NextRequest) {
  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  )

  // Obtem o token do cookie ou localStorage
  const token = request.cookies.get('auth_token')?.value

  // Se a rota não for pública e não tiver token, redireciona para o login
  if (!isPublicRoute && !token) {
    // Cria a URL de redirecionamento
    const loginUrl = new URL('/login', request.url)
    // Adiciona a URL atual como parâmetro para redirecionar de volta após o login
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configuração de middlewares - define em quais rotas o middleware será executado
export const config = {
  matcher: [
    // Exclui rotas estáticas como imagens, fonts, etc
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
