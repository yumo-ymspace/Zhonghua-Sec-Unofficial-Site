# zhonghuasec.school

Unofficial student portal for [Zhonghua Secondary School](https://www.zhonghuasec.moe.edu.sg/), Singapore. Provides quick access to timetables, CCA information, school achievements, and student-led initiatives.

## Pages

| Page | Description |
|------|-------------|
| Home | Announcements, quick links, school overview |
| About | School history, vision, mission, RICE values, principal's message |
| Timetables | Class schedule PDF lookup by level and class |
| CCA | Browse all co-curricular activities with schedules and achievements |
| Achievements | Academic results, organisational awards, environmental stewardship |
| ZNotes | Student notes-sharing platform |
| ZPortal | Centralised student dashboard |

## Tech Stack

- **HTML/CSS/JS** — static site, no framework
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first CSS
- **[Chart.js](https://www.chartjs.org/)** — data visualisation (achievements page)
- **Hosted on [Vercel](https://vercel.com)**

## Development

```bash
# Install dependencies
npm install

# Build for production (outputs to dist/)
npm run build

# Watch mode for development
npm run dev
```

The build process:
1. Compiles Tailwind CSS from `src/input.css` → `dist/assets/styles.css` (purged, minified)
2. Inlines `header.html` and `footer.html` into each page
3. Copies static assets (`robots.txt`, `sitemap.xml`, `vercel.json`)

## Project Structure

```
zhonghuasec.school/
├── src/
│   └── input.css          # Tailwind entry point
├── scripts/
│   └── build.js           # Build script (inlines header/footer)
├── dist/                  # Production output (deploy this)
├── header.html            # Shared navigation
├── footer.html            # Shared footer
├── header.js              # Nav active state + mobile menu
├── footer.js              # Back-to-top button (dev only)
├── *.html                 # Page files
├── tailwind.config.js     # Tailwind configuration
├── vercel.json            # Vercel deployment config
├── robots.txt             # Crawler directives
├── sitemap.xml            # Site index for search engines
└── package.json           # Build dependencies
```

## Deployment

This site is configured for Vercel with clean URLs and redirects. Deploy the `dist/` directory:

```bash
npm run build
# Deploy dist/ to Vercel
```

The `vercel.json` handles:
- Clean URLs (`/about` instead of `/about.html`)
- Redirects for renamed pages

## License

This is an unofficial student project and is not affiliated with or endorsed by Zhonghua Secondary School or the Ministry of Education, Singapore.

School logo and images are property of Zhonghua Secondary School.
