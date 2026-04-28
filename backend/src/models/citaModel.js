const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  paciente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' },
  medico_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico' },
  fecha_hora: { type: Date, required: true },
  duracion_minutos: { type: Number, default: 30 },
  motivo: { type: String },
  estado: { type: String, default: 'programada' }
}, { timestamps: true });

const CitaModel = mongoose.model('Cita', citaSchema);

CitaModel.getAll = async () => {
  const citas = await CitaModel.find()
    .populate('paciente_id', 'nombre apellido')
    .populate('medico_id', 'nombre apellido especialidad')
    .sort({ fecha_hora: -1 });
  return citas.map(c => ({
    id: c._id.toString().slice(-8),
    _id: c._id,
    paciente_id: c.paciente_id?._id,
    paciente_nombre: c.paciente_id?.nombre || '',
    paciente_apellido: c.paciente_id?.apellido || '',
    medico_id: c.medico_id?._id,
    medico_nombre: c.medico_id?.nombre || '',
    medico_apellido: c.medico_id?.apellido || '',
    fecha_hora: c.fecha_hora,
    duracion_minutos: c.duracion_minutos,
    motivo: c.motivo,
    estado: c.estado,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt
  }));
};

CitaModel.getById = async (id) => {
  return await CitaModel.findById(id)
    .populate('paciente_id', 'nombre apellido')
    .populate('medico_id', 'nombre apellido especialidad');
};

CitaModel.getByMedico = async (medicoId) => {
  return await CitaModel.find({ medico_id: medicoId })
    .populate('paciente_id', 'nombre apellido')
    .sort({ fecha_hora: 1 });
};

CitaModel.create = async (data) => {
  const cita = new CitaModel(data);
  return await cita.save();
};

CitaModel.update = async (id, data) => {
  return await CitaModel.findByIdAndUpdate(id, data, { new: true });
};

CitaModel.delete = async (id) => {
  return await CitaModel.findByIdAndDelete(id);
};

module.exports = CitaModel;