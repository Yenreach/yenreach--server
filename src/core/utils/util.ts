import { Notification } from "../../user/models/NotificationModel";
import { UserProvider } from "../../user/providers";
import { logger } from "./logger";

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
}

/**
 * Send Push Notification To Users
 * @param param0 
 * @returns 
 */
const sendNotification = async ({ userId, title, body }) => {
  try {
    logger.info(`Notification sent successfully!`)
    const sentNotification = await (new UserProvider).sendNotification({ userId, title, body })
    await Notification.create({ user: userId, title, body, data: sentNotification.responses, status: "sent" })
  } catch (error: any) {
    await Notification.create({ user: userId, title, body, data: error.stack, status: "failed" })
    logger.error(error.stack)
  }
}

export { isEmpty, sendNotification }
