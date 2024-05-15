import { model, Schema, Document } from 'mongoose';
import { Otp } from '../interfaces';

const OtpSchema: Schema = new Schema({
    code: {
        type: String,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Otp = model<Otp & Document>('Otp', OtpSchema);

export { Otp }
