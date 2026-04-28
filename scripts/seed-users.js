const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const UsuarioModel = require('./backend/src/models/usuarioModel');
const MedicoModel = require('./backend/src/models/medicoModel');
const PacienteModel = require('./backend/src/models/pacienteModel');

const MONGO_HOST = process.env.MONGO_HOSTS || 'localhost:27017';
const MONGO_DB = process.env.MONGO_DB || 'clinica_dental';

const mongoUri = `mongodb://${MONGO_HOST}/${MONGO_DB}`;

async function seed() {
  await mongoose.connect(mongoUri);
  console.log('Conectado a MongoDB');

  await UsuarioModel.deleteMany({});
  console.log('Usuarios antiguos eliminados');

  const passwordHash = await bcrypt.hash('secretaria123', 10);

  const secretaria = await UsuarioModel.create({
    email: 'secretaria@clinica.com',
    password: passwordHash,
    rol: 'secretaria',
    nombre: 'Maria',
    apellido: 'Gomez'
  });

  const medicos = await MedicoModel.find({}).limit(2);
  const pacientes = await PacienteModel.find({}).limit(2);

  let medicoUser, pacienteUser;

  if (medicos.length > 0) {
    const medicoPasswordHash = await bcrypt.hash('medico123', 10);
    medicoUser = await UsuarioModel.create({
      email: 'medico@clinica.com',
      password: medicoPasswordHash,
      rol: 'medico',
      nombre: medicos[0].nombre,
      apellido: medicos[0].apellido,
      entityId: medicos[0]._id,
      rolModel: 'Medico'
    });
    console.log('Usuario médico creado:', medicoUser.email);
  }

  if (pacientes.length > 0) {
    const pacientePasswordHash = await bcrypt.hash('paciente123', 10);
    pacienteUser = await UsuarioModel.create({
      email: 'paciente@clinica.com',
      password: pacientePasswordHash,
      rol: 'paciente',
      nombre: pacientes[0].nombre,
      apellido: pacientes[0].apellido,
      entityId: pacientes[0]._id,
      rolModel: 'Paciente'
    });
    console.log('Usuario paciente creado:', pacienteUser.email);
  }

  console.log('\n=== Usuarios Demo Creados ===');
  console.log('Secretaria: secretaria@clinica.com / secretaria123');
  console.log('Medico: medico@clinica.com / medico123');
  console.log('Paciente: paciente@clinica.com / paciente123');

  await mongoose.disconnect();
  console.log('\nListo!');
}

seed().catch(e => { console.error(e); process.exit(1); });