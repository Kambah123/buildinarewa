import type {MetadataRoute} from 'next';
import {getCategories, getDirectory, getStates} from '@/lib/queries/catalog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const [categories, states, directory] = await Promise.all([getCategories(), getStates(), getDirectory({sort: 'featured'})]);
  const staticPaths = ['', '/products', '/about', '/terms', '/privacy'];
  const locales = ['en', 'ha'];
  return [
    ...locales.flatMap((locale) => staticPaths.map((path) => ({url: `${siteUrl}/${locale}${path}`, lastModified: new Date()}))),
    ...directory.products.flatMap((product) => locales.map((locale) => ({url: `${siteUrl}/${locale}/p/${product.slug}`, lastModified: new Date(product.createdAt)}))),
    ...categories.flatMap((category) => locales.map((locale) => ({url: `${siteUrl}/${locale}/categories/${category.slug}`, lastModified: new Date()}))),
    ...states.flatMap((state) => locales.map((locale) => ({url: `${siteUrl}/${locale}/states/${state.slug}`, lastModified: new Date()})))
  ];
}
