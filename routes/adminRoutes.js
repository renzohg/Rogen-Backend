import express from 'express';
import Auto from '../models/Auto.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToS3, getCloudFrontUrl, getCloudFrontUrls, extractS3PathFromCloudFrontUrl } from '../utils/s3.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Helper function para transformar autos con URLs de CloudFront
function transformAutoImages(auto) {
  if (!auto) return auto;
  
  const autoObj = auto.toObject ? auto.toObject() : auto;
  
  if (autoObj.imagenes && Array.isArray(autoObj.imagenes)) {
    autoObj.imagenes = getCloudFrontUrls(autoObj.imagenes);
  }
  
  return autoObj;
}

// GET - Obtener todos los autos (incluyendo no publicados)
router.get('/autos', async (req, res) => {
  try {
    const autos = await Auto.find().sort({ createdAt: -1 });
    const transformedAutos = autos.map(transformAutoImages);
    res.json(transformedAutos);
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
    res.json(transformAutoImages(auto));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crear un nuevo auto
router.post('/autos', async (req, res) => {
  try {
    // Convertir URLs de CloudFront a paths de S3 antes de guardar
    const autoData = { ...req.body };
    if (autoData.imagenes && Array.isArray(autoData.imagenes)) {
      autoData.imagenes = autoData.imagenes.map(img => {
        // Si es una URL de CloudFront, extraer el path de S3
        const s3Path = extractS3PathFromCloudFrontUrl(img);
        if (s3Path) return s3Path;
        // Si es imgbb u otra URL externa, mantenerla
        if (img.startsWith('http://') || img.startsWith('https://')) {
          return img;
        }
        // Si ya es un path de S3, mantenerlo
        return img;
      });
    }
    
    const auto = new Auto(autoData);
    const savedAuto = await auto.save();
    res.status(201).json(transformAutoImages(savedAuto));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Actualizar un auto
router.put('/autos/:id', async (req, res) => {
  try {
    // Convertir URLs de CloudFront a paths de S3 antes de guardar
    const autoData = { ...req.body };
    if (autoData.imagenes && Array.isArray(autoData.imagenes)) {
      autoData.imagenes = autoData.imagenes.map(img => {
        // Si es una URL de CloudFront, extraer el path de S3
        const s3Path = extractS3PathFromCloudFrontUrl(img);
        if (s3Path) return s3Path;
        // Si es imgbb u otra URL externa, mantenerla
        if (img.startsWith('http://') || img.startsWith('https://')) {
          return img;
        }
        // Si ya es un path de S3, mantenerlo
        return img;
      });
    }
    
    const auto = await Auto.findByIdAndUpdate(
      req.params.id,
      autoData,
      { new: true, runValidators: true }
    );
    if (!auto) {
      return res.status(404).json({ message: 'Auto no encontrado' });
    }
    res.json(transformAutoImages(auto));
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

// POST - Subir imágenes a S3
router.post('/upload-images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron imágenes' });
    }

    const uploadedData = [];

    for (const file of req.files) {
      const s3Path = await uploadToS3(
        file.buffer,
        file.originalname,
        file.mimetype
      );
      const cloudFrontUrl = getCloudFrontUrl(s3Path);
      uploadedData.push({
        s3Path: s3Path, // Path para almacenar en DB
        url: cloudFrontUrl // URL para preview inmediato
      });
    }

    // Retornar URLs de CloudFront para preview, pero también los paths para almacenar
    res.json({ 
      success: true, 
      urls: uploadedData.map(item => item.url), // URLs para preview
      paths: uploadedData.map(item => item.s3Path), // Paths para almacenar en DB
      message: `${uploadedData.length} imagen(es) subida(s) exitosamente`
    });
  } catch (error) {
    console.error('Error al subir imágenes:', error);
    res.status(500).json({ message: 'Error al subir imágenes: ' + error.message });
  }
});

export default router;
