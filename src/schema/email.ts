import { z } from 'zod';

export const EmailSchema = z.object({
  emails: z.string().email("This is not a valid email"),
});