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
  },
  // Características Avanzadas
  puertas: { type: Number },
  motor: { type: String, trim: true },
  tipoCarroceria: { type: String, trim: true },
  llantasAleacion: { type: Boolean, default: false },
  tapizadoCuero: { type: Boolean, default: false },
  computadoraAbordo: { type: Boolean, default: false },
  portaVasos: { type: Boolean, default: false },
  direccion: { type: String, trim: true },
  alarma: { type: Boolean, default: false },
  controlTraccion: { type: Boolean, default: false },
  capacidadPersonas: { type: Number },
  potencia: { type: String, trim: true },
  distanciaEjes: { type: String, trim: true },
  capacidadTanque: { type: String, trim: true },
  valvulasPorCilindro: { type: Number },
  frenosABS: { type: Boolean, default: false },
  airbagConductorPasajero: { type: Boolean, default: false },
  largo: { type: String, trim: true },
  altura: { type: String, trim: true },
  ancho: { type: String, trim: true }
}, {
  timestamps: true
});

export default mongoose.model('Auto', autoSchema);

