import cote from 'cote'
import { EmailProvider } from '../providers'
import { CtxObject } from '@/interfaces/'
import { EmailPayload } from '../interfaces'

const EmailRequester = new cote.Requester({
    name: 'Email Requester',
    key: 'email',
    requests: [
        'send_email'
    ]
})

const EmailResponder = new cote.Responder({
    name: 'Email Responder',
    key: 'email',
    respondsTo: [
       'send_email'
    ],
})


EmailResponder.on('send_email', async (ctx: CtxObject, cb) => {
   return await new EmailProvider().sendMail(ctx.payload as EmailPayload)
})



export { EmailRequester }