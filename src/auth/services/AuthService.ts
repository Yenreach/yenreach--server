import cote from 'cote'
import { AuthenticationProvider, PasswordTokenProvider, OtpProvider, TokenProvider } from '../providers'
import { EmailRequester } from '@/email'
import { CtxObject } from '@/interfaces/'
import { APP_NAME, APP_URL } from '@/config'
import { AccountRequester } from '@/account'
import { SMSPublisher } from '@/sms'
import { CardRequester } from '@/card'
import { isNumber } from 'class-validator'
import { ContactRequester } from '@/contact/services'
import { agenda } from '@/core/utils'

const AuthenticationRequester = new cote.Requester({
    name: 'Authentication Requester',
    key: 'auth',
    requests: [
        'register',
        'verify',
        'check_duplicate',
        'resend',
        'login',
        'request_password_reset',
        'verify_password_code',
        'change_password'
    ]
})

const AuthenticationResponder = new cote.Responder({
    name: 'Authentication Responder',
    key: 'auth',
    respondsTo: [
        'register',
        'verify',
        'check_duplicate',
        'resend',
        'login',
        'verify_password_code',
        'request_password_reset',
        'change_password'
    ],
})

const authProvider = new AuthenticationProvider()

AuthenticationResponder.on('register', async (ctx: CtxObject, cb) => {
    const user = await authProvider.registerUser(ctx.payload)

    const token = await new TokenProvider().createToken(user._id)

    const account = await AccountRequester.send({
        type: 'create_account', payload: {
            userId: user._id,
            type: ctx.payload.accountType
        }
    })

    // vault

    await Promise.all([
        CardRequester.send({
            type: 'create_card', payload: {
                userId: user._id,
                data: { type: 'personal' }
            }
        }),

        ContactRequester.send({
            type: 'create_contact', payload: {
                userId: user._id
            }
        }),


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
    return { user, account, token }
})

AuthenticationResponder.on('verify', async (ctx: CtxObject, cb) => {
    // return await authProvider.verifyPhoneNumber(ctx.payload.code)
})

AuthenticationResponder.on('check_duplicate', async (ctx: CtxObject, cb) => {
    return await authProvider.checkDuplicates(ctx.payload.value)
})

AuthenticationResponder.on('send_phone_otp', async (ctx: CtxObject, cb) => {
    return await authProvider.sendPhoneOtp(ctx.payload.phoneNumber)
})


AuthenticationResponder.on('resend', async (ctx: CtxObject, cb) => {
    return await authProvider.sendPhoneOtp(ctx.payload.phoneNumber)
})

AuthenticationResponder.on('login', async (ctx: CtxObject, cb) => {
    const loggedIn = await authProvider.login(ctx.payload)
    return loggedIn;
})

AuthenticationResponder.on('request_password_reset', async (ctx: CtxObject, cb) => {
    const passwordToken = await authProvider.requestPasswordReset(ctx.payload.field)

    if (isNumber(ctx.payload.field)) {
        await SMSPublisher.publish('send_sms', {
            body: `
        Your Morizon Reset Code is ${passwordToken.code}
        `,
            to: `+${String(ctx.payload.field)}`
        } as unknown as Event)
    } else {
        const user = await authProvider.findUser({ email: ctx.payload.field })

        EmailRequester.send({
            type: 'send_email', payload: {
                to: ctx.payload.field,
                subject: `${APP_NAME} - Password Reset Link`,
                payload: {
                    name: user.name,
                    reset_link: `${APP_URL}/auth/password/reset/${passwordToken.token}`
                },
                template: '../templates/auth/reset.handlebars'
            }
        })
    }
})

AuthenticationResponder.on('verify_password_code', async (ctx: CtxObject, cb) => {
    return await authProvider.verifyPasswordResetCode(ctx.payload.code)
})

AuthenticationResponder.on('change_password', async (ctx: CtxObject, cb) => {
    return await authProvider.changePassword(ctx.payload.passwordToken, ctx.payload.password, ctx.payload.confirmPassword)
})

AuthenticationResponder.on('logout', async (ctx: CtxObject) => {
    return await authProvider.logout(ctx.token)
})

export { AuthenticationRequester }
