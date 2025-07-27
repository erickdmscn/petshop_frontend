import { z } from 'zod'

export enum StatusAppointments {
  SCHEDULED = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  CANCELED = 4,
}

export enum PaymentStatus {
  PENDING = 1,
  PAID = 2,
  CANCELED = 3,
}

export enum PaymentMethod {
  NONE = 1,
  CASH = 2,
  CREDIT_CARD = 3,
  DEBIT_CARD = 4,
  PIX = 5,
}

export const appointmentSchema = z.object({
  userId: z.number().nullable().default(null),
  petId: z.coerce.number().min(1, 'Selecione um pet'),
  appointmentDate: z.string().min(1, 'Data obrigatória'),
  statusAppointments: z.coerce.number().min(1).max(4),
  totalPrice: z.coerce.number().min(0, 'Preço deve ser positivo'),
  paymentStatus: z.coerce.number().min(1).max(3),
  paymentMethod: z.coerce.number().min(1).max(5),
  notes: z.string().optional(),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>
