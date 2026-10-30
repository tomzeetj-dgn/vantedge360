import type { Metadata, Viewport } from 'next';
import '@fontsource/marcellus/400.css';
import '@fontsource/manrope/300.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import './home.css';
import './room.css';
import { u } from '@/content/base';
import { heroRoomSrc } from '@/content/assets';

const SITE = 'https://www.vantedge360.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'VantEdge360 · Google 360° virtual tours for hotels, villas and restaurants',
  description: 'Google Trusted Photographers who shoot your space in one visit and publish a 360° tour to Google Maps, your Business Profile and your website.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'VantEdge360',
    title: 'VantEdge360 · Google 360° virtual tours',
    description: 'One shoot, then you’re everywhere guests look you up.',
    images: [{ url: u('/images/og.jpg'), width: 1200, height: 630 }],
  },
  icons: { icon: u('/images/ve-emblem-ink.svg') },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#FAF8F4' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href={heroRoomSrc} fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  );
}
