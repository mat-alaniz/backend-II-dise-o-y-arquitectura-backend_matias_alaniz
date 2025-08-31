import productService from "../services/product.service.js";

export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const result = await productService.getProducts(limit, page, sort, query, req);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error', 
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productService.getProductById(pid);
        res.json({ status: 'success', product });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await productService.createProduct(productData);
        res.status(201).json({ status: 'success', product: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const updateData = req.body;
        const updatedProduct = await productService.updateProduct(pid, updateData);
        res.json({ status: 'success', product: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productService.deleteProduct(pid);
        res.json({ status: 'success', message: 'Producto eliminado', product: deletedProduct });
    } catch (error) {
        res.status(404).json({ status: 'error', error: error.message });
    }
};