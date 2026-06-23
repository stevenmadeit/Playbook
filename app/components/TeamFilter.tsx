'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type TeamFilterProps = {
  teams: string[];
  selectedTeam: string;
  selectedWeek?: number | null;
};

export default function TeamFilter({ teams, selectedTeam, selectedWeek }: TeamFilterProps) {
  const router = useRouter();
  const [team, setTeam] = useState(selectedTeam);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (team) {
      params.set('team', team);
    }

    if (selectedWeek) {
      params.set('week', String(selectedWeek));
    }

    const query = params.toString();
    const href = query ? `/?${query}` : '/';

    router.push(href);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <label htmlFor="team" className="sr-only">
        Filter by team
      </label>
      <select
        id="team"
        name="team"
        value={team}
        onChange={(event) => setTeam(event.target.value)}
        className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
      >
        <option value="">All teams</option>
        {teams.map((teamName) => (
          <option key={teamName} value={teamName}>
            {teamName}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
      >
        Apply
      </button>
    </form>
  );
}
