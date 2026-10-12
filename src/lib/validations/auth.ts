import { z } from 'zod';

import { emailSchema } from '@/lib/validations/common';

export const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string({ error: 'Password is required.' })
    .min(1, 'Password is required.')
    .max(256, 'Password is too long.'),
});

export type SignInInput = z.input<typeof signInSchema>;
export type SignInValues = z.output<typeof signInSchema>;
