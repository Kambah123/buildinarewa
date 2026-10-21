import {z} from 'zod';
import {splitCommaList} from '@/lib/utils';

const productStage = z.enum(['idea', 'beta', 'live', 'growing']);
const fundingType = z.enum(['bootstrapped', 'funded']);

export const productFiltersSchema = z.object({
  q: z.string().trim().max(120).optional().default(''),
  category: z.string().trim().max(80).optional().default(''),
  state: z.string().trim().max(8).optional().default(''),
  stage: z.union([productStage, z.literal('')]).optional().default(''),
  funding: z.union([fundingType, z.literal('')]).optional().default(''),
  alternative: z.string().trim().max(120).optional().default(''),
  sort: z.union([z.literal('featured'), z.literal('newest')]).optional().default('featured'),
  page: z.coerce.number().int().min(1).max(10000).optional().default(1)
});

export const productSubmissionSchema = z.object({
  name: z.string().trim().min(2, 'Use at least 2 characters.').max(80),
  website: z.string().trim().url('Enter a valid website URL.').max(500),
  taglineEn: z.string().trim().min(12, 'Use at least 12 characters.').max(150),
  taglineHa: z.string().trim().max(150).optional().or(z.literal('')),
  descriptionEn: z.string().trim().min(60, 'Tell us a little more (at least 60 characters).').max(3000),
  descriptionHa: z.string().trim().max(3000).optional().or(z.literal('')),
  category: z.string().trim().min(1, 'Choose a category.').max(80),
  state: z.string().trim().min(1, 'Choose a state.').max(8),
  city: z.string().trim().min(2, 'Tell us the city.').max(100),
  stage: productStage,
  funding: fundingType,
  alternatives: z.string().trim().max(500).optional().default(''),
  tags: z.string().trim().max(250).optional().default(''),
  makerRole: z.string().trim().min(2, 'Tell us your role.').max(100),
  turnstileToken: z.string().trim().optional().default('')
});

export const reviewSchema = z.object({
  productId: z.string().uuid(),
  decision: z.enum(['approved', 'rejected', 'featured']),
  rejectionReason: z.string().trim().min(10, 'Give a helpful reason of at least 10 characters.').max(1000).optional()
}).superRefine((values, ctx) => {
  if (values.decision === 'rejected' && !values.rejectionReason) {
    ctx.addIssue({code: 'custom', path: ['rejectionReason'], message: 'A reason is required when rejecting a listing.'});
  }
});

export const productEditSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().trim().min(2).max(80),
  taglineEn: z.string().trim().min(12).max(150),
  descriptionEn: z.string().trim().min(60).max(3000),
  category: z.string().trim().min(1).max(80),
  state: z.string().trim().min(1).max(8),
  city: z.string().trim().min(2).max(100),
  stage: productStage,
  funding: fundingType,
  alternatives: z.string().trim().max(500).optional().default(''),
  tags: z.string().trim().max(250).optional().default('')
});

export const emailSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').max(255),
  next: z.string().trim().max(500).optional().default('/')
});

export const newsletterSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').max(255),
  lang: z.enum(['en', 'ha'])
});

export const newsletterConfirmationSchema = z.object({
  token: z.string().uuid()
});

export const builderSchema = z.object({
  name: z.string().trim().min(2).max(120),
  headline: z.string().trim().min(4).max(180),
  bioEn: z.string().trim().min(40).max(3000),
  bioHa: z.string().trim().max(3000).optional().default(''),
  state: z.string().trim().max(8).optional().default(''),
  website: z.string().trim().max(500).optional().default(''),
  x: z.string().trim().max(500).optional().default(''),
  linkedin: z.string().trim().max(500).optional().default(''),
  photoUrl: z.string().trim().max(1000).optional().default('')
}).superRefine((values, ctx) => {
  for (const field of ['website', 'x', 'linkedin', 'photoUrl'] as const) {
    if (values[field] && !/^https?:\/\//i.test(values[field])) ctx.addIssue({code: 'custom', path: [field], message: 'Enter a full URL starting with http:// or https://.'});
  }
});

export const storySchema = z.object({
  builderId: z.string().uuid().optional().or(z.literal('')).transform((value) => value || undefined),
  titleEn: z.string().trim().min(8).max(180),
  titleHa: z.string().trim().max(180).optional().default(''),
  excerptEn: z.string().trim().min(30).max(500),
  excerptHa: z.string().trim().max(500).optional().default(''),
  bodyEn: z.string().trim().min(100).max(30000),
  bodyHa: z.string().trim().max(30000).optional().default(''),
  coverUrl: z.string().trim().max(1000).optional().default(''),
  videoUrl: z.string().trim().max(1000).optional().default(''),
  publish: z.enum(['true', 'false']).default('false')
}).superRefine((values, ctx) => {
  for (const field of ['coverUrl', 'videoUrl'] as const) {
    if (values[field] && !/^https?:\/\//i.test(values[field])) ctx.addIssue({code: 'custom', path: [field], message: 'Enter a full URL starting with http:// or https://.'});
  }
});

export const imageFileSchema = z.object({
  type: z.string().regex(/^image\/(png|jpeg|webp)$/, 'Use a PNG, JPG or WebP image.'),
  size: z.number().positive().max(5 * 1024 * 1024, 'Images must be 5 MB or smaller.')
});

export function parseSubmissionForm(formData: FormData) {
  const raw = {
    name: formData.get('name'),
    website: formData.get('website'),
    taglineEn: formData.get('taglineEn'),
    taglineHa: formData.get('taglineHa'),
    descriptionEn: formData.get('descriptionEn'),
    descriptionHa: formData.get('descriptionHa'),
    category: formData.get('category'),
    state: formData.get('state'),
    city: formData.get('city'),
    stage: formData.get('stage'),
    funding: formData.get('funding'),
    alternatives: formData.get('alternatives'),
    tags: formData.get('tags'),
    makerRole: formData.get('makerRole'),
    turnstileToken: formData.get('turnstileToken')
  };

  return productSubmissionSchema.parse(raw);
}

export function listFields(value: string) {
  return splitCommaList(value);
}
