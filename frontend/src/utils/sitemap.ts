import { ICar } from '../services/carService';

const SITE_URL = 'https://drivexmotors.com';

interface SitemapPage {
  url: string;
  priority: number;
  changefreq: string;
  lastmod?: string | Date;
}

export const generateSitemap = (cars: ICar[] = []) => {
  const staticPages: SitemapPage[] = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/cars', priority: 0.9, changefreq: 'daily' },
    { url: '/about', priority: 0.8, changefreq: 'monthly' },
    { url: '/contact', priority: 0.8, changefreq: 'monthly' },
    { url: '/sell', priority: 0.7, changefreq: 'monthly' },
    { url: '/faq', priority: 0.7, changefreq: 'monthly' },
    { url: '/terms', priority: 0.5, changefreq: 'yearly' },
    { url: '/privacy', priority: 0.5, changefreq: 'yearly' }
  ];

  const carPages: SitemapPage[] = cars.map(car => ({
    url: `/cars/${car.id}`,
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: car.updatedAt || car.createdAt
  }));

  const allPages: SitemapPage[] = [...staticPages, ...carPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return sitemap;
};

export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml

# Block common non-content paths
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$
Disallow: /*?*$
Disallow: /login
Disallow: /register

# Allow specific API endpoints for SEO
Allow: /api/cars
Allow: /api/cars/`;
};
