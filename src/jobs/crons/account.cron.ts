import { Account } from '@/account/models';
import { DAILY_ACCOUNT_LIMIT } from '@/config';
import { agenda, logger } from '@/core/utils'

agenda.define('renew account limit', async (job: any) => {
    const { user } = job.attrs.data

    await Account.findOneAndUpdate({ user }, {
        limit: {
            daily: DAILY_ACCOUNT_LIMIT
        }
    })

    await job.save()
})


agenda.on('complete:renew account limit', async (job: any) => {
    logger.info(`Renew account Successfully ✔`)
})

