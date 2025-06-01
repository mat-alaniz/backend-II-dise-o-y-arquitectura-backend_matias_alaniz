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
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});
router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.status(200).json({ message: 'Carritos obtenidos exitosamente', carts });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos' });
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
    res.status(500).json({ error: 'Error al obtener los productos del carrito' });
}
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
       const { cid, pid } = req.params;
       const actualizarCarrito = await cartManager.addProductToCart(cid, pid);
         if (!actualizarCarrito) {
              return res.status(404).json({ error: 'Carrito o producto no encontrado' });
         }
         res.status(200).json({ message: 'Producto agregado al carrito exitosamente', cart: actualizarCarrito });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito', details: error.message });
    }
});

module.exports = router;