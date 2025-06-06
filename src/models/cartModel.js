const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1, min: [1, 'La cantidad mínima es 1'], validate: { validator: Number.isInteger, message: 'La cantidad debe ser un número entero' } }
    }
  ]
});

cartSchema.pre(/^find/, function(next) {
  this.populate({ path: 'products.product', select: 'title price category stock description' });
  next();
});

cartSchema.index({ 'products.product': 1 });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;