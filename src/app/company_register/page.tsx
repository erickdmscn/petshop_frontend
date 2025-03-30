'use client'

import { NextPage } from 'next'
import React, { useState } from 'react'

const CompanyRegister: NextPage = () => {
  const [formData, setFormData] = useState({
    companyId: 0,
    companyName: '',
    tradeName: '',
    registrationNumber: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    status: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean
    message?: string
  }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({})

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'An error occurred while registering the company',
        )
      }

      setSubmitStatus({
        success: true,
        message: 'Company registered successfully!',
      })

      setFormData({
        companyId: 0,
        companyName: '',
        tradeName: '',
        registrationNumber: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        status: '',
      })
    } catch (error) {
      console.error('An error occurred while sending data:', error)
      setSubmitStatus({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred while registering',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen w-full">
      <section className="w-[30%] bg-gradient-to-b from-emerald-400 to-cyan-400">
        <div className="flex h-full items-center justify-center"></div>
      </section>

      <div className="w-[70%] p-8">
        <h1 className="mb-8 text-3xl font-bold text-emerald-800">
          CADASTRE SUA EMPRESA
        </h1>

        {submitStatus.message && (
          <div
            className={`mb-6 rounded-md p-4 ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="mb-4 text-xl text-emerald-700">
              Informações da Empresa
            </h2>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-gray-700">Nome da empresa</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Nome da empresa"
                  className="w-full rounded-md bg-gray-100 p-2"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700">Nome Comercial</label>
                <input
                  type="text"
                  name="tradeName"
                  value={formData.tradeName}
                  onChange={handleChange}
                  placeholder="Nome Comercial"
                  className="w-full rounded-md bg-gray-100 p-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700">Número de registro</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="Rº"
                className="w-full rounded-md bg-gray-100 p-2"
                required
              />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="mb-4 text-xl text-emerald-700">
              Informações de Contato
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-gray-700">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-mail"
                  className="w-full rounded-md bg-gray-100 p-2"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700">Telefone</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="(xx) xxxxx-xxxx"
                  className="w-full rounded-md bg-gray-100 p-2"
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="mb-4 text-xl text-emerald-700">Endereço</h2>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-gray-700">País</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="País"
                  className="w-full rounded-md bg-gray-100 p-2"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700">Estado</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="UF"
                  className="w-full rounded-md bg-gray-100 p-2"
                  required
                />
              </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-gray-700">Cidade</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Cidade"
                  className="w-full rounded-md bg-gray-100 p-2"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700">Código Postal</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="CEP"
                  className="w-full rounded-md bg-gray-100 p-2"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700">Endereço Completo</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Endereço"
                className="w-full rounded-md bg-gray-100 p-2"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-md py-3 text-white transition-colors ${isSubmitting ? 'bg-gray-400' : 'bg-emerald-400 hover:bg-emerald-500'}`}
          >
            {isSubmitting ? 'ENVIANDO...' : 'CADASTRAR'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default CompanyRegister
