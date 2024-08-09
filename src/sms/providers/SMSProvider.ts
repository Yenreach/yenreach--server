import { Twilio } from 'twilio'
import { SMS } from '../interfaces'
import { HttpException } from '../../core/exceptions'
import { logger } from '../../core/utils'
import axios from 'axios';
import { SENDCHAMP_APIKEY, SENDCHAMP_LIVEURL, SENDCHAMP_SENDER, TWILIO_NUMBER, TWILIO_SID, TWILIO_TOKEN } from '../../config'
import { HttpCodes } from '../../core/constants';


class SMSProvider {
  public client = new Twilio(TWILIO_SID, TWILIO_TOKEN)

  public async sendSMS(payload: SMS) {
    try {
      // await this.client.messages.create({ body: `TWILIO_SID: ${TWILIO_SID}, TWILIO_TOKEN: ${TWILIO_TOKEN}`, to: '+2347042488422', from: String(TWILIO_NUMBER) })
      // await this.client.messages
      //   .create({
      //     ...payload,
      //     from: String(TWILIO_NUMBER)
      //   })
      //   .then((msg) => {
      //     logger.info(`Message sent successfully.

      //       ${msg}
      //       `)

      //     console.log({ msg })
      //   })
      //   .catch(err => {
      //     console.log({ err })
      //     logger.error(err)

      //     throw new Error(`Failed to send SMS: ${err}`)
      //   })

      console.log(payload)

      const data = {
        ...payload,
        sender_name: SENDCHAMP_SENDER,
        route: "non_dnd"
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${SENDCHAMP_LIVEURL}/sms/send`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${SENDCHAMP_APIKEY}`
        },
        data: data
      };

      const message = await axios.request(config)

      console.log(JSON.stringify(message));
      return message;
      // .then((response) => {
      //   logger.info(`Message sent successfully`)
      //   console.log(JSON.stringify(response.data));
      // })
      // .catch((error) => {
      //   logger.error(`Message sending failed`)
      //   console.log({ error: error.response.data });
      //   throw new Error(error.response.data.message)
      // });
    } catch (err) {
      console.log({ err: err.response.data })
      // throw new Error(`Failed to send SMS: ${err.response.data.message}`)
      throw new HttpException(HttpCodes.BAD_REQUEST, `Failed to send SMS: ${err.response.data.message}`);

    }
  }
}

export { SMSProvider }
