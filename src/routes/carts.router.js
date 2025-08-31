import express from 'express';
import passport from 'passport'; 
import CartManager from '../managers/CartManager.js';
import { removeProductFromCart, updateProductQuantity, updateCart, clearCart } from '../controllers/cart.controller.js';
import { requireUser, requireCartOwner } from '../middlewares/authorization.js'; 
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

//Crear carrito (cualquiera puede crear un carrito)
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: 'success', message: 'Carrito creado exitosamente', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al crear el carrito', error: process.env.NODE_ENV === 'development' ? error.message : null });
    }
});

// Ver todos los carritos (pero con cuidado con la info sensible)
router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.status(200).json({ status: 'success', message: 'Se han obtenido los carritos exitosamente', payload: carts });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener los carritos', details: error.message });
    }
});
// Ver carrito por ID (pero con información limitada)
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

// SOLO USUARIOS:Agregar producto al carrito 
router.post('/:cid/products/:pid', 
  passport.authenticate('jwt', { session: false }),
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

// SOLO USUARIOS: Eliminar producto del carrito ← AGREGÁ PROTECCIÓN
router.delete('/:cid/products/:pid', 
  passport.authenticate('jwt', { session: false }),
  requireUser,
  requireCartOwner,
  removeProductFromCart
);

// SOLO USUARIOS: Actualizar cantidad ← AGREGÁ PROTECCIÓN
router.put('/:cid/products/:pid', 
  passport.authenticate('jwt', { session: false }),
  requireUser,
  requireCartOwner,
  updateProductQuantity
);

// SOLO USUARIOS: Actualizar carrito ← AGREGÁ PROTECCIÓN
router.put('/:cid', 
  passport.authenticate('jwt', { session: false }), 
  requireUser,                                      
  requireCartOwner,                                 
  updateCart
);

// SOLO USUARIOS: Vaciar carrito ← AGREGÁ PROTECCIÓN
router.delete('/:cid', 
  passport.authenticate('jwt', { session: false }),
  requireUser,
  requireCartOwner,
  clearCart
);

// PÚBLICO: Vista de productos (para el frontend)
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