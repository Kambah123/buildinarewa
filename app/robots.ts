import type {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return {
    rules: [
      {userAgent: '*', allow: '/', disallow: ['/api/', '/auth/', '/en/admin', '/ha/admin', '/en/me', '/ha/me']}
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
