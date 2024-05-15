import { compare, hash } from 'bcrypt'
import { isNumber } from 'class-validator'
import { JwtPayload, verify } from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '@/config'
import { HttpException } from '@/core/exceptions/HttpException'
import { HttpCodes } from '@/core/constants'
import { User } from '@/user/models'
import { isEmpty } from '@/core/utils/util'
import { AuthDto } from '../dtos'
import { PasswordToken } from '../models'
import { TokenProvider } from './TokenProvider'
import { PasswordTokenProvider } from './PasswordTokenProvider'
import { Otp, TokenResponse } from '../interfaces'
import { OtpProvider } from './OtpProvider'
import { AccountDocument } from '@/account/interfaces'
import { Account } from '@/account/models'
import { generateDP } from '@/core/utils'
import { SMSProvider } from '@/sms/providers'
import { WalletProvider } from '@/wallet/providers'
import { Customer, Wallet } from '@/wallet/models'
import { AuthOption } from '../../2fa/models'
import { AuthOptionsDocument } from '../../2fa/interfaces'
import vault from '@/wallet/utils/vault.utils'

class AuthenticationProvider {
    public tokenProvider = new TokenProvider()
    public passwordTokenProvider = new PasswordTokenProvider()
    public otpProvider = new OtpProvider()
    public smsProvider = new SMSProvider()
    public walletProvider = new WalletProvider()
    public authOptionModel = AuthOption;
    public userModel = User
    public accountModel = Account

    public async registerUser(payload: User): Promise<User> {
        // Convert email to lowercase in payload request
        payload.email = payload.email.toLowerCase()

        if (payload.password.length < 8) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Minimum password length is 8')
        }

        const existingEmail = await this.userModel.findOne({ email: payload.email })

        const existingPhoneNumber = await this.userModel.findOne({ phoneNumber: payload.phoneNumber })

        if (existingEmail) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Email already exists')
        }

        if (existingPhoneNumber) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Phone number already exists')
        }

        const vaultPassword = `Pas${`${payload.phoneNumber}`.substring(-0, 5)}$$`;
        console.log({ vaultPassword })
        await vault({}).auth.createAccount({ phone: `${payload.phoneNumber}`, password: vaultPassword })

        const createdUser: User = await this.userModel.create({
            ...payload,
            displayPhoto: await generateDP(`${payload.name.first} ${payload.name.last}`)
        })


        try {
            await this.authOptionModel.create({
                user: createdUser._id
            })
        } catch (error) {

        }

        return createdUser
    }

    public async findUser(query: any): Promise<User> {
        const user: User = await this.userModel.findOne(query)
        console.log({ query, user }, 'Fiats')
        if (!user) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'User does not exist')
        }

        return user
    }

    public async sendPhoneOtp(phoneNumber: number) {
        const foundUser = await this.userModel.findOne({ phoneNumber })
        if (foundUser?.phoneNumber && !foundUser.phoneVerified)
            return await vault({}).auth.resendOtp(`${foundUser.phoneNumber}`)
        // return await vault({}).auth.resendOtp(`${phoneNumber}`)
        const otp = await this.otpProvider.createOtp(phoneNumber)

        await this.smsProvider.sendSMS(
            {
                body: `
        Your Morizon OTP code is ${otp.code}
        `,
                to: `+${String(phoneNumber)}`
            })
    }

    public async verifyPhoneNumber(code: string, phone: string): Promise<Otp> {
        const foundUser = await this.userModel.findOne({ phoneNumber: phone })
        console.log({ foundUser })
        if (foundUser?.phoneNumber && !foundUser.phoneVerified) {
            const returned = await vault({}).auth.verifyPhone({
                phone,
                smsCode: code
            }) as any;

            return {
                code,
                isUsed: true,
                phoneNumber: Number(phone)
            }
        }
        const otp = await this.otpProvider.findOtp(code)

        await this.otpProvider.invalidateOtp(otp.code)

        return otp
    }

    public async checkPhoneNumber(phoneNumber: number): Promise<void> {
        const user = await this.userModel.findOne({ phoneNumber })

        if (user) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Phone number already used')
        }
    }

    public async checkDuplicates(value: string | number): Promise<void> {
        let user;


        if (isNumber(value)) {
            user = await this.findUser({ phoneNumber: value })
        } else {
            user = await this.userModel.findOne({ email: value })
        }

        if (user) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Already in use !')
        }
    }

    public async login(userData: AuthDto): Promise<{ user: User, account: AccountDocument, token: TokenResponse, authOption: AuthOptionsDocument | null }> {
        if (isEmpty(userData)) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Field is empty')
        }

        const user: User = await this.findUser({ email: userData.email?.toLowerCase() })

        const isPasswordMatching: boolean = await compare(userData.password, user.password)

        if (isPasswordMatching === false) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Password is incorrect')
        }

        const token: TokenResponse = await this.tokenProvider.createToken(user._id)

        const account = await this.accountModel.findOne({ user: user._id })
            .populate({
                path: 'user',
                select: 'name display_picture isVerified email'
            })


        const authOption = await this.authOptionModel.findOne({ user: user._id })



        await this.userModel.findByIdAndUpdate(user._id, { lastLogin: new Date() })

        // console.log({
        //     name: user.name.full,
        //     email: user.email,
        //     phone: user.phoneNumber,
        //     userId: user._id
        // })

        this.walletProvider.createWallet({
            name: user.name,
            email: user.email,
            phone: user.phoneNumber,
            userId: user._id
        }, user._id)
            .then(createdUser => {
                // console.log('created user', createdUser)
            }).catch(console.error)
        return { user, account, token, authOption }
    }

    public async requestPasswordReset(field: string | number): Promise<PasswordToken> {
        if (isEmpty(field)) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Field is empty')
        }

        let user

        if (isNumber(field)) {
            user = await this.findUser({ phoneNumber: field })
        } else {
            user = await this.findUser({ email: field?.toString()?.toLowerCase() })
        }

        return this.passwordTokenProvider.createPasswordToken(user._id)
    }

    public async verifyPasswordResetCode(code: string): Promise<PasswordToken> {
        return this.passwordTokenProvider.findPasswordOtp(code)
    }

    public async changePassword(passwordToken: string, password: string, confirmPassword: string): Promise<void> {
        if (isEmpty([passwordToken, password, confirmPassword])) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Fields are empty')
        }

        const token: PasswordToken = await this.passwordTokenProvider.findPasswordToken(passwordToken)

        if (token.isUsed) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Password token already used')
        }

        if (String(password) !== String(confirmPassword)) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Password does not match')
        }

        await this.userModel.findByIdAndUpdate(token.user, { password: await hash(password, 10) })

        return this.passwordTokenProvider.invalidatePasswordToken(token.token)
    }

    public async logout(token: string): Promise<void> {
        const extractedToken: string = token.split(' ')[1]

        const tokenPayload: string | JwtPayload = await verify(extractedToken, JWT_SECRET_KEY)

        if (isEmpty(token)) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Authentication token is empty')
        }

        if (!tokenPayload) {
            throw new HttpException(HttpCodes.BAD_REQUEST, 'Token is invalid')
        }

        return this.tokenProvider.invalidateToken(extractedToken)
    }
}

export { AuthenticationProvider }
