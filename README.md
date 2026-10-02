# SportPredict AI

Aplicación React + TypeScript + Vite con servidor Express para datos deportivos y predicciones mediante Gemini.

## Arquitectura

- **Frontend:** React + TypeScript + Vite.
- **Backend:** Express + TypeScript (`server.ts`).
- **Datos deportivos:** `lib/sports-api.ts` en el servidor y datos fallback locales.
- **IA:** `lib/ai-service.ts` — únicamente servidor; la clave de Gemini nunca debe llegar al navegador.
- **Fallback de IA:** `lib/prediction-fallback.ts` — lógica determinista sin secretos, segura para usar en cliente cuando el endpoint de IA no responde.
- **Tipos compartidos:** `lib/ai-types.ts`.
- **Variables públicas:** prefijo `VITE_`.
- **Variables secretas:** sin prefijo `VITE_`; por ejemplo `GEMINI_API_KEY`.

## Desarrollo local

Requisitos:

- Node.js 20+ recomendado.
- npm.

Instalación:

```bash
npm install
```

Crear `.env` a partir de `.env.example` y configurar, como mínimo si se quiere IA real:

```env
GEMINI_API_KEY=tu_clave
```

Opcionalmente:

```env
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
```

Ejecutar:

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

## Producción

Construir:

```bash
npm run build
```

Iniciar:

```bash
NODE_ENV=production npm start
```

En Windows PowerShell:

```powershell
$env:NODE_ENV="production"
npm start
```

En Render, el archivo `render.yaml` deja configurados el comando de build, el comando de inicio y `/api/health`. Render proporciona `PORT` automáticamente; no es necesario fijarlo manualmente. Las claves secretas se cargan desde Environment Variables y no se guardan en Git.

Para producción, usa Node 22.16.0 (fijado en `.node-version`) para mantener el mismo runtime que el desarrollo local.

## Seguridad aplicada

- La clave `GEMINI_API_KEY` permanece en el servidor.
- El navegador solicita predicciones por `/api/ai-predict`; no ejecuta el SDK de Gemini.
- El endpoint de IA obtiene el partido por `matchId` en el servidor y no confía en un objeto de partido enviado por el cliente.
- Límite de tamaño para JSON: 100 KB.
- Rate limiting en memoria para endpoints públicos.
- Cabeceras HTTP básicas de seguridad.
- `X-Powered-By` deshabilitado.
- `.env` está excluido de Git mediante `.gitignore`.
- Los endpoints devuelven mensajes de error generales sin exponer secretos ni trazas al cliente.

## Extender el proyecto

Para añadir una nueva función:

1. Añade el endpoint Express en `server.ts` si requiere servidor, claves o acceso a proveedores externos.
2. Añade los tipos en un módulo separado si serán compartidos.
3. Crea el componente React en `components/` o una página dentro de `app/`.
4. Añade la ruta en `src/App.tsx`.
5. Si la función requiere una API externa privada, mantenla en el servidor.
6. Prueba primero con `npm run dev` y después con `npm run build`.

## Render

1. Sube este repositorio a GitHub.
2. En Render crea un **Web Service** y conecta el repositorio. Render recomienda Web Service para aplicaciones Express que ejecutan código del servidor.
3. Si Render detecta `render.yaml`, revisa la configuración propuesta.
4. Añade `GEMINI_API_KEY` en Environment Variables. No la pongas en React, GitHub ni `VITE_*`.
5. Añade `VITE_ADSENSE_CLIENT_ID` únicamente cuando tengas el ID real de AdSense.
6. Usa `/api/health` como health check.

## AdSense

El componente `AdBanner` está preparado para cargar AdSense cuando existe `VITE_ADSENSE_CLIENT_ID`. Antes de monetizar, el sitio debe tener contenido propio y cumplir las políticas de Google. Después de que AdSense proporcione el publisher ID, el servidor puede servir `/ads.txt` automáticamente. No se debe publicar un `ads.txt` con un ID de ejemplo.
