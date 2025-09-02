import User from '../models/userModel.js';

export class UserRepository {
    // Crear usuario
    async create(userData) {
        try {
            const user = new User(userData);
            return await user.save();
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    // Buscar usuario por email
    async findByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw new Error(`Error al buscar usuario por email: ${error.message}`);
        }
    }

    // Buscar usuario por id
    async findById(id) {
        try {
            const user = await User.findById(id);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return user;
        } catch (error) {
            throw new Error(`Error al buscar usuario por ID: ${error.message}`);
        }
    }

    // Actualizar usuario
    async update(id, userData) {
        try {
            const updatedUser = await User.findByIdAndUpdate(id, userData, { 
                new: true, 
                runValidators: true 
            });
            if (!updatedUser) {
                throw new Error('Usuario no encontrado');
            }
            return updatedUser;
        } catch (error) {
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    // Eliminar usuario
    async delete(id) {
        try {
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                throw new Error('Usuario no encontrado');
            }
            return deletedUser;
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }
}

export default new UserRepository();