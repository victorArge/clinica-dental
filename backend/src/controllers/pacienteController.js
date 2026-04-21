const PacienteModel = require('../models/pacienteModel');

const PacienteController = {
  async getAll(req, res) {
    try {
      const pacientes = await PacienteModel.getAll();
      res.json(pacientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const paciente = await PacienteModel.getById(req.params.id);
      if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
      res.json(paciente);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const paciente = await PacienteModel.create(req.body);
      res.status(201).json(paciente);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const paciente = await PacienteModel.update(req.params.id, req.body);
      if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
      res.json(paciente);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const paciente = await PacienteModel.delete(req.params.id);
      if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
      res.json({ mensaje: 'Paciente eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = PacienteController;
