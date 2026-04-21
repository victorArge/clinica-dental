# ============================================
# PRUEBAS DE DISTRIBUCIÓN - CLÍNICA DENTAL
# ============================================

## MODO NORMAL (todos los nodos activos)
```powershell
docker-compose --profile normal up -d
```

## SIMULAR NODO LENTO (agregar 2 segundos de delay a node1)
```powershell
# Opción 1: Recompilar con latencia
docker-compose --profile lento up -d

# Opción 2: Modificar variable de entorno en vivo
docker exec -e LATENCY_MS=2000 clinica_node1 sh -c "apk add > /dev/null && killall node; node src/index.js"

# O más simple: modificar y reiniciar
docker stop clinica_node1
docker run -d --name clinica_node1 --network clinica_dental_clinica-net -e NODE_NAME=node1 -e LATENCY_MS=2000 -e DB_HOST=clinica_db -e DB_PORT=5432 -e DB_NAME=clinica_dental -e DB_USER=postgres -e DB_PASSWORD=2004 -p 3001:3000 clinicadental-node1:latest
```

## SIMULAR NODO SATURADO (usar recursos limitados)
```powershell
# Limitar CPU del node2
docker update --cpus="0.1" clinica_node2

# O agregar carga artificial
docker exec clinica_node2 sh -c "apk add --no-cache curl && yes > /dev/null &"
```

## PRUEBAS DE CARGA
```powershell
# Solicitudes simples
1..50 | ForEach-Object { 
  curl http://localhost:8080/api/medicos -UseBasicParsing | Select-String "X-Node-Name"
}

# Medir tiempo de respuesta
Measure-Command { curl http://localhost:8080/api/medicos -UseBasicParsing }
```

## VERIFICAR LATENCIA EN RESPUESTAS
```powershell
curl -i http://localhost:8080/api/pacientes -UseBasicParsing | Select-String "X-Latency"
```

## COMANDOS ÚTILES
```powershell
# Ver qué nodos están activos
docker ps --format "table {{.Names}}\t{{.Status}}"

# Ver logs de todos los nodos
docker logs clinica_node1
docker logs clinica_node2
docker logs clinica_node3

# Detener todo
docker-compose --profile normal down
```