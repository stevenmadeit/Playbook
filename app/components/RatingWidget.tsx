'use client';

import React from 'react';

type SavedRating = {
  rating: number;
  review?: string;
  updatedAt: number;
};

export default function RatingWidget({ slug }: { slug: string }) {
  const [rating, setRating] = React.useState<number>(0);
  const [review, setReview] = React.useState('');
  const [draftReview, setDraftReview] = React.useState('');
  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    const saved = window.localStorage.getItem(`nfl-game-${slug}-rating`);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as SavedRating;
      if (typeof parsed.rating === 'number') {
        setRating(parsed.rating);
      }
      if (typeof parsed.review === 'string') {
        setReview(parsed.review);
        setDraftReview(parsed.review);
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
      review,
      updatedAt: Date.now(),
    };

    setRating(value);
    window.localStorage.setItem(`nfl-game-${slug}-rating`, JSON.stringify(payload));
  };

  const saveReview = () => {
    const payload: SavedRating = {
      rating,
      review: draftReview.trim(),
      updatedAt: Date.now(),
    };

    setReview(payload.review || '');
    setDraftReview(payload.review || '');
    setEditing(false);
    window.localStorage.setItem(`nfl-game-${slug}-rating`, JSON.stringify(payload));
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/70">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            className={`rounded-2xl border px-4 py-3 text-lg font-semibold transition ${value <= rating ? 'bg-sky-600 text-white shadow' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'}`}
          >
            ★ {value}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Game review</p>
          {review && !editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              Edit
            </button>
          ) : null}
        </div>

        {review && !editing ? (
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">{review}</p>
        ) : (
          <div className="mt-4 space-y-3">
            <textarea
              value={draftReview}
              onChange={(event) => setDraftReview(event.target.value)}
              rows={4}
              placeholder="Write an optional review of this game..."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
            />
            <button
              type="button"
              onClick={saveReview}
              className="inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Save review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

