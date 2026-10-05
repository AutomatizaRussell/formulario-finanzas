# ---- Build: compila la app React con Vite ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Runtime: nginx sirve el build y hace proxy de /api al backend ----
FROM nginx:1.27-alpine
# Host:puerto del backend. La imagen oficial aplica envsubst a /etc/nginx/templates/*.template
ENV API_UPSTREAM=backend:3000
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/healthz || exit 1
