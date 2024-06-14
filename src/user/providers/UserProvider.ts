import { generate } from 'otp-generator'
import { HttpException } from '../../core/exceptions'
import { User } from '../models'
import { HttpCodes } from '../../core/constants'
import { User as IUser } from '../interfaces'
import axios from 'axios'
import { StatusCodes } from "http-status-codes";


class UserProvider {
  public userModel = User

  public async createUser(data: IUser): Promise<any | null> {
    try {
      const user = new User(data);

      return await user.save();
    } catch (err: any) {
      console.log({ err: err.response.data })
      throw new HttpException(StatusCodes.BAD_REQUEST, err?.response?.data?.error?.message);

    }
  }
}

export { UserProvider }
