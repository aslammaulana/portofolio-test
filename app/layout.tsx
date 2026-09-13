import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portfolio | Personal Website',
  description: 'Personal portfolio showcasing skills, projects, and experience.',
  openGraph: {
    type: 'website',
    title: 'Portfolio | Personal Website',
    description: 'Personal portfolio showcasing skills, projects, and experience.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
