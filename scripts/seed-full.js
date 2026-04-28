const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const UsuarioModel = require('./src/models/usuarioModel');
const MedicoModel = require('./src/models/medicoModel');
const PacienteModel = require('./src/models/pacienteModel');
const CitaModel = require('./src/models/citaModel');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo1:27017/clinicadental';

async function seed() {
  console.log('Conectando a:', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log('Conectado!');

  await Promise.all([
    UsuarioModel.deleteMany({}),
    MedicoModel.deleteMany({}),
    PacienteModel.deleteMany({}),
    CitaModel.deleteMany({})
  ]);
  console.log('Datos antiguos eliminados');

  const passwordHash = await bcrypt.hash('secretaria123', 10);
  await UsuarioModel.create({
    email: 'secretaria@clinica.com',
    password: passwordHash,
    rol: 'secretaria',
    nombre: 'Maria',
    apellido: 'Gomez'
  });
  console.log('Secretaria creada');

  const juan = await MedicoModel.create({
    nombre: 'Juan', apellido: 'Perez', especialidad: 'Odontología General',
    telefono: '1234567', email: 'juan@clinica.com', matricula: 'MAT-001'
  });
  console.log('Médico Juan creado:', juan._id);

  const maria = await MedicoModel.create({
    nombre: 'Maria', apellido: 'Lopez', especialidad: 'Ortodoncia',
    telefono: '2345678', email: 'maria@clinica.com', matricula: 'MAT-002'
  });
  console.log('Médico Maria creado:', maria._id);

  const carlos = await PacienteModel.create({
    nombre: 'Carlos', apellido: 'Rodriguez', telefono: '5551234',
    email: 'carlos@email.com', fecha_nacimiento: '1990-05-15', direccion: 'Calle Principal 123'
  });
  console.log('Paciente Carlos creado');

  const medicoHash = await bcrypt.hash('medico123', 10);
  await UsuarioModel.create({
    email: 'juan@clinica.com', password: medicoHash, rol: 'medico',
    nombre: 'Juan', apellido: 'Perez', entityId: juan._id, rolModel: 'Medico'
  });
  await UsuarioModel.create({
    email: 'maria@clinica.com', password: medicoHash, rol: 'medico',
    nombre: 'Maria', apellido: 'Lopez', entityId: maria._id, rolModel: 'Medico'
  });
  console.log('Usuarios de médicos creados');

  const pacienteHash = await bcrypt.hash('paciente123', 10);
  await UsuarioModel.create({
    email: 'paciente@clinica.com', password: pacienteHash, rol: 'paciente',
    nombre: 'Carlos', apellido: 'Rodriguez', entityId: carlos._id, rolModel: 'Paciente'
  });
  console.log('Usuario paciente creado');

  await CitaModel.create({
    paciente_id: carlos._id, medico_id: juan._id,
    fecha_hora: new Date('2026-04-28T10:00:00'), estado: 'programada', motivo: 'Limpieza general'
  });
  await CitaModel.create({
    paciente_id: carlos._id, medico_id: juan._id,
    fecha_hora: new Date('2026-04-29T14:00:00'), estado: 'programada', motivo: 'Revisión'
  });
  await CitaModel.create({
    paciente_id: carlos._id, medico_id: maria._id,
    fecha_hora: new Date('2026-04-30T11:00:00'), estado: 'programada', motivo: 'Consulta ortodoncia'
  });
  console.log('Citas creadas');

  console.log('\n=== CREDENCIALES ===');
  console.log('Secretaria: secretaria@clinica.com / secretaria123');
  console.log('Médico Juan: juan@clinica.com / medico123');
  console.log('Médico Maria: maria@clinica.com / medico123');
  console.log('Paciente: paciente@clinica.com / paciente123');

  await mongoose.disconnect();
  console.log('\nListo!');
}

seed().catch(e => { console.error(e); process.exit(1); });