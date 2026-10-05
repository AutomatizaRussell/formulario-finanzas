# Formulario de Precios de Transferencia

Formulario web de Russell Bedford para recibir la información financiera y los soportes de Precios de Transferencia. Los datos se reenvían a un webhook de n8n.

```
frontend/   React (JSX) + CSS · Vite · servido por nginx
backend/    Node/Express · recibe el formulario y lo reenvía a n8n
```

## Desarrollo local

```bash
cd backend && npm install && npm start      # API en http://localhost:3000
cd frontend && npm install && npm run dev   # App en http://localhost:5173 (proxy /api → 3000)
cd frontend && npm run lint                 # Revisión de código con ESLint
```

## Despliegue en Coolify

1. Nuevo recurso → **Docker Compose** → repositorio de GitHub, rama `main`, archivo `docker-compose.yml`.
2. Asigne el dominio **solo** al servicio `frontend` (puerto 80). El `backend` queda interno.
3. Variable de entorno opcional: `N8N_WEBHOOK_URL` (por defecto `https://n8n.rbgct.cloud/webhook/financiera`).

Nginx reenvía `/api/*` a `API_UPSTREAM` (por defecto `backend:3000`). Si el backend se despliega como recurso separado, cambie esa variable en el servicio `frontend`.

## Dónde cambiar cosas

| Qué | Archivo |
| --- | --- |
| Campos, etiquetas y secciones | `frontend/src/config/formSchema.js` |
| Sectores y seniors | `frontend/src/config/options.js` |
| Colores y tipografía de marca | `frontend/src/styles/theme.css` |
| Validaciones | `frontend/src/utils/validation.js` |

Los `name` de los campos y los `value` de las opciones son los que recibe n8n: no los cambie sin ajustar el flujo.
