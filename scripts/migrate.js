const { MongoClient } = require('mongodb');

async function migrate() {
  const client = new MongoClient('mongodb://mongo1:27017');
  await client.connect();
  console.log('Connected');

  const sourceDb = client.db('clinicadental');
  const targetDb = client.db('clinica_dental');

  // Copy usuarios
  const users = await sourceDb.collection('usuarios').find().toArray();
  if (users.length > 0) {
    await targetDb.collection('usuarios').deleteMany({});
    await targetDb.collection('usuarios').insertMany(users);
    console.log('Users copied:', users.length);
  } else {
    console.log('No users to copy');
  }

  // Copy medicos
  const medicos = await sourceDb.collection('medicos').find().toArray();
  if (medicos.length > 0) {
    await targetDb.collection('medicos').deleteMany({});
    await targetDb.collection('medicos').insertMany(medicos);
    console.log('Medicos copied:', medicos.length);
  } else {
    console.log('No medicos to copy');
  }

  // Copy pacientes if exists
  const pacientes = await sourceDb.collection('pacientes').find().toArray();
  if (pacientes.length > 0) {
    await targetDb.collection('pacientes').deleteMany({});
    await targetDb.collection('pacientes').insertMany(pacientes);
    console.log('Pacientes copied:', pacientes.length);
  }

  // Copy citas if exists
  const citas = await sourceDb.collection('citas').find().toArray();
  if (citas.length > 0) {
    await targetDb.collection('citas').deleteMany({});
    await targetDb.collection('citas').insertMany(citas);
    console.log('Citas copied:', citas.length);
  }

  // Verify
  const verifyUsers = await targetDb.collection('usuarios').find().toArray();
  console.log('\nVerification - Users in clinica_dental:', verifyUsers.length);

  await client.close();
  console.log('DONE!');
}

migrate().catch(console.error);