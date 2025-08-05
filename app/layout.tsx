import './globals.css'
import type { Metadata } from 'next'
import ClientLayout from '@/components/ClientLayout'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'Luthando Fragrances | Premium Perfumes from South Africa',
  description: 'Discover premium fragrances at Luthando Fragrances. Shop our collection of luxury perfumes for him, her, and unisex scents.',
  keywords: 'perfumes, fragrances, South Africa, luxury, scents, cologne',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
