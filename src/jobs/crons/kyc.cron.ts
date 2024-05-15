import { Otp, PasswordToken } from '@/auth/models';
import { agenda, logger } from '@/core/utils'
import vault from '@/wallet/utils/vault.utils'


agenda.define('KycStatusCheck',async (job: any, done: any) => {
    const { token } = job.attrs.data
    console.log('entered job: ', token)

    try {
      const status = await vault({bearerToken: token}).kyc.status()

      console.log('status: ', status)

      if (status.kyc1ClientData.status === 'COMPLETED') {
        console.log('Job completed successfully.');
        done();
      }
      else if (status.kyc1ClientData.status === 'DENIED') {
        console.log('Job Failed: ', status.kyc1ClientData.rejectFormattedMessage);
        done();
      } else {
        console.log('Job not completed yet, scheduling status check again.');
        job.schedule('in 30 seconds');
        done();
      }
    } catch (error) {
      console.error('Error while checking job status:', error);
      done(error);
    }

    // await Otp.findByIdAndDelete(otp._id)

    // await job.save();
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
