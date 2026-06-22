import Link from 'next/link';
import type { Metadata } from 'next';
import ThemeToggle from './components/ThemeToggle';
import './globals.css';

export const metadata: Metadata = {
  title: 'Playbook',
  description: 'Track NFL games, save ratings, and follow the season in one place.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-300">
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-10">
              <Link href="/" className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-sm font-semibold text-white shadow-sm">
                  PB
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.35em] text-sky-600 dark:text-sky-400">Playbook</span>
                  <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">NFL Ratings</span>
                </span>
              </Link>
              <nav className="flex items-center gap-2">
                <Link href="/" className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                  Games
                </Link>
                <Link href="/ratings" className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                  My Ratings
                </Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
