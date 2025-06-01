# Todo App Backend - Technical Test

## Descripción
Este proyecto es un backend para una aplicación de gestión de tareas (Todo App) desarrollado con NestJS, implementando una arquitectura hexagonal y utilizando GraphQL como API principal, con un endpoint REST para la autenticación.

## URL del Proyecto
El proyecto está desplegado en: https://todo-app-be-production-017b.up.railway.app/

### Documentación
- **API REST (Swagger)**: https://todo-app-be-production-017b.up.railway.app/api
- **GraphQL Playground**: https://todo-app-be-production-017b.up.railway.app/graphql

## Despliegue
El proyecto está desplegado en Railway, una plataforma que simplifica el despliegue y hosting de aplicaciones. Railway proporciona:
- Despliegue automático desde el repositorio
- Base de datos PostgreSQL integrada
- Variables de entorno seguras
- Monitoreo y logs en tiempo real
- Escalabilidad automática

La base de datos PostgreSQL está configurada directamente en Railway, lo que elimina la necesidad de gestionar un contenedor Docker separado en producción. Sin embargo, para desarrollo local, se mantiene la configuración con Docker como se describe en la sección de configuración.

## Tecnologías Principales
- **Arquitectura Hexagonal**: Patrón de arquitectura para mantener el dominio aislado
- **Docker**: Para contenerización de la base de datos i
- **GraphQL**: Lenguaje de consulta para APIs
- **JWT**: Autenticación basada en tokens
- **NestJS**: Framework para construir aplicaciones del lado del servidor
- **PostgreSQL**: Base de datos (contenedorizado con Docker)
- **TypeORM**: ORM para manejo de base de datos
- **TypeScript**: Lenguaje de programación

## Estructura del Proyecto
```
src/
├── context/
│   ├── application/          # Casos de uso
│   │   └── use-cases/
│   │       ├── auth/
│   │       ├── todo/
│   │       └── user/
│   ├── domain/               # Entidades y reglas de negocio
│   │   ├── entities/
│   │   ├── enums/
│   │   ├── interfaces/
│   │   └── tokens/
│   └── infrastructure/       # Implementaciones técnicas
│       ├── adapters/         # Adaptadores para servicios externos
│       ├── auth/             # Implementación de autenticación
│       │   ├── guards/
│       │   └── strategies/
│       ├── graphql/          # Implementación de GraphQL
│       │   ├── dtos/
│       │   ├── models/
│       │   └── resolvers/
│       ├── rest/             # Implementación de REST
│       │   ├── controllers/
│       │   └── dtos/
│       └── repositories/     # Implementaciones de repositorios
```

## Características Implementadas

### Autenticación
- Login mediante endpoint REST
- Generación de token JWT
- Protección de rutas con JwtAuthGuard

### Gestión de Usuarios
- Creación de usuarios
- Autenticación de usuarios
- Validación de credenciales

### Gestión de Tareas (Todos)
- Creación de tareas
- Actualización de tareas
- Eliminación de tareas
- Consulta de tareas por usuario
- Actualización del estado de las tareas (PENDING, IN_PROGRESS, COMPLETED)

## API Endpoints

### REST
```bash
# Login
POST /auth/login
Content-Type: application/json

{
  "email": "email@example.com",
  "password": "password123"
}

# Respuesta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "name": "Nombre Usuario",
    "email": "email@example.com",
    "createdAt": "2024-03-20T12:00:00Z"
  }
}

# Obtener información del usuario actual
GET /auth/user
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Respuesta
{
  "id": "user-id",
  "name": "Nombre Usuario",
  "email": "email@example.com",
  "createdAt": "2024-03-20T12:00:00Z"
}
```

### GraphQL
```graphql
# Crear Usuario
mutation CreateUser {
  createUser(input: {
    name: "Nombre Usuario",
    email: "email@example.com",
    password: "password123"
  }) {
    id
    name
    email
    createdAt
  }
}

# Crear Todo
mutation CreateTodo {
  createTodo(input: {
    title: "Mi tarea",
    description: "Descripción detallada de la tarea",
    userId: "user-id"
  }) {
    id
    title
    description
    userId
    createdAt
    status
  }
}

# Actualizar Todo
mutation UpdateTodo {
  updateTodo(input: {
    id: "todo-id",
    title: "Título actualizado",
    description: "Nueva descripción detallada"
  }) {
    id
    title
    description
    userId
    updatedAt
    status
  }
}

# Eliminar Todo
mutation DeleteTodo {
  deleteTodo(id: "todo-id")
}

# Consultar Todos por Usuario
query todosByUser {
  todosByUser(userId: "user-id") {
    id
    title
    description
    userId
    createdAt
    status
  }
}

# Actualizar Estado del Todo
mutation UpdateTodoStatus {
  updateTodoStatus(input: {
    id: "todo-id",
    status: IN_PROGRESS
  }) {
    id
    title
    description
    status
    userId
    createdAt
    updatedAt
  }
}
```

## Estados Disponibles para Todos
- `PENDING`: Estado inicial de la tarea
- `IN_PROGRESS`: Tarea en progreso
- `COMPLETED`: Tarea completada

## Arquitectura

### Arquitectura Hexagonal
El proyecto implementa una arquitectura hexagonal que:
- Aísla el dominio de la aplicación
- Separa la lógica de negocio de la infraestructura
- Facilita el testing y mantenimiento
- Permite cambiar fácilmente implementaciones técnicas

### Capas
1. **Dominio**: Contiene las entidades y reglas de negocio
2. **Aplicación**: Implementa los casos de uso
3. **Infraestructura**: Proporciona implementaciones técnicas

## Configuración del Proyecto

### Requisitos
- Node.js
- Docker y Docker Compose
- Yarn o npm

### Variables de Entorno
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=123
DB_DATABASE=todo_app
JWT_SECRET=your-secret-key
```

### Docker
El proyecto utiliza Docker para la base de datos PostgreSQL. La configuración se encuentra en el directorio `docker/`:

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: postgres_tasks
    restart: always
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: 123
      POSTGRES_DB: todo_app
    ports:
      - "5432:5432"
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
```

### Instalación
```bash
# Instalar dependencias
yarn install

# Iniciar la base de datos con Docker
docker-compose up -d

# Iniciar el servidor en modo desarrollo
yarn start:dev
```

## Testing
```bash
# Ejecutar tests unitarios
yarn test

# Ejecutar tests e2e
yarn test:e2e
```
