import { z } from 'zod'

export const serviceSchema = z.object({
  serviceId: z.number().nullable().default(null),
  name: z.string().min(2, 'Nome obrigatório'),
  description: z.string().min(2, 'Descrição obrigatória'),
  price: z.coerce.number().min(0, 'Preço deve ser positivo'),
  duration: z.coerce.number().min(1, 'Duração deve ser maior que 0'),
})

export type ServiceFormData = z.infer<typeof serviceSchema>
