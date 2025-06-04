const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();
const CartManager = require('../managers/CartManager');
const cartManager = new CartManager();

const getOrCreateCart = async (req, res, next) => {
  try {
    if (!req.session.cartId) {
      const newCart = await cartManager.createCart();
      req.session.cartId = newCart._id.toString();
    }
    next();
  } catch (error) {
    res.status(500).render('error', { message: 'Error al inicializar carrito', error });
  }
};

router.get('/', getOrCreateCart, async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const cart = await cartManager.getCartById(req.session.cartId);

    res.render('home', { products, cartId: req.session.cartId, cartItemCount: cart.products.reduce((sum, item) => sum + item.quantity, 0) });
  } catch (error) {
    res.status(500).render('error', { message: 'Error al cargar productos', error });
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realtimeproducts', { products });
  } catch (error) {
    res.status(500).render('error', { message: 'Error al cargar productos', error });
  }
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).render('error', { message: `Carrito ${req.params.cid} no encontrado` });
    }
    res.render('carts', { cart, title: `Carrito ${cart._id}` });
  } catch (error) { res.status(500).render('error', { message: 'Error al cargar el carrito', error });
  }
});

router.get('/test-cart', async (req, res) => {
  const testCart = {
    _id: '65f1a2b3c4d5e6f7a8b9c0d',
    products: [{
      productId: {
        _id: '65f1a2b3c4d5e6f7a8b9c1d',
        title: 'Producto de Prueba',
        price: 100
      },
      quantity: 2
    }]
  };
  res.render('carts', { cart: testCart });
});

module.exports = router;