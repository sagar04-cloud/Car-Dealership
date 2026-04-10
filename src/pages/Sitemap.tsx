import React, { useEffect, useState } from 'react';
import { generateSitemap } from '../utils/sitemap';
import CarService from '../services/carService';

const Sitemap: React.FC = () => {
  const [sitemap, setSitemap] = useState<string>('');

  useEffect(() => {
    const generate = async () => {
      try {
        const { cars } = await CarService.getCars();
        const sitemapXml = generateSitemap(cars);
        setSitemap(sitemapXml);
      } catch (error) {
        console.error('Error generating sitemap:', error);
        // Generate basic sitemap without cars
        setSitemap(generateSitemap());
      }
    };

    generate();
  }, []);

  if (!sitemap) {
    return null;
  }

  return (
    <pre
      style={{
        fontSize: '12px',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}
    >
      {sitemap}
    </pre>
  );
};

export default Sitemap;
