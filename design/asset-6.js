// Direction C — STAGE ENERGY
// Expressive, glow, motion-rich. Dashboard as backstage. Hero player + beat viz + bold typography.

const DirectionC = () => {
  const { ARTIST, ACTIVITY, TRACKS, UPCOMING, COUNTRIES, Icons, Sparkline, LogoMark, Avatar, BeatBars, SPARK_VISITS } = window.SHARED;
  const [tab, setTab] = React.useState('Inicio');
  const [playing, setPlaying] = React.useState(true);

  const navItems = [
    { label: 'Inicio', icon: Icons.layout },
    { label: 'Studio', icon: Icons.palette },
    { label: 'Pulse', icon: Icons.bar },
    { label: 'Shows', icon: Icons.calendar },
    { label: 'Inbox', icon: Icons.mail },
    { label: 'Settings', icon: Icons.settings },
  ];

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#05050A', color: '#fff', fontFamily: "'Inter', sans-serif", overflow: 'hidden', position: 'relative' }}>
      {/* Aurora background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-30%', left: '20%', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,38,211,0.18), transparent 60%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 60%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '60%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,121,249,0.1), transparent 60%)', filter: 'blur(40px)' }} />
      </div>

      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, padding: 20, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <LogoMark size={28} />
          <span className="ff-display" style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.04em' }}>PRESSKIT<span style={{ color: '#E879F9' }}>.PRO</span></span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItems.map(item => {
            const active = item.label === tab;
            return (
              <button key={item.label} onClick={() => setTab(item.label)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12,
                background: active ? 'linear-gradient(90deg, rgba(192,38,211,0.18), rgba(192,38,211,0))' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: 13, fontWeight: active ? 600 : 500,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                position: 'relative',
              }}>
                {active && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 2, background: '#E879F9', boxShadow: '0 0 12px #E879F9' }} />}
                {React.cloneElement(item.icon, { size: 15 })}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Pro card */}
        <div style={{ padding: 14, borderRadius: 14, background: 'linear-gradient(135deg, rgba(192,38,211,0.2), rgba(124,58,237,0.05))', border: '1px solid rgba(232,121,249,0.25)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            {React.cloneElement(Icons.fire, { size: 14, stroke: '#E879F9' })}
            <span className="ff-mono" style={{ fontSize: 9, color: '#E879F9', letterSpacing: '0.18em' }}>STREAK · 12 DÍAS</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
            Subiste contenido <strong style={{ color: '#fff' }}>12 días</strong> seguidos. ¡Sigue así!
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '20px 28px 28px 4px', overflow: 'auto', position: 'relative', zIndex: 2 }} className="scroll-thin">
        {/* Header strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} className="pulse-dot" />
              <span className="ff-mono" style={{ fontSize: 10, color: '#34D399', letterSpacing: '0.18em' }}>EN VIVO · 3 VIENDO</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ padding: '9px 14px', borderRadius: 100, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              {React.cloneElement(Icons.share, { size: 12 })} Compartir
            </button>
            <button style={{ padding: '9px 18px', borderRadius: 100, background: 'linear-gradient(135deg, #E879F9, #C026D3, #7C3AED)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 30px rgba(192,38,211,0.4)' }}>
              ★ Upgrade
            </button>
            <Avatar size={36}>{ARTIST.initials}</Avatar>
          </div>
        </div>

        {/* HERO — backstage card */}
        <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', marginBottom: 20, minHeight: 280, border: '1px solid rgba(232,121,249,0.15)' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1F0524 0%, #0A0414 60%, #110423 100%)' }} />
          <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,121,249,0.3), transparent 60%)', filter: 'blur(20px)' }} />
          <div className="grain" style={{ position: 'absolute', inset: 0 }} />

          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, padding: 32 }}>
            <div>
              <div className="ff-mono" style={{ fontSize: 10, color: '#E879F9', letterSpacing: '0.22em', marginBottom: 14 }}>● BACKSTAGE · LUN 04 MAY</div>
              <h1 className="ff-display" style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 0.95, marginBottom: 14 }}>
                Hey <span className="iridescent">Valentina</span>,<br/>
                tu show está <span className="ff-serif" style={{ fontStyle: 'italic', fontWeight: 400, color: '#E879F9' }}>vivo</span>.
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', maxWidth: 460, lineHeight: 1.5, marginBottom: 22 }}>
                <strong style={{ color: '#fff' }}>247 personas</strong> entraron a tu presskit ayer. Hoy ya van <strong style={{ color: '#E879F9' }}>89</strong>. Y un booker de Madrid acaba de descargar tu EPK.
              </p>

              {/* Inline stats pills */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: 'Hoy', value: '89', delta: '+12%', color: '#E879F9' },
                  { label: 'Bookings', value: '38', delta: '+34%', color: '#7C3AED' },
                  { label: 'EPK', value: '12', delta: '+8%', color: '#0EA5E9' },
                  { label: 'Spotify', value: '24.8K', delta: '+6%', color: '#22C55E' },
                ].map(p => (
                  <div key={p.label} style={{ padding: '8px 14px', borderRadius: 100, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="ff-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em' }}>{p.label.toUpperCase()}</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{p.value}</span>
                    <span className="ff-mono" style={{ fontSize: 9, color: p.color }}>{p.delta}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Now-playing card */}
            <div style={{ padding: 20, borderRadius: 18, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="ff-mono" style={{ fontSize: 9, color: '#E879F9', letterSpacing: '0.2em' }}>♪ TOP TRACK · ESTA SEMANA</span>
                <BeatBars count={4} color="#E879F9" height={12} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 72, height: 72, borderRadius: 12, background: 'linear-gradient(135deg, #C026D3, #7C3AED, #1F0524)', boxShadow: '0 0 30px rgba(192,38,211,0.4)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  {React.cloneElement(Icons.music, { size: 26, stroke: 'rgba(255,255,255,0.9)' })}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ff-display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Solar Drift</div>
                  <div className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', marginTop: 4 }}>SUBLIME RECORDS · 6:12</div>
                </div>
              </div>
              {/* Waveform */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 32 }}>
                {Array.from({ length: 60 }).map((_, i) => {
                  const isPast = i < 22;
                  const h = 0.3 + Math.abs(Math.sin(i * 0.5)) * 0.7;
                  return <div key={i} style={{ flex: 1, height: `${h * 100}%`, background: isPast ? '#E879F9' : 'rgba(255,255,255,0.18)', borderRadius: 1, boxShadow: isPast ? '0 0 6px rgba(232,121,249,0.5)' : 'none' }} />;
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => setPlaying(p => !p)} style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', color: '#000', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {playing ? React.cloneElement(Icons.pause, { size: 14, stroke: '#000' }) : React.cloneElement(Icons.play, { size: 14, stroke: '#000' })}
                  </button>
                  <div className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>14,820 plays</div>
                </div>
                <div style={{ fontSize: 11, color: '#34D399', fontWeight: 600 }} className="ff-mono">↑ +12% hoy</div>
              </div>
            </div>
          </div>
        </div>

        {/* GRID: 3 columns mid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Pulse card with chart */}
          <div style={{ padding: 22, borderRadius: 20, background: 'linear-gradient(180deg, rgba(192,38,211,0.08), rgba(192,38,211,0))', border: '1px solid rgba(192,38,211,0.18)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,121,249,0.15), transparent 70%)', filter: 'blur(20px)' }} />
            <div style={{ position: 'relative' }}>
              <div className="ff-mono" style={{ fontSize: 10, color: '#E879F9', letterSpacing: '0.2em', marginBottom: 6 }}>PULSE · 14 DÍAS</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
                <span className="ff-display" style={{ fontSize: 48, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>1,247</span>
                <span style={{ fontSize: 13, color: '#34D399' }} className="ff-mono">↑ +12%</span>
              </div>
              <div style={{ marginLeft: -22, marginRight: -22, marginBottom: -10 }}>
                <Sparkline data={SPARK_VISITS} color="#E879F9" width={1000} height={80} fill={true} strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Big country highlight */}
          <div style={{ padding: 22, borderRadius: 20, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.2em', marginBottom: 14 }}>AUDIENCIA GLOBAL · 14 PAÍSES</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 42 }}>🇦🇷</div>
              <div>
                <div className="ff-display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Argentina</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>473 visitas · 38% del total</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {COUNTRIES.slice(1).map(c => (
                <div key={c.name} style={{ display: 'grid', gridTemplateColumns: '20px 1fr 30px', gap: 8, alignItems: 'center', fontSize: 11 }}>
                  <span>{c.flag}</span>
                  <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1, overflow: 'hidden' }}>
                    <div style={{ width: `${c.pct/38*100}%`, height: '100%', background: 'linear-gradient(90deg, #C026D3, #E879F9)' }} />
                  </div>
                  <span className="ff-mono" style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live activity */}
          <div style={{ padding: 22, borderRadius: 20, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 12px #34D399' }} className="pulse-dot" />
              <span className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.2em' }}>ACTIVIDAD EN VIVO</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ACTIVITY.slice(0, 4).map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, boxShadow: `0 0 8px ${a.color}`, flexShrink: 0, marginTop: 5 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>{a.text}</div>
                    <div className="ff-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2, letterSpacing: '0.1em' }}>HACE {a.time.toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM: tracks list (full width, expressive) */}
        <div style={{ padding: '24px 28px', borderRadius: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 className="ff-display" style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>Tu catálogo <span className="ff-serif" style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>en pulso</span></h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="ff-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.16em' }}>SPOTIFY · ÚLTIMOS 7D</span>
              {React.cloneElement(Icons.spotify, { size: 14, stroke: '#22C55E' })}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {TRACKS.map((t, i) => (
              <div key={t.title} style={{ padding: 16, borderRadius: 14, background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden' }}>
                {i === 0 && <div style={{ position: 'absolute', top: 0, right: 0, padding: '3px 8px', background: 'linear-gradient(135deg, #E879F9, #C026D3)', borderBottomLeftRadius: 8, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em' }} className="ff-mono">HOT</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: `linear-gradient(135deg, hsl(${280 + i * 20}, 70%, 50%), hsl(${280 + i * 20 + 30}, 60%, 35%))`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {React.cloneElement(Icons.music, { size: 16, stroke: 'rgba(255,255,255,0.9)' })}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                    <div className="ff-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{t.length} · {t.label.toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span className="ff-display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em' }}>{t.plays.toLocaleString()}</span>
                  <span className="ff-mono" style={{ fontSize: 10, color: t.change > 0 ? '#34D399' : '#F87171', fontWeight: 600 }}>
                    {t.change > 0 ? '↑' : '↓'} {Math.abs(t.change)}%
                  </span>
                </div>
                <Sparkline data={SPARK_VISITS.slice(0, 8 + i).map(v => v * (0.5 + Math.random()))} color={i === 0 ? '#E879F9' : '#C026D3'} width={300} height={28} fill={true} strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

window.DirectionC = DirectionC;
