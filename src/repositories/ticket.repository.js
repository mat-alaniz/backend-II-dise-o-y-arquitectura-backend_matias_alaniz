import Ticket from '../models/ticketModel.js';

export class TicketRepository {
    // Crear ticket
    async create(ticketData) {
        try {
            const ticket = new Ticket(ticketData);
            return await ticket.save();
        } catch (error) {
            throw new Error(`Error al crear ticket: ${error.message}`);
        }
    }

    // Buscar ticket por ID
    async findById(id) {
        try {
            const ticket = await Ticket.findById(id).populate('products.product');
            if (!ticket) {
                throw new Error('Ticket no encontrado');
            }
            return ticket;
        } catch (error) {
            throw new Error(`Error al buscar ticket por ID: ${error.message}`);
        }
    }

    
    // Buscar tickets por usuario (email)
    async findByUser(email) {
        try {
            return await Ticket.find({ purchaser: email })
                .populate('products.product')
                .sort({ purchase_datetime: -1 });
        } catch (error) {
            throw new Error(`Error al buscar tickets por usuario: ${error.message}`);
        }
    }

    // Actualizar ticket
    async update(id, updateData) {
        try {
            const updatedTicket = await Ticket.findByIdAndUpdate(id, updateData, { 
                new: true, 
                runValidators: true 
            });
            if (!updatedTicket) {
                throw new Error('Ticket no encontrado');
            }
            return updatedTicket;
        } catch (error) {
            throw new Error(`Error al actualizar ticket: ${error.message}`);
        }
    }

    // Eliminar ticket
    async delete(id) {
        try {
            const deletedTicket = await Ticket.findByIdAndDelete(id);
            if (!deletedTicket) {
                throw new Error('Ticket no encontrado');
            }
            return deletedTicket;
        } catch (error) {
            throw new Error(`Error al eliminar ticket: ${error.message}`);
        }
    }

    // Generar código único para ticket
    generateUniqueCode() {
        return `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
}

export default new TicketRepository();