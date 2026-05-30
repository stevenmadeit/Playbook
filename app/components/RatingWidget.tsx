'use client';

import React from 'react';

export default function RatingWidget({ slug }: { slug: string }) {
  const [rating, setRating] = React.useState<number>(0);

  React.useEffect(() => {
    const saved = window.localStorage.getItem(`nfl-game-${slug}-rating`);
    if (saved) {
      setRating(Number(saved));
    }
  }, [slug]);

  const saveRating = (value: number) => {
    setRating(value);
    window.localStorage.setItem(`nfl-game-${slug}-rating`, String(value));
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Rate this game</h2>
          <p className="mt-2 text-sm text-slate-600">Pick between 1 and 5 stars. Your choice is stored locally.</p>
        </div>
        <div className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">{rating || 'No'} star{rating === 1 ? '' : 's'}</div>
      </div>

      <div className="mt-6 flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => saveRating(value)}
            className={`rounded-2xl px-4 py-3 text-lg font-semibold transition ${value <= rating ? 'bg-sky-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100'} border border-slate-200`}
          >
            ★ {value}
          </button>
        ))}
      </div>
    </div>
  );
}
