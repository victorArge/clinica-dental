# Clínica Dental - Despliegue Local

## Requisitos
- Docker
- Docker Compose

## quickstart (Modo Distribuido)

```bash
# Construir y ejecutar todo
docker-compose --profile distributed up -d

# Acceder a la aplicación
http://localhost:8080
```

## Perfiles disponibles

| Perfil | Servicios |
|--------|-----------|
| `distributed` | MongoDB (3 nodos) + Backend (3 nodos) + Frontend + Nginx |
| `postgres` | PostgreSQL en lugar de MongoDB |

## Puertos

| Servicio | Puerto |
|----------|--------|
| Nginx (API + Frontend) | 8080 |
| Node1 | 3001 |
| Node2 | 3002 |
| Node3 | 3003 |
| Mongo1 | 27017 |
| Mongo2 | 27018 |
| Mongo3 | 27019 |

## Comandos útiles

```bash
# Ver estado
docker-compose --profile distributed ps

# Logs
docker-compose --profile distributed logs -f

# Detener
docker-compose --profile distributed down

# Reconstruir
docker-compose --profile distributed build
docker-compose --profile distributed up -d --force-recreate
```

## Estructura

```
├── backend/        # API Node.js
├── frontend/       # Vue.js app
├── nginx/          # Balanceador
└── docker-compose.yml
```