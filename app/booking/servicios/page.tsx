'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, User } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Service {
  id: string
  name: string
  category: string
  duration_minutes: number
  base_price: number
}

interface Location {
  id: string
  name: string
  timezone: string
}

export default function ServiciosPage() {
  const [services, setServices] = useState<Service[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [timeSlots, setTimeSlots] = useState<any[]>([])
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchServices()
    fetchLocations()
  }, [])

  useEffect(() => {
    if (selectedService && selectedLocation && selectedDate) {
      fetchTimeSlots()
    }
  }, [selectedService, selectedLocation, selectedDate])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      const data = await response.json()
      if (data.services) {
        setServices(data.services)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations')
      const data = await response.json()
      if (data.locations) {
        setLocations(data.locations)
        if (data.locations.length > 0) {
          setSelectedLocation(data.locations[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  const fetchTimeSlots = async () => {
    if (!selectedService || !selectedLocation || !selectedDate) return

    setLoading(true)
    try {
      const response = await fetch(
        `/api/availability/time-slots?location_id=${selectedLocation}&service_id=${selectedService}&date=${selectedDate}`
      )
      const data = await response.json()
      if (data.availability) {
        setTimeSlots(data.availability)
      }
    } catch (error) {
      console.error('Error fetching time slots:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (selectedService && selectedLocation && selectedDate && selectedTime) {
      const params = new URLSearchParams({
        service_id: selectedService,
        location_id: selectedLocation,
        date: selectedDate,
        time: selectedTime
      })
      window.location.href = `/cita?${params.toString()}`
    }
  }

  const selectedServiceData = services.find(s => s.id === selectedService)

  return (
    <div className="min-h-screen bg-[var(--bone-white)] pt-24">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <header className="mb-12">
          <h1 className="text-5xl mb-4" style={{ color: 'var(--charcoal-brown)' }}>
            Reservar Cita
          </h1>
          <p className="text-xl opacity-80" style={{ color: 'var(--charcoal-brown)' }}>
            Selecciona el servicio y horario de tu preferencia
          </p>
        </header>

        <div className="space-y-8">
          <Card className="border-none" style={{ background: 'var(--soft-cream)' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: 'var(--charcoal-brown)' }}>
                <User className="w-5 h-5" />
                Servicios
              </CardTitle>
              <CardDescription>Selecciona el servicio que deseas reservar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Servicio</Label>
                  <Select onValueChange={setSelectedService} value={selectedService}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ${service.base_price} ({service.duration_minutes} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none" style={{ background: 'var(--soft-cream)' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: 'var(--charcoal-brown)' }}>
                <Clock className="w-5 h-5" />
                Fecha y Hora
              </CardTitle>
              <CardDescription>Selecciona la fecha y hora disponible</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Ubicación</Label>
                  <Select onValueChange={setSelectedLocation} value={selectedLocation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Fecha</Label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full px-4 py-3 border rounded-lg"
                    style={{ borderColor: 'var(--mocha-taupe)' }}
                  />
                </div>

                {selectedServiceData && (
                  <div>
                    <Label>Duración del servicio: {selectedServiceData.duration_minutes} minutos</Label>
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-4">
                    Cargando horarios...
                  </div>
                ) : (
                  <div>
                    <Label>Horarios disponibles</Label>
                    {timeSlots.length === 0 ? (
                      <p className="text-sm opacity-70 mt-2">
                        No hay horarios disponibles para esta fecha. Selecciona otra fecha.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {timeSlots.map((slot, index) => (
                          <Button
                            key={index}
                            variant={selectedTime === slot.start_time ? 'default' : 'outline'}
                            onClick={() => setSelectedTime(slot.start_time)}
                            className={selectedTime === slot.start_time ? 'w-full' : ''}
                          >
                            {format(new Date(slot.start_time), 'HH:mm', { locale: es })}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedServiceData && selectedTime && (
            <Card className="border-none" style={{ background: 'var(--deep-earth)' }}>
              <CardContent className="pt-6">
                <div className="text-white">
                  <p className="text-lg font-semibold mb-2">Resumen de la reserva</p>
                  <div className="space-y-1 opacity-90">
                    <p>Servicio: {selectedServiceData.name}</p>
                    <p>Fecha: {format(new Date(selectedDate), 'PPP', { locale: es })}</p>
                    <p>Hora: {format(new Date(selectedTime), 'HH:mm', { locale: es })}</p>
                    <p>Precio: ${selectedServiceData.base_price.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleContinue}
            disabled={!selectedService || !selectedLocation || !selectedDate || !selectedTime}
            className="w-full"
          >
            Continuar con Datos del Cliente
          </Button>
        </div>
      </div>
    </div>
  )
}
