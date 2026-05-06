// Shared data + icon components for PRESSKIT.PRO dashboard redesign

const ARTIST = {
  name: 'Valentina M.',
  initials: 'VM',
  city: 'Buenos Aires',
  role: 'House DJ',
  slug: 'valentina-m',
  url: 'presskit.pro/valentina-m',
};

const KPIS = {
  visits: { value: 1247, change: 12, prev: 1113 },
  bookingClicks: { value: 38, change: 34, prev: 28 },
  epkDownloads: { value: 12, change: 8, prev: 11 },
  shares: { value: 5, change: 0, prev: 5 },
  avgTime: { value: '2:34', change: 18, prev: '2:16' },
  countries: { value: 14, change: 3, prev: 11 },
  monthlyListeners: { value: 24800, change: 6, prev: 23390 },
  followers: { value: 8420, change: 4, prev: 8090 },
};

// 14-day spark
const SPARK_VISITS = [62, 81, 73, 102, 87, 143, 210, 168, 195, 247, 197, 178, 211, 247];
const SPARK_BOOKING = [1, 2, 3, 2, 4, 5, 7, 4, 6, 8, 5, 6, 7, 8];

const BAR_DATA = [
  { day: 'Lun', value: 87 },
  { day: 'Mar', value: 143 },
  { day: 'Mié', value: 210 },
  { day: 'Jue', value: 168 },
  { day: 'Vie', value: 195 },
  { day: 'Sáb', value: 247 },
  { day: 'Dom', value: 197 },
];

const SOURCES = [
  { name: 'Instagram', pct: 42, color: '#E1306C' },
  { name: 'WhatsApp', pct: 28, color: '#25D366' },
  { name: 'Google', pct: 18, color: '#4285F4' },
  { name: 'Directo', pct: 12, color: '#9CA3AF' },
];

const COUNTRIES = [
  { name: 'Argentina', pct: 38, flag: '🇦🇷' },
  { name: 'España', pct: 22, flag: '🇪🇸' },
  { name: 'México', pct: 19, flag: '🇲🇽' },
  { name: 'Colombia', pct: 12, flag: '🇨🇴' },
  { name: 'Chile', pct: 9, flag: '🇨🇱' },
];

const ACTIVITY = [
  { text: 'Pablo Vera (booker, Madrid) descargó tu EPK', time: '5m', tag: 'EPK', color: '#C026D3' },
  { text: 'Click en Booking desde Instagram Stories', time: '1h', tag: 'BOOK', color: '#7C3AED' },
  { text: 'Compartido en grupo de WhatsApp (12 vistas)', time: '2h', tag: 'SHARE', color: '#10B981' },
  { text: 'Nuevo visitante repetido desde México', time: '3h', tag: 'VIEW', color: '#0EA5E9' },
  { text: '"Solar Drift" reprodución completa', time: '5h', tag: 'PLAY', color: '#F59E0B' },
  { text: 'Email capturado: bruno@boilerroom.tv', time: '8h', tag: 'LEAD', color: '#EC4899' },
];

const TRACKS = [
  { title: 'Solar Drift', label: 'Sublime Records', plays: 14820, change: 12, length: '6:12' },
  { title: 'Midnight Echo', label: 'Self-released', plays: 8730, change: 4, length: '5:48' },
  { title: 'Glass Tower', label: 'Sublime Records', plays: 6210, change: -2, length: '7:02' },
  { title: 'Volcán', label: 'Innervisions', plays: 3940, change: 28, length: '6:30' },
];

const UPCOMING = [
  { date: 'MAY 12', city: 'Buenos Aires', venue: 'Crobar', status: 'Confirmado' },
  { date: 'MAY 24', city: 'Madrid', venue: 'Mondo Disko', status: 'Confirmado' },
  { date: 'JUN 07', city: 'Berlín', venue: 'Watergate', status: 'Negociando' },
];

const CHECKLIST = [
  { label: 'Foto de perfil', done: true },
  { label: 'Biografía', done: true },
  { label: 'Plataformas de música', done: true },
  { label: 'Galería de fotos', done: false },
  { label: 'Link de booking', done: false },
];

// Icons (lucide-style inline SVG)
const Icon = ({ d, size = 16, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="lucide" {...rest}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

const Icons = {
  trendUp: <Icon d="M3 17l6-6 4 4 8-8M14 7h7v7" />,
  trendDown: <Icon d="M3 7l6 6 4-4 8 8M14 17h7v-7" />,
  eye: <Icon d={<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>} />,
  click: <Icon d={<><path d="M9 9l5 12 1.8-5.2L21 14z"/><path d="M7.2 2.2l1 2.5"/><path d="M2.2 7.2l2.5 1"/><path d="M5.6 5.6l1.8 1.8"/></>} />,
  download: <Icon d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>} />,
  share: <Icon d={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></>} />,
  globe: <Icon d={<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>} />,
  clock: <Icon d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>} />,
  music: <Icon d={<><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>} />,
  play: <Icon d="M5 3l14 9-14 9V3z" />,
  pause: <Icon d={<><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>} />,
  external: <Icon d={<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>} />,
  copy: <Icon d={<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>} />,
  check: <Icon d="M20 6L9 17l-5-5" />,
  arrowR: <Icon d={<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>} />,
  spark: <Icon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  calendar: <Icon d={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />,
  pin: <Icon d={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>} />,
  bell: <Icon d={<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></>} />,
  search: <Icon d={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.6" y2="16.6"/></>} />,
  settings: <Icon d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>} />,
  layout: <Icon d={<><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></>} />,
  palette: <Icon d={<><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-4.4-4.5-8-10-8z"/></>} />,
  link: <Icon d={<><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></>} />,
  bar: <Icon d={<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>} />,
  spotify: <Icon d={<><circle cx="12" cy="12" r="10"/><path d="M7 14a8 8 0 0 1 10 1"/><path d="M7.5 11a10 10 0 0 1 11 1.5"/><path d="M8 8a12 12 0 0 1 12 2"/></>} />,
  zap: <Icon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  fire: <Icon d="M12 2s4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 1-3s-2 0-3 3a6 6 0 1 0 12 0c0-5-6-8-6-8z" />,
  users: <Icon d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/></>} />,
  mail: <Icon d={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></>} />,
  arrowUp: <Icon d={<><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>} />,
  arrowDown: <Icon d={<><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>} />,
  filter: <Icon d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z" />,
};

// Helper: build SVG sparkline
function Sparkline({ data, color = '#C026D3', width = 120, height = 32, fill = true, strokeWidth = 1.5 }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 4) - 2}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;
  const id = React.useId();
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {fill && (
        <>
          <defs>
            <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#sg-${id})`} />
        </>
      )}
      <path d={linePath} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// LogoMark
function LogoMark({ size = 26, color = '#C026D3' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="7" fill={color} />
      <path d="M9 8h8.5C20.5 8 23 10.2 23 13.2c0 3-2.5 5.2-5.5 5.2H13v5.6H9V8zm4 8.2h4c1.4 0 2.5-.9 2.5-2.2 0-1.3-1.1-2.2-2.5-2.2h-4v4.4z" fill="white" />
    </svg>
  );
}

// Mini avatar
function Avatar({ size = 32, gradient = 'linear-gradient(135deg, #C026D3, #7C3AED)', children }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.36, color: '#fff', flexShrink: 0,
    }}>
      {children}
    </div>
  );
}

// Beat bars (8 vertical bars with staggered animation)
function BeatBars({ count = 5, color = '#C026D3', height = 14, gap = 2 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, height }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="beat-bar" style={{
          width: 2, height: '100%',
          background: color, borderRadius: 1,
          animationDelay: `${i * 0.12}s`,
        }} />
      ))}
    </div>
  );
}

window.SHARED = {
  ARTIST, KPIS, SPARK_VISITS, SPARK_BOOKING, BAR_DATA, SOURCES, COUNTRIES, ACTIVITY, TRACKS, UPCOMING, CHECKLIST,
  Icons, Sparkline, LogoMark, Avatar, BeatBars,
};
