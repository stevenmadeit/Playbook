import Image from 'next/image';
import Link from 'next/link';
import { getGames } from '../../../data/games';
import RatingWidget from '../../components/RatingWidget';

type Params = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const games = await getGames();

  return games.map((game) => ({ slug: game.slug }));
}

export default async function GameDetailPage({ params }: Params) {
  const games = await getGames();
  const game = games.find((entry) => entry.slug === params.slug);

  if (!game) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-card">
          <h1 className="text-2xl font-semibold text-slate-900">Game not found</h1>
          <p className="mt-3 text-slate-600">Return to the homepage to pick a valid game.</p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
            Back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-3xl bg-white p-8 shadow-card">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Game details</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-slate-50">
                  {game.awayTeamLogo ? (
                    <Image
                      src={game.awayTeamLogo}
                      alt={`${game.awayTeam} logo`}
                      fill
                      sizes="80px"
                      className="object-contain p-3"
                    />
                  ) : null}
                </div>
                <h1 className="text-3xl font-semibold text-slate-900">{game.awayTeam} @ {game.homeTeam}</h1>
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-slate-50">
                  {game.homeTeamLogo ? (
                    <Image
                      src={game.homeTeamLogo}
                      alt={`${game.homeTeam} logo`}
                      fill
                      sizes="80px"
                      className="object-contain p-3"
                    />
                  ) : null}
                </div>
              </div>
            </div>
            <Link href="/" className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white">
              ← Back to games
            </Link>
          </div>

          <div className="mt-8 grid gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Date</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{game.date}</p>
              <p className="mt-1 text-sm text-slate-600">{game.time}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Score</p>
              <p className="mt-3 flex items-center justify-center gap-2 text-2xl font-semibold leading-none tracking-tight text-slate-900 [font-variant-numeric:tabular-nums]">
                <span>{game.awayScore}</span>
                <span className="text-slate-400">-</span>
                <span>{game.homeScore}</span>
              </p>
              <p className="mt-1 text-sm text-slate-600">{game.awayTeam} @ {game.homeTeam}</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <p className="text-base leading-7 text-slate-700">{game.description}</p>
            <div className="mt-8">
              <RatingWidget slug={game.slug} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
