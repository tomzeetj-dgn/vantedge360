import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import '../legal.css';

export const metadata: Metadata = { title: 'Terms & Conditions · VantEdge360', alternates: { canonical: '/terms/' }, robots: { index: false } };

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="The terms that apply when you work with VantEdge360 or hear from us about your project."
      sections={[
        { id: 's1', title: 'Our services', body: 'VantEdge360 provides 360° virtual tour and digital media services for businesses, including photography, processing and publication to Google Maps and Business Profile.' },
        { id: 's2', title: 'Messages about your project', body: 'If you share a phone number with us, you may receive transactional, account, project-update and customer-support messages related to your enquiry or project.' },
        { id: 's3', title: 'Opting out', body: 'You can stop text messages at any time by replying STOP. You will receive one confirmation message. To start again, reply START or contact us.' },
        { id: 's4', title: 'Support', body: <>For help, reply HELP or email <a href="mailto:info@vantedge360.com">info@vantedge360.com</a>.</> },
        { id: 's5', title: 'Message and data rates', body: 'Standard message and data rates may apply. How often you hear from us depends on your enquiry or project.' },
        { id: 's6', title: 'Privacy', body: <>Your information is handled in line with our <a href="/privacy/">Privacy Policy</a>.</> },
      ]}
    />
  );
}
