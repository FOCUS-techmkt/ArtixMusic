# Plantilla "DJ Landing" — Especificación de réplica

Fuente analizada: https://landing-dj.vercel.app/dj/demodj (slug `demodj`).
Objetivo: replicarla exactamente en Artist Pulse como **opción de plantilla personalizable**.
Es un sitio one-page oscuro, estética techno/minimal, todo navegado por anclas (`#bio`, `#releases`, etc.).

---

## 1. Sistema de diseño (design tokens)

### Colores (CSS vars en `:root`)
```css
--background:        #07070f;   /* fondo base (casi negro azulado) */
--foreground:        #f1f5f9;   /* texto principal (slate-100) */
--dj-accent:         #d45137;   /* acento primario: naranja/terracota (rgb 212,81,55) */
--dj-accent2:        #ff0000;   /* acento secundario: rojo puro */
--dj-surface:        #ffffff0a; /* superficie de tarjetas (white @ 4%) */
--dj-surface-hover:  #ffffff12; /* hover de tarjetas (white @ 7%) */
--dj-border:         #ffffff14; /* bordes sutiles (white @ 8%) */
--radius:            .625rem;   /* 10px */
```
- **Fondo alterna entre dos tonos** sección a sección para dar ritmo:
  - `#07070f` (hero, bio, shows, mix, youtube, presskit, contact)
  - `#050509` (releases, showsmap, media) — un pelín más oscuro.
- Los acentos `--dj-accent` y `--dj-accent2` son **el punto de personalización clave**: en el editor de Artist Pulse deberían exponerse como dos color pickers ("Color primario" / "Color secundario"). El resto del esquema es fijo.

### Tipografías (Google Fonts vía next/font)
| Uso | Fuente | Notas |
|-----|--------|-------|
| Display / títulos | **Bebas Neue** | h1, h2, números de stats. Condensada, mayúsculas naturales. |
| Cuerpo / UI | **Space Grotesk** | body, párrafos, links, botones. |
| Labels / mono | **JetBrains Mono** | etiquetas tipo `— SOBRE EL ARTISTA`, fechas. |

Escala tipográfica observada (desktop):
- `h1` (nombre artista): **Bebas Neue, ~192px** (`clamp` responsive), `font-weight:400`, `letter-spacing:-4.8px`. En el screenshot se ve gigante ocupando el ancho del hero.
- `h2` (títulos de sección): **Bebas Neue, 72px**, `letter-spacing:-1.8px`.
- Label de sección: **JetBrains Mono, 12px**, `uppercase`, `letter-spacing:3px`, color `--dj-accent` (#d45137). Formato: `— Sobre el artista`.
- Cuerpo: Space Grotesk, ~14-16px, `letter-spacing:0.35px` en links.

---

## 2. Estructura de la página (orden de secciones)

```
<nav>        Barra superior fija
<main>
  0. HERO            (section, h-screen)
  1. #bio            Biografía
  2. #releases       Discografía
  3. #shows          Agenda / próximos shows
  4. #showsmap       Mapa de gira (Leaflet/CARTO)
  5. #media          Galería multimedia (carrusel)
  6. #mix            Reproductores embebidos (SoundCloud + Spotify)
  7. #youtube        Carrusel de videos YouTube
  8. #presskit       Press kit protegido por contraseña
  9. #contact        Formulario + datos de contacto
<footer>     Footer con redes y copyright
```
Todas las secciones (excepto hero) usan `py-24 md:py-32` (128px vertical en desktop).
Las secciones internas cargan en scroll (lazy / IntersectionObserver) — por eso aparecen vacías en un screenshot estático.

### Selector de idioma (ES/EN)
Botones flotantes (fixed, esquina) con banderas 🇪🇸 / 🇺🇸. El sitio es bilingüe.

---

## 3. Detalle por sección

### NAV (banner fijo)
- Logo = nombre del DJ (link a `#`).
- Menú: Bio · Releases · Shows · Media · Instagram · Contacto (anclas).
- Derecha: iconos de redes (Instagram, Spotify, SoundCloud, YouTube) + botón "Contacto".

### HERO
- `section` con `h-screen`, `flex flex-col items-center justify-end md:justify-center`, `overflow-hidden`, fondo `#07070f`.
- Imagen de fondo del artista (full bleed).
- **Capas de efecto** (clave para el look):
  - Gradiente inferior: `absolute bottom-0 inset-x-0 h-2/5 bg-gradient-to-t from-[#07070f]/80 to-transparent` (funde la foto hacia el fondo).
  - 3 "orbs" radiales con blur, posicionados absolutos, en colores de acento:
    - orb-1: 600×600, top 15% / left 10%, `rgba(212,81,55,0.15)`
    - orb-2: 500×500, bottom 10% / right 8%, `rgba(255,0,0,0.10)`
    - orb-3: 300×300, top 35% / right 20%, `rgba(212,81,55,0.06)`
    - (rounded-full + blur grande → glows difusos de neón).
- Contenido centrado (`z-10`): 
  - eyebrow: `Techno · Minimal · House` (géneros).
  - `h1` enorme con el nombre.
  - subtítulo: `Minimal Techno Argentina`.
  - botón "Contacto" + fila de iconos sociales (`gap-4 mt-6`).
  - nav secundario de anclas.

### #bio — Biografía
- Layout 2 columnas: imagen del artista (izq) + texto (der).
- Label `— Sobre el artista`, h2 "Biografía".
- Párrafo de bio + botón "Leer más ↓" (expandible).
- **Fila de stats** (4 items): `+5 Años activo`, `+50 Shows`, `+10 Países`, `+10 Releases`. Número en Bebas Neue grande color acento, etiqueta debajo en mono.

### #releases — Discografía
- Label `— Discografía`, h2 "Releases", subtítulo.
- Grid de `<article>` (tarjetas). Cada una: cover (img), badge "SINGLE", título, año, link a la plataforma (SoundCloud/Spotify) con su icono.

### #shows — Agenda
- Label `— Agenda`, h2 "Shows", subtítulo "Próximos shows" con icono.
- Lista de filas de evento: bloque de fecha (día / mes / año) + nombre del venue + ubicación (con icono pin) + badge "Sold Out" o botón "Tickets".

### #showsmap — Mapa de gira
- Label `— Gira mundial`, h2 "Mapa de Shows".
- Mapa **Leaflet** con tiles **CARTO** (dark). Controles zoom +/−. Marcadores.
- Leyenda: "Próximos" / "Pasados".

### #media — Multimedia
- Label `— Galería`, h2 "Multimedia", subtítulo.
- **Carrusel** de imágenes con captions ("Boiler Room, 2026", "Berghain, Berlin 2026"...), botones Anterior/Siguiente + dots de paginación.

### #mix — Reproductores
- Label `— Audio`, h2 "Mix".
- Dos tarjetas embebidas lado a lado:
  - SoundCloud (iframe del widget, header "SoundCloud" con icono).
  - Spotify (iframe del embed de artista/playlist, header "Spotify").

### #youtube — Videos
- Label `— Video`, h2 "YouTube", subtítulo.
- Carrusel de iframes de YouTube (botones prev/next + dots Video 1/2/3).
- Link "Ver canal completo".

### #presskit — Press Kit
- Label `— Prensa`, h2 "Press Kit".
- **Contenido protegido por contraseña**: input password + botón "Acceder" (deshabilitado hasta escribir). Texto "Ingresá la contraseña para acceder al press kit."

### #contact — Hablemos
- Label `— Contacto`, h2 "Hablemos", subtítulo.
- Columna izq: cards de Booking / Prensa (email mailto con icono) + redes sociales.
- Columna der: **formulario** — inputs Nombre + Email, selector de tipo (botones Booking / Prensa / Otro), textarea mensaje, botón "Enviar mensaje".

### FOOTER
- Nombre del DJ, iconos de redes, copyright `© 2026 Demo Dj. Todos los derechos reservados.`

---

## 4. Datos personalizables (esquema para el editor)

La plantilla debe leer estos campos del perfil del artista en Supabase:

```ts
{
  artistName: string,
  tagline: string,            // "Minimal Techno Argentina"
  genres: string[],           // ["Techno","Minimal","House"]
  heroImage: url,
  bioImage: url,
  bio: string,                // texto largo (con "leer más")
  accentColor: string,        // #d45137  ← color picker
  accentColor2: string,       // #ff0000  ← color picker
  stats: [{value:"+5", label:"Años activo"}, ...],
  socials: { instagram, spotify, soundcloud, youtube },
  releases: [{title, year, type:"SINGLE", cover, platformUrl, platform}],
  shows: [{day, month, year, venue, location, status:"soldout"|null, ticketsUrl}],
  showsMap: [{lat, lng, label, status:"upcoming"|"past"}],
  gallery: [{image, caption}],
  mix: { soundcloudUrl, spotifyEmbedUrl },
  videos: [youtubeUrl],
  pressKit: { password, files[] },
  contact: { bookingEmail, pressEmail },
  locale: "es" | "en",        // selector ES/EN
}
```

---

## 5. Notas técnicas para la implementación en Artist Pulse

- Stack del repo ya soporta todo: Next.js 14 App Router + Tailwind + Framer Motion (animaciones de orbs/scroll) + Cloudinary (imágenes).
- Mapa: agregar `leaflet` + `react-leaflet` con tiles CARTO dark (`https://{s}.basemaps.cartocdn.com/dark_all/...`).
- Cargar las 3 fuentes con `next/font/google` (Bebas Neue, Space Grotesk, JetBrains Mono).
- Implementar como nuevas secciones en `src/app/[slug]/sections/` siguiendo el patrón existente (HeroSection.tsx, etc.), y registrar la plantilla como un preset seleccionable en el onboarding/editor.
- El doble fondo alternado (#07070f / #050509) se puede resolver con una prop `tone` en cada `<Section>`.
- Exponer `accentColor`/`accentColor2` como CSS vars inline en el wrapper del perfil para que el usuario las personalice.

## 6. Estado de implementación (HECHO)

Implementado como **layout dedicado `minimal-pulse`** + plantilla `MINIMAL PULSE`.

Archivos:
- `src/app/[slug]/sections/MinimalPulse.tsx` — layout completo (nav, hero con orbs/glow, bio 2-col + stats, releases grid, shows con date-block + VenueMap, gallery coverflow, mix con embeds SoundCloud/Spotify/YouTube, contact form, footer). Brand icons SVG inline. Eyebrows mono, alternancia de fondo `#07070f`/`#050509`, pill buttons.
- `src/app/[slug]/SlugClient.tsx` — enruta a `<MinimalPulse>` cuando `hero.config.pageLayout === 'minimal-pulse'`.
- `src/components/panel/editor/TemplatesPanel.tsx` — preset `MINIMAL PULSE` (#D45137/#FF0000, Bebas Neue) con campo `pageLayout`; `applyTemplate` lo escribe en el config del hero.

**⚠ Decisión clave:** la columna `artists.layout_variant` tiene un CHECK/enum en Supabase que rechaza valores nuevos (PATCH → 400). Por eso el layout NO se rutea por esa columna sino por `hero.config.pageLayout` (JSONB, sin constraint). Si en el futuro se quiere usar la columna, hay que migrar el CHECK:
```sql
ALTER TABLE artists DROP CONSTRAINT artists_layout_variant_check;
ALTER TABLE artists ADD CONSTRAINT artists_layout_variant_check
  CHECK (layout_variant IN ('centered','editorial','split','raw','minimal-pulse'));
```

Verificado en `/solaris-kane-iuwf`: hero, nav y bio renderizan idénticos al original. Releases/shows/gallery sólo aparecen con datos cargados (es contenido del artista, no plantilla).

### Pendiente de pulido fino (opcional)
- Bio a 2 columnas necesita `photo_url` o `bio.bg_image` para mostrar el retrato.
- Sección Press Kit con contraseña: no existe como sección en el modelo (se omitió).
- Sección YouTube dedicada: se resuelve dentro de `mix` (los embeds YouTube se renderizan), no como bloque aparte.
- Medir gaps exactos contra el original con datos reales cargados.
