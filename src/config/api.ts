// src/config/api.ts

// URL base da API remota (obtida das variáveis de ambiente)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Versões da API
export const API_VERSION = 'v1'

// Endpoints da API Remota (backend)
export const REMOTE_ENDPOINTS = {
  // Autenticação
  AUTH: `/${API_VERSION}/users/Authenticate`,

  // Usuários
  USERS: {
    BASE: `/${API_VERSION}/users`,
    GET_BY_ID: (id: number) => `/${API_VERSION}/users/GetById/${id}`,
    GET_BY_REGISTRATION: (reg: string) =>
      `/${API_VERSION}/users/GetByRegistrationNumber/${reg}`,
  },

  // Pets
  PETS: {
    BASE: `/${API_VERSION}/pets`,
    CREATE: `/${API_VERSION}/pets/CreatePet`,
    GET_ALL: `/${API_VERSION}/pets/GetAllPets`,
    GET_BY_USER: (userId: number) =>
      `/${API_VERSION}/pets/GetPetsByUser/${userId}`,
    GET_BY_ID: (id: number) => `/${API_VERSION}/pets/GetPetsById/${id}`,
  },

  // Agendamentos
  APPOINTMENTS: {
    BASE: `/${API_VERSION}/appointment`,
    CREATE: `/${API_VERSION}/appointment/CreateAppointment`,
    GET_BY_USER: (userId: number) =>
      `/${API_VERSION}/appointment/GetAppointmentByUser/${userId}`,
    GET_BY_PET: (petId: number) =>
      `/${API_VERSION}/appointment/GetAppointmentByPet/${petId}`,
    GET_SERVICES: `/${API_VERSION}/appointment/GetAllServices`,
  },

  // Serviços
  SERVICES: {
    BASE: `/${API_VERSION}/services`,
    CREATE: `/${API_VERSION}/services/CreateService`,
    GET_ALL: `/${API_VERSION}/services/GetAllServices`,
    GET_BY_ID: (id: number) => `/${API_VERSION}/services/GetServicesById/${id}`,
  },

  // Empresas
  COMPANIES: {
    BASE: `/${API_VERSION}/companies`,
    GET_BY_ID: (id: number) => `/${API_VERSION}/companies/${id}`,
    GET_BY_CNPJ: (cnpj: string) => `/${API_VERSION}/companies/cnpj/${cnpj}`,
  },

  // Integrações
  BRASIL_API: {
    GET_CNPJ: (cnpj: string) => `/${API_VERSION}/BrasilApi/${cnpj}`,
    GET_CEP: (cep: string) => `/${API_VERSION}/BrasilApi/GetCep/${cep}`,
  },
}

// Endpoints da API Local (proxy do Next.js)
export const LOCAL_ENDPOINTS = {
  // Autenticação
  AUTH: `/api/auth`,

  // Empresas
  COMPANIES: {
    BASE: `/api/companies`,
    GET_BY_ID: (id: number) => `/api/companies/${id}`,
    GET_BY_CNPJ: (cnpj: string) => `/api/companies/cnpj/${cnpj}`,
  },
}

// Endpoints finais para uso na aplicação (combinando locais e remotos)
export const ENDPOINTS = {
  // Endpoints com proxy local
  AUTH: LOCAL_ENDPOINTS.AUTH,

  COMPANIES: LOCAL_ENDPOINTS.COMPANIES,

  // Endpoints que ainda usam acesso direto
  USERS: REMOTE_ENDPOINTS.USERS,
  PETS: REMOTE_ENDPOINTS.PETS,
  APPOINTMENTS: REMOTE_ENDPOINTS.APPOINTMENTS,
  SERVICES: REMOTE_ENDPOINTS.SERVICES,
  BRASIL_API: REMOTE_ENDPOINTS.BRASIL_API,
}

// Função para construir URLs completas da API remota
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`
}
