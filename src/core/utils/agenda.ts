import env from '../../config/env.config';
import { Agenda } from '@hokify/agenda';
// import { logger } from './logger';

// const agenda = new Agenda({
//   db: {
//     address: env.DB_URI,
//     collection: 'cron-jobs',
//   },
// });

// agenda.on('ready', async () => {
//   // agenda.define('welcomeMessag', () => {
//   //   console.log('Sending a welcome message every few seconds');
//   // });
//   await Promise.all([
//     // await agenda.start(),
//     // await agenda.every('5 seconds', 'welcomeMessag');
//     agenda.purge(),
//   ]);

//   logger.info('Agenda Cron Ready ✔');
// });

// agenda.on('start', async () => {
//   logger.info('Agenda Cron Started ✔');
// });

// const completed = async () => {
//   await agenda.stop();

//   logger.info('Agenda Cron Stopped ✔');

//   process.exit(0);
// };

// // process.on('SIGTERM', completed)
// // process.on('SIGINT', completed)

const agenda = () => {}; // placeholder for agenda

export { agenda };
