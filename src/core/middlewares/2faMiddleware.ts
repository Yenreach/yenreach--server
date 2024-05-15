/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/core/exceptions';
import { RequestWithUser } from '@/auth/interfaces';
import { HttpCodes } from '@/core/constants'
import { AuthOption } from '@/2fa/models';
import authenticator from 'authenticator';
import { AuthenticationProvider } from '../../auth/providers';
import { verify } from 'jsonwebtoken';

const getAuthOption = async (user) => {
    const authOption = await AuthOption.findOne({ user })
        .populate({
            path: 'user',
            select: 'name displayPhoto phoneNumber'
        })

    return authOption
}

const canSendCrypto = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const response = await getAuthOption(req.user?._id)

    if (response.canSendCrypto != true) {
        throw new HttpException(HttpCodes.BAD_REQUEST, 'Cannot send crypto with this account')
    }

    next()
};

const canSendMoney = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const response = await getAuthOption(req.user?._id)

    if (response.canSendMoney != true) {
        throw new HttpException(HttpCodes.BAD_REQUEST, 'Cannot send money with this account')
    }

    next()
};

const canLoginApp = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const response = await getAuthOption(req.user?._id)

    if (response?.canLoginApp != true) {
        throw new HttpException(HttpCodes.BAD_REQUEST, 'Cannot login via app')
    }

    next()
};


/**
 * Verify OtpCode
 * @param code
 * @param user
 * @returns
 */
export const verifyOtpCode = async (req: Request | RequestWithUser, user: string) => {
    const code = req.body.otpCode || req.query.otpCode
    const authOption = await getAuthOption(user)
    if (!authOption) throw new Error("User is yet to activate 2FA!");

    const authenticationProvider = new AuthenticationProvider();

    if (!code) {
        if (!authOption.googleAuth) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await authenticationProvider.sendPhoneOtp(authOption.user.phoneNumber)
        }
        throw new Error("2FA code is reqiured for this request!")
    };

    if (authOption.googleAuth) {
        if (!authenticator.verifyToken(authOption.otp.formattedKey, code.toString())) throw new HttpException(HttpCodes.BAD_REQUEST, 'Incorrect Google 2FA code!')
    } else {
        if (!await authenticationProvider.verifyPhoneNumber(code,
            // @ts-ignore
            req.user?.phoneNumber)) throw new HttpException(HttpCodes.BAD_REQUEST, 'Incorrect OTP code!')
    }

    return true;
}

export { canLoginApp, canSendCrypto, canSendMoney }
