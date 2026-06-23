'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getGames } from '../../data/games';

import type { Game } from '../../data/games';

type SavedRating = {
  rating: number;
  review?: string;
  updatedAt: number;
};

type RatedGame = Game & {
  rating: number;
  review?: string;
  updatedAt: number;
};

export default function RatingsPage() {
  const [ratedGames, setRatedGames] = useState<RatedGame[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadRatings() {
      const games = await getGames();
      const savedEntries = Object.entries(localStorage).filter(([key]) =>
        key.startsWith('nfl-game-') && key.endsWith('-rating')
      );

      const ratings = await Promise.all(
        savedEntries.map(async ([key, value]) => {
          let parsed: SavedRating;

          try {
            parsed = JSON.parse(value) as SavedRating;
          } catch {
            parsed = {
              rating: Number(value),
              updatedAt: Date.now(),
            };
          }

          const slug = key.replace('nfl-game-', '').replace('-rating', '');
          const game = games.find((entry) => entry.slug === slug);

          if (!game) {
            return null;
          }

          return {
            ...game,
            rating: parsed.rating,
            review: parsed.review,
            updatedAt: parsed.updatedAt,
          };
        })
      );

      if (!isMounted) return;

      setRatedGames(
        ratings
          .filter((entry): entry is RatedGame => Boolean(entry))
          .sort((a, b) => b.updatedAt - a.updatedAt)
      );
    }

    loadRatings();

    return () => {
      isMounted = false;
    };
  }, []);

  const ratingSummary = useMemo(() => {
    if (ratedGames.length === 0) {
      return 'No ratings yet';
    }

    return `${ratedGames.length} game${ratedGames.length === 1 ? '' : 's'} rated`;
  }, [ratedGames]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">My Ratings</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">Your game diary.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            {ratingSummary}
          </p>
        </header>

        {ratedGames.length === 0 ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">You haven&apos;t rated any games yet</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Browse games to get started and save your favorites here.</p>
            <Link href="/" className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
              Browse games
            </Link>
          </section>
        ) : (
          <section className="space-y-6">
            {ratedGames.map((game) => (
              <article key={game.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Week {game.week} · {game.date} · {game.time}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{game.awayTeam} @ {game.homeTeam}</h2>
                  </div>
                  <div className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                    ★ {game.rating} / 5
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white">
                          {game.awayTeamLogo ? (
                            <Image src={game.awayTeamLogo} alt={`${game.awayTeam} logo`} fill sizes="48px" className="object-contain p-1" />
                          ) : null}
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Away</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{game.awayTeam}</p>
                        </div>
                      </div>
                      <span className="text-3xl font-semibold text-slate-900 dark:text-white">{game.awayScore}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white">
                          {game.homeTeamLogo ? (
                            <Image src={game.homeTeamLogo} alt={`${game.homeTeam} logo`} fill sizes="48px" className="object-contain p-1" />
                          ) : null}
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Home</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{game.homeTeam}</p>
                        </div>
                      </div>
                      <span className="text-3xl font-semibold text-slate-900 dark:text-white">{game.homeScore}</span>
                    </div>
                  </div>
                </div>

                {game.review ? (
                  <div className="mt-5 rounded-3xl bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                    <p className="font-semibold text-slate-900 dark:text-white">Review</p>
                    <p className="mt-2 whitespace-pre-line">{game.review}</p>
                  </div>
                ) : null}

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Stadium: {game.stadium}</p>
                  <Link href={`/game/${game.slug}`} className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
                    View game
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}