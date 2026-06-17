import Image from 'next/image';
import Link from 'next/link';
import { getGames } from '../data/games';

export default async function HomePage() {
  const games = await getGames();

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
              <div className="space-y-4">
                <p className="text-sm text-slate-500">{game.date} · {game.time}</p>
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-white">
                      {game.awayTeamLogo ? (
                        <Image
                          src={game.awayTeamLogo}
                          alt={`${game.awayTeam} logo`}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Away</p>
                      <p className="mt-1 truncate text-base font-semibold text-slate-900">{game.awayTeam}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold leading-none tracking-tight text-slate-900 [font-variant-numeric:tabular-nums]">{game.awayScore}</p>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-white">
                      {game.homeTeamLogo ? (
                        <Image
                          src={game.homeTeamLogo}
                          alt={`${game.homeTeam} logo`}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Home</p>
                      <p className="mt-1 truncate text-base font-semibold text-slate-900">{game.homeTeam}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold leading-none tracking-tight text-slate-900 [font-variant-numeric:tabular-nums]">{game.homeScore}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-600">{game.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
