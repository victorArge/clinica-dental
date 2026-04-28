const mongoose = require('mongoose');

async function debug() {
  await mongoose.connect('mongodb://mongo1:27017/clinicadental');
  const db = mongoose.connection.db;

  const user = await db.collection('usuarios').findOne({email: 'secretaria@clinica.com'});
  console.log('User document:', JSON.stringify(user, null, 2));

  mongoose.disconnect();
}

debug().catch(console.error);