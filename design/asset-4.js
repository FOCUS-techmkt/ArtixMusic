// Direction B — MISSION CONTROL
// Data-dense, pro/utilitarian: tighter grid, more KPIs visible, sparklines everywhere, live ticker.

const DirectionB = () => {
  const { ARTIST, SPARK_VISITS, SPARK_BOOKING, BAR_DATA, SOURCES, COUNTRIES, ACTIVITY, TRACKS, UPCOMING, Icons, Sparkline, LogoMark, Avatar, BeatBars } = window.SHARED;
  const [tab, setTab] = React.useState('Overview');
  const [range, setRange] = React.useState('7D');

  const navItems = [
    { label: 'Overview', icon: Icons.layout },
    { label: 'Audiencia', icon: Icons.users },
    { label: 'Música', icon: Icons.music },
    { label: 'Bookings', icon: Icons.calendar },
    { label: 'Links', icon: Icons.link },
    { label: 'Inbox', icon: Icons.mail },
    { label: 'Settings', icon: Icons.settings },
  ];

  const kpiTiles = [
    { label: 'VISITAS', value: '1,247', change: 12, spark: SPARK_VISITS, color: '#C026D3' },
    { label: 'BOOKING CLICKS', value: '38', change: 34, spark: SPARK_BOOKING, color: '#7C3AED' },
    { label: 'EPK DOWNLOADS', value: '12', change: 8, spark: SPARK_VISITS.map(v=>v*0.05), color: '#0EA5E9' },
    { label: 'SHARES', value: '5', change: 0, spark: SPARK_VISITS.map(v=>v*0.025), color: '#10B981' },
    { label: 'AVG TIME', value: '2:34', change: 11, spark: SPARK_VISITS.map(v=>v*0.5), color: '#F59E0B' },
    { label: 'SPOTIFY MTHLY', value: '24.8K', change: 6, spark: SPARK_VISITS.map(v=>v*120), color: '#22C55E' },
    { label: 'IG FOLLOWERS', value: '8.4K', change: 4, spark: SPARK_VISITS.map(v=>v*45), color: '#E1306C' },
    { label: 'PAÍSES', value: '14', change: 27, spark: SPARK_VISITS.map(v=>v*0.06), color: '#06B6D4' },
  ];

  const tickerItems = [
    'PRESSKIT.PRO LIVE', '↑ 247 VISITAS HOY', 'BOILER ROOM REPOST · +220% MADRID', 'NUEVO LEAD · pablo@mondodisko.es',
    'SOLAR DRIFT · 14,820 PLAYS', '3 BOOKINGS PENDIENTES', 'EPK DESCARGADO · 5 MIN', 'SPOTIFY MTHLY · 24.8K (+6%)',
  ];

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#06060A', color: '#E5E7EB', fontFamily: "'Inter', sans-serif", overflow: 'hidden', fontSize: 13 }}>
      {/* Sidebar — narrow icon-first */}
      <aside style={{ width: 64, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', background: '#04040A', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 14 }}>
        <div style={{ marginBottom: 18 }}><LogoMark size={28} /></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, width: '100%', alignItems: 'center' }}>
          {navItems.map(item => {
            const active = item.label === tab;
            return (
              <button key={item.label} onClick={() => setTab(item.label)} title={item.label} style={{
                width: 40, height: 40, borderRadius: 10, border: 'none',
                background: active ? 'rgba(192,38,211,0.12)' : 'transparent',
                color: active ? '#E879F9' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                {React.cloneElement(item.icon, { size: 16 })}
                {active && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 2, borderRadius: 1, background: '#C026D3' }} />}
              </button>
            );
          })}
        </div>
        <div style={{ paddingBottom: 14 }}>
          <Avatar size={32}>{ARTIST.initials}</Avatar>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top status bar */}
        <div style={{ display: 'flex', alignItems: 'center', height: 44, borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px', gap: 16, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} className="pulse-dot" />
            <span className="ff-mono" style={{ fontSize: 10, color: '#34D399', letterSpacing: '0.18em' }}>LIVE</span>
            <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
            <span className="ff-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>MISSION CONTROL · {ARTIST.url.toUpperCase()}</span>
          </div>
          <div style={{ flex: 1 }} />
          {/* Range tabs */}
          <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: 2 }}>
            {['24H','7D','30D','90D','TODO'].map(r => (
              <button key={r} onClick={() => setRange(r)} style={{
                padding: '4px 10px', fontSize: 10, letterSpacing: '0.12em',
                background: r === range ? '#C026D3' : 'transparent',
                color: r === range ? '#fff' : 'rgba(255,255,255,0.5)',
                border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
              }}>{r}</button>
            ))}
          </div>
          <button style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            {React.cloneElement(Icons.filter, { size: 11 })} Filtros
          </button>
          <button style={{ padding: '6px 12px', borderRadius: 6, background: '#C026D3', color: '#fff', fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            {React.cloneElement(Icons.external, { size: 11 })} VER PRESSKIT
          </button>
        </div>

        {/* Ticker */}
        <div style={{ height: 28, borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative', flexShrink: 0, background: 'rgba(192,38,211,0.04)' }}>
          <div className="marquee-track" style={{ display: 'flex', gap: 32, padding: '6px 0', whiteSpace: 'nowrap', width: 'max-content' }}>
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} className="ff-mono" style={{ fontSize: 10, color: i % 8 === 1 ? '#34D399' : 'rgba(255,255,255,0.55)', letterSpacing: '0.16em' }}>
                {t} <span style={{ color: 'rgba(255,255,255,0.2)', marginLeft: 32 }}>◆</span>
              </span>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }} className="scroll-thin">
          {/* KPI tiles row — 8 across */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
            {kpiTiles.map(k => (
              <div key={k.label} style={{ padding: '12px 12px 8px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="ff-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.18em' }}>{k.label}</span>
                  <span className="ff-mono" style={{ fontSize: 9, color: k.change > 0 ? '#34D399' : k.change < 0 ? '#F87171' : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                    {k.change > 0 ? '↑' : k.change < 0 ? '↓' : '·'} {Math.abs(k.change)}%
                  </span>
                </div>
                <div className="ff-display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{k.value}</div>
                <div style={{ marginTop: 'auto', marginLeft: -12, marginRight: -12, marginBottom: -8 }}>
                  <Sparkline data={k.spark} width={1000} height={26} color={k.color} fill={true} strokeWidth={1} />
                </div>
              </div>
            ))}
          </div>

          {/* Big chart + sources + countries */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
            {/* Bar chart with overlay line */}
            <div style={{ padding: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em' }}>VISITAS · ÚLTIMOS 7 DÍAS</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10 }} className="ff-mono">
                    <span style={{ width: 8, height: 2, background: '#C026D3' }} /><span style={{ color: 'rgba(255,255,255,0.5)' }}>VISITAS</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10 }} className="ff-mono">
                    <span style={{ width: 8, height: 2, background: '#7C3AED', borderRadius: 1 }} /><span style={{ color: 'rgba(255,255,255,0.5)' }}>CLICKS</span>
                  </span>
                </div>
                <span className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>MAX 247 · AVG 178</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 180, position: 'relative', borderLeft: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingLeft: 30 }}>
                {/* Y axis labels */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 16, width: 26, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.3)' }} className="ff-mono">
                  <span>250</span><span>125</span><span>0</span>
                </div>
                {/* Grid lines */}
                {[0, 0.5, 1].map(p => (
                  <div key={p} style={{ position: 'absolute', left: 30, right: 0, top: `${p * 100}%`, borderTop: '1px dashed rgba(255,255,255,0.04)' }} />
                ))}
                {BAR_DATA.map((b, i) => {
                  const h = (b.value / 247) * 100;
                  return (
                    <div key={b.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
                      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                        <div className="grow-up" style={{
                          width: '100%', borderRadius: '3px 3px 0 0',
                          background: i === 5 ? 'linear-gradient(180deg, #E879F9, #C026D3)' : 'rgba(192,38,211,0.4)',
                          height: `${h}%`,
                          boxShadow: i === 5 ? '0 0 16px rgba(192,38,211,0.5)' : 'none',
                          animationDelay: `${i * 0.06}s`,
                        }} />
                        <span className="ff-mono" style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: i === 5 ? '#E879F9' : 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{b.value}</span>
                      </div>
                      <span className="ff-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{b.day.toUpperCase()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sources */}
            <div style={{ padding: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)', borderRadius: 8 }}>
              <div className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', marginBottom: 14 }}>FUENTES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {SOURCES.map(s => (
                  <div key={s.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>{s.name}</span>
                      <span className="ff-mono" style={{ color: s.color, fontWeight: 600 }}>{s.pct}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      <div className="grow-up" style={{ width: `${s.pct}%`, height: '100%', background: s.color, transformOrigin: 'left', animation: 'growUp 0.7s ease-out forwards' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Countries */}
            <div style={{ padding: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)', borderRadius: 8 }}>
              <div className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', marginBottom: 14 }}>PAÍSES · TOP 5</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {COUNTRIES.map(c => (
                  <div key={c.name} style={{ display: 'grid', gridTemplateColumns: '20px 1fr 36px', gap: 8, alignItems: 'center', fontSize: 11 }}>
                    <span style={{ fontSize: 14 }}>{c.flag}</span>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 3 }}>{c.name}</div>
                      <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                        <div style={{ width: `${c.pct}%`, height: '100%', background: 'linear-gradient(90deg, #C026D3, #7C3AED)' }} />
                      </div>
                    </div>
                    <span className="ff-mono" style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom: tracks table + activity feed + upcoming */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 8 }}>
            {/* Tracks data table */}
            <div style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em' }}>TRACKS · PERFORMANCE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {React.cloneElement(Icons.spotify, { size: 11, stroke: '#22C55E' })}
                  <span className="ff-mono" style={{ fontSize: 9, color: '#22C55E', letterSpacing: '0.14em' }}>SPOTIFY</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 70px 70px 60px', padding: '8px 14px', gap: 10, fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="ff-mono">
                <span>#</span><span>TRACK</span><span style={{ textAlign: 'right' }}>PLAYS</span><span style={{ textAlign: 'right' }}>TREND</span><span style={{ textAlign: 'right' }}>Δ</span>
              </div>
              {TRACKS.map((t, i) => (
                <div key={t.title} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 70px 70px 60px', padding: '10px 14px', gap: 10, fontSize: 12, alignItems: 'center', borderBottom: i < TRACKS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span className="ff-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>0{i+1}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                    <div className="ff-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>{t.label.toUpperCase()}</div>
                  </div>
                  <span className="ff-mono" style={{ textAlign: 'right', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{t.plays.toLocaleString()}</span>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Sparkline data={SPARK_VISITS.slice(0, 8 + i).map(v => v * (0.5 + Math.random()))} width={66} height={20} color={t.change > 0 ? '#C026D3' : '#6B7280'} fill={false} strokeWidth={1} />
                  </div>
                  <span className="ff-mono" style={{ textAlign: 'right', color: t.change > 0 ? '#34D399' : '#F87171', fontWeight: 600 }}>{t.change > 0 ? '+' : ''}{t.change}%</span>
                </div>
              ))}
            </div>

            {/* Activity log */}
            <div style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em' }}>EVENT LOG</div>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} className="pulse-dot" />
              </div>
              <div style={{ flex: 1, overflow: 'auto' }} className="scroll-thin">
                {ACTIVITY.map((a, i) => (
                  <div key={i} style={{ padding: '9px 14px', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 8, alignItems: 'center', fontSize: 11 }}>
                    <span className="ff-mono" style={{ fontSize: 8, padding: '2px 5px', borderRadius: 3, color: a.color, background: a.color + '15', letterSpacing: '0.14em', fontWeight: 700, textAlign: 'center' }}>{a.tag}</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.text}</span>
                    <span className="ff-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming + share */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ padding: 14, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)', borderRadius: 8 }}>
                <div className="ff-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', marginBottom: 12 }}>NEXT GIGS · 3</div>
                {UPCOMING.map((g, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '54px 1fr auto', gap: 10, alignItems: 'center', padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="ff-mono" style={{ fontSize: 10, color: '#E879F9', letterSpacing: '0.08em' }}>{g.date}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{g.city}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{g.venue}</div>
                    </div>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: g.status === 'Confirmado' ? '#34D399' : '#F59E0B' }} />
                  </div>
                ))}
              </div>
              <div style={{ padding: 14, border: '1px solid rgba(192,38,211,0.18)', background: 'linear-gradient(135deg, rgba(192,38,211,0.1), rgba(124,58,237,0.04))', borderRadius: 8 }}>
                <div className="ff-mono" style={{ fontSize: 10, color: '#E879F9', letterSpacing: '0.18em', marginBottom: 8 }}>● PRESSKIT URL</div>
                <div className="ff-mono" style={{ fontSize: 11, color: '#fff', marginBottom: 10, padding: '6px 8px', background: 'rgba(0,0,0,0.4)', borderRadius: 4 }}>{ARTIST.url}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ flex: 1, padding: 7, borderRadius: 5, background: '#C026D3', color: '#fff', fontSize: 10, fontWeight: 700, border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }} className="ff-mono">ABRIR</button>
                  <button style={{ flex: 1, padding: 7, borderRadius: 5, background: 'transparent', color: '#fff', fontSize: 10, fontWeight: 700, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', letterSpacing: '0.1em' }} className="ff-mono">COPIAR</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

window.DirectionB = DirectionB;
