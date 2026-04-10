import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

const defaultTitle = 'SSX MOTORS | Premium Car Dealership';
const defaultDescription = 'Explore luxury and premium cars at SSX MOTORS. Buy, sell, compare, and test drive the finest vehicles.';

const SEO: React.FC<SEOProps> = ({ title, description, url, image }) => {
  const pageTitle = title ? `${title} | SSX MOTORS` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageUrl = url || window.location.origin;
  const pageImage = image || `${window.location.origin}/logo.png`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="robots" content="index, follow" />
      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={pageImage} />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
    </Helmet>
  );
};

export default SEO;
