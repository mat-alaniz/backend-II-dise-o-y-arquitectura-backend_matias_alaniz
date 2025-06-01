const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        if (!newCart) {
            return res.status(500).json({ error: 'Error al crear el carrito' });
        }
        res.status(201).json({ message: 'Carrito creado exitosamente', cart: newCart });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito', details: error.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.status(200).json({ message: 'Carritos obtenidos exitosamente', carts });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos', details: error.message });
    }
});

router.get('/:cid/products', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.status(200).json({ message: 'Productos del carrito obtenidos exitosamente', products: cart.products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos del carrito', details: error.message });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto agregado al carrito exitosamente', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito', details: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.removeProductFromCart(cid, pid);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado del carrito exitosamente', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito', details: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ error: 'Cantidad inválida' });
        }
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
        res.status(200).json({ message: 'Cantidad del producto actualizada exitosamente', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito', details: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const emptiedCart = await cartManager.clearCart(cid);
        if (!emptiedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.status(200).json({ message: 'Carrito vaciado exitosamente', cart: emptiedCart });
    } catch (error) {
        res.status(500).json({ error: 'Error al vaciar el carrito', details: error.message });
    }
});

module.exports = router;