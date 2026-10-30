import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import '../legal.css';

export const metadata: Metadata = { title: 'Privacy Policy · VantEdge360', alternates: { canonical: '/privacy/' }, robots: { index: false } };

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How VantEdge360 collects and uses the information you share with us."
      sections={[
        { id: 's1', title: 'Information we collect', body: 'When you contact us or request a quote, we collect the details you choose to give us: your name, email address, phone number if you provide one, and anything you include in your message.' },
        { id: 's2', title: 'How we use it', body: 'We use this information to reply to your enquiry, prepare a quote, deliver and support your project, and send you updates about it.' },
        { id: 's3', title: 'Phone numbers', body: 'We only collect a phone number when you give it to us, and we use it to contact you about your enquiry or an active project. We do not share phone numbers, mobile information or consent data with third parties for marketing.' },
        { id: 's4', title: 'Contact', body: <>Questions about this policy can be sent to <a href="mailto:info@vantedge360.com">info@vantedge360.com</a>.</> },
      ]}
    />
  );
}
