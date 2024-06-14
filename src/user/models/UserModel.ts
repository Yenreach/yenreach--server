import { model, Schema, Document } from 'mongoose';
import { User } from '../interfaces';
import { logger } from '../../core/utils';

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  email_track: {
    type: Number,
    default: 1
  }

});


const User = model<User & Document>('User', UserSchema);


export { User }
