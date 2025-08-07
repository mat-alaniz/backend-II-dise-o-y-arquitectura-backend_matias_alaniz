import CartManager from '../managers/CartManager.js';
import mongoose from 'mongoose';
const cartManager = new CartManager();

export const deleteProductFromCart = async (req, res) => {
    try { 
        const { cid, pid } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).json({ status: 'error', message: 'ID de carrito no válido' });
        }

        const updatedCart = await cartManager.removeProductFromCart(cid, pid);
        if (!updatedCart) {
            return res.status(404).json({ status: 'error', message: 'No se ha podido eliminar el producto' });
        }
        res.status(200).json({ status: 'success', message: 'Producto eliminado exitosamente', payload: updatedCart });
    } catch (error) {
        console.error('Error en deleteProductFromCart:', error);
        res.status(500).json({ status: 'error', message: error.message || 'Error al eliminar el producto', error: process.env.NODE_ENV === 'development' ? error : null });
    }
};

export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ status: 'error', message: 'La cantidad debe ser un número positivo' });
        }

        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);

        if (!updatedCart) {
            return res.status(404).json({ status: 'error', message: 'No se ha podido actualizar la cantidad' });
        }

        res.status(200).json({ status: 'success', message: 'Cantidad actualizada exitosamente', payload: updatedCart });
    } catch (error) {
        console.error('Error en updateProductQuantity:', error);
        res.status(500).json({ status: 'error', message: error.message || 'Error al actualizar cantidad', error: process.env.NODE_ENV === 'development' ? error : null });
    }       
};

export const updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({ status: 'error', message: 'Los productos deben ser un arreglo' });
        }

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).json({ status: 'error', message: 'ID de carrito no válido' });
        }

        const updatedCart = await cartManager.updateAllCartProducts(cid, products);
        if (!updatedCart) {
            return res.status(404).json({ status: 'error', message: 'No se ha podido actualizar el carrito' });
        }
        res.status(200).json({ status: 'success', message: 'Carrito actualizado exitosamente', payload: updatedCart });
    } catch (error) {
        console.error('Error en updateCart:', error);
        res.status(500).json({ status: 'error', message: error.message || 'Error al actualizar carrito', error: process.env.NODE_ENV === 'development' ? error : null });
    }
};

export const clearCart = async (req, res) => {
    try {
        const { cid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).json({ status: 'error', message: 'ID de carrito no válido' });
        }

        const emptiedCart = await cartManager.clearCart(cid);

        if (!emptiedCart) {
            return res.status(404).json({ status: 'error', message: 'No se ha podido vaciar el carrito' });
        }

        res.status(200).json({ status: 'success', message: 'Carrito vaciado exitosamente', payload: emptiedCart });
    } catch (error) {
        console.error('Error en clearCart:', error);
        res.status(500).json({ status: 'error', message: error.message || 'Error al vaciar carrito', error: process.env.NODE_ENV === 'development' ? error : null });
    }
};


export default cartManager;