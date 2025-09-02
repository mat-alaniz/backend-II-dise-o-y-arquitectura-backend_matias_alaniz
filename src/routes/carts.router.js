import express from 'express';
import passport from 'passport'; 
import CartManager from '../managers/CartManager.js';
import { removeProductFromCart, updateProductQuantity, updateCart, clearCart, purchaseCart } from '../controllers/cart.controller.js';
import { requireUser, requireCartOwner } from '../middlewares/authorization.js'; 
import ProductManager from '../managers/ProductManager.js';
import { passportCall } from '../utils.js';

const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

//Crear carrito 
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: 'success', message: 'Carrito creado exitosamente', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al crear el carrito', error: process.env.NODE_ENV === 'development' ? error.message : null });
    }
});

// Ver todos los carritos 
router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.status(200).json({ status: 'success', message: 'Se han obtenido los carritos exitosamente', payload: carts });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener los carritos', details: error.message });
    }
});

// Ver carrito por ID 
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.status(200).json({ status: 'success', message: 'Productos del carrito obtenidos exitosamente', payload: cart.products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener los productos del carrito', error: process.env.NODE_ENV === 'development' ? error.message : null }); 
    }
});

//Agregar producto al carrito 
router.post('/:cid/products/:pid', 
  passportCall("current"),
  requireUser,                                     
  requireCartOwner,                                
  async (req, res) => {
    try {
        const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        if (!updatedCart) {
            return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });
        }
        res.status(200).json({ status: 'success', message: 'Producto agregado al carrito exitosamente', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al agregar el producto al carrito', error: process.env.NODE_ENV === 'development' ? error.message : null });
    }
});

//Eliminar producto del carrito
router.delete('/:cid/products/:pid', 
  passportCall("current"),
  requireUser,
  requireCartOwner,
  removeProductFromCart
);

//Actualizar cantidad
router.put('/:cid/products/:pid', 
  passportCall("current"),
  requireUser,
  requireCartOwner,
  updateProductQuantity
);

//Actualizar carrito
router.put('/:cid', 
  passportCall("current"), 
  requireUser,                                      
  requireCartOwner,                                 
  updateCart
);

// Vaciar carrito
router.delete('/:cid', 
  passportCall("current"),
  requireUser,
  requireCartOwner,
  clearCart
);


// Finalizar compra
router.post('/:cid/purchase', 
  passportCall("current"),
  requireUser,
  requireCartOwner,
  purchaseCart // ← Controlador de compra
);

//Vista de productos
router.get('/products', async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        const cart = await cartManager.getCartById(req.session.cartId);
        const cartCount = cart ? cart.products.reduce((acc, item) => acc + item.quantity, 0) : 0;
        res.render('products', { payload: productos, cartId: req.session.cartId, cartCount });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener los productos', error: process.env.NODE_ENV === 'development' ? error.message : null });
    }
});

export default router;