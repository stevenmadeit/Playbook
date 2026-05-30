export type Game = {
  id: number;
  slug: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  stadium: string;
  description: string;
};

export const games: Game[] = [
  {
    id: 1,
    slug: 'bills-vs-dolphins',
    homeTeam: 'Buffalo Bills',
    awayTeam: 'Miami Dolphins',
    date: 'Sunday, Oct 6',
    time: '1:00 PM ET',
    stadium: 'Highmark Stadium',
    description: 'A primetime AFC East showdown with electric playmakers on both rosters. Great atmosphere and plenty of star power.',
  },
  {
    id: 2,
    slug: 'chiefs-vs-packers',
    homeTeam: 'Kansas City Chiefs',
    awayTeam: 'Green Bay Packers',
    date: 'Sunday, Nov 3',
    time: '4:25 PM ET',
    stadium: 'Arrowhead Stadium',
    description: 'Patrick Mahomes brings the Chiefs to the frozen tundra for a classic matchup against the Packers.',
  },
  {
    id: 3,
    slug: 'ravens-vs-browns',
    homeTeam: 'Baltimore Ravens',
    awayTeam: 'Cleveland Browns',
    date: 'Monday, Nov 18',
    time: '8:15 PM ET',
    stadium: 'M&T Bank Stadium',
    description: 'A tough AFC North rivalry featuring strong defenses and edge-of-your-seat late-game drama.',
  },
  {
    id: 4,
    slug: 'cowboys-vs-eagles',
    homeTeam: 'Dallas Cowboys',
    awayTeam: 'Philadelphia Eagles',
    date: 'Sunday, Dec 8',
    time: '8:20 PM ET',
    stadium: 'AT&T Stadium',
    description: 'A huge NFC matchup with championship implications and vocal fanbases on display.',
  },
  {
    id: 5,
    slug: '49ers-vs-buccaneers',
    homeTeam: 'San Francisco 49ers',
    awayTeam: 'Tampa Bay Buccaneers',
    date: 'Sunday, Dec 22',
    time: '4:05 PM ET',
    stadium: 'Levi\'s Stadium',
    description: 'A strategic battle between two veteran-led teams with dynamic offenses and stout defenses.',
  },
];
