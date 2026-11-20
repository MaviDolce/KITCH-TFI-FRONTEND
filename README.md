# Kitch (Frontend)

Frontend de Kitch construido con **Vite + React + Tailwind CSS + React Router**.

## Desarrollo local (`localhost`)

1. Copiá `.env.example` a `.env` (`.env` está ignorado por Git):

```env
VITE_API_BASE_URL=http://localhost:5295
VITE_IA_TIMEOUT_MS=120000
```

2. Instalá dependencias y levantá el servidor de desarrollo:

```bash
npm install
npm run dev
```

Abre en `http://localhost:5173`. Si necesitás presentar en `localhost` como respaldo, este entorno convive con producción sin cambiar código.

## Deploy en producción (Vercel)

1. Conectá el repositorio en **Vercel** (Framework Preset: `Vite`, Build Command: `npm run build`, Output Directory: `dist`).
2. Cargá la variable de entorno en **Vercel -> Project Settings -> Environment Variables**:
   - `VITE_API_BASE_URL=https://<tu-backend-azure>` *(sin barra final)*
   - `VITE_IA_TIMEOUT_MS=120000` *(opcional)*
3. `vercel.json` incluye el rewrite SPA (`/(.*) -> /index.html`) necesario para que funcionen accesos directos y recargas en `/reset-password`, `/pago-exitoso` y rutas protegidas.
4. `.github/workflows/ci.yml` valida `npm run lint` y `npm run build` en cada `push` y `pull_request`.
