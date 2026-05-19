import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MoveOut Sale · Quality Stuff, Honest Prices',
  description: 'Personal clearance sale — furniture, electronics, and more. Everything must go! Contact via WhatsApp.',
  keywords: ['garage sale', 'moving sale', 'secondhand', 'clearance', 'furniture', 'electronics'],
  openGraph: {
    title: 'MoveOut Sale · Quality Stuff, Honest Prices',
    description: 'Personal clearance sale — furniture, electronics, and more. Everything must go!',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#FAF8F4',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
