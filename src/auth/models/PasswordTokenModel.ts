import { model, Schema, Document } from 'mongoose';
import { PasswordToken } from '../interfaces';

const PasswordTokenSchema: Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const PasswordToken = model<PasswordToken & Document>('PasswordToken', PasswordTokenSchema);

export { PasswordToken }
