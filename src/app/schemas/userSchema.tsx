import { z } from 'zod'

// Função para validar CPF
function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '')
  
  if (cleanCPF.length !== 11) return false
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  // Validar primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false
  
  // Validar segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false
  
  return true
}

export const userSchema = z.object({
  fullName: z.string().min(1, 'Nome completo é obrigatório').trim(),
  registrationNumber: z.string()
    .min(1, 'CPF é obrigatório')
    .refine((value) => validateCPF(value), {
      message: 'CPF inválido. Digite um CPF válido (apenas números)',
    }),
  userName: z.string().min(1, 'Nome de usuário é obrigatório').trim(),
  companyId: z.number().min(1, 'Empresa é obrigatória'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  phone: z.string().min(1, 'Telefone é obrigatório').trim(),
  postalCode: z.string().min(1, 'CEP é obrigatório').trim(),
  address: z.string().min(1, 'Endereço é obrigatório').trim(),
  city: z.string().min(1, 'Cidade é obrigatória').trim(),
  state: z.string().min(1, 'Estado é obrigatório').trim(),
  country: z.string().min(1, 'País é obrigatório').trim(),
})

export type UserFormData = z.infer<typeof userSchema> 