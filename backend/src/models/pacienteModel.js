const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, maxlength: 100 },
  apellido: { type: String, required: true, maxlength: 100 },
  telefono: { type: String, maxlength: 20 },
  email: { type: String, maxlength: 100 },
  direccion: { type: String },
  fecha_nacimiento: { type: Date },
  fecha_registro: { type: Date, default: Date.now },
  estado: { type: Boolean, default: true }
});

const PacienteModel = mongoose.model('Paciente', pacienteSchema);

PacienteModel.getAll = async () => {
  return await PacienteModel.find({ estado: true }).sort({ _id: 1 });
};

PacienteModel.getById = async (id) => {
  return await PacienteModel.findById(id);
};

PacienteModel.create = async (data) => {
  const paciente = new PacienteModel(data);
  return await paciente.save();
};

PacienteModel.update = async (id, data) => {
  return await PacienteModel.findByIdAndUpdate(id, data, { new: true });
};

PacienteModel.delete = async (id) => {
  return await PacienteModel.findByIdAndUpdate(id, { estado: false }, { new: true });
};

module.exports = PacienteModel;