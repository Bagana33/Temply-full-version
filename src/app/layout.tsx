import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.temply.business'),
  title: {
    default: 'Temply — Монгол Canva Template Marketplace',
    template: '%s | Temply',
  },
  description:
    'Монгол дизайнеруудын бүтээсэн Canva template-үүдийг сонгож, өөрийн контентод хурдан тохируулан ашигла.',
  keywords: ['Temply', 'Canva', 'template', 'загвар', 'дизайн', 'Монгол', 'marketplace'],
  authors: [{ name: 'Temply' }],
  creator: 'Temply',
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    title: 'Temply — Монгол Canva Template Marketplace',
    description: 'Бэлэн загвараас эхэл. Өөрийнхөөрөө бүтээ.',
    url: 'https://www.temply.business',
    siteName: 'Temply',
    locale: 'mn_MN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Temply — Монгол Canva Template Marketplace',
    description: 'Бэлэн загвараас эхэл. Өөрийнхөөрөө бүтээ.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} bg-background text-foreground antialiased`}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
