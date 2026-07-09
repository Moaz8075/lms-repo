import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password must include uppercase, lowercase, and a number',
  });

export const registerSchema = z
  .object({
    organizationName: z.string().min(1, 'Organization name is required').min(2, 'Too short'),
    organizationSlug: z
      .string()
      .min(1, 'Organization slug is required')
      .min(2, 'Slug must be at least 2 characters')
      .regex(slugRegex, 'Use lowercase letters, numbers, and hyphens only'),
    ownerName: z.string().min(1, 'Owner name is required').min(2, 'Too short'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Enter a valid email address'),
    phone: z.string().optional(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export function slugifyOrganizationName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
