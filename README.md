# PRESSKIT.PRO

Press kits animados y profesionales para DJs y productores musicales — listos en 5 minutos.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Estilos | Tailwind CSS |
| Animaciones | Framer Motion |
| Base de datos / Auth | Supabase (multi-tenant con RLS) |
| Imágenes | Cloudinary (widget de subida sin firma) |
| Deploy | Vercel |

---

## Configuración local

### 1. Clonar e instalar

```bash
git clone https://github.com/tu-usuario/presskit-pro
cd presskit-pro
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Rellena los valores:

| Variable | Dónde obtenerla |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (solo servidor) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard → Cloud name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary → Settings → Upload → Unsigned preset |

### 3. Configurar Supabase

En el editor SQL de tu proyecto Supabase:

```sql
-- 1. Ejecutar el esquema completo
-- (contenido de supabase/schema.sql)

-- 2. Ejecutar datos de prueba (opcional)
-- (contenido de supabase/seed.sql)
```

> **Nota:** Para el seed, primero crea 2 usuarios en Supabase Dashboard → Authentication → Users y actualiza los UUIDs en `seed.sql`.

### 4. Configurar Cloudinary

1. Ir a Cloudinary → Settings → Upload
2. Crear un **Upload Preset sin firma** llamado `presskit_unsigned`
3. En "Allowed formats" añadir: `jpg, png, webp, gif`
4. Guardar

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Rutas de la aplicación

| Ruta | Descripción |
|------|------------|
| `/` | Landing page |
| `/signup` | Registro de artista |
| `/login` | Inicio de sesión |
| `/onboarding` | Asistente de 5 pasos (autenticado) |
| `/panel` | Dashboard del artista (autenticado) |
| `/[slug]` | Press kit público del artista |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx              # Layout raíz con fuentes
│   ├── page.tsx                # Landing page
│   ├── middleware.ts           # Protección de rutas con Supabase
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── onboarding/page.tsx     # Server component → OnboardingWizard
│   ├── panel/page.tsx          # Server component → DashboardClient
│   └── [slug]/page.tsx         # Press kit público con SSR
├── components/
│   ├── onboarding/
│   │   ├── OnboardingWizard.tsx   # Orquestador con AnimatePresence
│   │   ├── ProgressBar.tsx
│   │   ├── StepIdentity.tsx       # Paso 1
│   │   ├── StepSound.tsx          # Paso 2
│   │   ├── StepAchievements.tsx   # Paso 3
│   │   ├── StepLinks.tsx          # Paso 4
│   │   └── StepAesthetic.tsx      # Paso 5
│   ├── presskit/
│   │   ├── PresskitPage.tsx        # Composición de secciones
│   │   ├── HeroSection.tsx         # Parallax + letras animadas + waveform
│   │   ├── BioSection.tsx          # Contadores + bio revelatoria
│   │   ├── MusicSection.tsx        # Embeds Spotify/SoundCloud
│   │   ├── LiveHistorySection.tsx  # Timeline con línea dibujada
│   │   ├── GallerySection.tsx      # Masonry + lightbox
│   │   ├── ContactSection.tsx      # Links sociales + copiar email
│   │   └── BookingCTA.tsx          # Botón flotante pulsante
│   └── panel/
│       └── DashboardClient.tsx     # Panel con toggle de secciones
├── hooks/
│   ├── useCountUp.ts           # Contador animado con spring
│   └── useParallax.ts          # Efecto parallax suave en hero
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Cliente browser
│   │   └── server.ts           # Cliente servidor (SSR)
│   └── utils.ts                # cn, slugify, formatNumber, EASINGS…
└── types/
    └── index.ts                # Tipos, enums y THEME_CONFIGS
```

---

## Deploy en Vercel

```bash
# Instalar CLI de Vercel
npm i -g vercel

# Deploy
vercel --prod
```

Añade las mismas variables de entorno en Vercel → Project Settings → Environment Variables.

Cambia `NEXT_PUBLIC_APP_URL` a tu dominio de producción: `https://presskit.pro`

---

## Artistas demo

Con el seed ejecutado, puedes ver:

- [`/nxght`](http://localhost:3000/nxght) — NXGHT (Techno DJ, tema Dark Rave)
- [`/solara`](http://localhost:3000/solara) — SOLARA (Productora Afrobeats, tema Cyber Neón)

---

## Temas visuales

| Tema | Estética | Paleta |
|------|----------|--------|
| `dark_rave` | Underground / Berlín | Negro + Magenta |
| `minimal_pro` | Estudio / Premium | Blanco + Negro |
| `cyber_neon` | Futuro / Digital | Azul noche + Cian |
| `editorial_clean` | Artístico / Limpio | Crema + Ámbar |

---

## Seguridad (RLS)

Cada tabla tiene Row Level Security activado:
- Artistas solo pueden leer y escribir sus propios datos (`user_id = auth.uid()`)
- Datos públicos solo son legibles si `is_published = true`
- Analytics: inserción pública, lectura solo para el dueño
