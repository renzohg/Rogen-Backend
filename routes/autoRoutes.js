import express from 'express';
import Auto from '../models/Auto.js';

const router = express.Router();

// GET - Obtener todos los autos publicados
router.get('/', async (req, res) => {
  try {
    const autos = await Auto.find({ publicado: true, estado: 'Disponible' })
      .sort({ createdAt: -1 });
    res.json(autos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtener un auto por ID
router.get('/:id', async (req, res) => {
  try {
    const auto = await Auto.findById(req.params.id);
    if (!auto || !auto.publicado) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }
    res.json(auto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

