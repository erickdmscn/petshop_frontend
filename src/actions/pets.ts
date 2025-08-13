'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch, getUserData } from './utils'
import { ENDPOINTS } from '@/config/api'

interface ActionResult {
  error?: string
  success?: boolean
  data?: any
}

export async function createPetAction(petData: {
  fullName: string
  species: number
  breed: string
  age: number
  birthDate: string
  gender: number
  needAttention: boolean
}): Promise<ActionResult> {
  try {
    const userData = await getUserData()
    if (!userData?.id) {
      return { error: 'Usuário não autenticado' }
    }

    const requestData = {
      petsId: 0,
      userId: Number(userData.id),
      fullName: petData.fullName,
      species: Number(petData.species),
      breed: petData.breed || '',
      age: Number(petData.age),
      birthDate: petData.birthDate,
      gender: Number(petData.gender),
      needAttention: Boolean(petData.needAttention),
    }
    if (!requestData.fullName || !requestData.species) {
      return { error: 'Nome e espécie são obrigatórios' }
    }

    const response = await authenticatedFetch(ENDPOINTS.PETS_CREATE, {
      method: 'POST',
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      const errorText = await response.text()

      let errorData: { message?: string } = {}
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }

      return {
        error: errorData.message || `Erro ao criar pet (${response.status})`,
      }
    }

    const responseText = await response.text()

    let data = null
    if (responseText.trim()) {
      try {
        data = JSON.parse(responseText)
      } catch {
        data = null
      }
    }
    revalidatePath('/pets')
    revalidatePath(`/${userData.id}/pets`)

    return { success: true, data }
  } catch {
    return { error: 'Erro interno do servidor' }
  }
}

export async function updatePetAction(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const petData = {
      name: formData.get('name') as string,
      species: formData.get('species') as string,
      breed: formData.get('breed') as string,
      age: Number(formData.get('age')),
      weight: Number(formData.get('weight')),
      color: formData.get('color') as string,
      gender: formData.get('gender') as string,
    }

    const response = await authenticatedFetch(`${ENDPOINTS.PETS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(petData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao atualizar pet' }
    }

    const data = await response.json()
    revalidatePath('/pets')
    revalidatePath(`/pets/${id}`)

    return { success: true, data }
  } catch {
    return { error: 'Erro interno do servidor' }
  }
}

export async function deletePetAction(petId: string): Promise<ActionResult> {
  try {
    const response = await authenticatedFetch(`${ENDPOINTS.PETS}/${petId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return { error: 'Erro ao deletar pet' }
    }

    revalidatePath('/pets')
    return { success: true }
  } catch {
    return { error: 'Erro interno do servidor' }
  }
}

export async function getAllPetsAction(
  pageIndex: number = 1,
  pageSize: number = 10,
) {
  try {
    const response = await authenticatedFetch(
      `${ENDPOINTS.PETS_GET_ALL}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    )

    return await response.json()
  } catch {
    throw new Error('Erro ao buscar pets')
  }
}

export async function getPetsByUserAction(
  userId: number,
  pageIndex: number = 1,
  pageSize: number = 10,
) {
  try {
    const response = await authenticatedFetch(
      `${ENDPOINTS.PETS_GET_BY_USER}/${userId}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()

    if (data && typeof data === 'object' && 'items' in data) {
      return data.items || []
    }

    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function getPetByIdAction(petId: number) {
  try {
    const response = await authenticatedFetch(
      `${ENDPOINTS.PETS_GET_BY_ID}/${petId}`,
    )

    if (!response.ok) {
      throw new Error('Pet não encontrado')
    }

    return await response.json()
  } catch {
    throw new Error('Erro ao buscar pet')
  }
}

export async function getPetsSpecieAction() {
  try {
    const response = await authenticatedFetch(ENDPOINTS.PETS_GET_SPECIES)

    if (!response.ok) {
      throw new Error('Erro ao buscar espécies')
    }

    return await response.json()
  } catch {
    throw new Error('Erro ao buscar espécies')
  }
}

export async function getPetsGenderAction() {
  try {
    const response = await authenticatedFetch(ENDPOINTS.PETS_GET_GENDERS)

    if (!response.ok) {
      throw new Error('Erro ao buscar gêneros')
    }

    return await response.json()
  } catch {
    throw new Error('Erro ao buscar gêneros')
  }
}

export async function getPetsNeedAttentionAction() {
  try {
    const response = await authenticatedFetch(ENDPOINTS.PETS_GET_NEED_ATTENTION)

    if (!response.ok) {
      throw new Error('Erro ao buscar pets que precisam de atenção')
    }

    return await response.json()
  } catch {
    throw new Error('Erro ao buscar pets que precisam de atenção')
  }
}
