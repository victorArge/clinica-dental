const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_HOSTS = process.env.MONGO_HOSTS || 'localhost:27017';
const MONGO_DB = process.env.MONGO_DB || 'clinica_dental';
const MONGO_REPLICA_SET = process.env.MONGO_REPLICA_SET || '';

const hosts = MONGO_HOSTS.split(',').map(h => h.trim()).join(',');
let mongoUri;

if (MONGO_REPLICA_SET) {
  mongoUri = `mongodb://${hosts}/${MONGO_DB}?replicaSet=${MONGO_REPLICA_SET}`;
} else {
  mongoUri = `mongodb://${hosts}/${MONGO_DB}`;
}

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

mongoose.connect(mongoUri, options)
  .then(() => console.log('Conectado a MongoDB Replica Set'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

module.exports = mongoose;