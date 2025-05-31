const fs = require('fs');
const path = require('path');

class CartManager {
    constructor() {
        this.cartsFilePath = path.join(__dirname, '../data/carts.json');
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.cartsFilePath)) {
                const data = await fs.promises.readFile(this.cartsFilePath, 'utf-8');
                return JSON.parse(data);
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error leyendo los carritos:', error);
            return [];
        }
    }

    async saveCarts(carts) {
        try {
            await fs.promises.writeFile(this.cartsFilePath, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.error('Error guardando los carritos:', error);
        }
    }

    async createCart() {
        try {
            const carts = await this.getCarts();
            const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

            const newCart = {
                id: newId,
                products: [],
            };
            carts.push(newCart);
            await this.saveCarts(carts);
            return newCart;
        } catch (error) {
            console.error('Error creando el carrito:', error);
            return null;
        }
    }

    async getCartById(cartId) {
        try {
            const carts = await this.getCarts();
            return carts.find(cart => cart.id === cartId) || null;
        } catch (error) {
            console.error('Error obteniendo el carrito por ID:', error);
            return null;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cartId);
            if (!cart) {
                return null;
            }

            const existingProduct = cart.products.find(p => p.product === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await this.saveCarts(carts);
            return cart;
        } catch (error) {
            console.error('Error agregando producto al carrito:', error);
            return null;
        }
    }
}

module.exports = CartManager;