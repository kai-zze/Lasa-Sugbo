# Sugbo Table — Cebu City Cuisine Guide

A district-by-district cuisine & recipe blog for Cebu City, Philippines.

## Project structure

```
sugbo-table/
├── index.html                  Home — hero, 7 district cards, 6 recipe cards, story, newsletter
├── about.html                  Mission + Privacy Policy (#privacy) + Terms
├── contact.html                 Contact / recipe-submission form
├── 404.html                     Custom not-found page (noindex)
├── regions/
│   └── carbon-market.html      Full district-page TEMPLATE (duplicate for the other 6 districts)
├── recipes/
│   └── cebu-lechon.html        Full recipe-page TEMPLATE with Recipe schema (duplicate per dish)
├── css/style.css                Single stylesheet, CSS custom properties, mobile-first
├── js/script.js                 Mobile nav, scroll-spy, back-to-top, form handling, checklist
├── images/                      17 original WEBP illustrations (~15KB each, no stock photos)
├── scripts/
│   ├── generate_images.py      Regenerates/extends the illustration set
│   └── convert-to-webp.sh      Converts real photography to WEBP if/when you add real photos
├── robots.txt
└── sitemap.xml                  Lists pages currently built — append a <url> per new page
```

## Why illustrations instead of stock photos

Every visual on this site (`/images/*.webp`) is original, procedurally-generated artwork —
not stock photography. That means zero licensing risk when you deploy this publicly, a
consistent visual identity across every district and recipe, and very light page weight
(15–28KB per image). If you'd rather use real photography later, drop your photos in a
folder and run `scripts/convert-to-webp.sh your-photos/ images/` — it converts to WEBP
automatically — then swap the `src` paths in the HTML.

## SEO features already in place

- Unique, descriptive `<title>` and meta description per page
- Canonical URLs, Open Graph + Twitter Card tags, theme-color
- `WebSite`, `Organization`, `ItemList`, `BreadcrumbList`, `Article`, and `Recipe`
  JSON-LD structured data (the `Recipe` schema on `recipes/cebu-lechon.html` is eligible
  for Google's recipe rich-result carousel)
- Semantic HTML5 landmarks throughout: `header`, `nav`, `main`, `section`, `article`,
  `aside`, `figure`/`figcaption`, `footer`, proper `h1`–`h3` hierarchy
- Descriptive, keyword-relevant `alt` text and filenames on every image
- `loading="lazy"` on below-the-fold images, `fetchpriority="high"` on the hero image
- Explicit `width`/`height` on all images to prevent layout shift
- `robots.txt` + `sitemap.xml`
- Mobile-first responsive layout, semantic focus states, `prefers-reduced-motion` support

## Before you deploy

1. **Replace the placeholder domain.** `https://www.sugbotable.com/` appears in canonical
   tags, Open Graph tags, and structured data — find-and-replace it with your real domain.
2. **Update social links** in the footer (`instagram.com`, `facebook.com`, `youtube.com`
   placeholders).
3. **Extend the district/recipe pages.** Only Carbon Market and Cebu Lechon are built out
   as full pages — the other 6 districts and 5 recipes are live as homepage cards/sections.
   Duplicate `regions/carbon-market.html` and `recipes/cebu-lechon.html` for each remaining
   one, then add a `<url>` entry to `sitemap.xml`.
4. **Hook up the forms.** The newsletter and contact forms are client-side stubs (no
   backend). Wire them to your email provider or a form service (e.g. Formspree, Netlify
   Forms) by changing the `<form>` `action`/`method` and removing the JS `preventDefault`
   stub in `js/script.js` if you want a real POST.
5. **Host it.** Any static host works as-is — Netlify, Vercel, GitHub Pages, Cloudflare
   Pages. No build step is required.

## Design system

- **Palette:** charcoal `#2b2118`, lechon mahogany `#a8401d`, atsuete gold `#e8a33d`,
  Visayan-sea teal `#1f6f6b`, banana-leaf cream `#f7f2e7`, bamboo `#d8c9ae`
- **Type:** Fraunces (display), Work Sans (body), Space Mono (labels/eyebrows/meta)
- **Signature element:** the hero's illustrated Cebu coastline with route-pin markers,
  doubling as the site's wayfinding device
- **Layout:** F-pattern — left-aligned headings/CTAs, a horizontal hero bar, a horizontal
  stat bar, then vertically-scanned card grids and prose
