import Image from 'next/image';
import Link from 'next/link';
import { getGames } from '../data/games';

type HomePageProps = {
  searchParams?: {
    week?: string;
  };
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const games = await getGames();
  const selectedWeek = searchParams?.week;
  const weekFilter = selectedWeek ? Number(selectedWeek) : null;
  const filteredGames = weekFilter
    ? games.filter((game) => game.week === weekFilter)
    : games;

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

        <section className="mb-8 rounded-3xl bg-white p-4 shadow-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-700">
              {weekFilter
                ? `Showing Week ${weekFilter} · ${filteredGames.length} game${filteredGames.length === 1 ? '' : 's'}`
                : `Showing all weeks · ${filteredGames.length} game${filteredGames.length === 1 ? '' : 's'}`}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${!weekFilter ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                All weeks
              </Link>
              {Array.from({ length: 18 }, (_, index) => {
                const weekNumber = index + 1;
                const isActive = weekFilter === weekNumber;

                return (
                  <Link
                    key={weekNumber}
                    href={`/?week=${weekNumber}`}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    Week {weekNumber}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          {filteredGames.map((game) => (
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
