import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Invalid email address'),
    password: z.string({
      required_error: 'Password is required',
    }).min(6, 'Password must be at least 6 characters long'),
    name: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Invalid email address'),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

export const createTreeSchema = z.object({
  body: z.object({
    species: z.string({
      required_error: 'Species name is required',
    }).trim().min(1, 'Species name cannot be empty'),
    latitude: z.number({
      required_error: 'Latitude is required',
    }).min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
    longitude: z.number({
      required_error: 'Longitude is required',
    }).min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
    plantingDate: z.string({
      required_error: 'Planting date is required',
    }).refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid planting date format (should be YYYY-MM-DD or ISO string)',
    }),
    health: z.enum(['Good', 'Fair', 'Poor'], {
      errorMap: () => ({ message: 'Health status must be one of: Good, Fair, Poor' }),
    }),
  }),
});

export const updateTreeHealthSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'Tree ID is required',
    }),
  }),
  body: z.object({
    health: z.enum(['Good', 'Fair', 'Poor'], {
      errorMap: () => ({ message: 'Health status must be one of: Good, Fair, Poor' }),
    }),
  }),
});
