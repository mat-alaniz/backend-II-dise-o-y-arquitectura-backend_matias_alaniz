import productRepository from "../repositories/product.repository";

export class ProductService {

    //obtener productos x paginación
  async getProducts(limit = 10, page = 1, query = {}, sort = {}) {
    try {
      const skip = (page - 1) * limit;
      const sortOption = sort === "desc" ? { price: -1 } : { price: 1 };
      const products = await productRepository.findAll(query, {
        limit,
        skip,
        sort: sortOption,
      });

      const totalProducts = await productRepository.count(query);
      const totalPages = Math.ceil(totalProducts / limit);

      return {
        status: "success",
        payload: products,
        totalPages: totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: page,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink:
          page > 1
            ? `/api/products?limit=${limit}&page=${page - 1}&query=${query}&sort=${sort}`
            : null,
        nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&query=${query}&sort=${sort}` : null,
      };
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }
  //obtener productos por id
  async getProductById(id) {
    try {
      return await productRepository.findById(id);
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }
  //crear nuevo producto
  async createProduct(productData) {
    try {
      return await productRepository.create(productData);
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }
  //actualizar producto
  async updateProduct(id, updateData) {
    try {
      return await productRepository.update(id, updateData);
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }
  //eliminar producto
  async deleteProduct(id) {
    try {
      return await productRepository.delete(id);
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}


export default new ProductService();
