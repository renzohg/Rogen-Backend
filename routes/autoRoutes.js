import express from 'express';
import Auto from '../models/Auto.js';
import { getCloudFrontUrls } from '../utils/s3.js';

const router = express.Router();

// Helper function para transformar autos con URLs de CloudFront
function transformAutoImages(auto) {
  if (!auto) return auto;
  
  const autoObj = auto.toObject ? auto.toObject() : auto;
  
  if (autoObj.imagenes && Array.isArray(autoObj.imagenes)) {
    autoObj.imagenes = getCloudFrontUrls(autoObj.imagenes);
  }
  
  return autoObj;
}

// GET - Obtener todos los autos publicados
router.get('/', async (req, res) => {
  try {
    const autos = await Auto.find({ publicado: true, estado: 'Disponible' })
      .sort({ createdAt: -1 });
    const transformedAutos = autos.map(transformAutoImages);
    res.json(transformedAutos);
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
    res.json(transformAutoImages(auto));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

