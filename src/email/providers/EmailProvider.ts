import sgMail from '@sendgrid/mail'
import { readFileSync } from 'fs'
import { join, resolve } from 'path'
import { compile } from 'handlebars'
import { SENDER_EMAIL, SENDGRID_API_KEY, APP_NAME, APP_URL, APP_LOGO, APP_EMAIL } from '@/config'
import { EmailPayload } from '../interfaces'
import { logger } from '@/core/utils'

class EmailProvider {
    public mailer = sgMail

    constructor() {
        this.mailer.setApiKey(SENDGRID_API_KEY)
    }

    private async compileHtmlEmail(template: string, payload: object) {
        try {
            const templateSource: Buffer = await readFileSync(join(resolve(__dirname, template)))

            const compiledTemplate = compile(String(templateSource))

            console.log(compiledTemplate)

            return compiledTemplate({
                ...payload, app: {
                    name: APP_NAME, url: APP_URL, logo: APP_LOGO, email: APP_EMAIL
                }
            })
        } catch (err) {
            logger.error(err)
        }
    }

    public async sendMail({ to, subject, payload, template }: EmailPayload): Promise<void> {
        try {
            const html: string = await this.compileHtmlEmail(template, payload)

            return this.mailer
                .send({ from: SENDER_EMAIL, to, subject, html })
                .then(() => {
                    logger.info('Email Sent Successfully')
                })
                .catch((err: Error) => {
                    console.log(err)
                    logger.error(err)
                })
        } catch (err) {
            logger.error(err)
        }
    }
}

export { EmailProvider }