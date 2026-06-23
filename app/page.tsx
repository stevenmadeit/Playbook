import Image from 'next/image';
import Link from 'next/link';
import { getGames } from '../data/games';
import { getTeamAccent } from './utils/teamColors';
import TeamFilter from './components/TeamFilter';

type HomePageProps = {
  searchParams?: {
    week?: string;
    team?: string;
  };
};

const playoffRoundNames: Record<number, string> = {
  19: 'Wild Card',
  20: 'Divisional',
  21: 'Conference',
  22: 'Super Bowl',
};

function getWeekLabel(week: number) {
  return playoffRoundNames[week] ?? `Week ${week}`;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const games = await getGames();
  const selectedWeek = searchParams?.week;
  const selectedTeam = searchParams?.team ?? '';
  const weekFilter = selectedWeek ? Number(selectedWeek) : null;
  const selectedWeekLabel = weekFilter ? getWeekLabel(weekFilter) : null;
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
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">Playbook</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">Track the season and rate the games that matter.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Browse the full NFL slate, open a game page, and save your 1-5 star ratings locally in your browser.
          </p>
        </header>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:flex-1">
              <p className="whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200">
                {selectedTeam && selectedWeekLabel
                  ? `Showing ${selectedTeam} · ${selectedWeekLabel} · ${filteredGames.length} game${filteredGames.length === 1 ? '' : 's'}`
                  : selectedTeam
                    ? `Showing ${selectedTeam} · ${filteredGames.length} game${filteredGames.length === 1 ? '' : 's'}`
                    : selectedWeekLabel
                      ? `Showing ${selectedWeekLabel} · ${filteredGames.length} game${filteredGames.length === 1 ? '' : 's'}`
                      : `Showing all weeks · ${filteredGames.length} game${filteredGames.length === 1 ? '' : 's'}`}
              </p>
              <TeamFilter teams={uniqueTeams} selectedTeam={selectedTeam} selectedWeek={weekFilter} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={selectedTeam ? `/?team=${encodeURIComponent(selectedTeam)}` : '/'}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${!weekFilter ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'}`}
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
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    Week {weekNumber}
                  </Link>
                );
              })}
              {Object.entries(playoffRoundNames).map(([value, label]) => {
                const roundWeek = Number(value);
                const isActive = weekFilter === roundWeek;
                const href = selectedTeam
                  ? `/?week=${roundWeek}&team=${encodeURIComponent(selectedTeam)}`
                  : `/?week=${roundWeek}`;

                return (
                  <Link
                    key={value}
                    href={href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          {filteredGames.map((game, index) => {
            const accent = game.homeTeamColor || getTeamAccent(game.homeTeam);

            return (
              <Link
                key={game.id}
                href={`/game/${game.slug}`}
                style={{
                  animationDelay: `${index * 80}ms`,
                }}
                className="animate-card-enter group relative block overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-1 hover:ring-sky-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:ring-sky-500/30"
              >
                <span className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: accent }} />
                <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: accent }} />
                <div className="space-y-4 pl-2 pt-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{game.date} · {game.time}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{getWeekLabel(game.week)}</span>
                      {game.type === 'playoff' ? (
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">Playoffs</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/80">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-white dark:bg-slate-900">
                        {game.awayTeamLogo ? (
                          <Image
                            src={game.awayTeamLogo}
                            alt={`${game.awayTeam} logo`}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Away</p>
                        <p className="mt-1 truncate text-base font-semibold text-slate-900 dark:text-white">{game.awayTeam}</p>
                      </div>
                    </div>
                    <p className="text-3xl font-semibold leading-none tracking-tight text-slate-900 [font-variant-numeric:tabular-nums] dark:text-white">{game.awayScore}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/80">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-white dark:bg-slate-900">
                        {game.homeTeamLogo ? (
                          <Image
                            src={game.homeTeamLogo}
                            alt={`${game.homeTeam} logo`}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Home</p>
                        <p className="mt-1 truncate text-base font-semibold text-slate-900 dark:text-white">{game.homeTeam}</p>
                      </div>
                    </div>
                    <p className="text-3xl font-semibold leading-none tracking-tight text-slate-900 [font-variant-numeric:tabular-nums] dark:text-white">{game.homeScore}</p>
                  </div>
                </div>
                <p className="mt-5 pl-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{game.description}</p>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
