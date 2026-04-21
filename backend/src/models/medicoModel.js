const pool = require('../db/connection');

const MedicoModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM medicos WHERE estado = true ORDER BY id');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM medicos WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create(data) {
    const { nombre, apellido, especialidad, telefono, email, matricula } = data;
    const result = await pool.query(
      `INSERT INTO medicos (nombre, apellido, especialidad, telefono, email, matricula)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, apellido, especialidad, telefono, email, matricula]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { nombre, apellido, especialidad, telefono, email, matricula } = data;
    const result = await pool.query(
      `UPDATE medicos SET nombre = $1, apellido = $2, especialidad = $3,
       telefono = $4, email = $5, matricula = $6 WHERE id = $7 RETURNING *`,
      [nombre, apellido, especialidad, telefono, email, matricula, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      'UPDATE medicos SET estado = false WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
};

module.exports = MedicoModel;
