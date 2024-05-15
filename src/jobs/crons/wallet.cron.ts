import { agenda, logger } from '@/core/utils'
import { WalletRequester } from '@/wallet/services';
import { WalletProvider } from '../../wallet/providers';

agenda.define('create wallet', async (job: any) => {
    const { email, name, phone, userId } = job.attrs.data

    try {
        // await WalletRequester.send({
        //     type: 'create_wallet',
        //     payload: {
        //         data: {
        //             email,
        //             name,
        //             phone: String(phone)
        //         },
        //         userId
        //     }
        // })
        await (new WalletProvider).createWallet({
            email,
            name,
            phone: String(phone),
            userId
        }, userId)
    } catch (error) {
        logger.error(error)
        return 0
    }

    await job.save()
})


agenda.on('complete:create wallet', async (job: any) => {
    await job.remove()

    logger.info(`Wallet seeded Successfully ✔`)
})

