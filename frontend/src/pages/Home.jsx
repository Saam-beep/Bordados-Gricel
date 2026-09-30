import { Link } from 'react-router-dom';
const services = [
  ['Bordado plano', 'Logos, nombres y diseños con acabado profesional.'],
  ['Bordado 3D', 'Ideal para gorras, prendas promocionales y marcas.'],
  ['Sublimación', 'Diseños llenos de color para prendas personalizadas.'],
  ['Full sublimado', 'Uniformes y playeras con diseño integral.'],
  ['Confección', 'Prendas, uniformes y proyectos textiles a medida.'],
  ['Parches', 'Parches bordados personalizados para empresas y grupos.']
];
export default function Home() {
  return <>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow">BORDADOS GRICEL · GUATEMALA</span><h1>Convierte tu idea en una prenda que represente tu marca.</h1><p>Solicita bordados, sublimados, uniformes y confección desde un solo portal. Sube tu diseño, agenda tu fecha y consulta el avance de tu pedido.</p><div className="actions"><Link className="button" to="/registro">Crear cuenta</Link><Link className="button secondary" to="/login">Ya soy cliente</Link></div></div>
      <div className="hero-card"><div className="stitch">BG</div><h3>Tu pedido, siempre visible</h3><ul><li>✓ Cotizaciones organizadas</li><li>✓ Archivos y logos en un mismo lugar</li><li>✓ Seguimiento de producción</li><li>✓ Fecha solicitada y confirmada</li></ul></div>
    </section>
    <section className="section"><div className="section-head"><span className="eyebrow">SERVICIOS</span><h2>Todo lo que necesitas para personalizar y confeccionar</h2></div><div className="service-grid">{services.map(([title, text], i) => <article className="service-card" key={title}><span className="service-number">0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="cta"><div><span className="eyebrow">PEDIDOS ONLINE</span><h2>¿Ya tienes tu diseño?</h2><p>Regístrate, sube tu archivo y envía tu solicitud en minutos.</p></div><Link className="button light" to="/registro">Empezar pedido</Link></section>
  </>;
}
