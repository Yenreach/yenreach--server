import { z } from 'zod';

export const BusinessSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  userString: z.string().min(1, 'User id is required'),
  subscriptionString: z.string().optional().default(''),
  category: z.string().min(1, 'Business must belong to a category'),
  facilities: z.string().optional().default(''),
  address: z.string().min(1, 'Business must have an address'),
  lga: z.string().optional().default('Lga where business is situated must be included'),
  town: z.string().optional().default('Town where business is situated must be included'),
  state: z.string().min(1, 'State where the business is situated must be included'),
  stateId: z.number().min(1, 'state id must be included'),
  email: z.string().min(1, 'Business must have an email address'),
  phonenumber: z.string().min(1, 'Business must have a phone number'),
  whatsapp: z.string().optional().default(''),
  website: z.string().optional().default(''),
  twitterLink: z.string().optional().default(''),
  instagramLink: z.string().optional().default(''),
  youtubeLink: z.string().optional().default(''),
  remarks: z.string().optional().default(''),
  cv: z.string().optional().default(''),
  profileImg: z.string().optional().default(''),
  coverImg: z.string().optional().default(''),
  filename: z.string().optional().default(''),
  monthStarted: z.string().min(1, 'Month started is required'),
  yearStarted: z.string().min(1, 'Year started is required'),
  activation: z.number().optional().default(1),
});

export type CreateBusinessDto = z.infer<typeof BusinessSchema>;
export type UpdateBusinessDto = Partial<CreateBusinessDto>;
