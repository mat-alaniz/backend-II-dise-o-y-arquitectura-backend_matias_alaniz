import ticketRepository from '../repositories/ticket.repository.js';
import productRepository from '../repositories/product.repository.js';

export class TicketService {
    // Crear ticket de compra
    async createTicket(purchaseData) {
        try {
            const ticketData = {
                code: ticketRepository.generateUniqueCode(),
                amount: purchaseData.totalAmount,
                purchaser: purchaseData.purchaser,
                products: purchaseData.products,
                status: 'completed'
            };

            const ticket = await ticketRepository.create(ticketData);
            return ticket;
        } catch (error) {
            throw new Error(`Error al crear ticket: ${error.message}`);
        }
    }

    // Obtener ticket por ID
    async getTicketById(ticketId) {
        try {
            return await ticketRepository.findById(ticketId);
        } catch (error) {
            throw new Error(`Error al obtener ticket: ${error.message}`);
        }
    }

    // Obtener tickets por usuario
    async getTicketsByUser(email) {
        try {
            return await ticketRepository.findByUser(email);
        } catch (error) {
            throw new Error(`Error al obtener tickets del usuario: ${error.message}`);
        }
    }

    // Actualizar stock de productos después de compra
    async updateProductStock(productsPurchased) {
        try {
            for (const item of productsPurchased) {
                await productRepository.update(item.product, {
                    $inc: { stock: -item.quantity }
                });
            }
        } catch (error) {
            throw new Error(`Error al actualizar stock: ${error.message}`);
        }
    }

    // Procesar compra completa
    async processPurchase(cartData, user) {
        try {
            // 1. Actualizar stock de productos
            await this.updateProductStock(cartData.productsPurchased);

            // 2. Crear ticket
            const ticketData = {
                totalAmount: cartData.totalAmount,
                purchaser: user.email,
                products: cartData.productsPurchased
            };

            const ticket = await this.createTicket(ticketData);
            return ticket;

        } catch (error) {
            throw new Error(`Error al procesar la compra: ${error.message}`);
        }
    }
}

export default new TicketService();