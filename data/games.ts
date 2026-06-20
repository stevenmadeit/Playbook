export type Game = {
  id: number;
  slug: string;
  week: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  homeScore: number;
  awayScore: number;
  date: string;
  time: string;
  stadium: string;
  description: string;
};

type ESPNTeam = {
  displayName?: string;
  shortDisplayName?: string;
  name?: string;
  abbreviation?: string;
  logo?: string;
};

type ESPNCompetitor = {
  id?: string;
  homeAway?: string;
  team?: ESPNTeam;
  score?: string | number;
};

type ESPNVenue = {
  fullName?: string;
};

type ESPNStatus = {
  type?: {
    detail?: string;
    shortDetail?: string;
  };
};

type ESPNCompetition = {
  competitors?: ESPNCompetitor[];
  venue?: ESPNVenue;
  status?: ESPNStatus;
};

type ESPNEvent = {
  id?: string;
  date?: string;
  competitions?: ESPNCompetition[];
};

type ESPNScoreboardResponse = {
  events?: ESPNEvent[];
};

const ESPN_SCOREBOARD_URL =
  'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

function formatTime(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString));
}

export async function getGames(): Promise<Game[]> {
  const weekRequests = Array.from({ length: 18 }, (_, index) => {
    const weekNumber = index + 1;
    const url = `${ESPN_SCOREBOARD_URL}?dates=2025&seasontype=2&week=${weekNumber}`;

    return fetch(url, {
      next: { revalidate: 3600 },
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ESPN scoreboard for week ${weekNumber}: ${response.status}`);
      }

      const data = (await response.json()) as ESPNScoreboardResponse;
      return { weekNumber, events: data.events ?? [] };
    });
  });

  const weekResults = await Promise.all(weekRequests);
  const events = weekResults.flatMap(({ weekNumber, events }) =>
    (events || []).map((event) => ({ weekNumber, event }))
  );

  return events.map(({ weekNumber, event }) => {
    const competition = event.competitions?.[0];
    const homeCompetitor = competition?.competitors?.find(
      (competitor) => competitor.homeAway === 'home'
    );
    const awayCompetitor = competition?.competitors?.find(
      (competitor) => competitor.homeAway === 'away'
    );

    const homeTeam =
      homeCompetitor?.team?.displayName ||
      homeCompetitor?.team?.shortDisplayName ||
      homeCompetitor?.team?.name ||
      'TBD';
    const awayTeam =
      awayCompetitor?.team?.displayName ||
      awayCompetitor?.team?.shortDisplayName ||
      awayCompetitor?.team?.name ||
      'TBD';
    const homeTeamLogo = homeCompetitor?.team?.logo || '';
    const awayTeamLogo = awayCompetitor?.team?.logo || '';
    const homeScore = Number(homeCompetitor?.score ?? 0);
    const awayScore = Number(awayCompetitor?.score ?? 0);
    const stadium = competition?.venue?.fullName || 'TBD';
    const eventDate = event.date || new Date().toISOString();
    const statusDetail = competition?.status?.type?.detail;

    return {
      id: Number(event.id ?? 0),
      slug: `${toSlug(awayTeam)}-vs-${toSlug(homeTeam)}`,
      week: weekNumber,
      homeTeam,
      awayTeam,
      homeTeamLogo,
      awayTeamLogo,
      homeScore,
      awayScore,
      date: formatDate(eventDate),
      time: formatTime(eventDate),
      stadium,
      description: statusDetail
        ? `${awayTeam} at ${homeTeam} (${statusDetail}).`
        : `${awayTeam} vs ${homeTeam} at ${stadium}.`,
    };
  });
}
