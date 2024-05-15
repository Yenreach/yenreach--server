import { generate } from 'otp-generator'
import { HttpException } from '@/core/exceptions/HttpException';
import { PasswordToken as IPasswordToken } from '../interfaces';
import { PasswordToken } from '../models'
import { HttpCodes } from '@/core/constants';

class PasswordTokenProvider {
    public passwordTokenModel = PasswordToken

    public async createPasswordToken(user: string): Promise<IPasswordToken> {
        const token = generate(29, { upperCaseAlphabets: true, digits: true, specialChars: false })

        const code = generate(5, {
            upperCaseAlphabets: false, lowerCaseAlphabets: false,
            digits: true, specialChars: false,
        })

        const createdPasswordToken: IPasswordToken = await this.passwordTokenModel.create({
            token,
           code: String(code),
            user,
        } as IPasswordToken)

        return createdPasswordToken
    }

    public async findPasswordOtp(code: string): Promise<PasswordToken> {
        const passwordTokenResponse: PasswordToken = await this.passwordTokenModel.findOne({ code })

        if(!passwordTokenResponse){
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Invalid code')
        }

        return passwordTokenResponse
    }

    public async findPasswordToken(token: string): Promise<PasswordToken> {
        const passwordTokenResponse: PasswordToken = await this.passwordTokenModel.findOne({ token })

        if(!passwordTokenResponse){
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Invalid token')
        }

        return passwordTokenResponse
    }

    public async invalidatePasswordToken(token: string): Promise<void> {
        const passwordTokenResponse: PasswordToken = await this.findPasswordToken(token)

        if (!passwordTokenResponse) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Password reset token not found')
        }

        await PasswordToken.findById(passwordTokenResponse.user, { isUsed: true })
    }
}

export { PasswordTokenProvider }
