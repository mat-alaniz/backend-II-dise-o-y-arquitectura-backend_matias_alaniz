const fs = require('fs');
const path = require('path');
const product = require('../modelo/productModel');

class ProductManager {
    constructor() {
        this.productsFilePath = path.join(__dirname, '../data/products.json');
    }

    async getProducts(limit = null) {
        try {
            let query = product.find();
            if (limit) {
                query = query.limit(limit);
            }
            return await query.lean();

        } catch (error) {
            console.error('Error leyendo los productos:', error);
            return [];
        }
    }

    async saveProducts(products) {
        try {
            
            const newProducts = new product(products);
            return await newProducts.save();
        } catch (error) {
            console.error('Error guardando los productos:', error);
        }
    }

    async addProduct(productData) {
        return this.saveProducts(productData);
    }
    
    async getProductById(id) {
        try {
            const products = await product.findById(id).lean();
            if (!products) {
                return null;
            }
            return products;
        } catch (error) {
            console.error('Error obteniendo el producto por ID:', error);
            return null;
        }
    }

    async updateProduct(id, updateData) {
        try {
            delete updateData.id;
            const actualizarProduct = await product.findByIdAndUpdate(id, updateData, { new: true });
            return actualizarProduct;
        } catch (error) {
            console.error('Error actualizando el producto:', error);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
           
            const eliminarProduct = await product.findByIdAndDelete(id);
            return eliminarProduct;
        } catch (error) {
            console.error('Error eliminando el producto:', error);
            return false;
        }
    }
}

module.exports = ProductManager;

