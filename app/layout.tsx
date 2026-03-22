import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BG Remover - AI-powered Image Background Removal',
  description: 'Remove image backgrounds instantly with AI. Free, fast, and no signup required.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
        {children}
      </body>
    </html>
  )
}
