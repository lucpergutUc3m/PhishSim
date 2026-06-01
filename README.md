# PhishSim

Aplicación web de concienciación en phishing desarrollada como TFM en la UC3M.  
Permite lanzar campañas de simulación y que los participantes consulten su evolución.

## Stack

- **Frontend:** React 19 + Vite 8, desplegado en Vercel
- **Backend:** FastAPI en Azure (proxy transparente vía `vercel.json`)
- **Motor de phishing:** GoPhish

## Desarrollo local

```bash
npm install
npm run dev
```

Crea un `.env` con:

```
VITE_API_URL=http://localhost:8000
```

En producción `VITE_API_URL` se deja vacío — las llamadas a `/api/*` van al backend Azure a través de las rewrites de Vercel.

## Scripts

```bash
npm run build   # Build de producción
npm run lint    # ESLint
```
