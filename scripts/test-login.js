const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'clinica_dental_secret_key_2024';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo1:27017/clinicadental';

async function testLogin() {
  await mongoose.connect(MONGO_URI);

  const email = 'secretaria@clinica.com';
  const password = 'secretaria123';

  console.log('Attempting login...');

  const UsuarioModel = mongoose.model('Usuario', new mongoose.Schema({
    email: String, password: String, rol: String, nombre: String, apellido: String, activo: Boolean
  }));

  const usuario = await UsuarioModel.findOne({ email, activo: true });
  console.log('User found:', usuario ? 'SI' : 'NO');
  if (usuario) {
    console.log('Usuario:', { email: usuario.email, rol: usuario.rol, activo: usuario.activo });
    const isValidPassword = await bcrypt.compare(password, usuario.password);
    console.log('Password valido:', isValidPassword);
  }

  mongoose.disconnect();
}

testLogin().catch(console.error);