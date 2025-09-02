// Objeto de transferencia de datos para Productos
export class ProductDTO {
    constructor(product) {
        this.id = product._id || product.id;
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.code = product.code;
        this.stock = product.stock;
        this.category = product.category;
        this.thumbnails = product.thumbnails || [];
        this.status = product.status !== undefined ? product.status : true;
    }
}

export default ProductDTO;