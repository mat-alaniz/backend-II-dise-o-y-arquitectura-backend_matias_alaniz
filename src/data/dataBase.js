const mongoose = require("mongoose");
const connectionDB = async () => {
    try {
        const db = await mongoose.connect('mongodb+srv://matiascaialaniz:PJ0TiOHVQKdeDKCY@cluster0.gal6rlx.mongodb.net/codeProyecto?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Conexión exitosa a la base de datos:', db.connection.name);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

module.exports = connectionDB;