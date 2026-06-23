# Playbook

A Letterboxd-style app for rating NFL games, built with Next.js 14 and Tailwind CSS.

## Available pages
- `/` — game list with full 2025 NFL season data, including regular season and playoffs
- `/game/[slug]` — game detail, star rating, and written review page
- `/ratings` — diary of all games you have rated and reviewed

## Run locally
1. Install dependencies:
```bash
npm install
```
2. Start the development server:
```bash
npm run dev
```
3. Open `http://localhost:3000`

## Notes
- Team logos are displayed from the ESPN API on game cards and detail pages.
- Filter games by week (1-18) and playoff rounds: Wild Card, Divisional, Conference Championships, Super Bowl.
- Filter games by NFL team.
- Dark mode is available and persisted in `localStorage`.
- Written reviews are saved alongside star ratings.
- `/ratings` shows all rated and reviewed games.
- Live data is fetched from the ESPN API for the full 2025 season, including playoffs.
