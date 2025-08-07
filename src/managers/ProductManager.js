import path from 'path';
import Product from '../models/productModel.js';

class ProductManager {
    constructor() {
       
        this.productsFilePath = path.join(path.dirname(new URL(import.meta.url).pathname), '../data/products.json');
    }

    async getProductsPaginated({ limit = 10, page = 1, sort = null, query = null, queryValue = null} = {}) {
        try {
            const filter = {};
            if (query === 'category') {
                filter.category = queryValue;
            } else if (query === 'availability') {
                filter.stock = queryValue === 'available' ? { $gt: 0 } : 0;
            }

            const options = { limit: parseInt(limit), page: parseInt(page), lean: true, sort: {} };

            if (sort === 'asc' || sort === 'desc') { options.sort.price = sort === 'asc' ? 1 : -1; }

            const result = await Product.paginate(filter, options);

            return {
                docs: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage
            };

        } catch (error) {
            console.error('Error en getProductsPaginated:', error);
            throw error;
        }
    }

    async getProducts(limit = null) {
        try {
            const query = Product.find().lean();
            if (limit) query.limit(parseInt(limit));
            return await query;
        } catch (error) {
            console.error('Error en getProducts:', error);
            throw error;
        }
    }

    async saveProducts(productData) {
        try {
            const newProduct = new Product(productData);
            return await newProduct.save();
        } catch (error) {
            console.error('Error en saveProducts:', error);
            throw error;
        }
    }

    async addProduct(productData) {
        return this.saveProducts(productData);
    }
    
    async getProductById(id) {
        try {
            return await Product.findById(id).lean();
        } catch (error) {
            console.error('Error en getProductById:', error);
            throw error;
        }
    }

    async updateProduct(id, updateData) {
        try {
            delete updateData._id;
            return await Product.findByIdAndUpdate(
                id, 
                updateData, 
                { new: true, runValidators: true }
            );
        } catch (error) {
            console.error('Error en updateProduct:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await Product.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error en deleteProduct:', error);
            throw error;
        }
    }
}

export default ProductManager;