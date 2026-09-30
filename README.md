# Bordados Gricel CRM

Proyecto base completo para administrar clientes y pedidos de **bordado, sublimación y confección**.

## Incluye

- Sitio público responsive en React.
- Registro e inicio de sesión de clientes.
- Roles: CLIENT, ADMIN, SALES y PRODUCTION.
- Creación de pedidos con servicio, producto, cantidad, colores, tallas, fecha y notas.
- Carga de varios archivos por pedido.
- Portal del cliente con historial y estado del pedido.
- CRM administrativo con dashboard, clientes y gestión de pedidos.
- Estados de producción desde solicitud recibida hasta entregado.
- Total, anticipo y saldo.
- PostgreSQL + Prisma ORM.
- Docker Compose para levantar PostgreSQL rápidamente.
- Notificación de pedido nuevo preparada para WhatsApp mediante Twilio.

---

# 1. Requisitos

Instala:

- Node.js 20 o superior
- npm
- Docker Desktop (recomendado para PostgreSQL)
- Git opcional

Comprueba:

```bash
node -v
npm -v
docker -v
```

---

# 2. Abrir el proyecto

Abre la carpeta `bordados-gricel-crm` en Visual Studio Code.

La estructura principal es:

```text
bordados-gricel-crm/
├── frontend/             React + Vite
├── backend/              Node.js + Express
├── docker-compose.yml    PostgreSQL
└── README.md
```

---

# 3. Levantar PostgreSQL con Docker

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Esto crea:

```text
Host: localhost
Puerto: 5432
Base de datos: bordados_gricel
Usuario: gricel
Password: gricel123
```

Puedes comprobar el contenedor con:

```bash
docker ps
```

## Conexión desde pgAdmin

Registra un servidor con:

```text
Name: Bordados Gricel Local
Host: localhost
Port: 5432
Maintenance database: bordados_gricel
Username: gricel
Password: gricel123
```

---

# 4. Configurar backend

En una terminal:

```bash
cd backend
```

Copia `.env.example` como `.env`.

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### CMD

```cmd
copy .env.example .env
```

### Linux/macOS

```bash
cp .env.example .env
```

Completa DATABASE_URL en backend/.env con tus credenciales locales.

```env
DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/NOMBRE_BASE?schema=public"
```

Instala dependencias:

```bash
npm install
```

Genera Prisma Client:

```bash
npx prisma generate
```

Crea las tablas:

```bash
npx prisma migrate dev --name init
```

Crea el administrador inicial:

```bash
npm run prisma:seed
```

Credenciales iniciales:

```text
Correo: TU_CORREO
Password: CONTRASEÑA
```

**Cambia esta contraseña antes de publicar el sistema.**

Inicia la API:

```bash
npm run dev
```

Debe mostrar:

```text
API lista en http://localhost:4000
```

Prueba en el navegador:

```text
http://localhost:4000/api/health
```

Debe responder algo similar a:

```json
{
  "ok": true,
  "service": "Bordados Gricel API"
}
```

---

# 5. Configurar frontend React

Abre una segunda terminal:

```bash
cd frontend
```

Copia `.env.example` como `.env`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Instala dependencias:

```bash
npm install
```

Inicia React:

```bash
npm run dev
```

Abre:

```text
http://localhost:5173
```

---

# 6. Flujo para probar

## Cliente

1. Abre `http://localhost:5173`.
2. Haz clic en **Crear cuenta**.
3. Registra un cliente.
4. Entra al portal.
5. Crea un pedido.
6. Selecciona servicio, producto, cantidad y fecha.
7. Adjunta un logo o diseño.
8. Envía el pedido.
9. Revisa el historial del pedido.

## Administrador

1. Cierra la sesión del cliente.
2. Entra con:


3. Se abrirá `/admin`.
4. En **Pedidos** haz clic en **Gestionar**.
5. Cambia el estado.
6. Define fecha confirmada.
7. Registra total y anticipo.
8. Guarda cambios.
9. Vuelve a entrar como cliente para ver la actualización.

---

# 7. Estados disponibles

```text
Solicitud recibida
Revisando diseño
Cotización enviada
Esperando aprobación
Aprobado
Esperando anticipo
En producción
Control de calidad
Listo para entrega
Entregado
Cancelado
```

Cada actualización de estado crea un registro en `OrderHistory`.

---

# 8. WhatsApp a tu número de Guatemala

El backend ya contiene el servicio:

```text
backend/src/services/notifications.js
```

Por defecto, si Twilio no está configurado, cuando entre un pedido nuevo verás una simulación de WhatsApp en la terminal del backend.

Para activar WhatsApp debes completar estas variables en `backend/.env`:

```env
TWILIO_ACCOUNT_SID="TU_ACCOUNT_SID"
TWILIO_AUTH_TOKEN="TU_AUTH_TOKEN"
TWILIO_WHATSAPP_FROM="whatsapp:+NUMERO_AUTORIZADO_POR_TWILIO"
ADMIN_WHATSAPP_TO="whatsapp:+502XXXXXXXX"
```

Ejemplo del número receptor:

```env
ADMIN_WHATSAPP_TO="whatsapp:+50255555555"
```

Nunca subas `.env` a GitHub.

Cuando entre un pedido, el backend enviará al administrador información como:

```text
🧵 NUEVO PEDIDO - BORDADOS GRICEL
Pedido: BG-000001
Cliente: Juan Pérez
Servicio: FLAT_EMBROIDERY
Producto: Gorras
Cantidad: 50
Teléfono: +50255555555
```

> Para producción, Meta/Twilio puede requerir registrar/verificar el remitente y usar plantillas aprobadas según el tipo de mensaje.

---

# 9. Base de datos

Las tablas principales son creadas automáticamente por Prisma:

```text
User
Order
OrderFile
OrderHistory
```

El modelo está en:

```text
backend/prisma/schema.prisma
```

Para abrir Prisma Studio y ver los datos gráficamente:

```bash
cd backend
npx prisma studio
```

Luego abre la URL que aparezca en consola, normalmente:

```text
http://localhost:5555
```

---

# 10. Comandos importantes

## PostgreSQL

Encender:

```bash
docker compose up -d
```

Apagar:

```bash
docker compose down
```

Apagar y borrar todos los datos locales:

```bash
docker compose down -v
```

**Cuidado:** el último comando elimina la base local.

## Backend

```bash
cd backend
npm run dev
```

## Frontend

```bash
cd frontend
npm run dev
```

## Prisma Studio

```bash
cd backend
npx prisma studio
```

---

# 11. Si ya tienes PostgreSQL instalado y NO quieres Docker

Crea una base:

```sql
CREATE DATABASE bordados_gricel;
```

Luego cambia `backend/.env`:

```env
DATABASE_URL="postgresql://TU_USUARIO:TU_PASSWORD@localhost:5432/bordados_gricel?schema=public"
```

Después ejecuta:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

No necesitas crear manualmente las tablas. Prisma lo hace por medio de la migración.

---

# 12. Puertos utilizados

```text
Frontend React:    5173
Backend Node:      4000
PostgreSQL:        5432
Prisma Studio:     5555
```

Si PostgreSQL ya usa el puerto 5432 en tu PC, cambia en `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"
```

Y actualiza `DATABASE_URL`:

```env
DATABASE_URL="postgresql://TU_USUARIO:TU_CONTRASENA@localhost:5433/NOMBRE_BASE?schema=public"
```

---

# 13. Producción

Antes de subirlo a Internet debes, como mínimo:

1. Cambiar `JWT_SECRET`.
2. Cambiar el password del administrador.
3. Usar una contraseña fuerte para PostgreSQL.
4. Mover archivos a Cloudinary/S3 en vez de disco local si el hosting es efímero.
5. Configurar HTTPS.
6. Configurar correctamente CORS con tu dominio real.
7. Usar PostgreSQL administrado en producción.
8. Registrar tu remitente de WhatsApp Business.
9. Agregar recuperación de contraseña y verificación de correo si será público.
10. Crear copias de seguridad de PostgreSQL.

---

# 14. Variables del backend

```env
PORT=4000
DATABASE_URL="postgresql://TU_USUARIO:TU_CONTRASENA@localhost:5432/NOMBRE_BASE?schema=public"
JWT_SECRET="REEMPLAZAR_POR_UN_SECRETO_ALEATORIO_LARGO"
FRONTEND_URL="http://localhost:5173"
ADMIN_NAME="Administrador"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="TU_CONTRASENA_ADMIN"
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_WHATSAPP_FROM="whatsapp:+NUMERO_REMITENTE"
ADMIN_WHATSAPP_TO="whatsapp:+502XXXXXXXX"
```

# 15. Variables del frontend

```env
VITE_API_URL=http://localhost:4000/api
VITE_FILES_URL=http://localhost:4000
```

---

## Primera prueba recomendada

Primero haz que funcione completamente en local **sin configurar Twilio**. Cuando puedas registrar un cliente, crear un pedido y modificarlo desde el CRM, configura WhatsApp. De esa forma es mucho más fácil detectar cualquier problema.
