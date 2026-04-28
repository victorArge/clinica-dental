const UsuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'clinica_dental_secret_key_2024';

const recoveryCodes = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const UsuarioController = {
  async register(req, res) {
    try {
      const { email, password, rol, nombre, apellido, telefono } = req.body;

      const existingUser = await UsuarioModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let entityId = null;
      let rolModel = null;

      if (rol === 'paciente') {
        const PacienteModel = require('../models/pacienteModel');
        const paciente = new PacienteModel({
          nombre,
          apellido,
          email,
          telefono,
          activo: true
        });
        await paciente.save();
        entityId = paciente._id;
        rolModel = 'Paciente';
      }

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

      res.status(201).json({
        message: 'Cuenta creada exitosamente',
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
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const usuario = await UsuarioModel.findOne({ email, activo: true });
      if (!usuario) {
        return res.status(404).json({ error: 'No existe usuario con ese email' });
      }
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      recoveryCodes.set(email, { code, expires: Date.now() + 15 * 60 * 1000 });

      if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
        await transporter.sendMail({
          from: `"Clínica Dental" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: 'Código de recuperación de contraseña',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #1a365d;">Recuperación de Contraseña</h2>
              <p>Hola ${usuario.nombre} ${usuario.apellido},</p>
              <p>Recibiste este email porque solicitaste recuperar tu contraseña.</p>
              <div style="background: #f0f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="font-size: 24px; letter-spacing: 4px; margin: 0;"><strong>${code}</strong></p>
              </div>
              <p>Este código expira en <strong>15 minutos</strong>.</p>
              <p>Si no solicitaste este cambio, ignora este email.</p>
            </div>
          `
        });
        res.json({ message: 'Código enviado a tu email' });
      } else {
        console.log(`[RECUPERACION] Codigo para ${email}: ${code}`);
        res.json({ message: 'Código de recuperación (demo): ' + code });
      }
    } catch (error) {
      console.error('Error enviando email:', error);
      res.status(500).json({ error: 'Error al enviar el email: ' + error.message });
    }
  },

  async resetPassword(req, res) {
    try {
      const { email, code, newPassword } = req.body;
      const stored = recoveryCodes.get(email);
      if (!stored || stored.code !== code || stored.expires < Date.now()) {
        return res.status(400).json({ error: 'Código inválido o expirado' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UsuarioModel.findOneAndUpdate({ email }, { password: hashedPassword });
      recoveryCodes.delete(email);
      res.json({ message: 'Contraseña actualizada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = UsuarioController;