import { model, Schema, Document, Types } from 'mongoose';
import { hash } from 'bcrypt'
import { Broadcast } from '../interfaces';
import { Gender } from '../enums';

const BroadcastSchema: Schema = new Schema({
  users: { type: Array, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, default: "pending" }
});


const Broadcast = model<Broadcast & Document>('Broadcast', BroadcastSchema);


export { Broadcast }
