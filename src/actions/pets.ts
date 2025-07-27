'use server'

import { revalidatePath } from 'next/cache'
import { authenticatedFetch, getUserData } from './utils'

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

    const response = await authenticatedFetch('/v1/pets/CreatePet', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      const errorText = await response.text()

      let errorData: { message?: string } = {}
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        console.error('Erro ao processar resposta da API:', e)
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
      } catch (e) {
        console.error('Erro ao processar resposta da API:', e)
      }
    }

    revalidatePath('/pets')
    revalidatePath(`/${userData.id}/pets`)

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

export async function getPetsByUserAction(
  userId: number,
  pageIndex: number = 1,
  pageSize: number = 10,
) {
  try {
    const response = await authenticatedFetch(
      `/v1/pets/GetPetsByUser/${userId}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    )

    if (!response.ok) {
      console.warn(
        `API retornou status ${response.status} para pets do usuário ${userId}`,
      )
      return []
    }

    const data = await response.json()

    if (data && typeof data === 'object' && 'items' in data) {
      return data.items || []
    }

    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Erro ao buscar pets do usuário:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      throw error // Re-throw para que o componente possa lidar com isso
    }
    return []
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
