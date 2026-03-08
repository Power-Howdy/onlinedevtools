# Online Dev Tools

Free online developer utilities: JSON formatter, JWT decoder, Base64 encoder, Unix timestamp converter, regex tester, and more. All tools run in the browser.

## Tools

- **JSON Formatter** – Format and validate JSON
- **JWT Decoder** – Decode and inspect JWT tokens
- **Base64 Encoder / Decoder** – Encode and decode Base64
- **Unix Timestamp Converter** – Convert between timestamps and dates
- **Regex Tester** – Test regular expressions
- **UUID Generator** – Generate UUID v4, bulk generation
- **Markdown Previewer** – Preview Markdown, export to HTML
- **Diff Checker** – Compare two texts
- **SQL Formatter** – Format SQL queries
- **URL Encoder / Decoder** – Encode and decode URL parameters

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deployment

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to your production URL (e.g. `https://yourdomain.com`).
2. Run `npm run build` and `npm start`, or deploy to Vercel/Netlify.
3. Ensure the site is served over HTTPS (required for clipboard API).

## SEO

- Set `NEXT_PUBLIC_SITE_URL` for production sitemap, robots.txt, and Open Graph meta.
- Each tool has its own page with SEO metadata.
