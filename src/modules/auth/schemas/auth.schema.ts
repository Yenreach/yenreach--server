import { z } from 'zod';

// Password regex: Min 8 chars, 1 uppercase, 1 number, 1 special char
const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

export const CreateAuthSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .regex(strongPasswordRegex, 'Password must be at least 8 characters, include one uppercase letter, one number, and one special character'),
  profileImage: z.string().optional(),
  referral: z.string().optional(),
  cv: z.string().optional(),
  dob: z.string().optional(),
  phoneNumber: z.string().optional(),
  gender: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password cannot be empty'),
});

export type CreateAuthDto = z.infer<typeof CreateAuthSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
