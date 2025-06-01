const fs = require('fs');
const path = require('path');
const modeloCart = require('../modelo/cartModel');
const modeloProduct = require('../modelo/productModel');

class CartManager {
    constructor() {
        this.cartsFilePath = path.join(__dirname, '../data/carts.json');
    }

    async getCarts() {
        try {
            const todosCarts = await modeloCart.find().populate('products.productId');
            return todosCarts;
            
        } catch (error) {
            console.error('Error leyendo los carritos:', error);
            return [];
        }
    }

    async createCart() {
        try {
            const newCart = new modeloCart({ products: [] });
            const saveCarts = await newCart.save();
            return saveCarts;
        } catch (error) {
            console.error('Error creando el carrito:', error);
            return null;
        }
    }

    async getCartById(cartId) {
        try {
        const cart = await modeloCart.findById(cartId).populate('products.productId');
        return cart;
        } catch (error) {
            console.error('Error obteniendo el carrito por ID:', error);
            return null;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
           const product = await modeloProduct.findById(productId);
           if (!product) {
               throw new Error('Producto no encontrado');
            }
            const cart = await modeloCart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            const verificarProducto = cart.products.find(p => p.productId.toString() === productId);
            if (verificarProducto) {
                verificarProducto.quantity += 1; 
            } else {
                cart.products.push({ productId: productId, quantity: 1 });
            }
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error agregando producto al carrito:', error);
            return null;
        }
    }
}

module.exports = CartManager;