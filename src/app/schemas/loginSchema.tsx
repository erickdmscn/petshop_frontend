import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Nome de usuário é obrigatório').trim(),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
