import { z } from 'zod';

const coordinatesSchema = z.object({
    lat: z.number(),
    lng: z.number(),
  });
  
  const addressSchema = z.object({
    state: z.string(),
    street: z.string(),
    zip: z.string(),
    coordinates: coordinatesSchema,
  });
  

const profileUpdateValidation = z.object({
  body: z
  .object({
    dateOfBirth: z.string().datetime().optional(),
    image: z.string().optional(),
    gender: z.string().optional(),
    nationality: z.string().optional(),
    passport: z.object({
        number: z.string(),
        expirationDate: z.string().datetime()
    }).optional(),
  address: addressSchema.deepPartial(),
  age: z.number().optional(),
  user: z.string().optional(),
  })
  .catchall(
    z
      .unknown()
      .refine(() => false, {
        message: 'Validation Failed: Invalid body data, please see api documentation',
      })
  ),
});

export default {
  profileUpdateValidation,
};
