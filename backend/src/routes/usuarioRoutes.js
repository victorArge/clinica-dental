const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

router.post('/register', UsuarioController.register);
router.post('/login', UsuarioController.login);
router.get('/verify', UsuarioController.verifyToken);

module.exports = router;