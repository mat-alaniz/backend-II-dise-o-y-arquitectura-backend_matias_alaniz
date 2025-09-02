// Objeto de transferencia de datos para Carritos
export class CartDTO {
    constructor(cart) {
        this.id = cart._id || cart.id;
        this.products = cart.products.map(item => ({ product: item.product ? {
                id: item.product._id || item.product.id,
                title: item.product.title,
                price: item.product.price
            } : null,
            quantity: item.quantity
        }));
        this.total = this.calculateTotal(cart.products);
        this.createdAt = cart.createdAt;
        this.updatedAt = cart.updatedAt;
    }

    calculateTotal(products) {
        return products.reduce((total, item) => {
            if (item.product && item.product.price) {
                return total + (item.product.price * item.quantity);
            }
            return total;
        }, 0);
    }
}

export default CartDTO;