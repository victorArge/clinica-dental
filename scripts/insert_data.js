db.pacientes.insertMany([
  {nombre: "Ana", apellido: "Martínez", telefono: "555-1111", email: "ana@email.com", direccion: "Calle 123", fecha_nacimiento: new Date("1990-05-15"), estado: true},
  {nombre: "Pedro", apellido: "Rodríguez", telefono: "555-2222", email: "pedro@email.com", direccion: "Carrera 45", fecha_nacimiento: new Date("1985-08-22"), estado: true}
]);

db.medicos.insertMany([
  {nombre: "Juan", apellido: "Pérez", especialidad: "Ortodoncia", telefono: "555-1234", email: "juan@clinica.com", matricula: "MAT-001", estado: true},
  {nombre: "María", apellido: "García", especialidad: "Endodoncia", telefono: "555-5678", email: "maria@clinica.com", matricula: "MAT-002", estado: true}
]);

print("Datos insertados correctamente");