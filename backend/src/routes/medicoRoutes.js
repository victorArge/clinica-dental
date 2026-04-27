const express = require('express');
const router = express.Router();
const MedicoController = require('../controllers/medicoController');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(MedicoController.getAll));
router.get('/:id', asyncHandler(MedicoController.getById));
router.post('/', asyncHandler(MedicoController.create));
router.put('/:id', asyncHandler(MedicoController.update));
router.delete('/:id', asyncHandler(MedicoController.delete));

module.exports = router;
