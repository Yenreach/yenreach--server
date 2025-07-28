import { z } from 'zod';
import { AdminAuthorizationLevel } from '../enums';

// Password regex: Min 8 chars, 1 uppercase, 1 number, 1 special char
const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

export const CreateAuthSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
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

export const CreateAdminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'username is required'),
  official_email: z.email('Invalid email address'),
  personal_email: z.email('Invalid email address'),
  password: z
    .string()
    .regex(strongPasswordRegex, 'Password must be at least 8 characters, include one uppercase letter, one number, and one special character'),
  phoneNumber: z.string().optional(),
  authorizationLevel: z.enum(Object.values(AdminAuthorizationLevel)).refine(val => Object.values(AdminAuthorizationLevel).includes(val), {
    message: `authorizationLevel must be one of: ${Object.values(AdminAuthorizationLevel).join(', ')}`,
  }),
});

export const LoginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password cannot be empty'),
});

export const AdminLoginSchema = z.object({
  email: z.email('Invalid email address').optional(),
  username: z.string().optional(),
  password: z.string().min(1, 'Password cannot be empty'),
});

export type CreateAuthDto = z.infer<typeof CreateAuthSchema>;
export type CreateAdminDto = z.infer<typeof CreateAdminSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type AdminLoginDto = z.infer<typeof AdminLoginSchema>;
