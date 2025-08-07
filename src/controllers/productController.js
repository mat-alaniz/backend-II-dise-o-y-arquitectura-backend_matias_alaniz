import product from '../models/product.js';
import mongoosePaginate from 'mongoose-paginate-v2';

export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const filter = {};
        if (query) {
            if (query === 'available') {
                filter.stock = { $gt: 0 };
            } else {
                filter.category = query;
            }
        }
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            lean: true
        };
        const result = await product.paginate(filter, options);

        const buildLink = (page) => {
            const params = new URLSearchParams();
            params.append('limit', limit);
            params.append('page', page);
            if (sort) params.append('sort', sort);
            if (query) params.append('query', query);
            return `${req.protocol}://${req.get('host')}/api/products?${params.toString()}`;
        }
        
        res.status(200).json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
            nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
        });
    } catch (error) {
        res.status(500).json({status: 'error',message: 'Internal Server Error', error: process.env.NODE_ENV === 'development' ? error.message : null});
    }
};