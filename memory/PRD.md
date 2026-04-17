# Librería del Búho — PRD

## Problema original
Reconstrucción completa de una librería editorial online (frontend público + panel administrativo) con estética "Editorial-Tech" estricta: blanco técnico cálido, tipografía sans sin serifs, radios rígidos, cero sombras marcadas, iconografía sobre texto. Stack Astro 5 + React 19 islands + Tailwind v4 + Supabase.

## Stack
- Frontend único: Astro SSR (output=server, node adapter) en puerto 3000
- Islas interactivas: React 19 (@astrojs/react)
- Estilos: Tailwind CSS v4 + tokens CSS en `src/styles/global.css`
- Estado cliente: `nanostores` (carrito persistente en localStorage)
- Validación: Zod
- Datos/Auth/Storage: Supabase (anon client + SSR cookies + service role para seed)
- Iconos: lucide-react + SVG inline

## Identidad
- Marca: **Librería del Búho**
- Fuentes: Geist + Geist Mono (Google Fonts)
- Paleta: paper #F7F7F5 / ink #0A0A0A / signal orange #FF5C1A / success #2E7D4F / danger #B5271E
- Radios: 10px / 12px / pill 999px; hairlines #E4E4DF; sin sombras fuertes; grano SVG sutil

## Personas
1. Visitante/lector: descubre catálogo, compra libros vía checkout anónimo
2. Admin editorial: gestiona pedidos, inventario, publicación de títulos

## Arquitectura de datos (Supabase, provisto por el usuario)
- `books` (con slug único, stock + reserved_stock, published flag)
- `orders` + `order_items` (estados: pending/completed/canceled)
- `subscribers` (boletín, unsubscribe_token)
- Funciones RPC: `create_pending_order`, `complete_order`, `cancel_order`, `release_reserved_stock`
- RLS: lectura pública de `books.published=true`; insert anónimo en `subscribers`; resto bloqueado a anon
- Storage bucket `images` (público lectura, autenticado escritura)

## Rutas
### Públicas
- `/` — Home (hero + destacados + slider novedades + géneros + ofertas + boletín)
- `/catalog` — Catálogo con filtros (búsqueda, género, ordenar, ofertas ≤15€)
- `/product/[slug]` — Detalle de producto + relacionados
- `/cart` — Carrito + checkout (React island) que ejecuta `create_pending_order` RPC

### Admin (protegidas por middleware SSR)
- `/admin/login` — Supabase Auth email/password
- `/admin` — Dashboard KPIs (ingresos, pipeline, stock, suscriptores, bajo stock)
- `/admin/orders` — Tabla de pedidos + acciones complete/cancel + detalle expandible
- `/admin/products` — CRUD libros + upload portadas a Storage + toggle publicar

## Completado (2026-01-17)
- Andamiaje Astro + React + Tailwind v4 + Supabase configurado en puerto 3000
- Middleware SSR de guardia para rutas /admin/*
- Home, catálogo, producto, carrito/checkout con flujo RPC de reserva de stock
- Panel admin completo: login, dashboard, orders, products
- Upload de portadas a Supabase Storage
- Seed: 14 libros ficticios + usuario admin creado
- Panel admin oculto en UI pública (no hay enlaces visibles en header/footer)
- Renombrado a "Librería del Búho" en toda la UI

## Credenciales admin
- Email: `admin@buhobooks.co` (seed interno, no visible al público)
- Password: `BuhoBooks2026!`
- Login URL (no enlazada): `/admin/login`

## Backlog
### P1 — Siguiente iteración
- Dominio de correo real para el admin (cambiar seed a `admin@libreriadelbuho.com`)
- Emails transaccionales a cliente tras confirmar pedido (Resend/SendGrid)
- Unsubscribe endpoint para el token de `subscribers`
- Paginación en catálogo y en `/admin/orders`, `/admin/products`
- Filtro por rango de precio en catálogo

### P2 — Mejoras
- Buscador global con autocompletado en header
- Página institucional (manifiesto, equipo, prensa)
- Listas/colecciones editoriales curadas
- Carrito slide-over en lugar de página completa
- Pago real con Stripe o transferencia + comprobante

### P2 — Operativas
- Exportar pedidos a CSV desde `/admin/orders`
- Dashboard: gráfica histórica de ingresos últimos 30/90 días
- Registro de actividad admin (audit log)

## Notas técnicas
- Supervisor solo soporta `yarn start`; package.json script `start` → `astro dev --host 0.0.0.0 --port 3000`
- Backend FastAPI original permanece activo pero no se usa
- Vite `allowedHosts` debe incluir `.preview.emergentagent.com` para el ingress de Emergent
