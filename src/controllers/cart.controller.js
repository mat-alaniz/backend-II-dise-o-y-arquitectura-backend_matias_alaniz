const Cart = require('../modelo/cartModel');

const deleteProductFromCart = async (req, res) => {
    try { 
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }
        cart.products.splice(productIndex, 1);
        await cart.save();

        const updatedCart = await Cart.findById(cid).populate('products.product');
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor', error: process.env.NODE_ENV === 'development' ? error.message : null });
    }
};

const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ status: 'error', message: 'La cantidad debe ser un número positivo' });
        }
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        const productToUpdate = cart.products.find(item => item.product.toString() === pid);
        if (!productToUpdate) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }
        productToUpdate.quantity = quantity;
        await cart.save();
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor', error: process.env.NODE_ENV === 'development' ? error.message : null });
    }       
};

module.exports = {
    deleteProductFromCart,
    updateProductQuantity
};
