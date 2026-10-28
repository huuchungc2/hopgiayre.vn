import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessSchema({
  name = 'HopGiayRe.vn - Xưởng In Hộp Giấy Giá Rẻ',
  url = 'https://hopgiayre.vn',
  logo = 'https://hopgiayre.vn/images/logo.svg',
  telephone = '0909000000',
  address = 'TP. Hồ Chí Minh, Việt Nam',
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url}/#organization`,
    name,
    url,
    logo,
    image: logo,
    telephone,
    priceRange: '₫₫',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hồ Chí Minh',
      addressCountry: 'VN',
      streetAddress: address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '10.8231',
      longitude: '106.6297',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: '08:00',
        closes: '18:00',
      },
    ],
  };

  return <JsonLd data={schema} />;
}

export function FaqSchema({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return <JsonLd data={schema} />;
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  sku,
  url,
}: {
  name: string;
  description: string;
  image: string;
  price?: number;
  sku?: string;
  url: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description || name,
    image: [image],
    sku: sku || 'HGR',
    brand: {
      '@type': 'Brand',
      name: 'HopGiayRe',
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'VND',
      price: price && price > 0 ? price : 5000,
      priceValidUntil: '2028-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'HopGiayRe.vn',
      },
    },
  };

  return <JsonLd data={schema} />;
}
