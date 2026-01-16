'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, User, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth/context'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function BookingLayout({
  children,
}: {
  children: ReactNode
}) {
  const { user, signOut, loading } = useAuth()
  return (
    <Elements stripe={stripePromise}>
      <header className="site-header booking-header">
        <nav className="nav-primary">
          <div className="logo">
            <Link href="/">
              <span className="text-xl font-semibold" style={{ color: 'var(--charcoal-brown)' }}>
                ANCHOR:23
              </span>
            </Link>
          </div>

          <div className="nav-actions flex items-center gap-4">
            <Link href="/booking/servicios">
              <Button variant="ghost" size="sm">
                Reservar
              </Button>
            </Link>
            {user ? (
              <>
                <Link href="/booking/mis-citas">
                  <Button variant="ghost" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Mis Citas
                  </Button>
                </Link>
                <Link href="/booking/perfil">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  disabled={loading}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : (
              <Link href="/booking/login">
                <Button variant="outline" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-24">
        {children}
      </main>
    </Elements>
  )
}
