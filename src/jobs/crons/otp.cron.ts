import { Otp, PasswordToken } from '@/auth/models';
import { agenda, logger } from '@/core/utils'

agenda.define('delete otp',async (job: any) => {
    const { code, user } = job.attrs.data

    const otp = await Otp.findOne({ code, user })

    if (!otp) {
        job.fail(new Error('No code found'));

        await job.remove();
    }

    await Otp.findByIdAndDelete(otp._id)

    await job.save();
})

agenda.define('delete password token',async (job: any) => {
    const { token, user } = job.attrs.data

    const passwordToken = await PasswordToken.findOne({ token, user })

    if (!passwordToken) {
        job.fail(new Error('No password token found'));

        await job.remove();
    }

    await PasswordToken.findByIdAndDelete(passwordToken._id)

    await job.save();
})

agenda.on('complete:delete otp', async (job: any) => {
    await job.remove()

    logger.info(`Deleted OTP Successfully ✔`)
})

agenda.on('complete:delete password token', async (job: any) => {
    await job.remove()

    logger.info(`Deleted OTP Successfully ✔`)
})