import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PetCare',
  description: 'Sistema de gerenciamento para pet shop',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`antialiased`}>{children}</body>
    </html>
  )
}
