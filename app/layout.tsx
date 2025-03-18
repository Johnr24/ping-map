import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ping Map - Theoretical Latency Calculator',
  description: 'Calculate theoretical minimum ping between two points on the globe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black">{children}</body>
    </html>
  )
} 