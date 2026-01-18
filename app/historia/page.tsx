import { AnimatedLogo } from '@/components/animated-logo'
import { RollingPhrases } from '@/components/rolling-phrases'

/** @description Company history and philosophy page component explaining the brand's foundation and values. */
export default function HistoriaPage() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <AnimatedLogo />
          <h1>Historia</h1>
          <h2>Anchor:23</h2>
          <RollingPhrases />
          <div className="hero-actions">
            <a href="#fundamento" className="btn-secondary">El Fundamento</a>
            <a href="#filosofia" className="btn-primary">Nuestra Filosofía</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-amber-50 to-gray-50">
            <span className="text-gray-500 text-lg">Imagen Historia Hero</span>
          </div>
        </div>
      </section>

      <section className="foundation" id="fundamento">
        <article>
          <h3>Fundamento</h3>
          <h4>Nada sólido nace del caos</h4>
          <p>
            Anchor:23 nace de la unión de dos creativos que creen en el lujo
            como estándar, no como promesa. En un mundo saturado de opciones,
            decidimos crear algo diferente: un refugio donde la precisión técnica
            se encuentra con la elegancia atemporal.
          </p>
        </article>
        <aside className="foundation-image">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-gray-50">
            <span className="text-gray-500 text-lg">Imagen Fundamento</span>
          </div>
        </aside>
      </section>

      <section className="services-preview">
        <h3>El Significado</h3>
        <div className="service-cards">
          <article className="service-card">
            <h4>ANCHOR</h4>
            <p>El ancla representa estabilidad, firmeza y permanencia. Es el símbolo de nuestro compromiso con la calidad constante y la excelencia sin concesiones.</p>
          </article>
          <article className="service-card">
            <h4>:23</h4>
            <p>El dos y tres simbolizan la dualidad equilibrada: precisión técnica y creatividad artística, tradición e innovación, rigor y calidez.</p>
          </article>
        </div>
      </section>

      <section className="testimonials" id="filosofia">
        <h3>Nuestra Filosofía</h3>
        <div className="service-cards">
          <article className="service-card">
            <h4>Lujo como Estándar</h4>
            <p>No es lo extrañamente costoso, es lo excepcionalmente bien hecho.</p>
          </article>
          <article className="service-card">
            <h4>Exclusividad Inherente</h4>
            <p>Una sucursal por ciudad, invitación por membresía, calidad por convicción.</p>
          </article>
          <article className="service-card">
            <h4>Precisión Absoluta</h4>
            <p>Cada corte, cada color, cada tratamiento ejecutado con la máxima perfección técnica.</p>
          </article>
        </div>
      </section>
    </>
  )
}
