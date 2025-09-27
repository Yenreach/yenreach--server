import { z } from 'zod';

export const CreateBusinessSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  // category: z.string().min(1, 'Business must belong to a category'),
  address: z.string().min(1, 'Business must have an address'),
  lgaId: z.string().min(1, 'Lga where business is situated must be included'),
  town: z.string().min(1, 'Town where business is situated must be included'),
  stateId: z.string().min(1, 'state id must be included'),
  email: z.string().min(1, 'Business must have an email address'),
  phoneNumber: z.string().min(1, 'Business must have a phone number'),
  experience: z.number().optional(),
  categories: z.array(z.string())
    .min(1, { message: "At least 1 category is required" })
    .max(5, { message: "You can select at most 5 categories" }),
  photos: z.array(z.string()).optional().default([]),
  whatsapp: z.string().optional(),
  website: z.string().optional(),
  twitterLink: z.string().optional(),
  instagramLink: z.string().optional(),
  youtubeLink: z.string().optional(),
  remarks: z.string().optional(),
  cv: z.string().optional(),
  profileImg: z.string().optional(),
  coverImg: z.string().optional(),
  monthStarted: z.string().min(1, 'Month started is required'),
  yearStarted: z.string().min(1, 'Year started is required'),
});

export const UpdateBusinessSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  address: z.string().optional(),
  lgaId: z.string().optional(),
  town: z.string().optional(),
  stateId: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  whatsapp: z.string().optional(),
  website: z.string().optional(),
  twitterLink: z.string().optional(),
  instagramLink: z.string().optional(),
  youtubeLink: z.string().optional(),
  remarks: z.string().optional(),
  cv: z.string().optional(),
  profileImg: z.string().optional(),
  coverImg: z.string().optional(),
  monthStarted: z.string().optional(),
  yearStarted: z.string().optional(),
  categories: z.array(z.string()).optional().default([]),
  photos: z.array(z.string()).optional().default([]),
});

export const AddBusinessReviewSchema = z.object({
  businessId: z.string().min(1, 'Business id is required'),
  review: z.string().min(1, 'Business must have a reivew'),
  star: z.number().optional(),
});

export const AddBusinessWorkingHoursSchema = z.object({
  businessId: z.string().min(1, 'Business id is required'),
  days: z.string().min(1, 'Day is required'),
  openingTime: z.string().min(1, 'Opening time is required'),
  clsoingTime: z.string().min(1, 'Closing time is required'),
});

export const AddBusinessPhotoSchema = z.object({
  businessId: z.string().min(1, 'Business id is required'),
  mediaPath: z.string().min(1, 'Photo url is required'),
});

export const AddBusinessOfTheWeekSchema = z.object({
  businessId: z.string().uuid().min(1, 'Business id is required'),
});

export type AddBusinessWorkingHoursDto = z.infer<typeof AddBusinessWorkingHoursSchema>;
export type ReviewBusinessDto = z.infer<typeof AddBusinessReviewSchema>;
export type CreateBusinessDto = z.infer<typeof CreateBusinessSchema>;
export type UpdateBusinessDto = z.infer<typeof UpdateBusinessSchema>;
export type AddBussinessPhotoDto = z.infer<typeof AddBusinessPhotoSchema>;
export type AddBusinessOfTheWeekDto = z.infer<typeof AddBusinessOfTheWeekSchema>;
