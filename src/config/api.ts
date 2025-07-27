export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`
}

export const ENDPOINTS = {
  AUTH: '/v1/users/Authenticate',
  COMPANIES: '/v1/companies',
  USERS: '/v1/users',
  PETS: '/v1/pets',
  APPOINTMENTS: '/v1/appointment',
  SERVICES: '/v1/services',
  MAIL_SEND: '/v1/mailSend',
  MAIL_VERIFY: '/v1/mailSend/verify',
  BRASIL_API_CEP: '/v1/BrasilApi/GetCep',
} as const
