<div align="center">
  <img width="1200" height="475" alt="Palacio Cantón PZO" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# 🏮 Palacio Cantón PZO — App de Pedidos Online

App de pedidos en línea para el restaurante **Palacio Cantón PZO** (C.C. Costa Granada, Puerto Ordaz, Venezuela).

Construida con React + Vite (frontend) y Express + Node.js (backend), con asistente de Chef por IA usando Gemini.

---

## 🚀 Correr Localmente

**Prerequisitos:** Node.js 18+

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea tu archivo `.env` basándote en `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Añade tu clave Gemini en el `.env`:
   ```
   GEMINI_API_KEY="tu_clave_real_aqui"
   ```
4. Corre la app:
   ```bash
   npm run dev
   ```
   La app estará en `http://localhost:3000`

---

## ☁️ Despliegue en Render.com (Recomendado)

Este proyecto incluye un archivo `render.yaml` listo para usar.

### Pasos:

1. Ve a [render.com](https://render.com) y crea una cuenta gratuita.
2. Haz clic en **"New +"** → **"Web Service"**.
3. Conecta tu repositorio de GitHub: `maximilianoruizgonzalez25-wq/palacio-canton`.
4. Render detectará el `render.yaml` automáticamente. Confirma la configuración.
5. En la sección **"Environment Variables"**, añade:
   - `GEMINI_API_KEY` = tu clave real de Google AI Studio
6. Haz clic en **"Create Web Service"** y espera que termine el build (~2-3 minutos).
7. ¡Tu app estará en vivo en una URL pública tipo `https://palacio-canton.onrender.com`!

> **Nota:** En el plan gratuito de Render, el servidor se "duerme" tras 15 minutos de inactividad y tarda ~30 segundos en despertar al primer acceso. Para uso continuo se recomienda el plan Starter ($7/mes).

---

## 🔑 Variables de Entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `GEMINI_API_KEY` | Clave de Google AI Studio para el Chef AI Chen | Sí (para el chat IA) |
| `NODE_ENV` | `production` en servidor, no definir en local | No |

