const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

class CartManager {
    async getCarts() {
        try {
            return await Cart.find().populate('products.product');
        } catch (error) {
            console.error('Error al obtener carritos:', error);
            throw new Error('Error interno al listar carritos');
        }
    }

    async createCart() {
        try {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error('Error al crear carrito:', error);
            throw new Error('No se pudo crear el carrito');
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate({ path: 'products.productId', model: 'Product' });
            if (!cart) throw new Error('Carrito no encontrado');
            return cart;
        } catch (error) { console.error('Error al obtener carrito:', error);
            throw new Error(error.message || 'Error al buscar carrito');
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const product = await Product.findById(productId);
            if (!product) throw new Error('Producto no encontrado');

            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            const existingProduct = cart.products.find(item => item.productId.toString() === productId);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ productId: productId, quantity: 1 });
            }

            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw new Error(error.message || 'Error al agregar producto al carrito');
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            cart.products = cart.products.filter(item => item.productId.toString() !== productId);

            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw new Error(error.message || 'Error al remover producto');
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            if (!quantity || quantity <= 0) throw new Error('Cantidad inválida');

            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            const productToUpdate = cart.products.find(item => item.productId.toString() === productId);
            if (!productToUpdate) throw new Error('Producto no encontrado en el carrito');

            productToUpdate.quantity = quantity;
            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
            throw new Error(error.message || 'Error al actualizar cantidad');
        }
    }

    async updateAllCartProducts(cartId, newProducts) {
        try {
            if (!Array.isArray(newProducts)) throw new Error('Formato de productos inválido');

            const cart = await Cart.findByIdAndUpdate(
                cartId, { products: newProducts }, { new: true, runValidators: true }
            ).populate('products.productId');

            if (!cart) throw new Error('Carrito no encontrado');
            return cart;
        } catch (error) {
            console.error('Error al actualizar carrito:', error);
            throw new Error(error.message || 'Error al actualizar carrito');
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true }).populate('products.productId');

            if (!cart) throw new Error('Carrito no encontrado');
            return cart;
        } catch (error) {
            console.error('Error al vaciar carrito:', error);
            throw new Error(error.message || 'Error al vaciar carrito');
        }
    }
}

module.exports = CartManager;