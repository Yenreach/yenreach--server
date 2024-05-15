import { UserProvider } from '@/user/providers';
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
import { IKyc } from '../interfaces/Kycinterfaces';
import { agenda } from '@/core/utils'
import fs from 'fs';




const serviceAccount = require("@/config/morizon-bank-firebase-adminsdk-7cfgk-c0605eea7f.json");

// initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });


class KYCProvider {
  public userModel = User
  public userProvider = new UserProvider()

  protected getFileBinary(filePath: string) {
    // Read the file into a buffer
    // const buffer = fs.readFileSync(filePath);

    // // Convert the buffer to binary data
    // return buffer.toString('binary');

    return fs.createReadStream(filePath.replace(/\\/g, '/'))
  }

  public async kycStageOneStart(id: string) {
    try {
      const user: User = await this.userProvider.getUserById(id)

      const vaultPassword = `Pas${`${user.phoneNumber}`.substring(-0, 5)}$$`;

      const signedIn = await vault({}).auth.signIn({ number: `${user.phoneNumber}`, password: vaultPassword, grant_type: 'mobile_phone' })

      await vault({ bearerToken: signedIn.access_token }).kyc.step1().start();
    } catch (error) {
      console.log(error)
    }
  }

  public async kycStageOneFinish() {
    try {

    } catch (error) {
      console.log(error)
    }
  }

  public async kycStageThree() {
    try {

    } catch (error) {
      console.log(error)
    }
  }

  public async kycStageTwo(id: string, payload: any) {
    try {

    } catch (error) {
      console.log(error)
    }
  }

  public async startKycVerification({payload}: {
    payload: IKyc
  }) {
    try {
      const user = await this.userProvider.getUserById(payload.userId)

      const customer = await Customer.findOne({ user })

      const vaultPassword = `Pas${`${user.phoneNumber}`.substring(-0, 5)}$$`;

      const signedIn = await vault({}).auth.signIn({ number: `${user.phoneNumber}`, password: vaultPassword, grant_type: 'mobile_phone' })

      const kycres = await vault({ bearerToken: signedIn.access_token }).kyc.step1().start();
      console.log('started step 1: ', kycres)

      // user.kycID = kycres.id;

      await User.findOneAndUpdate({ _id: payload.userId }, {kycID: kycres.id}, { new: true });
      const identificationId = {
        identificationId: kycres.id
      }
      console.log('updated user: ', identificationId)


      console.log(payload.files)

      // payload.files.map(async (data: any, index: number) => {
      //   const binary = this.getFileBinary(data[0].path)

      //   const kyc2 = await localVault({ bearerToken: signedIn.access_token }).kyc.step2({image: binary, docType: data[0].fieldname})
      //   console.log('started step 2: ', kyc2 + ' interation ' + index)
      // })

      let count = 0;
      for (const [key, value] of Object.entries(payload.files)) {
        console.log(`${key}: ${value}`);
        const binary = this.getFileBinary(value[0].path)

        const kyc2 = await localVault({ bearerToken: signedIn.access_token }).kyc.step2({image: binary, docType: value[0].fieldname})
        console.log('started step 2: ', kyc2 + ' interation ' + count)
        count++;
      }

      const finish = await vault({ bearerToken: signedIn.access_token }).kyc.step1().finish(identificationId);
      console.log('finish: ', finish)

      agenda.schedule('2 seconds', 'KycStatusCheck', {
        token: signedIn.access_token,
    })

      // const response = await axiosInstance({
      //   method: 'post',
      //   url: '/kyc/verification',
      //   data: {
      //     country: {
      //       countryCode: payload.countryCode
      //     },
      //     idCard: base64,
      //     phone: String(user.phoneNumber),
      //     dateOfBirth: user.dob,
      //     name: {
      //       firstname: user.name.first,
      //       lastname: user.name.last
      //     },
      //     customer: customer.customerId
      //   },
      //   headers: getAuthHeader(NYXEX_TOKEN, NYXEX_REFRESH_TOKEN)
      // })
      //   .then(async res => {
      //     if (res.data.kyc.status) {
      //       await this.userProvider.updateUser(userId, { isVerified: true } as any)

      //       await Account.findOneAndUpdate({ user: userId }, { kycVerified: true })
      //     }
      //     return res.data
      //   })
      //   .catch(e => {
      //     console.log(e)
      //   })

      // return response.kyc.status
    } catch (error) {
      console.log(error)
    }
  }
}

export { KYCProvider }
