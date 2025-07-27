import { z } from 'zod'

export const emailSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
})

export const codeSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
})

export type EmailFormData = z.infer<typeof emailSchema>
export type CodeFormData = z.infer<typeof codeSchema>
