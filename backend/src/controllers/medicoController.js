const MedicoModel = require('../models/medicoModel');

const MedicoController = {
  async getAll(req, res) {
    try {
      const medicos = await MedicoModel.getAll();
      res.json(medicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const medico = await MedicoModel.getById(req.params.id);
      if (!medico) return res.status(404).json({ error: 'Médico no encontrado' });
      res.json(medico);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const medico = await MedicoModel.create(req.body);
      res.status(201).json(medico);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const medico = await MedicoModel.update(req.params.id, req.body);
      if (!medico) return res.status(404).json({ error: 'Médico no encontrado' });
      res.json(medico);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const medico = await MedicoModel.delete(req.params.id);
      if (!medico) return res.status(404).json({ error: 'Médico no encontrado' });
      res.json({ mensaje: 'Médico eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = MedicoController;
