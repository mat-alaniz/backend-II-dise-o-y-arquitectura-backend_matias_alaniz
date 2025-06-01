const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();
const CartManager = require('../managers/CartManager');
const cartManager = new CartManager();

router.get('/', async(req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realtimeproducts', { products });
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).send('Error al cargar el carrito');
  }
});

module.exports = router;