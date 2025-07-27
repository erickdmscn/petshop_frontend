'use server'

import { buildApiUrl, ENDPOINTS } from '@/config/api'

export interface EmailSendResult {
  success: boolean
  message?: string
  error?: string
}

export interface EmailVerifyResult {
  success: boolean
  message?: string
  error?: string
}

export async function sendEmailAction(email: string): Promise<EmailSendResult> {
  try {
    const url = `${buildApiUrl(ENDPOINTS.MAIL_SEND)}?email=${encodeURIComponent(email)}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (response.ok) {
      return {
        success: true,
        message: 'Código enviado para seu e-mail!',
      }
    } else {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.message || 'Erro ao enviar e-mail',
      }
    }
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    return {
      success: false,
      error: 'Erro de conexão. Tente novamente.',
    }
  }
}

export async function verifyEmailAction(
  email: string,
  code: string,
): Promise<EmailVerifyResult> {
  try {
    const url = `${buildApiUrl(ENDPOINTS.MAIL_VERIFY)}?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (response.ok) {
      return {
        success: true,
        message: 'E-mail verificado com sucesso!',
      }
    } else {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.message || 'Código inválido',
      }
    }
  } catch (error) {
    console.error('Erro ao verificar e-mail:', error)
    return {
      success: false,
      error: 'Erro de conexão. Tente novamente.',
    }
  }
}
