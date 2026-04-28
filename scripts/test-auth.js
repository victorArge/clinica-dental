const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function test() {
  await mongoose.connect('mongodb://mongo1:27017/clinicadental');
  const db = mongoose.connection.db;

  const user = await db.collection('usuarios').findOne({email: 'secretaria@clinica.com'});
  console.log('User found:', user ? 'SI' : 'NO');
  console.log('Hash:', user ? user.password.substring(0, 30) : 'N/A');

  if (user) {
    const valid = await bcrypt.compare('secretaria123', user.password);
    console.log('Password valido:', valid);
  }

  mongoose.disconnect();
}

test().catch(console.error);