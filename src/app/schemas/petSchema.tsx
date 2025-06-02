import { z } from 'zod'

export enum Species {
  CACHORRO = 1,
  GATO = 2,
  AVE = 3,
  ROEDOR = 4,
  REPTIL = 5,
  PEIXE = 6,
  OUTRO = 7,
}

export enum Gender {
  MACHO = 1,
  FEMEA = 2,
}

export const petSchema = z.object({
    petsId: z.number().nullable().default(null),
    userId: z.number().nullable().default(null),
    fullName: z.string().nullable(),
    species: z.coerce.number().min(1).max(8),
    breed: z.string().nullable().optional(),
    age: z.coerce.number().min(0),
    birthDate: z.string().refine(
      (date) => {
        return /^\d{4}-\d{2}-\d{2}$/.test(date);
      },
      {
        message: 'Data deve estar no formato YYYY-MM-DD',
      }
    ),
    gender: z.coerce.number().min(1).max(2),
    needAttention: z.boolean().default(false),
})

export type PetFormData = z.infer<typeof petSchema> 