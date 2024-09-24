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
      console.log(payload)

      const data = {
        ...payload,
        sender_name: SENDCHAMP_SENDER,
        route: "dnd"
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

      axios.request(config)
        .then((response) => {
          logger.info(`Message sent successfully`)
          console.log(JSON.stringify(response.data));
          return response.data
        })
        .catch((error) => {
          logger.error(`Message sending failed`)
          console.log({ error: error.response.data });
          throw new Error(error.response.data.message)
        });
    } catch (err) {
      console.log({ err: err })
      throw new Error(`Failed to send SMS: ${err.response.data.message}`)
      throw new HttpException(HttpCodes.BAD_REQUEST, `Failed to send/z SMS: ${err.response.data.message}`);

    }
  }

  public async sendSMSSequence(payload: SMS[]) {
    try {

      payload.map((item: SMS) => {
        console.log(item)

        const data = {
          ...item,
          sender_name: SENDCHAMP_SENDER,
          route: "dnd"
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
        axios.request(config)
          .then((response) => {
            logger.info(`Message sent successfully`)
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            logger.error(`Message sending failed`)
            console.log({ error: error.response.data });
            throw new Error(error.response.data.message)
          });
      })


    } catch (err) {
      console.log({ err: err })
      throw new Error(`Failed to send SMS: ${err.response.data.message}`)
      throw new HttpException(HttpCodes.BAD_REQUEST, `Failed to send/z SMS: ${err.response.data.message}`);

    }
  }

  public async sendBulkSMS(payload: SMS[]) {
    try {

      payload.map((item: SMS) => {
        console.log(item)

        const data = {
          ...item,
          sender_name: SENDCHAMP_SENDER,
          route: "dnd"
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
        axios.request(config)
          .then((response) => {
            logger.info(`Message sent successfully`)
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            logger.error(`Message sending failed`)
            console.log({ error: error.response.data });
            throw new Error(error.response.data.message)
          });
      })


    } catch (err) {
      console.log({ err: err })
      throw new Error(`Failed to send SMS: ${err.response.data.message}`)
      throw new HttpException(HttpCodes.BAD_REQUEST, `Failed to send/z SMS: ${err.response.data.message}`);

    }
  }
}

export { SMSProvider }
