const pool = require('../db/connection');

const CitaModel = {
  async getAll() {
    const result = await pool.query(`
      SELECT c.*, p.nombre as paciente_nombre, p.apellido as paciente_apellido,
             m.nombre as medico_nombre, m.apellido as medico_apellido, m.especialidad
      FROM citas c
      JOIN pacientes p ON c.paciente_id = p.id
      JOIN medicos m ON c.medico_id = m.id
      ORDER BY c.fecha_hora DESC
    `);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`
      SELECT c.*, p.nombre as paciente_nombre, p.apellido as paciente_apellido,
             m.nombre as medico_nombre, m.apellido as medico_apellido, m.especialidad
      FROM citas c
      JOIN pacientes p ON c.paciente_id = p.id
      JOIN medicos m ON c.medico_id = m.id
      WHERE c.id = $1
    `, [id]);
    return result.rows[0];
  },

  async getByMedico(medicoId) {
    const result = await pool.query(`
      SELECT c.*, p.nombre as paciente_nombre, p.apellido as paciente_apellido
      FROM citas c
      JOIN pacientes p ON c.paciente_id = p.id
      WHERE c.medico_id = $1
      ORDER BY c.fecha_hora
    `, [medicoId]);
    return result.rows;
  },

  async create(data) {
    const { paciente_id, medico_id, fecha_hora, duracion_minutos, motivo } = data;
    const result = await pool.query(
      `INSERT INTO citas (paciente_id, medico_id, fecha_hora, duracion_minutos, motivo)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [paciente_id, medico_id, fecha_hora, duracion_minutos || 30, motivo]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { paciente_id, medico_id, fecha_hora, duracion_minutos, motivo, estado } = data;
    const result = await pool.query(
      `UPDATE citas SET paciente_id = $1, medico_id = $2, fecha_hora = $3,
       duracion_minutos = $4, motivo = $5, estado = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [paciente_id, medico_id, fecha_hora, duracion_minutos, motivo, estado, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM citas WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = CitaModel;
