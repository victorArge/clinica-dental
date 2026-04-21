#!/bin/bash

echo "=========================================="
echo "  CLÍNICA DENTAL - PRUEBAS DE DISTRIBUCIÓN"
echo "=========================================="
echo ""

BASE_URL="http://localhost:8080"

echo "1. Verificando estado del balanceador..."
curl -s "$BASE_URL/health" || echo "Balanceador no disponible"
echo ""

echo "2. Solicitudes al API (verifica qué nodo responde)..."
echo "   Solicitud 1:"
curl -s -i "$BASE_URL/api/medicos" 2>/dev/null | grep -E "X-Node|HTTP"
echo ""

echo "   Solicitud 2:"
curl -s -i "$BASE_URL/api/medicos" 2>/dev/null | grep -E "X-Node|HTTP"
echo ""

echo "   Solicitud 3:"
curl -s -i "$BASE_URL/api/medicos" 2>/dev/null | grep -E "X-Node|HTTP"
echo ""

echo "3. Verificando nodos directamente..."
echo "   Node1:"
curl -s "http://localhost:3001/" 2>/dev/null || echo "Node1 no disponible"
echo ""

echo "   Node2:"
curl -s "http://localhost:3002/" 2>/dev/null || echo "Node2 no disponible"
echo ""

echo "   Node3:"
curl -s "http://localhost:3003/" 2>/dev/null || echo "Node3 no disponible"
echo ""

echo "=========================================="
echo "  PRUEBA COMPLETADA"
echo "=========================================="
