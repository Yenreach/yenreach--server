import crypto from 'crypto';

// Function to convert epoch time to ISO string format
export const convertEpochToISO = (epoch: number): string => {
  return new Date(epoch * 1000).toISOString(); // Multiply by 1000 to convert epoch (in seconds) to milliseconds
};


/**
 * Encrypts a value using the same logic as the original PHP function.
 * Combines a salt derived from the timer and wraps the value with static strings.
 */
export const encryptValue = (timer: number, value: string): string => {
  if (!timer || !value) return '';

  const timed = timer.toString(16); // equivalent to PHP's dechex
  const pass = `Yenreach${value}${timed}Roundyen`;
  const encrypted = crypto.createHash('sha1').update(pass).digest('hex');

  return encrypted;
};