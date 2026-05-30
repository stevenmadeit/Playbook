import Link from 'next/link';
import { games } from '../data/games';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 rounded-3xl bg-white p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">NFL Game Ratings</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">Rate the most exciting NFL matchups.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Browse today&apos;s curated slate of classic games, open a detail page, and choose a 1-5 star rating. Ratings are saved locally in your browser.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/game/${game.slug}`}
              className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{game.date} · {game.time}</p>
                  <h2 className="mt-3 text-xl font-semibold text-slate-900 group-hover:text-sky-600">{game.awayTeam} @ {game.homeTeam}</h2>
                </div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">Game {game.id}</span>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-600">{game.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
