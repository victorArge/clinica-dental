const pool = require('../db/connection');

const PacienteModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM pacientes WHERE estado = true ORDER BY id');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM pacientes WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create(data) {
    const { nombre, apellido, telefono, email, direccion, fecha_nacimiento } = data;
    const result = await pool.query(
      `INSERT INTO pacientes (nombre, apellido, telefono, email, direccion, fecha_nacimiento)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, apellido, telefono, email, direccion, fecha_nacimiento]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { nombre, apellido, telefono, email, direccion, fecha_nacimiento } = data;
    const result = await pool.query(
      `UPDATE pacientes SET nombre = $1, apellido = $2, telefono = $3,
       email = $4, direccion = $5, fecha_nacimiento = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [nombre, apellido, telefono, email, direccion, fecha_nacimiento, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      'UPDATE pacientes SET estado = false WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
};

module.exports = PacienteModel;
