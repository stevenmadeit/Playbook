# Playbook

A Letterboxd-style app for rating NFL games, built with Next.js 14 and Tailwind CSS.

## Available pages
- `/` — game list (full 2025 NFL season, pulled live from ESPN)
- `/game/[slug]` — game detail and rating page

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
- Ratings are saved in `localStorage`.
- Game data is fetched live from the [ESPN API](https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard), covering the full 2025 season including final scores.
