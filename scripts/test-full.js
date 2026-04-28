const http = require('http');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo1:27017/clinicadental';

async function testHTTP() {
  const data = JSON.stringify({
    email: 'secretaria@clinica.com',
    password: 'secretaria123'
  });

  // First verify MongoDB connection works
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');

  const UsuarioModel = mongoose.model('Usuario', new mongoose.Schema({
    email: String, password: String, rol: String, nombre: String, apellido: String, activo: Boolean
  }));

  // Verify user exists
  const user = await UsuarioModel.findOne({ email: 'secretaria@clinica.com', activo: true });
  console.log('User in MongoDB:', user ? 'FOUND' : 'NOT FOUND');

  // Now test HTTP API on port 3000
  mongoose.disconnect();

  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log('HTTP Status:', res.statusCode);
        console.log('HTTP Body:', body);
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error('HTTP Error:', e.message);
      resolve();
    });

    req.write(data);
    req.end();
  });
}

testHTTP().catch(console.error);