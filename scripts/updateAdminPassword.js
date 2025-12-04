import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const updateAdminPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://admin:yFf0pYT4FbnpJzoM@cluster0.lajcurg.mongodb.net/rogen-autos?retryWrites=true&w=majority');
        console.log('Conectado a MongoDB');

        const username = process.argv[2] || 'admin';
        const newPassword = process.argv[3] || 'admin123';

        const admin = await Admin.findOne({ username });
        if (!admin) {
            console.log(`El usuario "${username}" no existe`);
            process.exit(1);
        }

        admin.password = newPassword;
        await admin.save();
        console.log(`Contraseña actualizada exitosamente para el usuario: ${username}`);
        console.log(`Nueva contraseña: ${newPassword}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateAdminPassword();
