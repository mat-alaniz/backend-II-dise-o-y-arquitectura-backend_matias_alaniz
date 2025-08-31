import { Router } from 'express';
import passport from 'passport';
import { requireAdmin } from '../middlewares/authorization.js'; 
import ProductManager from '../managers/ProductManager.js';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
const router = Router();
const productManager = new ProductManager();


// Todos pueden ver productos
router.get('/', getProducts);

//  Ver producto por ID
router.get('/:pid', getProductById);

// SOLO ADMIN: Crear producto
router.post('/', 
  passport.authenticate('jwt', { session: false }),
  requireAdmin,
  createProduct
);

// 🔐 SOLO ADMIN: Actualizar producto
router.put('/:pid', 
  passport.authenticate('jwt', { session: false }),
  requireAdmin,
  updateProduct
);

// 🔐 SOLO ADMIN: Eliminar producto
router.delete('/:pid', 
  passport.authenticate('jwt', { session: false }),
  requireAdmin,
  deleteProduct
);

export default router;