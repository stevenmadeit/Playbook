export type Game = {
  id: number;
  slug: string;
  week: number;
  type: 'regular' | 'playoff';
  roundName?: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  homeTeamColor?: string;
  awayTeamColor?: string;
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
  color?: string;
  alternateColor?: string;
  isActive?: boolean;
  location?: string;
};

type ESPNCompetitor = {
  id?: string;
  homeAway?: string;
  team?: ESPNTeam;
  score?: string | number;
  winner?: boolean;
};

function isActualTeam(team?: ESPNTeam) {
  if (!team) return false;
  if (typeof team.isActive === 'boolean') {
    return team.isActive;
  }

  return !(team.location === 'AFC' || team.location === 'NFC');
}

function extractTeamName(team?: ESPNTeam) {
  if (!team) {
    return 'TBD';
  }

  if (isActualTeam(team)) {
    return (
      team.displayName || team.shortDisplayName || team.name || team.abbreviation || 'TBD'
    );
  }

  return team.displayName || team.shortDisplayName || team.name || team.abbreviation || 'TBD';
}

function extractTeamLogo(team?: ESPNTeam) {
  return team?.logo || '';
}

function getPlayoffSlugSuffix(roundName?: string) {
  if (!roundName) {
    return 'playoff';
  }

  const mapping: Record<string, string> = {
    'Wild Card': 'wildcard',
    Divisional: 'divisional',
    Conference: 'conference',
    'Super Bowl': 'superbowl',
  };

  return mapping[roundName] || toSlug(roundName);
}

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
  const playoffRoundNames = ['Wild Card', 'Divisional', 'Conference', 'Super Bowl'] as const;

  const regularWeekRequests = Array.from({ length: 18 }, (_, index) => {
    const weekNumber = index + 1;
    const url = `${ESPN_SCOREBOARD_URL}?dates=2025&seasontype=2&week=${weekNumber}`;

    return fetch(url, {
      next: { revalidate: 3600 },
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ESPN scoreboard for week ${weekNumber}: ${response.status}`);
      }

      const data = (await response.json()) as ESPNScoreboardResponse;
      return { weekNumber, type: 'regular' as const, events: data.events ?? [] };
    });
  });

  const playoffWeekRequests = Array.from({ length: 4 }, (_, index) => {
    const apiWeek = index + 1;
    const weekNumber = 18 + apiWeek;
    const roundName = playoffRoundNames[index];
    const url = `${ESPN_SCOREBOARD_URL}?dates=2025&seasontype=3&week=${apiWeek}`;

    return fetch(url, {
      next: { revalidate: 3600 },
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ESPN playoff scoreboard for week ${apiWeek}: ${response.status}`);
      }

      const data = (await response.json()) as ESPNScoreboardResponse;
      return { weekNumber, type: 'playoff' as const, roundName, events: data.events ?? [] };
    });
  });

  const weekResults = await Promise.all([...regularWeekRequests, ...playoffWeekRequests]);
  const events = weekResults.flatMap(({ weekNumber, type, roundName, events }) =>
    (events || []).map((event) => ({ weekNumber, type, roundName, event }))
  );

  return events.map(({ weekNumber, type, roundName, event }) => {
    const competition = event.competitions?.[0];
    const homeCompetitor = competition?.competitors?.find(
      (competitor) => competitor.homeAway === 'home'
    );
    const awayCompetitor = competition?.competitors?.find(
      (competitor) => competitor.homeAway === 'away'
    );

    const homeTeam = extractTeamName(homeCompetitor?.team);
    const awayTeam = extractTeamName(awayCompetitor?.team);
    const homeTeamLogo = extractTeamLogo(homeCompetitor?.team);
    const awayTeamLogo = extractTeamLogo(awayCompetitor?.team);
    const homeTeamColor = homeCompetitor?.team?.color || homeCompetitor?.team?.alternateColor;
    const awayTeamColor = awayCompetitor?.team?.color || awayCompetitor?.team?.alternateColor;
    const homeScore = Number(homeCompetitor?.score ?? 0);
    const awayScore = Number(awayCompetitor?.score ?? 0);
    const stadium = competition?.venue?.fullName || 'TBD';
    const eventDate = event.date || new Date().toISOString();
    const statusDetail = competition?.status?.type?.detail;

    const isSuperBowlPlaceholder =
      type === 'playoff' &&
      weekNumber === 22 &&
      (homeTeam === 'AFC' || homeTeam === 'NFC' || awayTeam === 'AFC' || awayTeam === 'NFC');

    const correctedAwayTeam = isSuperBowlPlaceholder ? 'Seattle Seahawks' : awayTeam;
    const correctedHomeTeam = isSuperBowlPlaceholder ? 'New England Patriots' : homeTeam;
    const correctedAwayTeamLogo = isSuperBowlPlaceholder
      ? 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png'
      : awayTeamLogo;
    const correctedHomeTeamLogo = isSuperBowlPlaceholder
      ? 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png'
      : homeTeamLogo;
    const correctedAwayScore = isSuperBowlPlaceholder ? 29 : awayScore;
    const correctedHomeScore = isSuperBowlPlaceholder ? 13 : homeScore;
    const correctedDate = isSuperBowlPlaceholder ? 'February 8, 2026' : formatDate(eventDate);
    const correctedStadium = isSuperBowlPlaceholder ? "Levi's Stadium, Santa Clara, CA" : stadium;

    const baseSlug = `${toSlug(correctedAwayTeam)}-vs-${toSlug(correctedHomeTeam)}`;
    const slug = isSuperBowlPlaceholder
      ? 'seahawks-vs-patriots-superbowl'
      : type === 'regular'
      ? `${baseSlug}-week-${weekNumber}`
      : `${baseSlug}-${getPlayoffSlugSuffix(roundName)}`;

    return {
      id: Number(event.id ?? 0),
      slug,
      week: weekNumber,
      type,
      roundName,
      homeTeam: correctedHomeTeam,
      awayTeam: correctedAwayTeam,
      homeTeamLogo: correctedHomeTeamLogo,
      awayTeamLogo: correctedAwayTeamLogo,
      homeTeamColor,
      awayTeamColor,
      homeScore: correctedHomeScore,
      awayScore: correctedAwayScore,
      date: correctedDate,
      time: formatTime(eventDate),
      stadium: correctedStadium,
      description: statusDetail
        ? `${correctedAwayTeam} at ${correctedHomeTeam} (${statusDetail}).`
        : `${correctedAwayTeam} vs ${correctedHomeTeam} at ${correctedStadium}.`,
    };
  });
}
