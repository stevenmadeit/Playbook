'use client';

import React from 'react';

type SavedRating = {
  rating: number;
  updatedAt: number;
};

export default function RatingWidget({ slug }: { slug: string }) {
  const [rating, setRating] = React.useState<number>(0);

  React.useEffect(() => {
    const saved = window.localStorage.getItem(`nfl-game-${slug}-rating`);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as SavedRating;
      if (typeof parsed.rating === 'number') {
        setRating(parsed.rating);
      }
    } catch {
      const fallback = Number(saved);
      if (!Number.isNaN(fallback)) {
        setRating(fallback);
      }
    }
  }, [slug]);

  const saveRating = (value: number) => {
    const payload: SavedRating = {
      rating: value,
      updatedAt: Date.now(),
    };

    setRating(value);
    window.localStorage.setItem(
      `nfl-game-${slug}-rating`,
      JSON.stringify(payload)
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/70">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Rate this game</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Pick between 1 and 5 stars. Your choice is stored locally.</p>
        </div>
        <div className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">{rating || 'No'} star{rating === 1 ? '' : 's'}</div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => saveRating(value)}
            className={`rounded-2xl border px-4 py-3 text-lg font-semibold transition ${value <= rating ? 'bg-sky-600 text-white shadow' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'} `}
          >
            ★ {value}
          </button>
        ))}
      </div>
    </div>
  );
}
