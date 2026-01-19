import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/account/'], // Hide admin and user accounts from Google
    },
    sitemap: 'https://dankbud.co.za/sitemap.xml',
  };
}
