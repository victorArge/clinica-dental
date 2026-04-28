const UsuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'clinica_dental_secret_key_2024';

const UsuarioController = {
  async register(req, res) {
    try {
      const { email, password, rol, nombre, apellido, entityId, rolModel } = req.body;

      const existingUser = await UsuarioModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const usuario = new UsuarioModel({
        email,
        password: hashedPassword,
        rol,
        nombre,
        apellido,
        entityId,
        rolModel
      });

      await usuario.save();

      const token = jwt.sign(
        { id: usuario._id, email: usuario.email, rol: usuario.rol },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        usuario: {
          id: usuario._id.toString().slice(-8),
          email: usuario.email,
          rol: usuario.rol,
          nombre: usuario.nombre,
          apellido: usuario.apellido
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const usuario = await UsuarioModel.findOne({ email, activo: true });
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const isValidPassword = await bcrypt.compare(password, usuario.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { id: usuario._id, email: usuario.email, rol: usuario.rol },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        usuario: {
          id: usuario._id.toString().slice(-8),
          email: usuario.email,
          rol: usuario.rol,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          entityId: usuario.entityId?.toString(),
          rolModel: usuario.rolModel
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const usuario = await UsuarioModel.findById(decoded.id).select('-password');

      if (!usuario || !usuario.activo) {
        return res.status(401).json({ error: 'Usuario no válido' });
      }

      res.json({
        id: usuario._id.toString().slice(-8),
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        entityId: usuario.entityId?.toString(),
        rolModel: usuario.rolModel
      });
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  }
};

module.exports = UsuarioController;