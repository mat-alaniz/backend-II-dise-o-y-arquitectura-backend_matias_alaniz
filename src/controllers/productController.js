const product = require('../modelo/productModel');
const mongoosePaginate = require('mongoose-paginate-v2');

const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const filter ={};
        if (query) {
            filter.$or = [
                { category: query },
                { status: query === 'available' }
            ];
        }
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            lean: true
        };
        const result = await product.paginate(filter, options);

        const baseUrl = `${req.protocol}://${req.get('host')}/api/products`;
        const prevLink = result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}` : null;
        const nextLink = result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}` : null;
        res.status(200).json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink,
            nextLink 
        });
    } catch (error) {
        res.status(500).json({status: 'error',message: error.message});
    }
}

module.exports = { getProducts };