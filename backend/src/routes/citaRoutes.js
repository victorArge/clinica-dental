const express = require('express');
const router = express.Router();
const CitaController = require('../controllers/citaController');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(CitaController.getAll));
router.get('/:id', asyncHandler(CitaController.getById));
router.get('/medico/:medicoId', asyncHandler(CitaController.getByMedico));
router.post('/', asyncHandler(CitaController.create));
router.put('/:id', asyncHandler(CitaController.update));
router.delete('/:id', asyncHandler(CitaController.delete));

module.exports = router;
