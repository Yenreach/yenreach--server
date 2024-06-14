import { Twilio } from 'twilio'
import { SMS } from '../interfaces'
import { HttpException } from '../../core/exceptions'
import { logger } from '../../core/utils'
import { TWILIO_NUMBER, TWILIO_SID, TWILIO_TOKEN } from '../../config'


class SMSProvider {
  public client = new Twilio(TWILIO_SID, TWILIO_TOKEN)

  public async sendSMS(payload: SMS) {
    try {
      await this.client.messages.create({ body: `TWILIO_SID: ${TWILIO_SID}, TWILIO_TOKEN: ${TWILIO_TOKEN}`, to: '2349048988056', from: String(TWILIO_NUMBER) })
      await this.client.messages
        .create({
          ...payload,
          from: String(TWILIO_NUMBER)
        })
        .then((msg) => {
          logger.info(`Message sent successfully.

            ${msg}
            `)
        })
        .catch(err => {
          console.log(err)
          logger.error(err)
        })
    } catch (err) {
      console.log(err)
    }
  }
}

export { SMSProvider }
