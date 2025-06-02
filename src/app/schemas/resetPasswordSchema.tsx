import { z } from 'zod'

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Digite um email válido' }),
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
