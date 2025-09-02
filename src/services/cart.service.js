import ticketService from './ticket.service.js';
import productRepository from '../repositories/product.repository.js';
import cartRepository from '../repositories/cart.repository.js';

export class CartService {
  
  // Obtener carrito por ID
  async getCartById(cartId) {
    try {
      return await cartRepository.findById(cartId);
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
  }

  // Obtener carrito por usuario
  async getCartByUserId(userId) {
    try {
      let cart = await cartRepository.findByUserId(userId);
      
      if (!cart) {
        cart = await cartRepository.create({ user: userId, products: [] });
      }
      
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito del usuario: ${error.message}`);
    }
  }

  // Crear nuevo carrito
  async createCart(cartData) {
    try {
      return await cartRepository.create(cartData);
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  }

  // Actualizar carrito
  async updateCart(cartId, updateData) {
    try {
      return await cartRepository.update(cartId, updateData);
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  // Eliminar carrito
  async deleteCart(cartId) {
    try {
      return await cartRepository.delete(cartId);
    } catch (error) {
      throw new Error(`Error al eliminar el carrito: ${error.message}`);
    }
  }

  // Agregar producto al carrito
  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      return await cartRepository.addProduct(cartId, productId, quantity);
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }

  // Actualizar cantidad de producto 
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartRepository.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productItem = cart.products.find(
        item => item.product.toString() === productId
      );

      if (productItem) {
        productItem.quantity = quantity;
      } else {
        throw new Error('Producto no encontrado en el carrito');
      }

      return await cart.save();
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto: ${error.message}`);
    }
  }

  // Remover producto del carrito
  async removeProductFromCart(cartId, productId) {
    try {
      return await cartRepository.removeProduct(cartId, productId);
    } catch (error) {
      throw new Error(`Error al remover producto del carrito: ${error.message}`);
    }
  }

  // Vaciar carrito
  async clearCart(cartId) {
    try {
      return await cartRepository.clearCart(cartId);
    } catch (error) {
      throw new Error(`Error al vaciar el carrito: ${error.message}`);
    }
  }

  // Obtener carrito con populate completo
  async getPopulatedCart(cartId) {
    try {
      const cart = await cartRepository.findById(cartId);
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito con populate: ${error.message}`);
    }
  }
  // MÉTODO DE COMPRA 
  async purchaseCart(cartId, user) {
    try {
        // Validar que user NO sea admin
        if (user.role === 'admin') {
            throw new Error('Los administradores no pueden realizar compras');
        }

        // Obtener carrito con productos populados
        const cart = await cartRepository.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        // Validar que el carrito no esté vacío
        if (cart.products.length === 0) {
            throw new Error('No se puede comprar un carrito vacío');
        }

        // Validar stock y calcular total
        let totalAmount = 0;
        const productsToPurchase = [];
        const productsOutOfStock = [];

        for (const item of cart.products) {
            const product = item.product;
            
            // Validar stock
            if (product.stock >= item.quantity) {
                productsToPurchase.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price
                });
                totalAmount += product.price * item.quantity;
            } else {
                productsOutOfStock.push({
                    product: product._id,
                    name: product.title,
                    requested: item.quantity,
                    available: product.stock
                });
            }
        }

        // Si no hay productos disponibles, error
        if (productsToPurchase.length === 0) {
            throw new Error('No hay productos con stock suficiente para comprar');
        }

        // Devolver resultado de la compra
        return {
            success: true,
            totalAmount,
            productsPurchased: productsToPurchase,
            productsOutOfStock,
            message: productsOutOfStock.length > 0 
                ? 'Compra parcialmente exitosa' 
                : 'Compra exitosa'
        };

    } catch (error) {
        throw new Error(`Error al procesar la compra: ${error.message}`);
    }
  }
}


export default new CartService();