import { model, Schema, Document, Types } from 'mongoose';
import { hash } from 'bcrypt'
import { Notification } from '../interfaces';
import { Gender } from '../enums';

const NotificationSchema: Schema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, default: "pending" },
  data: { type: Array, required: false }
});


const Notification = model<Notification & Document>('Notification', NotificationSchema);


export { Notification }
