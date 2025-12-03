import mongoose from 'mongoose';

const autoSchema = new mongoose.Schema({
  marca: {
    type: String,
    required: true,
    trim: true
  },
  modelo: {
    type: String,
    required: true,
    trim: true
  },
  año: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  kilometraje: {
    type: Number,
    required: true,
    min: 0
  },
  combustible: {
    type: String,
    required: true,
    enum: ['Nafta', 'Diesel', 'Eléctrico', 'Híbrido', 'GNC']
  },
  transmision: {
    type: String,
    required: true,
    enum: ['Manual', 'Automática']
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true,
    default: ''
  },
  imagenes: {
    type: [String],
    default: []
  },
  estado: {
    type: String,
    enum: ['Disponible', 'Vendido', 'Reservado'],
    default: 'Disponible'
  },
  publicado: {
    type: Boolean,
    default: true
  },
  destacado: {
    type: Boolean,
    default: false
  },
  nuevoIngreso: {
    type: Boolean,
    default: false
  },
  version: {
    type: String,
    trim: true,
    default: ''
  },
  moneda: {
    type: String,
    enum: ['ARS', 'USD'],
    default: 'ARS'
  }
}, {
  timestamps: true
});

export default mongoose.model('Auto', autoSchema);

