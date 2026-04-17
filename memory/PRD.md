# Librería del Búho — PRD

## Problema original
Librería pequeña REAL en Barranquilla, Colombia. Venta por Instagram/WhatsApp con catálogo online. 186 clásicos curados (literatura, filosofía, literatura colombiana, teatro, poesía, infantil) con precios en COP ($12.000 - $23.000). Panel interno oculto para gestión de pedidos e inventario.

## Stack
- Frontend único: Astro 5 SSR (server output, node adapter) en puerto 3000
- Islas interactivas: React 19 (@astrojs/react)
- Estilos: Tailwind CSS v4 + tokens CSS en `src/styles/global.css`
- Estado cliente: `nanostores` (carrito persistente en localStorage)
- Datos/Auth/Storage: Supabase — auth basada en COOKIES vía @supabase/ssr
- Validación: Zod
- Iconos: lucide-react + SVG inline

## Identidad
- Marca: **Librería del Búho** (logo: mascota búho con taza, trazo a mano)
- Voz: humilde, directa, honesta ("Una librería pequeña con muchos clásicos")
- Ubicación: Barranquilla, Colombia
- Contacto: WhatsApp + Instagram (@libreria.elbuho)
- Fuentes: Geist + Geist Mono
- Paleta: paper #F7F7F5 / ink #0A0A0A / signal orange #FF5C1A / success #2E7D4F / danger #B5271E

## Flujo de compra (sin pasarela de pago)
1. Cliente arma carrito en la web (localStorage)
2. Rellena form o usa fast-path
3. Al confirmar: RPC `create_pending_order` → reserva stock
4. Abre `wa.me/{número}` con mensaje pre-cargado (referencia, items, total)
5. Tienda y cliente coordinan pago (transferencia, Nequi, Daviplata) y entrega por WhatsApp

## Rutas
### Públicas (UI limpia, sin exponer admin)
- `/` — Hero honesto, destacados, literatura colombiana, novedades, géneros, económicos, cómo pedir, CTA WhatsApp/Instagram
- `/catalog` — 186 libros con filtros (búsqueda, género, ordenar, económicos ≤ $15.000)
- `/product/[slug]` — Detalle + "Preguntar por WhatsApp"
- `/cart` — Resumen + formulario + confirmación WhatsApp

### Admin (oculto, sólo por URL directa)
- `/admin/login` — Supabase Auth (email/password) con cookies SSR
- `/admin` — Dashboard KPIs (ingresos, pipeline, catálogo, inventario, suscriptores)
- `/admin/orders` — Gestionar pedidos + acciones complete/cancel
- `/admin/products` — CRUD libros + upload portadas

## Datos (Supabase)
- Esquema provisto por usuario con RLS + RPC (`create_pending_order`, `complete_order`, `cancel_order`)
- Bucket `images` (público read, auth write)
- Seed: 186 títulos clásicos con portadas reales de OpenLibrary/Google Books (~60% con cover real, resto placeholder)

## Completado (2026-01-17)

### Sesión 1 — MVP
- Astro + React + Tailwind v4 + Supabase montado en :3000
- Flujo completo tienda pública + admin
- Middleware SSR guardia, RPC reserva stock
- 14 libros ficticios placeholder

### Sesión 2 — Marca "Librería del Búho"
- Eliminado acceso público al admin (header/footer limpios)
- Renombrado marca

### Sesión 3 — Contenido real honesto
- Logo real del búho aplicado (imagen limpia /logo-owl.png)
- Hero reescrito: humilde, sin claims falsos, stats reales
- Currency a COP (es-CO, sin decimales)
- 186 libros clásicos reales importados con portadas de OpenLibrary
- Checkout rediseñado: sin pasarela, handoff a WhatsApp con mensaje pre-cargado
- Enlaces WhatsApp + Instagram en header/footer/product/cart
- Sección "Cómo pedir" con 3 pasos reales (armar pedido, WhatsApp, coordinar pago)

### Sesión 3 — Bugfixes post-testing
- Filtro "económicos" corregido a ≤ $15.000 (antes 15€)
- Label del filtro corregida a COP
- Auth admin SSR: cambio a `createBrowserClient` de @supabase/ssr para sesión cookie-based
- Login admin confirmado funcionando (dashboard visible tras login)

## Credenciales admin
- Email: `admin@buhobooks.co`
- Password: `BuhoBooks2026!`
- URL (oculta): `/admin/login`

## Configuración clave (.env)
- `PUBLIC_WHATSAPP_NUMBER=573000000000` (⚠️ placeholder — cambiar por el real)
- `PUBLIC_INSTAGRAM_URL=https://www.instagram.com/libreria.elbuho`
- `PUBLIC_LOGO_URL=/logo-owl.png`
- `PUBLIC_CITY=Barranquilla`

## Backlog

### P0 — Antes de publicar
- Reemplazar `PUBLIC_WHATSAPP_NUMBER` por el número real de la librería
- Cambiar credenciales del admin a un email del dueño de la librería
- Revisar las ~78 portadas faltantes (subir manualmente desde el panel)

### P1 — Próxima iteración
- Paginación en catálogo y listas del panel cuando el inventario crezca
- Filtro por rango de precio en el catálogo (slider)
- Página institucional (sobre la librería, selección editorial)
- Resumen de pedido persistido (cliente puede reabrir WhatsApp desde /order/[id])
- Sección "Encargos": formulario para pedir libros que no están en el catálogo

### P2 — Crecimiento
- Integración con Instagram Shopping (feed de productos)
- Newsletter con Resend/SendGrid (formulario ya presente en subscribers)
- Recomendaciones "del mismo género" en producto (ya implementado parcialmente)
- Colecciones curadas ("regalo aniversario", "primer clásico", "filosofía 101")
- Analytics ligeros: libros más vistos, género más pedido

### P2 — Operativas
- Exportar pedidos a CSV
- Gráfica histórica de ingresos en dashboard
- Audit log de cambios del catálogo

## Notas técnicas
- Supervisor config (read-only) ejecuta `yarn start` → astro dev :3000
- El FastAPI default sigue activo pero no se usa (Supabase es el backend)
- Vite `allowedHosts` incluye `.preview.emergentagent.com` para el ingress
- Auth Supabase vía `@supabase/ssr` (cookies) — no usar `@supabase/supabase-js` createClient para browser
