const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/pacienteController');

router.get('/', PacienteController.getAll);
router.get('/:id', PacienteController.getById);
router.post('/', PacienteController.create);
router.put('/:id', PacienteController.update);
router.delete('/:id', PacienteController.delete);

module.exports = router;
