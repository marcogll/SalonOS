'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

/** @description Responsive navigation component with hamburger menu for mobile */
export function ResponsiveNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="site-header">
      <nav className="nav-primary">
        <div className="logo">
          <a href="/">ANCHOR:23</a>
        </div>

        {/* Desktop nav */}
        <ul className="nav-links hidden md:flex items-center space-x-8">
          <li><a href="/">Inicio</a></li>
          <li><a href="/historia">Nosotros</a></li>
          <li><a href="/servicios">Servicios</a></li>
          <li><a href="/contacto">Contacto</a></li>
        </ul>

        {/* Desktop actions */}
        <div className="nav-actions hidden md:flex items-center gap-4">
          <a href="/booking/servicios" className="btn-secondary">
            Book Now
          </a>
          <a href="/membresias" className="btn-primary">
            Memberships
          </a>
        </div>

        {/* Mobile elegant vertical dots menu */}
        <button 
          className="md:hidden p-1 ml-auto"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-5 flex flex-col justify-center items-center space-y-0.25">
            <span className="w-1.5 h-1.5 bg-current rounded-full opacity-80 hover:opacity-100 transition-opacity"></span>
            <span className="w-1.5 h-1.5 bg-current rounded-full opacity-80 hover:opacity-100 transition-opacity"></span>
            <span className="w-1.5 h-1.5 bg-current rounded-full opacity-80 hover:opacity-100 transition-opacity"></span>
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 px-8 py-6">
          <ul className="space-y-4 text-center">
            <li><a href="/" className="block py-2 text-lg" onClick={() => setIsOpen(false)}>Inicio</a></li>
            <li><a href="/historia" className="block py-2 text-lg" onClick={() => setIsOpen(false)}>Nosotros</a></li>
            <li><a href="/servicios" className="block py-2 text-lg" onClick={() => setIsOpen(false)}>Servicios</a></li>
            <li><a href="/contacto" className="block py-2 text-lg" onClick={() => setIsOpen(false)}>Contacto</a></li>
          </ul>
          <div className="flex flex-col items-center space-y-4 mt-6 pt-6 border-t border-gray-200">
            <a href="/booking/servicios" className="btn-secondary w-full max-w-xs animate-pulse-subtle">
              Book Now
            </a>
              <a href="/membresias" className="bg-[#3E352E] text-white hover:bg-[#3E352E]/90 w-full max-w-xs px-6 py-3 rounded-lg font-semibold transition-all duration-300">
              Memberships
            </a>
          </div>
        </div>
      )}
    </header>
  )
}