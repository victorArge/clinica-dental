const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/pacienteController');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(PacienteController.getAll));
router.get('/:id', asyncHandler(PacienteController.getById));
router.post('/', asyncHandler(PacienteController.create));
router.put('/:id', asyncHandler(PacienteController.update));
router.delete('/:id', asyncHandler(PacienteController.delete));

module.exports = router;
