import { generate } from 'otp-generator'
import { HttpException } from '@/core/exceptions/HttpException';
import { Otp as IOtp } from '@/auth/interfaces/OtpInterface';
import { Otp } from '../models'
import { HttpCodes } from '@/core/constants';

class OtpProvider {
    public otpModel = Otp

    public async createOtp(phoneNumber: number): Promise<IOtp> {
        const code = generate(6, {
            upperCaseAlphabets: false, lowerCaseAlphabets: false,
            digits: true, specialChars: false,
        })

        const createdOtp: IOtp = await this.otpModel.create({
            code: String(code),
            phoneNumber,
        } as IOtp)

        return createdOtp
    }

    public async findOtp(code: string): Promise<Otp> {
        const otpResponse: Otp = await this.otpModel.findOne({ code, isUsed: false })

        if (!otpResponse) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Invalid OTP code')
        }

        return otpResponse
    }

    public async invalidateOtp(code: string): Promise<void> {
        const otpResponse: Otp = await this.findOtp(code)

        await Otp.findOneAndUpdate({ code }, { isUsed: true }, { new: true })
    }
}

export { OtpProvider }
