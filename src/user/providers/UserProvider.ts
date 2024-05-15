import { generate } from 'otp-generator'
import { HttpException } from '@/core/exceptions'
import { User } from '../models'
import { HttpCodes } from '@/core/constants'
import { User as IUser } from '../interfaces'
import axios from 'axios'
import imageTo64 from 'image-to-base64'
import { axiosInstance, getAuthHeader } from '@/wallet/utils'
import { Customer } from '@/wallet/models'
import { NYXEX_REFRESH_TOKEN, NYXEX_TOKEN } from '@/config'
import { Account } from '@/account/models'
import { compare, hash } from 'bcrypt'
import { messaging } from "firebase-admin"
import { initializeApp } from 'firebase-admin/app';
import admin from "firebase-admin"
import { FilterQuery } from 'mongoose'
import vault from '@/wallet/utils/vault.utils'
import localVault from '@/utils/vault/vault.utils'



const serviceAccount = require("@/config/morizon-bank-firebase-adminsdk-7cfgk-c0605eea7f.json");

initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


class UserProvider {
  public userModel = User

  public async getUsers(): Promise<User[]> {
    const users: User[] = await this.userModel.find()

    return users
  }
  public async sendNotification({ userId, title, body }) {
    const user = await this.getUserById(userId)


    const messages = [];
    messages.push({
      notification: { title, body },
      token: user.tokens,
    });

    const message = {
      notification: { title, body },
      tokens: user.tokens,
    };

    return admin.messaging().sendMulticast(message)
    // return await admin.messaging().sendAll(messages)
  }

  public async updateUserToken({ email, token }) {

    const user: User = await this.findUser({ email })
    user.tokens?.push(token)
    await this.userModel.updateOne({ _id: user._id }, { $set: { tokens: [...new Set(user.tokens || [token])] } }, { new: true })
  }

  public async getUserById(id: string): Promise<User> {
    const user: User = await this.userModel.findById(id)

    if (!user) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'No User bearing this id was found')
    }

    return user
  }

  public async findUser(query: any): Promise<User> {
    const user: User = await this.userModel.findOne(query)

    if (!user) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'User does not exist')
    }

    return user
  }

  public async changeUserPassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.getUserById(id)

    const oldPasswordMatch: boolean = await compare(oldPassword, user.password)

    const newPasswordMatch: boolean = await compare(newPassword, user.password)

    if (oldPasswordMatch === false) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'Password is incorrect')
    }

    if (newPasswordMatch) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'New password cannot be the same as old one')
    }

    await User.findByIdAndUpdate(user._id, { password: await hash(newPassword, 10) })
  }

  public async startKycVerification(payload: any, userId: string) {
    try {
      const user = await this.getUserById(userId)

      const customer = await Customer.findOne({ user })

      const base64 = await imageTo64(payload.file) // Path to the image
        .then(
          (response) => {
            return response
          }
        )
        .catch(
          (error) => {
            console.log(error); // Logs an error if there was one
          }
        )


      const response = await axiosInstance({
        method: 'post',
        url: '/kyc/verification',
        data: {
          country: {
            countryCode: payload.countryCode
          },
          idCard: base64,
          phone: String(user.phoneNumber),
          dateOfBirth: user.dob,
          name: {
            firstname: user.name.first,
            lastname: user.name.last
          },
          customer: customer.customerId
        },
        headers: getAuthHeader(NYXEX_TOKEN, NYXEX_REFRESH_TOKEN)
      })
        .then(async res => {
          if (res.data.kyc.status) {
            await this.updateUser(userId, { isVerified: true } as any)

            await Account.findOneAndUpdate({ user: userId }, { kycVerified: true })
          }
          return res.data
        })
        .catch(e => {
          console.log(e)
        })

      return response.kyc.status
    } catch (error) {
      console.log(error)
    }
  }

  public async updateUser(id: string, payload: FilterQuery<IUser>): Promise<void> {
    try {
      const user: User = await this.getUserById(id)
      const vaultPassword = `Pas${`${user.phoneNumber}`.substring(-0, 5)}$$`;

      const data = {
        firstName: payload.name.firstName,
        lastName: payload.name.lastName,
        primaryCurrency: payload.currency,
        residenceCountry: payload.country,
        residenceCity: payload.city,
        residenceStreet: payload.street,
        residenceZipCode: payload.zipCode,
        dateOfBirth: payload.dobs
      }

      const signedIn = await vault({}).auth.signIn({ number: `${payload.phoneNumber}`, password: vaultPassword, grant_type: 'mobile_phone' })

      const updateProfile = await localVault({ bearerToken: signedIn.access_token }).user.updateUserProfile(data);
      console.log('prof: ', updateProfile)
      await this.userModel.findByIdAndUpdate(user._id, { $set: { ...payload } }, { new: true })
    } catch (err: any) {
      console.log('err: ', err)
    }



  }

  public async deleteUser(id: string): Promise<void> {
    const user: User = await this.getUserById(id)

    await this.userModel.findByIdAndDelete(user._id)
  }
}

export { UserProvider }
