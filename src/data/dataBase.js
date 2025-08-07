import mongoose from "mongoose";

const connectionDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log('Conexión exitosa a la base de datos:', db.connection.name);
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

export default connectionDB;