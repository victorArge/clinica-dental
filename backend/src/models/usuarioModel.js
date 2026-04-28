const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['secretaria', 'medico', 'paciente'], required: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  activo: { type: Boolean, default: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, refPath: 'rolModel' },
  rolModel: { type: String, enum: ['Medico', 'Paciente'] }
}, { timestamps: true });

usuarioSchema.index({ email: 1 }, { unique: true });

const UsuarioModel = mongoose.model('Usuario', usuarioSchema);

module.exports = UsuarioModel;