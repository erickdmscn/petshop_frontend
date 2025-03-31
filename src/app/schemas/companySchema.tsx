import { z } from 'zod'

export const companySchema = z.object({
  companyId: z.number().nullable().default(null),
  companyName: z.string().min(1, { message: 'Nome da empresa é obrigatório' }),
  tradeName: z.string().optional(),
  registrationNumber: z
    .string()
    .min(1, { message: 'Número de registro é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  phoneNumber: z
    .string()
    .min(4, { message: 'Digite um número de telefone válido' }),
  address: z.string().min(1, { message: 'Endereço é obrigatório' }),
  city: z.string().min(1, { message: 'Cidade é obrigatória' }),
  state: z.string().min(1, { message: 'Estado é obrigatório' }),
  country: z.string().min(1, { message: 'País é obrigatório' }),
  postalCode: z.string().min(1, { message: 'Código postal é obrigatório' }),
  status: z.string().optional(),
})

export type CompanyFormData = z.infer<typeof companySchema>
