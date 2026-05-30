import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NFL Game Ratings',
  description: 'Rate NFL games from a curated list and save your favorites locally.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
