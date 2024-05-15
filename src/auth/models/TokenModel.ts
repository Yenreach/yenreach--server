import { model, Schema, Document } from 'mongoose';
import { Token } from '../interfaces';
import { AccountType } from '@/user/enums';

const TokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true
  },
  isBlacklisted: {
    type: Boolean,
    default: false
  },
  expirationDate: {
    type: Date,
    default: Date.now()
  },
  userType: {
    type: String,
    enum: AccountType
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Token = model<Token & Document>('Token', TokenSchema);

export { Token }
