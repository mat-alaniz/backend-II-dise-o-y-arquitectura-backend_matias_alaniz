const modeloCart = require('../modelo/cartModel');
const modeloProduct = require('../modelo/productModel');

class CartManager {
    async getCarts() {
        try {
            return await modeloCart.find().populate('products.productId');
        } catch (error) {
            console.error('Error leyendo los carritos:', error);
            return [];
        }
    }

    async createCart() {
        try {
            const newCart = new modeloCart({ products: [] });
            return await newCart.save();
        } catch (error) {
            console.error('Error creando el carrito:', error);
            return null;
        }
    }

    async getCartById(cartId) {
        try {
            return await modeloCart.findById(cartId).populate('products.productId');
        } catch (error) {
            console.error('Error obteniendo el carrito por ID:', error);
            return null;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const product = await modeloProduct.findById(productId);
            if (!product) throw new Error('Producto no encontrado');
            const cart = await modeloCart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');
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

    async removeProductFromCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        if (!cart) return null;
        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        await cart.save();
        return cart;
    }

    async updateAllCartProducts(cartId, newProducts) {
        const cart = await this.getCartById(cartId);
        if (!cart) return null;
        cart.products = newProducts;
        await cart.save();
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        if (!cart) return null;
        const product = cart.products.find(p => p.productId.toString() === productId);
        if (!product) return null;
        product.quantity = quantity;
        await cart.save();
        return cart;
    }

    async clearCart(cartId) {
        const cart = await this.getCartById(cartId);
        if (!cart) return null;
        cart.products = [];
        await cart.save();
        return cart;
    }
}

module.exports = CartManager;