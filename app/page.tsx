'use client'

import dynamic from 'next/dynamic'

// Dynamically import the Globe component with no SSR
const MapGlobe = dynamic(() => import('@/components/MapGlobe'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen w-full h-full">
      <MapGlobe />
    </main>
  )
} 