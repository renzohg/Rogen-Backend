import express from 'express';
import Auto from '../models/Auto.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET - Obtener todos los autos (incluyendo no publicados)
router.get('/autos', async (req, res) => {
  try {
    const autos = await Auto.find().sort({ createdAt: -1 });
    res.json(autos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener un auto por ID
router.get('/autos/:id', async (req, res) => {
  try {
    const auto = await Auto.findById(req.params.id);
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }
    res.json(auto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear un nuevo auto
router.post('/autos', async (req, res) => {
  try {
    const auto = new Auto(req.body);
    const savedAuto = await auto.save();
    res.status(201).json(savedAuto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Actualizar un auto
router.put('/autos/:id', async (req, res) => {
  try {
    const auto = await Auto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }
    res.json(auto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Eliminar un auto
router.delete('/autos/:id', async (req, res) => {
  try {
    const auto = await Auto.findByIdAndDelete(req.params.id);
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }
    res.json({ message: 'Auto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

