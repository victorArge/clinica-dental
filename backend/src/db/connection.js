const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_HOSTS = process.env.MONGO_HOSTS || 'localhost:27017';
const MONGO_DB = process.env.MONGO_DB || 'clinica_dental';

const hosts = MONGO_HOSTS.split(',').map(h => h.trim()).join(',');
const mongoUri = `mongodb://${hosts}/${MONGO_DB}`;

mongoose.connect(mongoUri)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

module.exports = mongoose;