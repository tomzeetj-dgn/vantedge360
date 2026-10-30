import type { Metadata } from 'next';
import './lab.css';

export const metadata: Metadata = { title: '360° scroll lab · VantEdge360', robots: { index: false, follow: false } };

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
