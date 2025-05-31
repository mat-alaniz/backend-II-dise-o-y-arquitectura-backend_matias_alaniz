const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/:cid/products', async (req, res) => {
try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);
   if(!cart){
         return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart.products);
} catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos del carrito' });
}
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        const updatedCart = await cartManager.addProductToCart(cartId, productId);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }

        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito', details: error.message });
    }
});

module.exports = router;