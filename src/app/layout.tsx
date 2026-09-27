import type { Metadata } from 'next'
import { Inter, Press_Start_2P } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const pressStart2P = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start'
})

export const metadata: Metadata = {
  title: 'STUDENTS\' COUNCIL 2026-27 | FRCRCE',
  description: 'Empowering Student Voice - Building Tomorrow\'s Leaders.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${pressStart2P.variable} font-sans bg-[#0b0d1b] text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
