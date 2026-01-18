import Link from 'next/link'

/**
 * @description Testing page with links to all domains and API endpoints
 * @audit DEBUG: Internal testing page for route validation
 */
export default function TestLinksPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🚀 AnchorOS Test Links</h1>
        <p className="text-gray-600 mb-8">
          Testing page for all AnchorOS domains and API endpoints. Click any link to navigate or test.
        </p>

        {/* anchor23.mx - Frontend Institucional */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">🌐 anchor23.mx - Frontend Institucional</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800 underline">🏠 Landing Page (/)</Link>
            <Link href="/servicios" className="text-blue-600 hover:text-blue-800 underline">💅 Servicios (/servicios)</Link>
            <Link href="/historia" className="text-blue-600 hover:text-blue-800 underline">📖 Historia (/historia)</Link>
            <Link href="/contacto" className="text-blue-600 hover:text-blue-800 underline">📧 Contacto (/contacto)</Link>
            <Link href="/franquicias" className="text-blue-600 hover:text-blue-800 underline">🏢 Franquicias (/franquicias)</Link>
            <Link href="/membresias" className="text-blue-600 hover:text-blue-800 underline">👑 Membresías (/membresias)</Link>
            <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">🔒 Privacy Policy</Link>
            <Link href="/legal" className="text-blue-600 hover:text-blue-800 underline">⚖️ Legal</Link>
          </div>
        </div>

        {/* booking.anchor23.mx - Frontend de Reservas */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">📅 booking.anchor23.mx - Frontend de Reservas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/booking/servicios" className="text-blue-600 hover:text-blue-800 underline">💅 Selección de Servicios (/booking/servicios)</Link>
            <Link href="/booking/cita" className="text-blue-600 hover:text-blue-800 underline">📝 Flujo de Reserva (/booking/cita)</Link>
            <Link href="/booking/registro" className="text-blue-600 hover:text-blue-800 underline">👤 Registro de Cliente (/booking/registro)</Link>
            <Link href="/booking/login" className="text-blue-600 hover:text-blue-800 underline">🔐 Login (/booking/login)</Link>
            <Link href="/booking/perfil" className="text-blue-600 hover:text-blue-800 underline">👤 Perfil (/booking/perfil)</Link>
            <Link href="/booking/mis-citas" className="text-blue-600 hover:text-blue-800 underline">📅 Mis Citas (/booking/mis-citas)</Link>
            <Link href="/booking/confirmacion" className="text-blue-600 hover:text-blue-800 underline">✅ Confirmación (/booking/confirmacion)</Link>
          </div>
        </div>

        {/* aperture.anchor23.mx - Backend Administrativo */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">⚙️ aperture.anchor23.mx - Backend Administrativo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/aperture" className="text-blue-600 hover:text-blue-800 underline">📊 Dashboard Home (/aperture)</Link>
            <Link href="/aperture/calendar" className="text-blue-600 hover:text-blue-800 underline">📅 Calendario Maestro (/aperture/calendar)</Link>
            <Link href="/aperture/staff" className="text-blue-600 hover:text-blue-800 underline">👥 Gestión de Staff (/aperture/staff)</Link>
            <Link href="/aperture/staff/payroll" className="text-blue-600 hover:text-blue-800 underline">💰 Nómina (/aperture/staff/payroll)</Link>
            <Link href="/aperture/clients" className="text-blue-600 hover:text-blue-800 underline">👥 Clientes (/aperture/clients)</Link>
            <Link href="/aperture/loyalty" className="text-blue-600 hover:text-blue-800 underline">🎁 Fidelización (/aperture/loyalty)</Link>
            <Link href="/aperture/pos" className="text-blue-600 hover:text-blue-800 underline">🛒 POS (/aperture/pos)</Link>
            <Link href="/aperture/finance" className="text-blue-600 hover:text-blue-800 underline">💸 Finanzas (/aperture/finance)</Link>
            <Link href="/aperture/login" className="text-blue-600 hover:text-blue-800 underline">🔐 Login Admin (/aperture/login)</Link>
          </div>
        </div>

        {/* kiosk.anchor23.mx - Sistema de Kiosko */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-2xl font-semibold text-orange-800 mb-4">🖥️ kiosk.anchor23.mx - Sistema de Kiosko</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-gray-600">🔄 Kiosk system requires physical device with API key</div>
            <div className="text-gray-600">📱 Touchscreen interface for walk-ins and confirmations</div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-2xl font-semibold text-red-800 mb-4">🔌 API Endpoints - api.anchor23.mx</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Public APIs */}
            <div className="font-semibold text-gray-800">🌐 Public APIs:</div>
            <div className="col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <span className="text-blue-600">GET /api/services</span>
                <span className="text-blue-600">GET /api/locations</span>
                <span className="text-blue-600">GET /api/public/availability</span>
                <span className="text-blue-600">POST /api/customers</span>
                <span className="text-blue-600">POST /api/bookings</span>
              </div>
            </div>

            {/* Aperture APIs */}
            <div className="font-semibold text-gray-800">⚙️ Aperture APIs:</div>
            <div className="col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <span className="text-blue-600">GET /api/aperture/dashboard</span>
                <span className="text-blue-600">GET /api/aperture/calendar</span>
                <span className="text-blue-600">GET /api/aperture/staff</span>
                <span className="text-blue-600">GET /api/aperture/resources</span>
                <span className="text-blue-600">POST /api/aperture/bookings/[id]/reschedule</span>
                <span className="text-blue-600">GET /api/aperture/payroll</span>
                <span className="text-blue-600">GET /api/aperture/pos</span>
                <span className="text-blue-600">GET /api/aperture/finance</span>
              </div>
            </div>

            {/* Kiosk APIs */}
            <div className="font-semibold text-gray-800">🖥️ Kiosk APIs:</div>
            <div className="col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <span className="text-blue-600">POST /api/kiosk/walkin</span>
                <span className="text-blue-600">GET/POST /api/kiosk/bookings</span>
                <span className="text-blue-600">POST /api/kiosk/bookings/[shortId]/confirm</span>
                <span className="text-blue-600">POST /api/kiosk/authenticate</span>
                <span className="text-blue-600">GET /api/kiosk/resources/available</span>
              </div>
            </div>

            {/* Sync APIs (New in FASE 2) */}
            <div className="font-semibold text-gray-800">🔄 Sync APIs (FASE 2):</div>
            <div className="col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <span className="text-blue-600">GET /api/sync/calendar/test</span>
                <span className="text-blue-600">POST /api/sync/calendar/bookings</span>
                <span className="text-blue-600">POST /api/sync/calendar</span>
                <span className="text-blue-600">POST /api/sync/calendar/webhook</span>
              </div>
            </div>

            {/* Admin APIs */}
            <div className="font-semibold text-gray-800">🔧 Admin APIs:</div>
            <div className="col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <span className="text-blue-600">GET /api/admin/locations</span>
                <span className="text-blue-600">GET /api/admin/kiosks</span>
                <span className="text-blue-600">GET /api/admin/users</span>
                <span className="text-blue-600">GET /api/availability/blocks</span>
                <span className="text-blue-600">GET /api/availability/staff-unavailable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">ℹ️ Environment Info</h3>
          <div className="text-sm text-yellow-700">
            <p><strong>Frontend:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:2311'}</p>
            <p><strong>API:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:2311'}/api</p>
            <p><strong>Status:</strong> FASE 2 Complete - Google Calendar, Dual Artists, Enhanced Availability</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>AnchorOS Test Links - Internal Development Tool</p>
          <p>Last updated: Sprint 2 Completion</p>
        </div>
      </div>
    </div>
  )
}