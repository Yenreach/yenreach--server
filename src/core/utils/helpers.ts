// Function to convert epoch time to ISO string format
export const convertEpochToISO = (epoch: number): string => {
  return new Date(epoch * 1000).toISOString(); // Multiply by 1000 to convert epoch (in seconds) to milliseconds
};
