import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query, queryValue } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true
        };
        const filter = {};
        if (query && queryValue) {
            if (query === 'category') {
                filter.category = queryValue;
            } else if (query === 'availability') {
                filter.stock = queryValue === 'available' ? { $gt: 0 } : 0;
            }
        }
        if (sort === 'asc' || sort === 'desc') {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }
        const result = await productManager.getProductsPaginated(filter, options);
        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? 
                `${baseUrl}?page=${result.prevPage}&limit=${options.limit}` + 
                (sort ? `&sort=${sort}` : '') + 
                (query ? `&query=${query}&queryValue=${queryValue}` : '') : 
                null,
            nextLink: result.hasNextPage ? 
                `${baseUrl}?page=${result.nextPage}&limit=${options.limit}` + 
                (sort ? `&sort=${sort}` : '') + 
                (query ? `&query=${query}&queryValue=${queryValue}` : '') : 
                null
        };
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

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

export default router;