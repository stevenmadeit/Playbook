import Image from 'next/image';
import Link from 'next/link';
import { getGames } from '../data/games';

type HomePageProps = {
  searchParams?: {
    week?: string;
    team?: string;
  };
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const games = await getGames();
  const selectedWeek = searchParams?.week;
  const selectedTeam = searchParams?.team ?? '';
  const weekFilter = selectedWeek ? Number(selectedWeek) : null;
  const uniqueTeams = Array.from(
    new Set(games.flatMap((game) => [game.awayTeam, game.homeTeam]))
  ).sort((a, b) => a.localeCompare(b));
  const filteredGames = games.filter((game) => {
    const matchesWeek = !weekFilter || game.week === weekFilter;
    const matchesTeam =
      !selectedTeam ||
      game.awayTeam === selectedTeam ||
      game.homeTeam === selectedTeam;

    return matchesWeek && matchesTeam;
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 rounded-3xl bg-white p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Playbook</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">Track the season and rate the games that matter.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Browse the full NFL slate, open a game page, and save your 1-5 star ratings locally in your browser.
          </p>
        </header>

        <section className="mb-8 rounded-3xl bg-white p-4 shadow-card">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="text-sm font-medium text-slate-700">
                {selectedTeam && weekFilter
                  ? `Showing ${selectedTeam} · Week ${weekFilter} · ${filteredGames.length} game${filteredGames.length === 1 ? '' : 's'}`
                  : selectedTeam
                    ? `Showing ${selectedTeam} · ${filteredGames.length} game${filteredGames.length === 1 ? '' : 's'}`
                    : weekFilter
                      ? `Showing Week ${weekFilter} · ${filteredGames.length} game${filteredGames.length === 1 ? '' : 's'}`
                      : `Showing all weeks · ${filteredGames.length} game${filteredGames.length === 1 ? '' : 's'}`}
              </p>
              <form method="get" className="flex items-center gap-2">
                <label htmlFor="team" className="sr-only">
                  Filter by team
                </label>
                <select
                  id="team"
                  name="team"
                  defaultValue={selectedTeam}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white"
                >
                  <option value="">All teams</option>
                  {uniqueTeams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
                {weekFilter ? <input type="hidden" name="week" value={weekFilter} /> : null}
                <button
                  type="submit"
                  className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                >
                  Apply
                </button>
              </form>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={selectedTeam ? `/?team=${encodeURIComponent(selectedTeam)}` : '/'}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${!weekFilter ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                All weeks
              </Link>
              {Array.from({ length: 18 }, (_, index) => {
                const weekNumber = index + 1;
                const isActive = weekFilter === weekNumber;
                const href = selectedTeam
                  ? `/?week=${weekNumber}&team=${encodeURIComponent(selectedTeam)}`
                  : `/?week=${weekNumber}`;

                return (
                  <Link
                    key={weekNumber}
                    href={href}
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
