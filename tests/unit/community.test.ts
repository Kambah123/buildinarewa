import {describe, expect, it} from 'vitest';
import {seedBuilders, seedStories} from '@/lib/seed-community';
import {localizedText} from '@/lib/utils';

describe('Stage 2 seed editorial data', () => {
  it('keeps every seed story attached to a clearly marked seed builder', () => {
    expect(seedStories.every((story) => story.isSeed && seedBuilders.some((builder) => builder.id === story.builderId))).toBe(true);
  });

  it('falls back to English when Hausa editorial copy is not available', () => {
    expect(localizedText('ha', 'English copy', '')).toBe('English copy');
  });
});
