# Contexto del proyecto — Base de datos Russell

> Documento de contexto para quien trabaje en este repositorio (personas o asistentes de IA).
> Última actualización: 2026-10-05.

## 1. Propósito

Formulario web **"Base de datos Russell"** de **Russell Bedford**, para que se reporte la información de una entidad, sus operaciones con vinculados y el acumulado por tercero. Cada envío se reenvía a un **webhook de n8n**, que alimenta el Excel de seguimiento.

- Repositorio: `AutomatizaRussell/formulario-finanzas` (rama `main`).
- Desplegado en **Coolify** como recurso **Docker Compose**.

## 2. Arquitectura

```
Navegador → nginx (servicio `frontend`, único con dominio público)
              ├─ /          → app React compilada (dist/)
              ├─ /healthz   → 200 "ok" (healthcheck de nginx)
              └─ /api/*     → http://${API_UPSTREAM} (backend:3000, red interna)
                                 └─ POST multipart → N8N_WEBHOOK_URL
```

| Carpeta | Tecnología | Responsabilidad |
| --- | --- | --- |
| `frontend/` | React 18 (JSX) + CSS puro, Vite 5, nginx 1.27 | Formulario, validación en cliente, envío a `/api/enviar-formulario` |
| `backend/` | Node 20, Express 4, multer, axios, form-data | Recibe campos y archivos y los reenvía a n8n con los mismos nombres |
| `docker-compose.yml` | Servicios `backend` y `frontend` | Lo que despliega Coolify |

No hay base de datos: el sistema no guarda nada. El backend escribe los archivos en un directorio temporal y los borra siempre al terminar cada petición.

## 3. Contrato con n8n (no romper)

Los `name` de los campos y los `value` de las opciones son lo que lee el flujo de n8n. **No cambiarlos sin ajustar el flujo.**

Orden = columnas del Excel de seguimiento. Todos los campos son obligatorios.

| # | Sección | Etiqueta | `name` | Tipo |
| --- | --- | --- | --- | --- |
| 1 | Datos de la entidad informante | Razón social de la entidad | `razon_social` | texto → MAYÚSCULAS |
| 1 | | NIT de la razón social | `nit_razon_social` | solo dígitos, mín. 5, sin DV |
| 1 | | Sector al que pertenece | `sector` | select (`SECTORES`) |
| 2 | Ubicación de entidades vinculadas | ¿Posee vinculados en zona franca? | `vinc_zona_franca` | `SI` / `NO` |
| 2 | | ¿Posee vinculados en el exterior? | `vinc_exterior` | `SI` / `NO` |
| 2 | | Senior a cargo | `senior_cargo` | select (`SENIORS`) |
| 2 | | Razón social de los vinculados | `razon_social_vinculados` | texto → MAYÚSCULAS |
| 3 | Naturaleza de las operaciones | Venta de bienes o prestación de servicios | `detalle_servicios` | texto → MAYÚSCULAS |
| 3 | | Saldos o movimientos de préstamos vigentes con vinculados | `detalle_prestamos` | texto → MAYÚSCULAS |
| 3 | | Operaciones en jurisdicciones no cooperantes o de baja imposición | `paises_no_cooperantes` | texto → MAYÚSCULAS |
| 4 | Acumulado por tercero a agosto 2026 | Archivo del acumulado por tercero | `soporte_financiero` | `.xlsx`, máx. 10 archivos, 20 MB c/u |

**Archivos:** si se envía uno, n8n lo recibe como `soporte_financiero`. Si son varios, como `soporte_financiero_0`, `soporte_financiero_1`, …

**Valores de los selects:** los `value` están en mayúsculas con guiones bajos y sin tildes (p. ej. `SERVICIOS_FINANCIEROS_SEGUROS`, `MARIA_ALEXANDRA_CALLE_HENAO`). Los `label` son solo de presentación. El value `SANDRA_PATRICA_MENDOZA_RINCON` conserva su error de digitación a propósito, porque así lo recibe n8n.

### Historial del contrato
- **Eliminados** (versión 2): `cantidad_empleados`, `total_activos`, `total_pasivo`, `total_patrimonio`, `total_ingreso`, `total_gasto`, `total_costo`, `correo_encargado`.
- **Agregado:** `razon_social`.
- **Cambió la etiqueta**, no el name: `detalle_servicios` pasó de "Egreso-ingreso-préstamos" a "Venta de bienes o prestación de servicios".

## 4. API del backend

| Método | Ruta | Respuesta |
| --- | --- | --- |
| GET | `/api/health` | `200 {"status":"ok"}` |
| POST | `/api/enviar-formulario` | multipart. Reenvía a n8n y devuelve el status y el body de n8n si es < 500 |

Errores:
- `413`: algún archivo supera 20 MB.
- `400`: más de 10 archivos, o un archivo en un campo distinto de `soporte_financiero`.
- `502`: n8n falló o no respondió.
- `500`: error inesperado.

Los límites están duplicados a propósito en `backend/server.js` y en `FILE_FIELD` de `frontend/src/config/formSchema.js`. **Deben coincidir.**

## 5. Estructura del frontend

```
frontend/
  index.html                    Fuente Lato (Google Fonts), favicon
  vite.config.js                Proxy /api → localhost:3000 en desarrollo
  eslint.config.js              ESLint 9 (flat): recommended + react + react-hooks
  Dockerfile                    Multi-stage: node:20 build → nginx:1.27-alpine
  nginx/default.conf.template   envsubst de ${API_UPSTREAM}; cache largo en /assets
  public/favicon.png            Símbolo del globo estilizado
  src/
    main.jsx                    Punto de entrada; importa estilos globales
    App.jsx / App.css           Tarjeta: encabezado + intro + formulario + pie
    config/formSchema.js        ← FUENTE ÚNICA de secciones, campos y reglas
    config/options.js           Catálogos: SI_NO, SECTORES, SENIORS
    hooks/useReportForm.js      Estado (values, files, errors, status), validación, envío, reset
    services/formService.js     Arma el FormData y hace el POST
    utils/validation.js         validateField, validateFile, validateForm
    utils/formatters.js         normalizeInput (dígitos/mayúsculas), fileKey, formatFileSize
    components/
      ReportForm.jsx            Recorre SECTIONS y orquesta todo
      form/FormSection.jsx      Sección numerada + FieldGrid (1 o 2 columnas)
      form/Field.jsx            Input/select con etiqueta, ayuda y error
      form/FileDropzone.jsx     Arrastrar/seleccionar, lista de archivos, quitar
      form/ProgressBar.jsx      Progreso fijo (campos completos / total)
      feedback/Alert.jsx        Error de envío
      feedback/SuccessPanel.jsx Confirmación + "Enviar otro reporte"
      layout/BrandHeader.jsx    Banda azul con logo blanco + círculos decorativos
      layout/BrandFooter.jsx    Logo azul, ciudades, sitio web
      layout/ColorBar.jsx       Franja de 4 colores
      icons/Icons.jsx           SVG inline
    styles/theme.css            Tokens de marca (colores, tipografía, espaciado)
    styles/global.css           Reset y utilidades (.visually-hidden)
    styles/buttons.css          .button, --primary, --secondary, spinner
    assets/                     logo-rb-azul.png, logo-rb-blanco.png
```

Cada componente importa su propio `.css` (convención BEM: `bloque__elemento--modificador`).

### Cómo agregar o cambiar una pregunta
1. Edita `SECTIONS` en `config/formSchema.js`. Propiedades del campo:
   - `name`, `label`, `type` (`text` | `digits` | `select`)
   - Opcionales: `placeholder`, `hint`, `uppercase`, `options`, `minLength` + `minLengthMessage`, `fullWidth`
2. Si es un select, agrega el catálogo en `config/options.js`.
3. Avisa a quien mantiene n8n del nuevo `name`.

La validación, el progreso, el envío y el foco en errores se derivan solos del esquema; no hay que tocar componentes.

## 6. Identidad visual (Manual de Marca Corporativa)

Implementada en `styles/theme.css`. Respetar al hacer cambios:

- **Tipografía:** Lato (300 títulos, 700 énfasis); Arial como respaldo.
- **Color principal:** PAN 2748 RBI Space Blue `#001871`.
- **Complementarios:**
  - Sea Green `#00bfb3`
  - Earth Orange `#ed8b00`
  - Sky Blue `#00a9ce`
  - Mind Magenta `#981d97`
  - Además, sus tintes al 80/40/20 %.
- **Roles semánticos:**
  - Obligatorio: naranja.
  - Error: magenta (no se usa rojo, porque no está en la paleta).
  - Éxito: verde mar.
  - Foco: sky blue.
- **Logo:**
  - Versión negativa (blanca) sobre fondo azul sólido; positiva (azul) sobre blanco.
  - Nunca deformar, recolorear ni añadir texto junto al logo.
  - Espacio libre ≥ 20 % del ancho del logo.
  - Ancho mínimo legible ≈ 30 mm (≥ 150 px en pantalla).
- **Recursos gráficos:** franja de 4 colores (membrete), círculos de colores (portadillas), números de sección en recuadro azul (tabla de contenido del manual).
- El eslogan "taking you further" es parte del logo y va solo en inglés.

## 7. Configuración

| Variable | Servicio | Por defecto | Uso |
| --- | --- | --- | --- |
| `N8N_WEBHOOK_URL` | backend | `https://n8n.rbgct.cloud/webhook/financiera` | Destino de los envíos |
| `PORT` | backend | `3000` | Puerto de Express |
| `API_UPSTREAM` | frontend | `backend:3000` | Host:puerto al que nginx envía `/api` |

## 8. Despliegue (Coolify)

- Build Pack: **Docker Compose**.
- Base directory: `/`.
- Archivo: `/docker-compose.yml` (extensión **.yml**, no `.yaml`).
- Rama: `main`.
- El dominio se asigna **solo** al servicio `frontend` (puerto 80). El `backend` no se publica.
- Verificación: `https://<dominio>/api/health` debe responder `{"status":"ok"}`.
- Ambas imágenes tienen `HEALTHCHECK`: `/healthz` en nginx y `/api/health` en el backend.

Errores ya vistos:
- *"/app/frontend/dist not found"*: el recurso estaba con Build Pack **Railpack/estático**. Debe ser **Docker Compose**.
- *"Docker Compose file not found"*: la ruta tenía `.yaml` y el archivo es `.yml`.

## 9. Desarrollo local

```bash
cd backend  && npm install && npm start      # API en http://localhost:3000
cd frontend && npm install && npm run dev    # App en http://localhost:5173 (proxy /api → 3000)
cd frontend && npm run lint                  # ESLint (debe quedar sin errores ni avisos)
cd frontend && npm run build                 # Build de producción en dist/
```

⚠️ En local el backend envía al **n8n real** por defecto. Para pruebas, arranca el backend con `N8N_WEBHOOK_URL` apuntando a un webhook de prueba.

## 10. Convenciones

- Código en inglés (variables y funciones); textos de interfaz y comentarios en español.
- Sin Tailwind ni librerías de UI: CSS por componente con tokens de `theme.css`.
- Lógica fuera de los componentes: esquema en `config/`, estado en `hooks/`, red en `services/`, funciones puras en `utils/`.
- `npm run lint` limpio antes de hacer commit.
- `dist/`, `node_modules/`, `uploads/` y `.env` están en `.gitignore`.

## 11. Pendientes conocidos

- [ ] En n8n: mapear el campo nuevo `razon_social` a su columna del Excel.
- [ ] En n8n: verificar que ningún nodo dependa de los campos eliminados (ver §3).
- [ ] Confirmar el texto completo de la columna "Venta de bienes o prestación de servicios" (en la captura del Excel aparece cortado).
