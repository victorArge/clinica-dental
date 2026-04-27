const mongoose = require('mongoose');

const medicoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, maxlength: 100 },
  apellido: { type: String, required: true, maxlength: 100 },
  especialidad: { type: String, required: true, maxlength: 100 },
  telefono: { type: String, maxlength: 20 },
  email: { type: String, maxlength: 100 },
  matricula: { type: String, required: true, maxlength: 50 },
  estado: { type: Boolean, default: true }
});

medicoSchema.index({ matricula: 1 }, { unique: true });

const MedicoModel = mongoose.model('Medico', medicoSchema);

MedicoModel.getAll = async () => {
  return await MedicoModel.find({ estado: true }).sort({ _id: 1 });
};

MedicoModel.getById = async (id) => {
  return await MedicoModel.findById(id);
};

MedicoModel.create = async (data) => {
  const medico = new MedicoModel(data);
  return await medico.save();
};

MedicoModel.update = async (id, data) => {
  return await MedicoModel.findByIdAndUpdate(id, data, { new: true });
};

MedicoModel.delete = async (id) => {
  return await MedicoModel.findByIdAndUpdate(id, { estado: false }, { new: true });
};

module.exports = MedicoModel;