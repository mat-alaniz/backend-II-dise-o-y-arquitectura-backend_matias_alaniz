import mongoose from "mongoose";    
import Product from "./productModel.js";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    Products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity: Number,
        price: Number
    }],
    status: {
        type: String,
        enum: ["complete", "pending", "canceled"],
        default: "complete"
    }
});

export default mongoose.model("Ticket", ticketSchema);