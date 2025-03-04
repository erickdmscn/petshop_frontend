'use client' // O Next.js exige isso para Error Boundaries

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error('Erro capturado:', error)
  }, [error])

  return (
    <div>
      <h1>Algo deu errado!</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Tentar novamente</button>
    </div>
  )
}
