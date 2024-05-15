import { model, Schema, Document } from 'mongoose';
import { hash } from 'bcrypt'
import { User } from '../interfaces';
import { Gender } from '../enums';
import Stripe from 'stripe';
import { stripe, STRIPE_SECRET_KEY } from '../../config';
import { logger } from '../../core/utils';

const UserSchema: Schema = new Schema({
  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    },
    full: {
      type: String
    }
  },
  username: {
    type: String,
  },
  dob: {
    type: Date,
    required: true
  },
  displayPhoto: {
    type: String
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  street: {
    type: String,
  },
  country: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  gender: {
    type: String,
    enum: [Gender]
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isDeactivated: {
    type: Boolean,
    default: false
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
  },
  documents: {
    passportFront: String,
    passportBack: String,
    driverLicenseFront: String,
    driverLicenseBack: String,
    selfie: String,
    idCardFront: String,
    idCardBack: String,
    utilityBill: String,
    bankStatement: String,
    creditCardSystem: String,
    videoVerification: String,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  tokens: {
    type: Array,
    required: false,
    default: []
  },
  stripeID: {
    type: String,
    default: ""
  },
  kycID: {
    type: String
  }
});

/* eslint-disable-next-line func-names */
UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this

  if (user.isModified('password')) {
    user.password = await hash(user.password, 10)
    user.name.full = `${user.name.first} ${user.name.last}`
  }
  try {

    const stripeCustomer = await stripe.customers.create({ email: user.email.toLowerCase(), name: `${user.name.first} ${user.name.last}` })
    user.stripeID = stripeCustomer.id
  } catch (error) {
    logger.error(`Could not create stripe user.`)
  }
  next()
})

const User = model<User & Document>('User', UserSchema);


export { User }
