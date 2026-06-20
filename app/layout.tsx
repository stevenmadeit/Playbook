import Link from 'next/link';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NFL Game Ratings',
  description: 'Rate NFL games from a curated list and save your favorites locally.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-50">
          <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-10">
              <Link href="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
                NFL Ratings
              </Link>
              <nav className="flex items-center gap-2">
                <Link href="/" className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  Games
                </Link>
                <Link href="/ratings" className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  My Ratings
                </Link>
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
