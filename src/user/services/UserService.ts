import cote from 'cote'
import { APP_NAME, APP_URL } from '@/config'
import { CtxObject } from '@/interfaces'
import { EmailRequester } from '@/email/services'
import { UserProvider } from '../providers'
import { KYCProvider } from '../providers/KYCProvider'

const UserRequester = new cote.Requester({
    name: 'User Requester',
    key: 'user',
    requests: [
        'get_users',
        'get_single_user',
        'update_user',
        'change_password',
        'delete_user',
        'update_user_tokens',
        'start_kyc_verification',
    ]
})

const UserResponder = new cote.Responder({
    name: 'user Responder',
    key: 'user',
    respondsTo: [
        'get_users',
        'get_single_user',
        'update_user',
        'change_password',
        'delete_user',
        'update_user_tokens',
        'start_kyc_verification',
    ],
})

const userProvider = new UserProvider()
const kycProvider = new KYCProvider()




UserResponder.on('send_notification', async (ctx: CtxObject, cb) => {
    return await userProvider.sendNotification(ctx.payload)
})

UserResponder.on('update_user_tokens', async (ctx: CtxObject, cb) => {
    return await userProvider.updateUserToken(ctx.payload)
})

UserResponder.on('get_users', async (ctx: CtxObject, cb) => {
    return await userProvider.getUsers()
})

UserResponder.on('get_single_user', async (ctx: CtxObject, cb) => {
    return await userProvider.getUserById(ctx.payload.id)
})

UserResponder.on('update_user', async (ctx: CtxObject, cb) => {
    return await userProvider.updateUser(ctx.payload.id, ctx.payload.data)
})


UserResponder.on('change_password', async (ctx: CtxObject, cb) => {
    return await userProvider.changeUserPassword(ctx.payload.id, ctx.payload.oldPassword, ctx.payload.newPassword)
})

UserResponder.on('delete_user', async (ctx: CtxObject, cb) => {
    return await userProvider.deleteUser(ctx.payload.id)
})

UserResponder.on('start_kyc_verification', async (ctx: CtxObject, cb) => {
  return await kycProvider.startKycVerification(ctx.payload.data)
})

export { UserRequester }
