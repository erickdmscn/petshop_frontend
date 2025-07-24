import { z } from 'zod'

export enum StatusAppointments {
  AGENDADO = 1,
  EM_ANDAMENTO = 2,
  CONCLUIDO = 3,
  CANCELADO = 4,
}

export enum PaymentStatus {
  PENDENTE = 1,
  PAGO = 2,
  CANCELADO = 3,
  REEMBOLSADO = 4,
}

export enum PaymentMethod {
  DINHEIRO = 1,
  DEBITO = 2,
  CREDITO = 3,
  PIX = 4,
  TRANSFERENCIA = 5,
}

export const appointmentSchema = z.object({
  userId: z.number().nullable().default(null),
  petId: z.coerce.number().min(1, 'Selecione um pet'),
  appointmentDate: z.string().min(1, 'Data obrigatória'),
  statusAppointments: z.coerce.number().min(1).max(4),
  totalPrice: z.coerce.number().min(0, 'Preço deve ser positivo'),
  paymentStatus: z.coerce.number().min(1).max(4),
  paymentMethod: z.coerce.number().min(1).max(5),
  notes: z.string().optional(),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>
