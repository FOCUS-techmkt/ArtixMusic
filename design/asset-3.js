// Direction A — EDITORIAL PULSE
// Refined magazine-style: serif+display mix, asymmetric layout, generous space, story-led data.

const DirectionA = () => {
  const { ARTIST, KPIS, SPARK_VISITS, SPARK_BOOKING, ACTIVITY, TRACKS, UPCOMING, CHECKLIST, Icons, Sparkline, LogoMark, Avatar } = window.SHARED;
  const [tab, setTab] = React.useState('Dashboard');
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const navItems = [
    { label: 'Dashboard', icon: Icons.layout },
    { label: 'Personalizar', icon: Icons.palette },
    { label: 'Links & Redes', icon: Icons.link },
    { label: 'Analíticas', icon: Icons.bar },
    { label: 'Vista previa', icon: Icons.eye },
    { label: 'Configuración', icon: Icons.settings },
  ];

  const aStyles = {
    page: { display: 'flex', width: '100%', height: '100%', background: '#0A0A0F', color: '#fff', fontFamily: "'Inter', sans-serif", overflow: 'hidden' },
    sidebar: { width: 240, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', background: '#08080C' },
    main: { flex: 1, overflow: 'auto', padding: '32px 40px 60px' },
  };

  const doneCount = CHECKLIST.filter(i => i.done).length;

  return (
    <div style={aStyles.page} className="scroll-thin">
      {/* Sidebar */}
      <aside style={aStyles.sidebar}>
        <div style={{ padding: '22px 18px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <LogoMark size={26} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span className="ff-display" style={{ fontWeight: 600, fontSize: 14, letterSpacing: '0.04em' }}>PRESSKIT<span style={{ color: '#C026D3' }}>.PRO</span></span>
            <span className="ff-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', marginTop: 4 }}>EDITORIAL · v2</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map((item, i) => {
            const active = item.label === tab;
            return (
              <button key={item.label} onClick={() => setTab(item.label)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10,
                background: active ? 'rgba(192,38,211,0.10)' : 'transparent',
                color: active ? '#E879F9' : 'rgba(255,255,255,0.5)',
                fontSize: 13, fontWeight: 500,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
                borderLeft: active ? '2px solid #C026D3' : '2px solid transparent',
                paddingLeft: active ? 10 : 12,
              }}>
                {React.cloneElement(item.icon, { size: 15 })}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(192,38,211,0.08)', border: '1px solid rgba(192,38,211,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              {React.cloneElement(Icons.zap, { size: 12, stroke: '#C026D3' })}
              <span className="ff-mono" style={{ fontSize: 9, color: '#E879F9', letterSpacing: '0.18em' }}>PLAN PRO</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>12 días restantes</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 4px' }}>
            <Avatar size={32}>{ARTIST.initials}</Avatar>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ARTIST.name}</div>
              <div className="ff-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>{ARTIST.role.toUpperCase()} · {ARTIST.city.toUpperCase()}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={aStyles.main} className="scroll-thin">
        {/* Top bar: search + bell */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', width: 280 }}>
            {React.cloneElement(Icons.search, { size: 14, stroke: 'rgba(255,255,255,0.4)' })}
            <input placeholder="Buscar tracks, contactos, eventos…" style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, flex: 1 }} />
            <span className="ff-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', padding: '2px 6px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}>⌘K</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button style={{ position: 'relative', width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
              {React.cloneElement(Icons.bell, { size: 14 })}
              <span style={{ position: 'absolute', top: 8, right: 9, width: 6, height: 6, borderRadius: '50%', background: '#C026D3' }} className="pulse-dot" />
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: '#fff', color: '#0A0A0F', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {React.cloneElement(Icons.external, { size: 13 })}
              Ver mi presskit
            </button>
          </div>
        </div>

        {/* HERO — magazine-style header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 12 }}>
            <span className="ff-mono" style={{ fontSize: 10, color: '#C026D3', letterSpacing: '0.22em' }}>● EDICIÓN · LUN 04 MAY 2026</span>
            <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(192,38,211,0.3), transparent)' }} />
            <span className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em' }}>VOL. 014 · SEMANA 18</span>
          </div>

          <h1 className="ff-display" style={{ fontSize: 64, fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 0.95, marginBottom: 6 }}>
            Buenos días, <span className="ff-serif" style={{ fontStyle: 'italic', fontWeight: 400, color: '#E879F9' }}>Valentina</span>.
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', maxWidth: 620, lineHeight: 1.4, fontWeight: 400 }}>
            Tu presskit recibió <strong style={{ color: '#fff', fontWeight: 600 }}>247 visitas</strong> el sábado — el mejor día desde que empezaste.
            Pablo Vera de Madrid descargó tu EPK hace 5 minutos.
          </p>
        </div>

        {/* HERO STATS — asymmetric row, big number left */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 18, overflow: 'hidden', marginBottom: 36 }}>
          {/* Big visits */}
          <div style={{ background: '#0A0A0F', padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em' }}>VISITAS · 14 DÍAS</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#34D399', fontSize: 11 }}>
                {React.cloneElement(Icons.arrowUp, { size: 11, stroke: '#34D399' })}
                <span className="ff-mono">+12%</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
              <div className="ff-display" style={{ fontSize: 56, fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 0.9 }}>1,247</div>
              <Sparkline data={SPARK_VISITS} color="#C026D3" width={170} height={56} />
            </div>
            <div className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em' }}>134 NUEVAS · 1,113 PERIODO ANTERIOR</div>
          </div>

          {[
            { label: 'CLICS BOOKING', value: '38', change: '+34%', positive: true, sub: '12 únicos' },
            { label: 'DESCARGAS EPK', value: '12', change: '+8%', positive: true, sub: '4 esta semana' },
            { label: 'OYENTES SPOTIFY', value: '24.8K', change: '+6%', positive: true, sub: 'mensuales' },
          ].map(s => (
            <div key={s.label} style={{ background: '#0A0A0F', padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'space-between' }}>
              <span className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em' }}>{s.label}</span>
              <div className="ff-display" style={{ fontSize: 38, fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="ff-mono" style={{ fontSize: 11, color: s.positive ? '#34D399' : '#F87171' }}>{s.change}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>· {s.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID: 2 columns asymmetric */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 28 }}>
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Editorial story card */}
            <div style={{ borderRadius: 18, padding: 28, border: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, rgba(192,38,211,0.06), rgba(124,58,237,0.02))', position: 'relative', overflow: 'hidden' }} className="grain">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span className="ff-mono" style={{ fontSize: 10, color: '#E879F9', letterSpacing: '0.22em' }}>HISTORIA DE LA SEMANA</span>
                <span style={{ flex: 1, height: 1, background: 'rgba(232,121,249,0.2)' }} />
              </div>
              <h2 className="ff-display" style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 12 }}>
                Madrid descubrió a <span className="ff-serif" style={{ fontStyle: 'italic', color: '#E879F9' }}>Valentina</span>.
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.55, marginBottom: 20, maxWidth: 480 }}>
                Tu visita de Madrid creció 220% esta semana — empujada por un <em style={{ color: '#E879F9' }}>repost de Boiler Room</em> en Stories. Es momento perfecto para activar booking en España.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ padding: '10px 18px', borderRadius: 100, background: '#fff', color: '#0A0A0F', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Ver oportunidad {React.cloneElement(Icons.arrowR, { size: 12, stroke: '#0A0A0F' })}
                </button>
                <button style={{ padding: '10px 18px', borderRadius: 100, background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                  Descartar
                </button>
              </div>
            </div>

            {/* Top tracks (editorial table) */}
            <div style={{ borderRadius: 18, padding: '24px 0 8px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
              <div style={{ padding: '0 26px 18px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <h3 className="ff-display" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>Tus tracks <span className="ff-serif" style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>esta semana</span></h3>
                <span className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em' }}>FUENTE · SPOTIFY</span>
              </div>
              <div>
                {TRACKS.map((t, i) => (
                  <div key={t.title} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto auto auto', gap: 16, alignItems: 'center', padding: '14px 26px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="ff-serif" style={{ fontStyle: 'italic', fontSize: 24, color: 'rgba(255,255,255,0.3)' }}>{i + 1}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{t.title}</div>
                      <div className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{t.label.toUpperCase()} · {t.length}</div>
                    </div>
                    <Sparkline data={SPARK_VISITS.slice(0, 8 + i).map(v => v * (0.5 + Math.random()))} width={70} height={24} color={t.change > 0 ? '#C026D3' : '#6B7280'} fill={false} strokeWidth={1.2} />
                    <div style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', minWidth: 60, textAlign: 'right' }}>{t.plays.toLocaleString()}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: t.change > 0 ? '#34D399' : '#F87171', minWidth: 48, justifyContent: 'flex-end' }} className="ff-mono">
                      {t.change > 0 ? '+' : ''}{t.change}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming gigs */}
            <div style={{ borderRadius: 18, padding: '24px 26px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
                <h3 className="ff-display" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>Próximos shows</h3>
                <button style={{ fontSize: 11, color: '#E879F9', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }} className="ff-mono">
                  AGREGAR {React.cloneElement(Icons.arrowR, { size: 11, stroke: '#E879F9' })}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {UPCOMING.map((g, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr auto', gap: 18, alignItems: 'center', padding: '14px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="ff-mono" style={{ fontSize: 11, color: '#E879F9', letterSpacing: '0.1em' }}>{g.date}</div>
                    <div>
                      <div className="ff-display" style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.02em' }}>{g.city}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{g.venue}</div>
                    </div>
                    <span className="ff-mono" style={{
                      fontSize: 9, padding: '4px 8px', borderRadius: 100, letterSpacing: '0.16em',
                      background: g.status === 'Confirmado' ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)',
                      color: g.status === 'Confirmado' ? '#34D399' : '#F59E0B',
                      border: `1px solid ${g.status === 'Confirmado' ? 'rgba(52,211,153,0.2)' : 'rgba(245,158,11,0.2)'}`,
                    }}>{g.status.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Share URL card */}
            <div style={{ borderRadius: 18, padding: 24, border: '1px solid rgba(192,38,211,0.18)', background: 'linear-gradient(180deg, rgba(192,38,211,0.06) 0%, rgba(192,38,211,0) 100%)' }}>
              <div className="ff-mono" style={{ fontSize: 10, color: '#E879F9', letterSpacing: '0.22em', marginBottom: 12 }}>● TU PRESSKIT — EN VIVO</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 14 }}>
                <span className="ff-mono" style={{ fontSize: 12, color: '#fff', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ARTIST.url}</span>
                <button onClick={handleCopy} style={{ padding: 6, borderRadius: 6, background: 'transparent', border: 'none', color: copied ? '#34D399' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                  {copied ? React.cloneElement(Icons.check, { size: 13 }) : React.cloneElement(Icons.copy, { size: 13 })}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ flex: 1, padding: '10px', borderRadius: 10, background: '#C026D3', color: '#fff', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {React.cloneElement(Icons.external, { size: 12 })} Abrir
                </button>
                <button style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'transparent', color: '#fff', fontSize: 12, fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {React.cloneElement(Icons.share, { size: 12 })} Compartir
                </button>
              </div>
            </div>

            {/* Checklist */}
            <div style={{ borderRadius: 18, padding: 24, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 className="ff-display" style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>Completa tu perfil</h3>
                <span className="ff-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{doneCount}/{CHECKLIST.length}</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ width: `${doneCount/CHECKLIST.length*100}%`, height: '100%', background: 'linear-gradient(90deg, #C026D3, #E879F9)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {CHECKLIST.map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: item.done ? 0.5 : 1 }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%',
                      border: `1.5px solid ${item.done ? '#C026D3' : 'rgba(255,255,255,0.2)'}`,
                      background: item.done ? '#C026D3' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {item.done && React.cloneElement(Icons.check, { size: 9, stroke: '#fff' })}
                    </div>
                    <span style={{ fontSize: 13, color: item.done ? 'rgba(255,255,255,0.4)' : '#fff', textDecoration: item.done ? 'line-through' : 'none', flex: 1 }}>{item.label}</span>
                    {!item.done && React.cloneElement(Icons.arrowR, { size: 12, stroke: 'rgba(255,255,255,0.3)' })}
                  </div>
                ))}
              </div>
            </div>

            {/* Activity feed */}
            <div style={{ borderRadius: 18, padding: 24, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <h3 className="ff-display" style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>Actividad</h3>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} className="pulse-dot" />
                <span className="ff-mono" style={{ fontSize: 9, color: '#34D399', letterSpacing: '0.18em' }}>EN VIVO</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {ACTIVITY.slice(0, 5).map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '11px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ flexShrink: 0, paddingTop: 2 }}>
                      <span className="ff-mono" style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, color: a.color, background: a.color + '15', letterSpacing: '0.14em', fontWeight: 600 }}>{a.tag}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{a.text}</div>
                      <div className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 3, letterSpacing: '0.06em' }}>HACE {a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

window.DirectionA = DirectionA;
