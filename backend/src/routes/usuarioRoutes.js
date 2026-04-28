const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

router.post('/register', UsuarioController.register);
router.post('/login', UsuarioController.login);
router.get('/verify', UsuarioController.verifyToken);
router.post('/forgot-password', UsuarioController.forgotPassword);
router.post('/reset-password', UsuarioController.resetPassword);

module.exports = router;