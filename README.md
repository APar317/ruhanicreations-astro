# Ruhani Creations by Sumati Website

This is a static multi-page catalog website for an Indian designer clothing business.

## Current pages

- `index.html` - Home + product catalog
- `about.html` - About page
- `contact.html` - Contact page
- `faq.html` - FAQ page
- `terms.html` - Terms and conditions
- `privacy.html` - Privacy policy
- `401.html` - Unauthorized page
- `404.html` - Not found page

Standard website files included:

- `robots.txt`
- `sitemap.xml`

## Core features

- Left sidebar navigation
- Footer links on every page
- Product cards with:
  - 3 to 4 photos per product
  - description
  - price in INR
  - stock status (`in-stock` / `sold`)
- Search and filters on the home catalog
- Product details modal gallery
- Mobile responsive layout

## Product updates

Edit `products.js` and add/update product objects.

Each product needs:

- `title`
- `category`
- `priceInr`
- `status`
- `description`
- `images` (3 to 4 image paths recommended, e.g. `assets/products/p-001/1.webp`)

## Product image hosting recommendation

For this static site, prefer storing product images in the repository under `assets/products/`.

- Good for launch and moderate catalog sizes.
- Version controlled and deployed together with site changes.
- Avoid using Dropbox public links for product assets (link stability and cache behavior are weaker for production websites).

## Local run

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Deployment (free)

Recommended: **Cloudflare Pages**.

1. Push this folder to GitHub.
2. Connect repo in Cloudflare Pages.
3. Build settings:
   - Framework: `None`
   - Build command: empty
   - Output directory: `/`
4. Deploy.
5. Add custom domain.

Alternative free hosts: Netlify, GitHub Pages.

## Git tracking

If this folder is not yet a git repo:

```bash
git init -b main
git add .
git commit -m "Initial commit: Ruhani Creations website"
```

If commit fails, set identity once:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```
