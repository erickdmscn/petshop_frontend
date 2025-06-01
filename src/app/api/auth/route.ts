import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/config/api'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    const authUrl = buildApiUrl(`/v1/users/Authenticate`)

    const response = await fetch(
      `${authUrl}?RegitrationNumber=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const errorText = await response.text()
      console.log('Resposta de erro completa:', errorText)

      try {
        const errorData = JSON.parse(errorText)
        console.log('Detalhes do erro:', errorData)
        return NextResponse.json(
          {
            message: 'Erro ao cadastrar empresa',
            details: errorData,
          },
          { status: response.status },
        )
      } catch {
        return NextResponse.json(
          {
            message: 'Erro ao cadastrar empresa',
            rawError: errorText,
          },
          { status: response.status },
        )
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro de autenticação:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
