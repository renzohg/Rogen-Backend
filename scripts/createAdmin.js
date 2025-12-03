import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://admin:yFf0pYT4FbnpJzoM@cluster0.lajcurg.mongodb.net/rogen-autos?retryWrites=true&w=majority');
    console.log('Conectado a MongoDB');

    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`El usuario "${username}" ya existe`);
      process.exit(0);
    }

    const admin = new Admin({ username, password });
    await admin.save();
    console.log(`Admin creado exitosamente:`);
    console.log(`Usuario: ${username}`);
    console.log(`Contraseña: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();

