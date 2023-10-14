import { z } from 'zod';


const createUserSchema = z.object({
  body: z
    .object({
      name: z.object({
        firstName: z.string().min(1, { message: 'First name is required' }),
        lastName: z.string().min(1, { message: 'Last name is required' }),
      }),
      phone_number: z.string().min(1, { message: 'Phone number is required' }),
      email: z.string().email({ message: 'Valid email address is required' }),
      // dateOfBirth: z.string().datetime({ message: 'Date of birth is required' }),
      // image: z.string().optional(),
      // gender: z.enum(['male', 'female'], { required_error: 'Gender is required' }),
      // nationality: z.string().min(1, { message: 'Nationality is required' }),
      // passport: z.object({
      //   number: z.string().optional(),
      //   expirationDate: z.string().datetime().optional(),
      // }).optional(),
      // role: z.enum(userRoleValues, { required_error: 'Valid user role is required' }), 
      password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
      // address: z.object({
      //   state: z.string().min(1, { message: 'State is required' }),
      //   street: z.string().min(1, { message: 'Street address is required' }),
      //   zip: z.string().min(1, { message: 'ZIP code is required' }),
      //   coordinates: z.array(
      //     z.object({
      //       lat: z.number(),
      //       lng: z.number(),
      //     })
      //   ).optional(),
      // }),
      // age: z.number({ required_error: 'Age is required' }),
    })
    .catchall(
      z
        .unknown()
        .refine(() => false, {
          message: 'Zod Validation Failed: Invalid body data, please see api documentation',
        })
    ),
});

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});


export default {
  createUserSchema, loginZodSchema, refreshTokenZodSchema
};
