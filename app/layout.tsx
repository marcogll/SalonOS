import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth/context'
import { AuthGuard } from '@/components/auth-guard'
import { AppWrapper } from '@/components/app-wrapper'
import { ResponsiveNav } from '@/components/responsive-nav'
import { FormbricksProvider } from '@/components/formbricks-provider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ANCHOR:23 — Belleza anclada en exclusividad',
  description: 'Salón de ultra lujo. Un estándar exclusivo de lujo y precisión.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <AppWrapper>
          <FormbricksProvider />
          <AuthProvider>
            <AuthGuard>
              <ResponsiveNav />
              <main>{children}</main>
            </AuthGuard>
          </AuthProvider>
        </AppWrapper>

        <footer className="site-footer">
          <div className="footer-brand">
            <span>ANCHOR:23</span>
            <p>Saltillo, Coahuila, México</p>
          </div>

          <div className="footer-links">
            <a href="/historia">Nosotros</a>
            <a href="/servicios">Servicios</a>
            <a href="/membresias">Membresías</a>
            <a href="/contacto">Contacto</a>
            <a href="/franchises">Franquicias</a>
          </div>

          <div className="footer-legal">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/legal">Legal</a>
          </div>

          <div className="footer-contact">
            <span>+52 844 123 4567</span>
            <span>contacto@anchor23.mx</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
