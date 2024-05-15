import { model, Schema, Document, Types } from 'mongoose';
import { InvoiceDocument } from '../interfaces';

const InvoiceSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    invoiceNo: {
        type: Number,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        hrsOrQty: {
            type: String,
            required: true
        },
        rate: {
           type: Number,
           default: 0,
           required: true
        },
        subtotal: {
           type: Number,
           default: 0,
           required: true
        },
        description: {
            type: String,
            required: true
        }
    }],
    pdf: {
        type: String,
        required: false
    },
    invoiceDate: {
        type: Date,
        required: false
    },
    dueDate: {
        type: Date,
        required: false
    }
}, {
    timestamps: true, toJSON: {
        getters: true
    },
    toObject: {
        getters: true
    }
});


const Invoice = model<InvoiceDocument>('Invoice', InvoiceSchema);

export { Invoice }
