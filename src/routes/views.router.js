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

router.get('/carts/', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).send('Carrito ');
    }
     res.render('carts', { 
      cart,
      title: `Carrito ${cart._id}` 
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Error al cargar el carrito', error });
  }
});
// En views.router.js (ruta temporal)
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