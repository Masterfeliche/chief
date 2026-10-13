# Azu — official site

Astro, static output, one React island (the floating player). Zero JavaScript shipped except the
small behaviour script and that island.

```
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview
```

## Where things live

```
src/data/
  site.ts          links, email, form key, announcement bar, nav, platforms   ← edit here first
  books.json       Walls of Azu — one object per book
  songs.json       releases, newest first
  videos.json      clips: poster, mp4 sequence, YouTube link
  shows.json       tour dates (empty = "no dates yet" state renders)
  products.json    shop items (soon: true = greyed "coming soon")
src/content.config.ts   schemas for the JSON above — the build fails if a field is wrong
src/layouts/Base.astro  head, announcement bar, nav, footer, player, scripts
src/components/         Clip · BookCard · PlatformList · SectionHead · JoinForm · ApplyForm · Player.tsx
src/pages/              index · music · watch · walls · shows · shop · story
src/styles/global.css   the design system
src/scripts/site.ts     menu, reveals, video-on-scroll, shelf, countdown, forms, dialogs
public/assets/          img · video · icons · books  (same paths as the old site)
public/_headers         Cloudflare Pages / Netlify: caching + security headers
_static/                the pre-Astro plain-HTML version, kept for reference — safe to delete
```

## Everyday edits

| Want to… | Do |
|---|---|
| Add a book | Append to `books.json`; drop `book-<id>.jpg` in `public/assets/img/` and `<id>.pdf` + `<id>.epub` in `public/assets/books/`. It appears on the home shelf, the library grid and the Music page automatically. |
| Announce a show | Append to `shows.json` with an ISO `date`, `city`, `venue`, `status` (`presale` · `onsale` · `soldout`) and `tickets` URL. Past dates move to the archive on their own. |
| Add a video | Append to `videos.json`. `seq` is one or more mp4s played back-to-back. Set `featured: true` on the one the hero and Watch page should lead with. |
| Add a product | Append to `products.json` with a `url` to any hosted checkout page. Remove `soon` to go live. |
| Change the top bar | `site.announcement` in `site.ts`. |
| Turn on form delivery | Paste a [web3forms.com](https://web3forms.com) key into `site.web3formsKey`. Empty = forms open the visitor's email app. |
| Add a page | New file in `src/pages/`, wrap it in `<Base>`, add it to `nav` in `site.ts`. |

## Deploy

Cloudflare Pages: build command `npm run build`, output directory `dist`. `_headers` and the sitemap are
included in the build. Links are extensionless (`/music`), which Pages serves from `music.html` automatically.
