const CitaModel = require('../models/citaModel');

const CitaController = {
  async getAll(req, res) {
    try {
      const citas = await CitaModel.getAll();
      res.json(citas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const cita = await CitaModel.getById(req.params.id);
      if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
      res.json(cita);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getByMedico(req, res) {
    try {
      const citas = await CitaModel.getByMedico(req.params.medicoId);
      res.json(citas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const cita = await CitaModel.create(req.body);
      res.status(201).json(cita);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const cita = await CitaModel.update(req.params.id, req.body);
      if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
      res.json(cita);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const cita = await CitaModel.delete(req.params.id);
      if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
      res.json({ mensaje: 'Cita eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = CitaController;
