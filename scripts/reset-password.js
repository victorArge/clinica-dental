const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function resetPassword() {
  await mongoose.connect('mongodb://mongo1:27017/clinica_dental');
  const db = mongoose.connection.db;

  const hash = await bcrypt.hash('medico123', 10);
  await db.collection('usuarios').updateOne(
    {email: 'monserrata@gmail.com'},
    {$set: {password: hash}}
  );
  console.log('Password reseteado para monserrata@gmail.com / medico123');

  mongoose.disconnect();
}

resetPassword().catch(console.error);