const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

require('./db/connection');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_NAME = process.env.NODE_NAME || 'unknown';
const LATENCY_MS = parseInt(process.env.LATENCY_MS || '0');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (LATENCY_MS > 0) {
    setTimeout(next, LATENCY_MS);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  res.setHeader('X-Node-Name', NODE_NAME);
  res.setHeader('X-Node-Host', process.env.HOSTNAME || 'local');
  res.setHeader('X-Latency', `${LATENCY_MS}ms`);
  next();
});

const pacienteRoutes = require('./routes/pacienteRoutes');
const medicoRoutes = require('./routes/medicoRoutes');
const citaRoutes = require('./routes/citaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API Clínica Dental funcionando', 
    version: '1.0.0',
    node: NODE_NAME,
    latency: LATENCY_MS,
    hostname: process.env.HOSTNAME || 'local'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    node: NODE_NAME,
    latency: LATENCY_MS,
    uptime: process.uptime()
  });
});

app.use('/api/auth', usuarioRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/citas', citaRoutes);

app.use((err, req, res, next) => {
  console.error('Error detallado:', err);
  res.status(500).json({ error: err.message || 'Algo salió mal!' });
});

app.listen(PORT, () => {
  console.log(`Nodo ${NODE_NAME} corriendo en puerto ${PORT} (latencia: ${LATENCY_MS}ms)`);
});