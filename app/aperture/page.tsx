'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, Clock, DollarSign, TrendingUp, LogOut } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function ApertureDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'staff' | 'resources' | 'reports'>('dashboard')
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    completedToday: 0,
    upcomingToday: 0
  })

  useEffect(() => {
    fetchBookings()
    fetchStats()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const response = await fetch(`/api/aperture/dashboard?start_date=${today}&end_date=${today}`)
      const data = await response.json()
      if (data.success) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/aperture/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_enrollment_key')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <header className="px-8 pb-8 mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aperture - Admin</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </Button>
      </header>

      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Citas Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.completedToday}</p>
              <p className="text-sm text-gray-600">Completadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Ingresos Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Ingresos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.upcomingToday}</p>
              <p className="text-sm text-gray-600">Por iniciar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Total Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              <p className="text-sm text-gray-600">Este mes</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveTab('dashboard')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'staff' ? 'default' : 'outline'}
              onClick={() => setActiveTab('staff')}
            >
              <Users className="w-4 h-4 mr-2" />
              Staff
            </Button>
            <Button
              variant={activeTab === 'resources' ? 'default' : 'outline'}
              onClick={() => setActiveTab('resources')}
            >
              <Users className="w-4 h-4 mr-2" />
              Recursos
            </Button>
            <Button
              variant={activeTab === 'reports' ? 'default' : 'outline'}
              onClick={() => setActiveTab('reports')}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Reportes
            </Button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>Resumen de operaciones del día</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  Cargando...
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <p className="text-center text-gray-500">No hay citas para hoy</p>
                  ) : (
                    bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold">{booking.customer?.first_name} {booking.customer?.last_name}</p>
                            <p className="text-sm text-gray-500">{booking.service?.name}</p>
                            <p className="text-sm text-gray-400">
                              {format(new Date(booking.start_time_utc), 'HH:mm', { locale: es })} - {format(new Date(booking.end_time_utc), 'HH:mm', { locale: es })}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded text-xs ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'staff' && (
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Staff</CardTitle>
              <CardDescription>Administra horarios y disponibilidad del equipo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 mb-4">
                Funcionalidad de gestión de staff próximamente
              </p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'resources' && (
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Recursos</CardTitle>
              <CardDescription>Administra estaciones y asignación</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 mb-4">
                Funcionalidad de gestión de recursos próximamente
              </p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'reports' && (
          <Card>
            <CardHeader>
              <CardTitle>Reportes</CardTitle>
              <CardDescription>Estadísticas y análisis de operaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 mb-4">
                Funcionalidad de reportes próximamente
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
