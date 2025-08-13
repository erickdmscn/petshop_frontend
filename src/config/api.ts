export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`
}

export const ENDPOINTS = {
  AUTH: '/v1/users/Authenticate',
  USERS: '/v1/users',
  USERS_CREATE: '/v1/users/CreateUser',
  USERS_GET_BY_ID: '/v1/users/GetById',
  USERS_GET_BY_REGISTRATION: '/v1/users/GetByRegistrationNumber',
  USERS_GET_BY_EMAIL: '/v1/users/GetByEmail',
  USERS_GET_BY_PHONE: '/v1/users/GetByPhoneNumber',
  COMPANIES: '/v1/companies',
  COMPANIES_BY_CNPJ: '/v1/companies/cnpj',
  PETS: '/v1/pets',
  PETS_CREATE: '/v1/pets/CreatePet',
  PETS_GET_ALL: '/v1/pets/GetAllPets',
  PETS_GET_BY_USER: '/v1/pets/GetPetsByUser',
  PETS_GET_BY_ID: '/v1/pets/GetPetsById',
  PETS_GET_SPECIES: '/v1/pets/GetPetsSpecie',
  PETS_GET_GENDERS: '/v1/pets/GetPetsGender',
  PETS_GET_NEED_ATTENTION: '/v1/pets/GetPetsNeedAttention',
  APPOINTMENTS: '/v1/appointment',
  APPOINTMENTS_CREATE: '/v1/appointment/CreateAppointment',
  APPOINTMENTS_ADD_SERVICES: '/v1/appointment/AddServicesAppointments',
  APPOINTMENTS_GET_ALL_SERVICES: '/v1/appointment/GetAllServices',
  APPOINTMENTS_GET_BY_ID: '/v1/appointment/GetAppointmentById',
  APPOINTMENTS_GET_BY_USER: '/v1/appointment/GetAppointmentByUser',
  APPOINTMENTS_GET_BY_PET: '/v1/appointment/GetAppointmentByPet',
  APPOINTMENTS_GET_BY_STATUS: '/v1/appointment/GetAppointmentByStatus',
  SERVICES: '/v1/services',
  SERVICES_CREATE: '/v1/services/CreateService',
  SERVICES_GET_ALL: '/v1/services/GetAllServices',
  SERVICES_GET_BY_ID: '/v1/services/GetServicesById',
  SERVICES_GET_BY_NAME: '/v1/services/GetServicesByName',
  MAIL_SEND: '/v1/mailSend',
  MAIL_VERIFY: '/v1/mailSend/verify',
  BRASIL_API_CEP: '/v1/BrasilApi/GetCep',
} as const
