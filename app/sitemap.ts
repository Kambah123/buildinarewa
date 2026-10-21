import type {MetadataRoute} from 'next';
import {getCategories, getDirectory, getStates} from '@/lib/queries/catalog';
import {getBuilders, getStories} from '@/lib/queries/community';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const [categories, states, directory, builders, stories] = await Promise.all([getCategories(), getStates(), getDirectory({sort: 'featured'}), getBuilders(), getStories()]);
  const staticPaths = ['', '/products', '/builders', '/stories', '/newsletter', '/about', '/terms', '/privacy'];
  const locales = ['en', 'ha'];
  return [
    ...locales.flatMap((locale) => staticPaths.map((path) => ({url: `${siteUrl}/${locale}${path}`, lastModified: new Date()}))),
    ...directory.products.flatMap((product) => locales.map((locale) => ({url: `${siteUrl}/${locale}/p/${product.slug}`, lastModified: new Date(product.createdAt)}))),
    ...builders.flatMap((builder) => locales.map((locale) => ({url: `${siteUrl}/${locale}/b/${builder.slug}`, lastModified: new Date(builder.createdAt)}))),
    ...stories.flatMap((story) => locales.map((locale) => ({url: `${siteUrl}/${locale}/stories/${story.slug}`, lastModified: new Date(story.publishedAt ?? story.createdAt)}))),
    ...categories.flatMap((category) => locales.map((locale) => ({url: `${siteUrl}/${locale}/categories/${category.slug}`, lastModified: new Date()}))),
    ...states.flatMap((state) => locales.map((locale) => ({url: `${siteUrl}/${locale}/states/${state.slug}`, lastModified: new Date()})))
  ];
}
