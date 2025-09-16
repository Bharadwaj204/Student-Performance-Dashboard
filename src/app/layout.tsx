import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Student Performance Dashboard',
  description: 'Cognitive Skills & Student Performance Analysis Dashboard',
  keywords: ['education', 'analytics', 'student performance', 'cognitive skills'],
  authors: [{ name: 'Student Dashboard Team' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}