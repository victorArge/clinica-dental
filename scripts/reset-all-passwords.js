const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function resetPasswords() {
  await mongoose.connect('mongodb://mongo1:27017/clinica_dental');
  const db = mongoose.connection.db;

  const hash = await bcrypt.hash('secretaria123', 10);
  await db.collection('usuarios').updateOne(
    {email: 'secretaria@clinica.com'},
    {$set: {password: hash}}
  );
  console.log('Password reseteado: secretaria@clinica.com / secretaria123');

  const medHash = await bcrypt.hash('medico123', 10);
  const medicos = ['juan@clinica.com', 'maria@clinica.com', 'monserrata@gmail.com', 'alejandro23argu@gmail.com'];
  for (const email of medicos) {
    await db.collection('usuarios').updateOne(
      {email: email},
      {$set: {password: medHash}}
    );
    console.log('Password reseteado:', email, '/ medico123');
  }

  mongoose.disconnect();
  console.log('Listo!');
}

resetPasswords().catch(console.error);