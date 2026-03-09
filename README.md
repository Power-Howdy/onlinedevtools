# Online Dev Tools

Free online developer utilities. No installation required — all tools run in your browser.

This project is open source under the [MIT License](LICENSE).

## Tools

- **JSON Formatter & TypeScript Generator** – Format and validate JSON. Generate TypeScript interfaces from JSON. Copy or download output.
- **JWT Decoder** – Decode and inspect JWT tokens. View header, payload, and expiration.
- **Base64 Encoder / Decoder** – Encode and decode Base64 strings. Works with text and binary data.
- **Unix Timestamp Converter** – Convert Unix timestamp to human date and vice versa. Timezone support.
- **Cron Expression Parser** – Parse cron expressions. Convert to human-readable schedule (e.g. every 5 minutes).
- **Regex Tester** – Test regular expressions with match highlighting and explanation.
- **UUID Generator** – Generate UUID v4. Bulk generation and copy to clipboard.
- **Markdown Previewer** – Preview Markdown as HTML. Export rendered output.
- **Diff Checker** – Compare two texts or code blocks. Side-by-side and unified views.
- **SQL Formatter** – Format and beautify SQL queries. Indent and uppercase keywords.
- **URL Encoder / Decoder** – Encode and decode URL parameters. Percent encoding support.
- **Bcrypt Generator** – Hash passwords with bcrypt. Compare hashes to verify.
- **SHA256 Generator** – Generate SHA256 hashes from text. Fast, client-side hashing.
- **HTML Entity Encoder** – Encode and decode HTML entities (`&`, `<`, `>`, `"`, `'`).
- **Color Converter** – Convert between HEX, RGB, and HSL color formats.
- **Random Data Generator** – Generate random strings, numbers, UUIDs, JSON, and hex.

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

## License

MIT © [online-dev-tools contributors](LICENSE)
