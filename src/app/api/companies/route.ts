import { NextResponse } from 'next/server'
import { buildApiUrl } from '@/config/api'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const token = request.headers.get('Authorization')

    if (!token) {
      return NextResponse.json(
        { message: 'Token de autenticação não fornecido' },
        { status: 401 },
      )
    }

    const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    const apiUrl = buildApiUrl('/v1/companies')

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Erro ao cadastrar empresa' },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pageIndex = searchParams.get('pageIndex') || '1'
    const pageSize = searchParams.get('pageSize') || '10'

    const token = request.headers.get('Authorization')

    if (!token) {
      return NextResponse.json(
        { message: 'Token de autenticação não fornecido' },
        { status: 401 },
      )
    }

    const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    const apiUrl = buildApiUrl(
      `/v1/companies?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    )

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Erro ao buscar empresas' },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
