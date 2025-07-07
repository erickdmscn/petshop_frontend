'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch } from './utils'

interface ActionResult {
  error?: string
  success?: boolean
  data?: any
}

export async function createPetAction(
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
      userId: Number(formData.get('userId')),
    }

    if (!petData.name || !petData.species || !petData.userId) {
      return { error: 'Nome, espécie e usuário são obrigatórios' }
    }

    const response = await authenticatedFetch('/v1/pets/CreatePet', {
      method: 'POST',
      body: JSON.stringify(petData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || 'Erro ao criar pet' }
    }

    const data = await response.json()
    revalidatePath('/pets')
    revalidatePath(`/users/${petData.userId}/pets`)

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao criar pet:', error)
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

    const response = await authenticatedFetch(`/v1/pets/${id}`, {
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
  } catch (error) {
    console.error('Erro ao atualizar pet:', error)
    return { error: 'Erro interno do servidor' }
  }
}

export async function deletePetAction(petId: string): Promise<ActionResult> {
  try {
    const response = await authenticatedFetch(`/v1/pets/${petId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return { error: 'Erro ao deletar pet' }
    }

    revalidatePath('/pets')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar pet:', error)
    return { error: 'Erro interno do servidor' }
  }
}

export async function getAllPetsAction() {
  try {
    const response = await authenticatedFetch('/v1/pets/GetAllPets')

    if (!response.ok) {
      throw new Error('Erro ao buscar pets')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar pets:', error)
    throw new Error('Erro ao buscar pets')
  }
}

export async function getPetsByUserAction(userId: number) {
  try {
    const response = await authenticatedFetch(
      `/v1/pets/GetPetsByUser/${userId}`,
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar pets do usuário')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar pets do usuário:', error)
    throw new Error('Erro ao buscar pets do usuário')
  }
}

export async function getPetByIdAction(petId: number) {
  try {
    const response = await authenticatedFetch(`/v1/pets/GetPetsById/${petId}`)

    if (!response.ok) {
      throw new Error('Pet não encontrado')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar pet:', error)
    throw new Error('Erro ao buscar pet')
  }
}

export async function getPetsSpecieAction() {
  try {
    const response = await authenticatedFetch('/v1/pets/GetPetsSpecie')

    if (!response.ok) {
      throw new Error('Erro ao buscar espécies')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar espécies:', error)
    throw new Error('Erro ao buscar espécies')
  }
}

export async function getPetsGenderAction() {
  try {
    const response = await authenticatedFetch('/v1/pets/GetPetsGender')

    if (!response.ok) {
      throw new Error('Erro ao buscar gêneros')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error)
    throw new Error('Erro ao buscar gêneros')
  }
}

export async function getPetsNeedAttentionAction() {
  try {
    const response = await authenticatedFetch('/v1/pets/GetPetsNeedAttention')

    if (!response.ok) {
      throw new Error('Erro ao buscar pets que precisam de atenção')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar pets que precisam de atenção:', error)
    throw new Error('Erro ao buscar pets que precisam de atenção')
  }
}
