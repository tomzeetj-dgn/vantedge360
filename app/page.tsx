import HomeExperience from '@/components/HomeExperience';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'VantEdge360',
  url: 'https://www.vantedge360.com',
  email: 'info@vantedge360.com',
  image: 'https://www.vantedge360.com/images/og.jpg',
  description: 'Google 360° virtual tours for hotels, villas, restaurants and retail, shot by Google Trusted Photographers.',
  areaServed: ['United Arab Emirates', 'Greece', 'Faroe Islands', 'Iceland'],
  serviceType: '360° virtual tours for Google Maps and Google Business Profile',
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeExperience />
    </>
  );
}
