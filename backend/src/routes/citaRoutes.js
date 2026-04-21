const express = require('express');
const router = express.Router();
const CitaController = require('../controllers/citaController');

router.get('/', CitaController.getAll);
router.get('/:id', CitaController.getById);
router.get('/medico/:medicoId', CitaController.getByMedico);
router.post('/', CitaController.create);
router.put('/:id', CitaController.update);
router.delete('/:id', CitaController.delete);

module.exports = router;
