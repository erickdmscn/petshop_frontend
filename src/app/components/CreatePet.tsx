'use client'

import { useState } from 'react'
import { XCircle } from 'lucide-react'

interface CreatePetProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreatePet({ isOpen, onClose }: CreatePetProps) {
  const [formData, setFormData] = useState({
    userId: '',
    fullName: '',
    species: '',
    breed: '',
    age: '',
    birthDate: '',
    gender: '',
    needAttention: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Converter os dados para o formato esperado
    const petData = {
      petsId: 0,
      userId: parseInt(formData.userId) || 0,
      fullName: formData.fullName,
      species: parseInt(formData.species) || 1,
      breed: formData.breed,
      age: parseInt(formData.age) || 0,
      birthDate: formData.birthDate,
      gender: parseInt(formData.gender) || 1,
      needAttention: formData.needAttention,
    }

    console.log('Dados do pet:', petData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-4 md:p-8">
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h3 className="text-lg font-bold text-gray-800 md:text-xl">
            Cadastrar Novo Pet
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Dono do Pet
              </label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Nome do dono do pet"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nome do Pet
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ex: Rex, Mimi, Luna"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Espécie
              </label>
              <select
                value={formData.species}
                onChange={(e) =>
                  setFormData({ ...formData, species: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              >
                <option value="">Selecione a espécie...</option>
                <option value="1">Cão</option>
                <option value="2">Gato</option>
                <option value="3">Pássaro</option>
                <option value="4">Outros</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Raça
              </label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) =>
                  setFormData({ ...formData, breed: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ex: Golden Retriever, Persa, SRD"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Idade (anos)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ex: 2, 5, 10"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Gênero
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              >
                <option value="">Selecione o gênero...</option>
                <option value="1">Macho</option>
                <option value="2">Fêmea</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="needAttention"
                checked={formData.needAttention}
                onChange={(e) =>
                  setFormData({ ...formData, needAttention: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="needAttention"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Precisa de atenção especial
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 md:py-3 md:text-base"
            >
              Cadastrar Pet
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 md:py-3 md:text-base"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
