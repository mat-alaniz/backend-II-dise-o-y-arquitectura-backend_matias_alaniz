
import cartRepository from "../repositories/cart.repository";   

export class CartService {
  //obtener el carro x Id

  async getCartById(cartId) {
  try{
    return await cartRepository.findById(cartId);
  } catch (error) {
    throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
  }

  //obteenr carrito x usuario


  async getCartByUserId(userId) {
    try {
         let cart = await cartRepository.findByUserId(userId);
         if (!cart) {
            cart = await cartRepository.create({ user: userId, products: [] });
         } return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
  }

  //crear un nuevo carro

  async createCart(cartData) {
    try{
        return await cartRepository.create(cartData);
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  }

  //actualizar el carro

  async updateCart(cartId, updateData) {
    try {
      return await cartRepository.update(cartId, updateData);
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  //eliminar el carro

  async deleteCart(cartId) {
    try {
      return await cartRepository.delete(cartId);
    } catch (error) {
      throw new Error(`Error al eliminar el carrito: ${error.message}`);
    }
  }

  //agregar producto al carrito

   async addProductToCart(cartId, productId, quantity = 1) {
    try {
      return await cartRepository.addProduct(cartId, productId, quantity);
    } catch (error) {
      throw new Error(`Error adding product to cart: ${error.message}`);
    }
  }

  //remover producto del carrito
  async removeProductFromCart(cartId, productId) {
    try {
      return await cartRepository.removeProduct(cartId, productId);
    } catch (error) {
      throw new Error(`Error removing product from cart: ${error.message}`);
    }
  }

  //vaciar carrito

  async clearCart(cartId) {
    try {
      return await cartRepository.clear(cartId);
    } catch (error) {
      throw new Error(`Error al vaciar el carrito: ${error.message}`);
    }
  }

  //obtener carrito con populate completo

  async getPopulatedCart(cartId) {
    try {
      const cart = await cartRepository.findById(cartId);
      return cart;
    } catch (error) {
      throw new Error(`Error getting populated cart: ${error.message}`);
    }
  }

}

export default new CartService();