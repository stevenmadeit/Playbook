# NFL Game Ratings

A simple Next.js 14 app with Tailwind CSS for rating hard-coded NFL games.

## Available pages

- `/` — game list
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
- The app uses a hard-coded list of NFL games in `data/games.ts`.
