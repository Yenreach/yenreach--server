import cote from 'cote';
import { SMSProvider } from '../providers';
import { CtxObject } from '../../interfaces';
import { SMS } from '../interfaces';
import moment from 'moment';
const sentSMSs = [];

const SMSPublisher = new cote.Publisher({
  name: 'SMS Publisher',
  key: 'sms',
  broadcasts: ['send_sms'],
});

const SMSSubscriber = new cote.Subscriber({
  name: 'SMS Subscriber',
  key: 'sms',
  subscribesTo: ['send_sms'],
});

SMSSubscriber.on('send_sms', async (body: any) => {
  const foundPhoneFromSentSms = sentSMSs.find(sms => sms.to == body.to);

  if (foundPhoneFromSentSms) {
    // Do not send another sms if sent within 60 sec
    if (moment(foundPhoneFromSentSms.time).diff(moment(new Date()), 'seconds') <= 60) return;
  }
  await new SMSProvider().sendSMS(body);
  sentSMSs.push({ to: body.to, time: new Date() });
});

export { SMSPublisher };
