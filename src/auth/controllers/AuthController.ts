import { NextFunction, Request, Response } from 'express';
import { AuthDto } from '../dtos';
import { RequestWithUser } from '@/auth/interfaces/AuthInterface';
import { AuthenticationProvider, TokenProvider } from '../providers';
import { sendResponse } from '@/core/utils/response';
import { HttpCodes } from '@/core/constants';
import { CardProvider } from '../../card/providers';
import { AccountProvider } from '../../account/providers';
import { AccountRequester } from '../../account';
import { ContactProvider } from '../../contact/providers';
import { agenda } from '@/core/utils'
import { isNumber } from 'class-validator';
import { SMSPublisher } from '../../sms';
import { EmailProvider } from '../../email/providers';
import { APP_NAME, APP_URL } from '../../config';

class AuthController {
    public authProvider = new AuthenticationProvider();
    public cardProvider = new CardProvider();
    public accountProvider = new AccountProvider();
    public contactProvider = new ContactProvider();

    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authProvider.registerUser(req.body);

            const token = await new TokenProvider().createToken(user._id)

            const account = await AccountRequester.send({
                type: 'create_account', payload: {
                    userId: user._id,
                    type: req.body.accountType
                }
            })

            await Promise.all([
                this.cardProvider.createCard(user._id, { type: 'personal' }),
                this.contactProvider.createContact(user._id),


                // AuthOptionRequester.send({
                //     type: 'create_2fa',
                //     user: user._id
                // }),

                agenda.schedule('2 seconds', 'create wallet', {
                    name: user.name.full,
                    email: user.email,
                    phone: user.phoneNumber,
                    userId: user._id
                })

            ])
            // return { user, account, token }
            return sendResponse(res, HttpCodes.CREATED, 'User registration successful', { user, account, token });
        } catch (error) {
            next(error);
        }
    }

    public sendPhoneOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authProvider.sendPhoneOtp(req.body.phoneNumber);
            return sendResponse(res, HttpCodes.OK, 'OTP code sent successfully');
        } catch (error) {
            next(error);
        }
    }

    public verify = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body?.phoneNumber) throw new Error("Please provide phone number you are trying to verify!");

            const data = await this.authProvider.verifyPhoneNumber(req.body.code,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                req.body?.phoneNumber);
            return sendResponse(res, HttpCodes.OK, 'User verification successful', data);
        } catch (error) {
            next(error);
        }
    }

    public resendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authProvider.sendPhoneOtp(req.body.phoneNumber);
            return sendResponse(res, HttpCodes.CREATED, 'OTP code sent successfully');
        } catch (error) {
            next(error);
        }
    }

    public checkDuplicates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authProvider.checkDuplicates(req.body.field);
            return sendResponse(res, HttpCodes.OK, 'Available to use');
        } catch (error) {
            next(error);
        }
    }

    // public addAddress = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    //     try {
    //         await this.authProvider.addAddress(req.user._id, req.body.address);
    //         return sendResponse(res, HttpCodes.OK, 'Address set successful');
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    public logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.authProvider.login(req.body as AuthDto);
            return sendResponse(res, HttpCodes.OK, 'Login successful', data);
        } catch (error) {
            next(error);
        }
    }

    public requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const passwordToken = await this.authProvider.requestPasswordReset(req.body.field);

            if (isNumber(req.body.field)) {
                await SMSPublisher.publish('send_sms', {
                    body: `
Your Morizon Reset Code is ${passwordToken.code}
        `,
                    to: `+${String(req.body.field)}`
                } as unknown as Event)
            } else {
                const user = await this.authProvider.findUser({ email: req.body.field })
                await (new EmailProvider).sendMail({
                    to: req.body.field,
                    subject: `${APP_NAME} - Password Reset Link`,
                    payload: {
                        name: user.name,
                        reset_link: `${APP_URL}/auth/password/reset/${passwordToken.token}`
                    },
                    template: '../templates/auth/reset.handlebars'
                })
            }

            return sendResponse(res, HttpCodes.OK, 'Password reset code sent successfully');
        } catch (error) {
            next(error);
        }
    }

    public verifyPasswordCode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authProvider.verifyPasswordResetCode(req.body.code);
            return sendResponse(res, HttpCodes.OK, 'Code verification successful');
        } catch (error) {
            next(error);
        }
    }

    public changePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authProvider.changePassword(req.body.token, req.body.password, req.body.confirmPassword);
            return sendResponse(res, HttpCodes.OK, 'Password changed successfully');
        } catch (error) {
            next(error);
        }
    }

    public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            await this.authProvider.logout(req.headers.authorization);
            return sendResponse(res, HttpCodes.OK, 'Logout successful');
        } catch (error) {
            next(error);
        }
    };
}

export { AuthController };
