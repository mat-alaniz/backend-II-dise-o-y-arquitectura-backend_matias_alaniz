
import { create } from 'express-handlebars';
import Product from '../models/product.model.js';

export class productRepository {
    //busca todos los productos con filtros
    async findAll(filter = {}, options ={}) {
        try {
            return await Product.find(filter)
            .limit(options.limit || 10)
            .skip(options.skip || 0)
            .sort(options.sort || { createdAt: -1 });
        } catch (error) {
            throw new Error(`Error al buscar productos: ${error.message}`);
        }
    }
    //busca producto por id
    async findById(id) {
        try {
            const product = await Product.findById(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error(`Error al buscar producto por ID: ${error.message}`);
        }
    }
    //crear nuevo producto
      async create(productData) {
        try {
            const newProduct = new Product(productData);
            return await newProduct.save();
        } catch (error) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }
   // actualizar producto
      async update(id, productData) {
       try {
           const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true, runValidators: true });
           if (!updatedProduct) {
               throw new Error('Producto no encontrado');
           }
           return updatedProduct;
       } catch (error) {
           throw new Error(`Error al actualizar producto: ${error.message}`);
       }
   }

   // eliminar producto
   async delete(id) {
       try {
           const deletedProduct = await Product.findByIdAndDelete(id);
           if (!deletedProduct) {
               throw new Error('Producto no encontrado');
           }
           return deletedProduct;
       } catch (error) {
           throw new Error(`Error al eliminar producto: ${error.message}`);
       }
   }

   // contar producto con filtros
   async count(filter = {}) {
       try {
           return await Product.countDocuments(filter);
       } catch (error) {
           throw new Error(`Error al contar productos: ${error.message}`);
       }
   }

}
export default new productRepository();