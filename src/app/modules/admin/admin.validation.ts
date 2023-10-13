import { z } from 'zod';

const createAdminZodSchema = z.object({
  body: z
    .object({
      role: z.string({
        required_error: 'Role is required',
      }),
      password: z.string({
        required_error: 'Password is required',
      }),
      phoneNumber: z.string({
        required_error: 'Phone number is required',
      }),
      name: z.object(
        {
          firstName: z.string({
            required_error: 'First name is required',
          }),
          lastName: z.string({
            required_error: 'Last name is required',
          }),
        },
        { required_error: 'Name name is required' }
      ),
      address: z.string({
        required_error: 'Address is required',
      })
    })
    .catchall(
      z
        .unknown()
        .refine(() => false, {
          message: 'Zod Validation Failed: Invalid body data, please see api documentation',
        })
    ),
});

const loginAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'PhoneNumber is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

export default {
    createAdminZodSchema, loginAdminZodSchema
};
