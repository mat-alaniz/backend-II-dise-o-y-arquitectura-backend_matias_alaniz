const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.getProducts(limit);
        res.status(200).json({ message: 'Lista de productos', products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
       const productId = await productManager.getProductById( pid )
        if (!productId) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto encontrado', product: productId });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    try {
      const { title, description, price, code, stock } = req.body;
      const newProduct = await productManager.saveProducts({ title, description, price, code, stock });
      res.status(201).json({ message: 'Producto creado', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const { title, description, price, code, stock } = req.body;
      const updatedProduct = await productManager.updateProduct(pid, { title, description, price, code, stock });
      if (!updatedProduct) {
          return res.status(404).json({ error: 'Producto no encontrado para ser actualizado' });
      }
      res.status(200).json({ message: 'Producto actualizado', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productManager.deleteProduct(pid);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado para ser eliminado' });
        }
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
