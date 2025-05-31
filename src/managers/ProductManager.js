const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor() {
        this.productsFilePath = path.join(__dirname, '../data/products.json');
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.productsFilePath)) {
                const data = await fs.promises.readFile(this.productsFilePath, 'utf-8');
                return JSON.parse(data);
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error leyendo los productos:', error);
            return [];
        }
    }

    async saveProducts(products) {
        try {
            await fs.promises.writeFile(this.productsFilePath, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error('Error guardando los productos:', error);
        }
    }

    async addProduct(productData) {
          if (!productData.title || !productData.description || !productData.code || productData.price <= 0) {
        throw new Error("Faltan campos obligatorios o son inválidos");
    }
        try {
            const products = await this.getProducts();
            const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

            const newProduct = {
                id: newId,
                status: true,
                ...productData,
            };

            products.push(newProduct);
            await this.saveProducts(products);
            return newProduct;
        } catch (error) {
            console.error('Error agregando el producto:', error.message);
            throw new Error('Error agregando el producto');
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === id);
        } catch (error) {
            console.error('Error obteniendo el producto por ID:', error);
            return null;
        }
    }

    async updateProduct(id, updateData) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id === id);

            if (index === -1) {
                return null;
            }

            products[index] = { ...products[index], ...updateData, id };
            await this.saveProducts(products);
            return products[index];
        } catch (error) {
            console.error('Error actualizando el producto:', error);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const newProducts = products.filter(product => product.id !== id);

            if (products.length === newProducts.length) {
                return false;
            }

            await this.saveProducts(newProducts);
            return true;
        } catch (error) {
            console.error('Error eliminando el producto:', error);
            return false;
        }
    }
}

module.exports = ProductManager;

