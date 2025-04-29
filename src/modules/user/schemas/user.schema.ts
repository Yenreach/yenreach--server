import { z } from 'zod';

// Strong password validation: min 8 chars, 1 uppercase, 1 number, 1 special char
const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

export const CreateUserSchema = z.object({
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

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z
    .string()
    .regex(strongPasswordRegex, 'Password must be at least 8 characters, include one uppercase letter, one number, and one special character')
    .optional(),
  profileImage: z.string().optional(),
  referral: z.string().optional(),
  cv: z.string().optional(),
  dob: z.string().optional(),
  phoneNumber: z.string().optional(),
  gender: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
