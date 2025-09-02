
import Cart from '../models/cartModel.js';

export class CartRepository {
 // buscar carrito x Id
async findById(id) {
    try{
        const cart = await Cart.findById(id).populate('products.product');
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    } catch (error) {
        throw new Error(`Error al buscar el carrito: ${error.message}`);
    }
}

//buscar carrito x usuario

async findByUserId(userId) {
    try {
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    } catch (error) {
        throw new Error(`Error al buscar el carrito: ${error.message}`);
    }
}

// actualizar carro

async update(id, updateData) {
    try {
        const updateData = await Cart.findByIdAndUpdate(id, updateData, { new: true }).populate('products.product');
        if (!updateData) {
            throw new Error('Carrito no encontrado');
        }
        return updateData;
    } catch (error) {
        throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
}

// eliminar carro

async delete(id) {
    try {
        const deletedCart = await Cart.findByIdAndDelete(id);
        if (!deletedCart) {
            throw new Error('Carrito no encontrado');
        }
        return deletedCart;
    } catch (error) {
        throw new Error(`Error al eliminar el carrito: ${error.message}`);
    }
}

//agregar producto al carro

async addProduct(cartId, productId, quantity = 1) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const existingProduct = cart.products.find(
        item => item.product.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      return await cart.save();
    } catch (error) {
      throw new Error(`Error adding product to cart: ${error.message}`);
    }
  }
// remover producto del carro

async removeProduct(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products = cart.products.filter(
        item => item.product.toString() !== productId
      );
      return await cart.save();
    } catch (error) {
      throw new Error(`Error al remover producto del carrito: ${error.message}`);
    }
  }

  //vaciar el carrito

  async clearCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products = [];
      return await cart.save();
    } catch (error) {
      throw new Error(`Error al vaciar el carrito: ${error.message}`);
    }
  }
};


export default new CartRepository();