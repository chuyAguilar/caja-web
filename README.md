# 468Club — App de Caja (Next.js)

Panel web interno para 468Club, sobre el mismo Supabase que el chatbot de WhatsApp.

- **/caja** — administrar clientes, inscripciones y registrar pagos (CRUD completo). Cada pago cobrado suma al corte de caja actual.
- **/dueño** — total de dinero en caja por recolectar, botón para marcar como recolectado (cierra el corte y reinicia el contador) e historial de recolecciones.

> ⚠️ **Sin autenticación.** Esta versión es para pruebas. Antes de usarla en producción, agrega protección (contraseña por vista o login). Cualquiera con la URL puede entrar.

## Requisitos previos
Haber corrido en Supabase, en orden:
1. `02_schema_supabase.sql`
2. `04_schema_caja.sql`
(`03_datos_prueba.sql` es opcional, para datos de ejemplo.)

## Variables de entorno
Crea `.env.local` (copia de `.env.local.example`):

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJ...
```

Ambas salen de Supabase → **Settings → API**. La `service_role` es secreta; solo se usa en el servidor (server actions), nunca se expone al navegador.

## Correr en local
```bash
npm install
npm run dev
```
Abre http://localhost:3000

## Desplegar en Vercel
1. Sube esta carpeta `caja-web` a un repo de GitHub (o usa `vercel` CLI).
2. En Vercel: **New Project** → importa el repo → framework **Next.js** (autodetectado).
3. En **Environment Variables** agrega `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
4. Deploy.

## Stack
Next.js 14 (App Router, Server Actions) · Tailwind CSS · @supabase/supabase-js (service_role, solo servidor).
