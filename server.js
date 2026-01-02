import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import autoRoutes from './routes/autoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/autos', autoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Rogen Autos funcionando' });
});

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log('Servidor corriendo en puerto', PORT);
    });
  })
  .catch((error) => {
    console.error('Error conectando a MongoDB:', error);
  });

export default app;
