import cartService from '../services/cart.service.js';

// Obtener el carrito por ID
export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartById(cid);
    res.json({
        status: "success",
        cart
    });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};

// Agregar un producto al carrito 
export const addProductToCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { pid, quantity = 1 } = req.body;
    const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
    res.json({
        status: "success",
        cart: updatedCart
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Remover un producto del carrito
export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartService.removeProductFromCart(cid, pid);
    res.json({
        status: "success",
        cart: updatedCart
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

//Actualizar cantidad de producto
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    // Necesitamos agregar este método al service primero
    const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
    res.json({
      status: "success",
      cart: updatedCart
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

//Actualizar carrito completo
export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const updateData = req.body;
    
    const updatedCart = await cartService.updateCart(cid, updateData);
    res.json({
      status: "success",
      cart: updatedCart
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Vaciar carrito
export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await cartService.clearCart(cid);
    res.json({
        status: "success",
        message: "Carrito vaciado",
        cart: updatedCart
    });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

// Obtener carrito x usuario
export const getCartByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartService.getCartByUserId(userId);
    res.json({
        status: "success",
        cart
    });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};