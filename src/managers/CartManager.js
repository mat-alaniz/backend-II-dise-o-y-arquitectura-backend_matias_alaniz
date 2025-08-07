import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

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
            const cart = await Cart.findById(cartId)
                .populate('products.product')
                .lean(); 
            if (!cart) throw new Error('Carrito no encontrado');
            return cart;
        } catch (error) { 
            console.error('Error al obtener carrito:', error);
            throw new Error(error.message || 'Error al buscar carrito');
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const [product, cart] = await Promise.all([
                Product.findById(productId),
                Cart.findById(cartId)
            ]);

            if (!product) throw new Error('Producto no encontrado');
            if (!cart) throw new Error('Carrito no encontrado');

            const existingProduct = cart.products.find(item => item.product.toString() === productId);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ 
                    product: productId,
                    quantity: 1 
                });
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

            cart.products = cart.products.filter(item => item.product.toString() !== productId);

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

            const productToUpdate = cart.products.find(item => item.product.toString() === productId);
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

            const productsExist = await Promise.all(
                newProducts.map(item => Product.exists({ _id: item.product }))
            );
            if (productsExist.some(exists => !exists)) {
                throw new Error('Uno o más productos no existen');
            }

            const cart = await Cart.findByIdAndUpdate(cartId, { products: newProducts }, { new: true, runValidators: true }).populate('products.product');

            if (!cart) throw new Error('Carrito no encontrado');
            return cart;
        } catch (error) {
            console.error('Error al actualizar carrito:', error);
            throw new Error(error.message || 'Error al actualizar carrito');
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true }).populate('products.product');

            if (!cart) throw new Error('Carrito no encontrado');
            return cart;
        } catch (error) {
            console.error('Error al vaciar carrito:', error);
            throw new Error(error.message || 'Error al vaciar carrito');
        }
    }

    async cleanDeletedProducts() {
        try {
            const carts = await Cart.find();
            
            for (const cart of carts) {
                const validProducts = await Promise.all(
                    cart.products.map(async item => { 
                        const productExists = await Product.exists({ _id: item.product });
                        return productExists ? item : null;
                    })
                );
                
                cart.products = validProducts.filter(item => item !== null);
                await cart.save();
            }

            return { status: 'success', message: 'Carritos limpiados exitosamente' };
        } catch (error) {
            console.error('Error al limpiar productos eliminados:', error);
            throw new Error('Error al limpiar productos eliminados de los carritos');
        }
    }
}

export default CartManager;

