import { Router } from 'express';
import passport from 'passport';
import { requireAdmin } from '../middlewares/authorization.js'; 
import ProductManager from '../managers/ProductManager.js';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { passportCall } from '../utils.js';

const router = Router();
const productManager = new ProductManager();


// Todos pueden ver productos
router.get('/', getProducts);

//  Ver producto por ID
router.get('/:pid', getProductById);

// SOLO ADMIN: Crear producto
router.post('/', 
  passportCall("current"),
  requireAdmin,
  createProduct
);

// SOLO ADMIN: Actualizar producto
router.put('/:pid', 
  passportCall("current"),
  requireAdmin,
  updateProduct
);

//  SOLO ADMIN: Eliminar producto
router.delete('/:pid', 
  passportCall("current"),
  requireAdmin,
  deleteProduct
);

export default router;