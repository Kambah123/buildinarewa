import {describe, expect, it} from 'vitest';
import {productFiltersSchema, productSubmissionSchema, reviewSchema} from '@/lib/validations/product';

describe('validation schemas', () => {
  it('normalises missing directory filters to safe defaults', () => {
    expect(productFiltersSchema.parse({})).toMatchObject({q: '', sort: 'featured', page: 1});
  });

  it('rejects an invalid submission website', () => {
    const result = productSubmissionSchema.safeParse({
      name: 'Kasuwa Kit',
      website: 'not-a-url',
      taglineEn: 'A helpful tool for independent local sellers.',
      descriptionEn: 'A deliberately long description for a product that meets the required content threshold and gives reviewers useful context.',
      category: 'e-commerce',
      state: 'KN',
      city: 'Kano',
      stage: 'beta',
      funding: 'bootstrapped',
      makerRole: 'Founder'
    });
    expect(result.success).toBe(false);
  });

  it('requires a useful rejection reason', () => {
    const result = reviewSchema.safeParse({productId: 'f2c08006-a22a-4cd7-8182-bac625e5dc29', decision: 'rejected'});
    expect(result.success).toBe(false);
  });
});
