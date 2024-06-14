import { agenda, logger } from '@/core/utils'
import { delay } from '@/core/utils/delay';
import { EmailProvider } from '@/email/providers'

import { User } from '@/user/models';

const users = [
  {
    name: 'ebi',
    email: 'oebiyeladouemmanuel@gmail.com',
    email_track: '1',
  },
  {
    name: 'ebi',
    email: 'oracleebi247@gmail.com',
    email_track: '1',
  },
  {
    name: 'ebi',
    email: 'codesoracle247@gmail.com',
    email_track: '1',
  },
  {
    name: 'ebi',
    email: 'ebiyeladou@gmail.com',
    email_track: '1',
  },
]

const userCount = 4


agenda.define('send_mail', async (job: any, done: any) => {
  logger.info('email cron running');

  // const { user } = job.attrs.data

  // try {
  //   const [users, userCount] = await Promise.all([
  //     User.find({ email_track: { $lt: 7 } }),
  //     User.countDocuments()
  //   ])
  // } catch (error) {
  //   console.error('error getting user:', error);
  //   done(error);
  // }


  console.log({ users, userCount })
  console.log('hi')

  const batchSize = 100;
  const delayBetweenBatches = 60000;

  for (let i = 0; i < userCount; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    batch.map((user: any) => {
      try {
        (new EmailProvider).sendMail({
          to: user.email,
          subject: `Yeanrach - KYC Request Succeeded`,
          payload: {
            heading: 'Welcome to Yenreach',
            name: user.name,
            message: "<p>hello</p>"
          },
          template: '../templates/email.handlebars'
        })
      } catch (error: any) {
        logger.error(`Failed to send batch ${i / batchSize + 1}:`, error);
        done(error)
      }
    })

    console.log(`Batch ${i / batchSize + 1} sent`);
    if (i + batchSize < userCount) {
      await delay(delayBetweenBatches);
    }
  }
})

// agenda.define('welcomeMessa', () => {
//   console.log('Sending a welcome message every few seconds');
// });

agenda.every('5 minutes', 'send_mail');

// agenda.on('complete:KycStatusCheck', async (job: any) => {
//   await job.remove()

//   logger.info(`Deleted OTP Successfully ✔`)
// })
