// ════════════════════════════════════════════════════════════════
// Email marketing — catálogo de plantillas y secuencias para artistas
// Datos puros (sin React). Consumido por EmailTab + renderEmail.
// ════════════════════════════════════════════════════════════════

export type EmailLayout =
  | 'welcome' | 'release' | 'event' | 'newsletter' | 'vip'
  | 'reengage' | 'merch' | 'crowdfund' | 'birthday' | 'presave'

export type EmailCategory = 'Automatización' | 'Campaña' | 'Transaccional'

export interface EmailContent {
  subject:     string
  preheader:   string   // texto de vista previa en la bandeja
  heading:     string
  body:        string   // párrafos separados por \n\n
  cta_text:    string
  cta_url:     string
  image_url:   string | null
  secondary:   string   // nota secundaria opcional (ej. P.D.)
}

export interface EmailTemplateDef {
  id:        string
  name:      string
  category:  EmailCategory
  layout:    EmailLayout
  icon:      string
  goal:      string
  best_for:  string
  desc:      string
  // Genera el contenido por defecto a partir del nombre del artista.
  makeDefault: (artistName: string) => EmailContent
}

const yr = new Date().getFullYear()
const monthEs = new Date().toLocaleDateString('es', { month: 'long', year: 'numeric' })

export const EMAIL_TEMPLATES: EmailTemplateDef[] = [
  {
    id: 'welcome', name: 'Bienvenida Cálida', category: 'Automatización', layout: 'welcome',
    icon: '👋', goal: 'Presentarte y dar la primera escucha', best_for: 'Nuevos fans que acaban de suscribirse',
    desc: 'El primer email que reciben tus fans. Preséntate, conecta y entrega un primer link de escucha.',
    makeDefault: (n) => ({
      subject: `Bienvenido/a a la familia de ${n} 👋`,
      preheader: 'Gracias por unirte — esto es lo que viene.',
      heading: `Hola, soy ${n}`,
      body: `Gracias por unirte. No mando spam — solo música, fechas y cosas que de verdad importan.\n\nPara empezar, escucha mi último set. Dime qué te parece respondiendo a este email, leo todos.`,
      cta_text: 'Escuchar ahora', cta_url: '', image_url: null,
      secondary: 'P.D. Sígueme en redes para no perderte nada.',
    }),
  },
  {
    id: 'release', name: 'Nuevo Lanzamiento', category: 'Campaña', layout: 'release',
    icon: '💿', goal: 'Anunciar un track / EP / álbum', best_for: 'Días de release, exclusivas',
    desc: 'Portada grande, links a todas las plataformas y llamada a compartir. El email de release definitivo.',
    makeDefault: (n) => ({
      subject: `${n} acaba de lanzar algo nuevo 💿`,
      preheader: 'Ya disponible en todas las plataformas.',
      heading: 'Ya está fuera',
      body: `Llevo meses trabajando en esto y por fin está disponible en todas las plataformas.\n\nDale play, guárdalo en tu librería y si te gusta compártelo — eso ayuda más de lo que imaginas.`,
      cta_text: 'Escuchar el track', cta_url: '', image_url: null,
      secondary: '',
    }),
  },
  {
    id: 'presave', name: 'Pre-save / Pre-order', category: 'Campaña', layout: 'presave',
    icon: '⏳', goal: 'Generar expectativa antes del release', best_for: 'Semana previa a un lanzamiento',
    desc: 'Crea hype antes del estreno con un pre-save que dispara el algoritmo el día del lanzamiento.',
    makeDefault: (n) => ({
      subject: `Algo nuevo viene de ${n} — pre-save ahora ⏳`,
      preheader: 'Sé de los primeros en escucharlo.',
      heading: 'Falta poco',
      body: `El [DÍA] sale mi nuevo track. Haz pre-save ahora y aparecerá automáticamente en tu Spotify el día del estreno.\n\nLos pre-saves le dicen al algoritmo que esto importa. Cada uno cuenta.`,
      cta_text: 'Hacer pre-save', cta_url: '', image_url: null, secondary: '',
    }),
  },
  {
    id: 'event', name: 'Próximo Show', category: 'Campaña', layout: 'event',
    icon: '🎤', goal: 'Vender entradas para un show', best_for: 'Anuncios de shows y giras',
    desc: 'Póster oscuro e impactante con fecha, venue, ciudad y link de tickets.',
    makeDefault: (n) => ({
      subject: `${n} toca en tu ciudad 🎤`,
      preheader: 'Fecha, venue y entradas dentro.',
      heading: 'Nos vemos en la pista',
      body: `Tengo un show que no te quieres perder.\n\n📅 [FECHA]\n📍 [VENUE], [CIUDAD]\n🎟️ Entradas limitadas`,
      cta_text: 'Conseguir entradas', cta_url: '', image_url: null,
      secondary: 'Llega temprano — la primera hora siempre es la mejor.',
    }),
  },
  {
    id: 'newsletter', name: 'Newsletter Mensual', category: 'Campaña', layout: 'newsletter',
    icon: '📰', goal: 'Mantener el engagement con updates', best_for: 'Updates regulares',
    desc: 'Resumen editorial del mes: qué pasó, próximos shows, nueva música y noticias de estudio.',
    makeDefault: (n) => ({
      subject: `Novedades de ${n} — ${monthEs}`,
      preheader: 'Lo que pasó este mes y lo que viene.',
      heading: `Resumen de ${monthEs}`,
      body: `Esto es lo que ha pasado y lo que viene:\n\n🎵 Nueva música en camino\n🎤 Próximos shows confirmados\n🎧 Lo que estoy escuchando ahora`,
      cta_text: 'Ver todo', cta_url: '', image_url: null, secondary: '',
    }),
  },
  {
    id: 'vip', name: 'Drop Exclusivo VIP', category: 'Campaña', layout: 'vip',
    icon: '⭐', goal: 'Recompensar a tus fans más fieles', best_for: 'Stem packs, descargas, acceso anticipado',
    desc: 'Contenido solo para suscriptores: stem pack, descarga exclusiva o acceso anticipado.',
    makeDefault: (n) => ({
      subject: 'Solo para ti: acceso exclusivo 🌟',
      preheader: 'Algo que no comparto en redes.',
      heading: 'Esto es solo para suscriptores',
      body: `Porque estás en mi lista, te doy acceso a algo que no comparto en ningún otro sitio.\n\nDescárgalo, úsalo, disfrútalo. Es mi forma de darte las gracias.`,
      cta_text: 'Acceder ahora', cta_url: '', image_url: null,
      secondary: 'Este link expira en 7 días.',
    }),
  },
  {
    id: 'merch', name: 'Drop de Merch', category: 'Campaña', layout: 'merch',
    icon: '👕', goal: 'Vender merchandising', best_for: 'Lanzamientos de ropa y productos',
    desc: 'Lanza tu colección con foto de producto, edición limitada y urgencia.',
    makeDefault: (n) => ({
      subject: `Nuevo merch de ${n} — edición limitada 👕`,
      preheader: 'Unidades limitadas. Cuando se acaba, se acaba.',
      heading: 'Drop limitado',
      body: `Nueva colección disponible. Diseño propio, calidad premium, cantidades limitadas.\n\nCuando se agota no vuelve. Asegura el tuyo.`,
      cta_text: 'Comprar ahora', cta_url: '', image_url: null, secondary: '',
    }),
  },
  {
    id: 'crowdfund', name: 'Apoya el proyecto', category: 'Campaña', layout: 'crowdfund',
    icon: '🤝', goal: 'Financiar un proyecto / EP', best_for: 'Crowdfunding, Patreon, Ko-fi',
    desc: 'Invita a tus fans a financiar tu próximo proyecto con recompensas por nivel.',
    makeDefault: (n) => ({
      subject: 'Ayúdame a hacer realidad el próximo proyecto 🤝',
      preheader: 'Tu apoyo hace posible la música.',
      heading: 'Construyamos esto juntos',
      body: `Estoy preparando mi proyecto más ambicioso y quiero hacerlo de forma independiente.\n\nCon tu apoyo puedo grabarlo como se merece. Hay recompensas exclusivas para quienes se suman.`,
      cta_text: 'Apoyar el proyecto', cta_url: '', image_url: null, secondary: '',
    }),
  },
  {
    id: 'birthday', name: 'Regalo de cumpleaños', category: 'Automatización', layout: 'birthday',
    icon: '🎁', goal: 'Fidelizar con un detalle personal', best_for: 'Cumpleaños del fan (si lo capturas)',
    desc: 'Un detalle automático en el cumpleaños del fan: un track gratis o un descuento.',
    makeDefault: (n) => ({
      subject: '¡Feliz cumpleaños! Tengo algo para ti 🎁',
      preheader: 'Un pequeño regalo de mi parte.',
      heading: '¡Feliz cumple!',
      body: `Hoy es tu día, así que tengo un regalo para ti.\n\nGracias por apoyar la música. Que tengas un día increíble.`,
      cta_text: 'Reclamar regalo', cta_url: '', image_url: null, secondary: '',
    }),
  },
  {
    id: 'reengage', name: 'Re-engagement', category: 'Automatización', layout: 'reengage',
    icon: '💔', goal: 'Reactivar fans inactivos', best_for: 'Suscriptores que ya no abren tus emails',
    desc: 'Para fans inactivos +60 días. Muestra qué se perdieron y los invita a reconectar.',
    makeDefault: (n) => ({
      subject: 'Te echamos de menos por aquí',
      preheader: 'Esto es lo que te has perdido.',
      heading: '¿Seguimos en contacto?',
      body: `Hace tiempo que no nos vemos por aquí, y han pasado cosas:\n\n🎵 Nueva música\n🎤 Shows\n🎁 Contenido exclusivo\n\n¿Te quedas? Si no, no pasa nada — puedes darte de baja abajo.`,
      cta_text: 'Reconectar', cta_url: '', image_url: null, secondary: '',
    }),
  },
]

export const TEMPLATE_BY_ID = Object.fromEntries(EMAIL_TEMPLATES.map(t => [t.id, t]))

// ── Secuencias automáticas ───────────────────────────────────────
export interface SequenceStep {
  id:         string
  template_id: string
  delay_days: number    // días desde el paso anterior (0 = inmediato)
  label:      string
}
export interface SequenceDef {
  id:    string
  name:  string
  icon:  string
  goal:  string
  desc:  string
  trigger: string       // qué dispara la secuencia
  steps: SequenceStep[]
}

export const SEQUENCES: SequenceDef[] = [
  {
    id: 'welcome-series', name: 'Serie de Bienvenida', icon: '👋',
    goal: 'Convertir un nuevo suscriptor en un fan fiel',
    trigger: 'Al suscribirse en el press kit',
    desc: 'La secuencia más importante. 3 emails en la primera semana para presentarte, entregar valor y construir el hábito.',
    steps: [
      { id: 'w1', template_id: 'welcome',  delay_days: 0, label: 'Bienvenida + primera escucha' },
      { id: 'w2', template_id: 'vip',      delay_days: 2, label: 'Regalo de bienvenida exclusivo' },
      { id: 'w3', template_id: 'newsletter', delay_days: 5, label: 'Conoce mi mundo' },
    ],
  },
  {
    id: 'release-campaign', name: 'Campaña de Lanzamiento', icon: '🚀',
    goal: 'Maximizar streams y guardados en el día del estreno',
    trigger: 'Manual — la activas antes de un release',
    desc: 'Construye expectativa con pre-save, golpea fuerte el día del estreno y recuérdalo a los rezagados.',
    steps: [
      { id: 'r1', template_id: 'presave',  delay_days: 0, label: 'Pre-save (7 días antes)' },
      { id: 'r2', template_id: 'release',  delay_days: 7, label: 'Día del lanzamiento' },
      { id: 'r3', template_id: 'release',  delay_days: 3, label: 'Recordatorio a quien no abrió' },
    ],
  },
  {
    id: 'show-reminder', name: 'Aviso de Show', icon: '🎤',
    goal: 'Llenar la pista vendiendo entradas',
    trigger: 'Manual — al confirmar una fecha',
    desc: 'Anuncia el show, recuerda a quien no compró y crea urgencia con las últimas entradas.',
    steps: [
      { id: 's1', template_id: 'event', delay_days: 0,  label: 'Anuncio del show' },
      { id: 's2', template_id: 'event', delay_days: 5,  label: 'Últimas entradas (urgencia)' },
    ],
  },
  {
    id: 'reengagement', name: 'Reactivación', icon: '💔',
    goal: 'Recuperar fans que dejaron de abrir',
    trigger: 'Automático — fans inactivos +60 días',
    desc: 'Reconecta con quien se enfrió. Si no responde, limpia la lista para mejorar tu entregabilidad.',
    steps: [
      { id: 'e1', template_id: 'reengage', delay_days: 0, label: 'Te echamos de menos' },
      { id: 'e2', template_id: 'vip',      delay_days: 4, label: 'Último incentivo' },
    ],
  },
]
