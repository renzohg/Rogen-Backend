# Backend - Rogen Autos API

API REST desarrollada con Express y MongoDB para el catálogo de autos.

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` con las siguientes variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rogen-autos
JWT_SECRET=tu_secreto_super_seguro_aqui
```

## Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Crear Admin Inicial

Puedes crear un usuario administrador usando la ruta:

```bash
POST /api/auth/create-admin
Content-Type: application/json

{
  "username": "admin",
  "password": "tu_contraseña"
}
```

O crear directamente en MongoDB:

```javascript
db.admins.insertOne({
  username: "admin",
  password: "$2a$10$..." // hash bcrypt de tu contraseña
})
```

