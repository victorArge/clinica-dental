# Clinica Dental - Pruebas de Distribución

## Comandos para ejecutar los nodos

### 1. Iniciar todos los servicios (modo normal)
```bash
docker-compose --profile normal up -d
```

### 2. Simular nodo lento (agrega 2 segundos de delay al Node1)
```bash
# Detener node1
docker stop clinica_node1

# Iniciar con delay simulado
docker run --rm -it \
  --network clinica_dental_clinica-net \
  -e NODE_NAME=node1 \
  -e PORT=3000 \
  -e DB_HOST=clinica_db \
  -e DB_PORT=5432 \
  -e DB_NAME=clinica_dental \
  -e DB_USER=postgres \
  -e DB_PASSWORD=2004 \
  --name clinica_node1_lento \
  -p 3001:3000 \
  clinicaDental_backend

# Dentro del contenedor instalar: npm install tiny-delay
# Y modificar index.js para usar el delay
```

### 3. Simular nodo saturado
```bash
# Usar stress tool dentro del contenedor
docker exec clinica_node2 sh -c "apk add --no-cache stress && stress --cpu 1 --timeout 300s"
```

### 4. Apagar un nodo y ver failover
```bash
# Apagar node2
docker stop clinica_node2

# Hacer solicitudes - deberían ir a node1 y node3
for i in {1..10}; do
  curl -s -i http://localhost:8080/api/medicos 2>/dev/null | grep X-Node
done

# Reactivar node2
docker start clinica_node2
```

### 5. Ver logs de qué nodo responde
```bash
docker logs -f clinica_node1
docker logs -f clinica_node2
docker logs -f clinica_node3
```

### 6. Detener todo
```bash
docker-compose down
```

## Endpoints de prueba
- Balanceador: http://localhost:8080
- Node1 directo: http://localhost:3001
- Node2 directo: http://localhost:3002
- Node3 directo: http://localhost:3003
