const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

const { getProducts } = require('../controllers/productController');
router.get('/', getProducts);

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto encontrado', product });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, price, code, stock } = req.body;
        if (!title || !description || !price || !code || !stock) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const newProduct = await productManager.saveProducts({
            title,
            description,
            price: Number(price),
            code,
            stock: Number(stock)
        });
        res.status(201).json({ message: 'Producto creado', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const { title, description, price, code, stock } = req.body;
        if (!title || !description || !price || !code || !stock) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const updatedProduct = await productManager.updateProduct(pid, {
            title,
            description,
            price: Number(price),
            code,
            stock: Number(stock)
        });
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
        res.status(200).json({ message: 'Producto eliminado', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
