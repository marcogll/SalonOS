import { AnimatedLogo } from '@/components/animated-logo'
import { RollingPhrases } from '@/components/rolling-phrases'

/** @description Home page component for the salon website, featuring hero section, services preview, and testimonials. */
export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <AnimatedLogo />
          <h1>ANCHOR:23</h1>
          <h2>Beauty Club</h2>
          <RollingPhrases />

          <div className="hero-actions" style={{ animationDelay: '2.5s' }}>
            <a href="/servicios" className="btn-secondary">Ver servicios</a>
              <a href="/booking/servicios" className="bg-[#3E352E] text-white hover:bg-[#3E352E]/90 px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center">Solicitar cita</a>
          </div>
        </div>

        <div className="hero-image">
          <div className="w-full h-96 flex items-center justify-center">
            <span className="text-gray-500 text-lg">Imagen Hero</span>
          </div>
        </div>
      </section>

      <section className="foundation">
        <article>
          <h3>Fundamento</h3>
          <h4>Nada sólido nace del caos</h4>
          <p>
            Anchor:23 nace de la unión de dos creativos que creen en el lujo
            como estándar, no como promesa.
          </p>
          <p>
            Aquí, lo excepcional es norma: una experiencia exclusiva y coherente,
            diseñada para quienes entienden que el verdadero lujo está en la
            precisión, no en el exceso.
          </p>
        </article>

        <aside className="foundation-image">
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-500 text-lg">Imagen Fundamento</span>
          </div>
        </aside>
      </section>

      <section className="services-preview">
        <h3>Servicios Exclusivos</h3>

        <div className="service-cards">
          <article className="service-card">
            <h4>Spa de Alta Gama</h4>
            <p>Sauna y spa excepcionales, diseñados para el rejuvenecimiento y el equilibrio.</p>
          </article>

          <article className="service-card">
            <h4>Arte y Manicure de Precisión</h4>
            <p>Estilización y técnica donde el detalle define el resultado.</p>
          </article>

          <article className="service-card">
            <h4>Peinado y Maquillaje de Lujo</h4>
            <p>Transformaciones discretas y sofisticadas para ocasiones selectas.</p>
          </article>
        </div>

        <div className="flex justify-center">
          <a href="/servicios" className="btn-secondary">Ver todos los servicios</a>
        </div>
      </section>

      <section className="testimonials">
        <h3>Testimonios</h3>

        <div className="testimonial-grid">
          <article className="testimonial">
            <span className="stars">★★★★★</span>
            <p>La atención al detalle define el lujo real.</p>
            <cite>Gabriela M.</cite>
          </article>

          <article className="testimonial">
            <span className="stars">★★★★★</span>
            <p>Exclusivo sin ser pretencioso.</p>
            <cite>Lorena T.</cite>
          </article>
        </div>

        <div className="flex justify-center">
          <a href="/membresias" className="btn-primary">Solicitar Membresía</a>
        </div>
      </section>
    </>
  )
}
