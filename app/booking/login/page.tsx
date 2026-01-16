'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // En una implementación real, esto haría una llamada a la API de autenticación
      // Por ahora, simulamos un login exitoso
      setTimeout(() => {
        localStorage.setItem('customer_token', 'mock-token-123')
        alert('Login exitoso! Redirigiendo...')
        window.location.href = '/perfil'
      }, 1000)
    } catch (error) {
      console.error('Login error:', error)
      alert('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      // En una implementación real, esto crearía la cuenta del cliente
      // Por ahora, simulamos un registro exitoso
      setTimeout(() => {
        alert('Cuenta creada exitosamente! Ahora puedes iniciar sesión.')
        setActiveTab('login')
        setFormData({
          ...formData,
          password: '',
          confirmPassword: ''
        })
      }, 1000)
    } catch (error) {
      console.error('Signup error:', error)
      alert('Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bone-white)] pt-24">
      <div className="max-w-md mx-auto px-8 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl mb-4" style={{ color: 'var(--charcoal-brown)' }}>
            Anchor:23
          </h1>
          <p className="text-lg opacity-80" style={{ color: 'var(--charcoal-brown)' }}>
            Accede a tu cuenta
          </p>
        </header>

        <Card className="border-none" style={{ background: 'var(--soft-cream)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--charcoal-brown)' }}>
              Bienvenido
            </CardTitle>
            <CardDescription>
              Gestiona tus citas y accede a beneficios exclusivos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Crear Cuenta</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 opacity-50" style={{ color: 'var(--mocha-taupe)' }} />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10"
                        style={{ borderColor: 'var(--mocha-taupe)' }}
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 opacity-50" style={{ color: 'var(--mocha-taupe)' }} />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="pl-10 pr-10"
                        style={{ borderColor: 'var(--mocha-taupe)' }}
                        placeholder="Tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 opacity-50 hover:opacity-100"
                        style={{ color: 'var(--mocha-taupe)' }}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Button
                    variant="link"
                    onClick={() => alert('Funcionalidad de recuperación próximamente')}
                    className="text-sm"
                    style={{ color: 'var(--mocha-taupe)' }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nombre</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 opacity-50" style={{ color: 'var(--mocha-taupe)' }} />
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="pl-10"
                          style={{ borderColor: 'var(--mocha-taupe)' }}
                          placeholder="María"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        style={{ borderColor: 'var(--mocha-taupe)' }}
                        placeholder="García"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signupEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 opacity-50" style={{ color: 'var(--mocha-taupe)' }} />
                      <Input
                        id="signupEmail"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10"
                        style={{ borderColor: 'var(--mocha-taupe)' }}
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{ borderColor: 'var(--mocha-taupe)' }}
                      placeholder="+52 844 123 4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signupPassword">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 opacity-50" style={{ color: 'var(--mocha-taupe)' }} />
                      <Input
                        id="signupPassword"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="pl-10 pr-10"
                        style={{ borderColor: 'var(--mocha-taupe)' }}
                        placeholder="Mínimo 8 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 opacity-50 hover:opacity-100"
                        style={{ color: 'var(--mocha-taupe)' }}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      style={{ borderColor: 'var(--mocha-taupe)' }}
                      placeholder="Repite tu contraseña"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                </form>

                <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--bone-white)' }}>
                  <p className="text-xs opacity-70" style={{ color: 'var(--charcoal-brown)' }}>
                    Al crear una cuenta, aceptas nuestros{' '}
                    <a href="/privacy-policy" className="underline hover:opacity-70" style={{ color: 'var(--deep-earth)' }}>
                      términos de privacidad
                    </a>{' '}
                    y{' '}
                    <a href="/legal" className="underline hover:opacity-70" style={{ color: 'var(--deep-earth)' }}>
                      condiciones de servicio
                    </a>.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--charcoal-brown)' }}>
            ¿No necesitas cuenta? Reserva como invitado
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/servicios'}
          >
            Reservar sin Cuenta
          </Button>
        </div>
      </div>
    </div>
  )
}
