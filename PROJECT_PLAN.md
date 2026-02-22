# Ruhani Creations Website - Project Plan and Configuration Runbook

Last updated: February 22, 2026

## 1. Project goal

Build and run a product-catalog website for **Ruhani Creations by Sumati** with:

- static website hosting
- custom domain
- business email on the same domain
- simple product update workflow from Git

## 2. Current architecture (live setup choices)

| Area | Service | Current status | Notes |
|---|---|---|---|
| Domain registration | Hostinger | Configured | Domain: `ruhanicreationsbysumati.com` |
| DNS / edge | Cloudflare | Zone created and configured | Domain added as Cloudflare zone |
| Website hosting | Cloudflare Pages | Pending final publish | Source from GitHub repo |
| Business email | Zoho Mail (Free plan) | Configured and working | Domain email is active |
| Source control | GitHub | Configured | Repo: `git@github.com:vishalaswanidei/ruhanicreations-website.git` |

## 3. Domain and branding

- Brand name: **Ruhani Creations by Sumati**
- Website domain: `ruhanicreationsbysumati.com`
- Social:
  - Instagram: `https://www.instagram.com/ruhani.creations/`
  - Facebook: `https://www.facebook.com/share/1BF1LsCzts/?mibextid=wwXIfr`

## 4. Git and repository controls

This repo is configured to enforce the correct identity and account usage.

### Commit identity (author)

- `user.name = Vishal Aswani`
- `user.email = vishal.aswanidei@gmail.com`
- `user.useConfigOnly = true`
- Hook path: `.githooks`
- Pre-commit check blocks commits if repo email differs.

### Push identity (GitHub account)

- Remote: `origin -> git@github.com:vishalaswanidei/ruhanicreations-website.git`
- Repo-local SSH command pins the key for this account only:
  - `ssh -i ~/.ssh/id_ed25519_github_vishalgmail -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new`

## 5. Website deployment plan (Cloudflare Pages)

## Prerequisites

- Cloudflare zone for `ruhanicreationsbysumati.com` is active.
- GitHub repo has latest branch pushed.

## Steps

1. Open Cloudflare dashboard -> `Workers & Pages` -> `Create application` -> `Pages`.
2. Connect GitHub and select `vishalaswanidei/ruhanicreations-website`.
3. Production branch: `main`.
4. Build settings for this static site:
   - Build command: *(empty)*
   - Output directory: `/` (repo root)
5. Deploy.
6. In Pages project -> `Custom domains`:
   - add `ruhanicreationsbysumati.com`
   - add `www.ruhanicreationsbysumati.com`
7. Keep Zoho MX/TXT records intact when reviewing DNS.

## Post-deploy checks

- Home page loads on apex and `www`.
- Product images load correctly.
- `robots.txt` resolves.
- `sitemap.xml` resolves and uses the new domain.
- 404 page works when opening a non-existing URL.

## 6. Email plan (Zoho)

Zoho Mail is configured and working on domain `ruhanicreationsbysumati.com`.

### Website-facing addresses currently used

- `support@ruhanicreationsbysumati.com`
- `order@ruhanicreationsbysumati.com`

These are already referenced in website pages.

### Recommended mailbox model

- Primary mailbox/user: owner/admin
- Aliases or groups:
  - `support@ruhanicreationsbysumati.com`
  - `order@ruhanicreationsbysumati.com`
  - optional: `sales@`, `info@`, `accounts@`, `returns@`

## 7. Content and product data workflow

## Product source files

- Catalog data: `products.js`
- Product images: `assets/products/`
- Logo: `assets/logo.svg`

## Current product image organization

- Women: `assets/products/women/`
- Girl child: `assets/products/girl-child/`

## Product object fields

Each product entry in `products.js` contains:

- `id`
- `title`
- `category` (`Women` or `Girl Child`)
- `priceInr` (estimated test pricing)
- `status` (`in-stock` or `sold`)
- `description`
- `images` (local image paths)

## 8. What has been configured in this branch

Branch: `feat/pre-hosting-branding-email-updates`

Completed in code:

- Brand color theme updated (green + gold palette).
- Logo integrated in sidebar/header.
- Footer cleaned (removed visible 401/404 links).
- Social links updated (Instagram/Facebook).
- Website email links changed to domain mail addresses.
- Sitemap and robots domain updated to `ruhanicreationsbysumati.com`.
- Product catalog replaced with local images and categorized Women/Girl Child sample data.

## 9. Operational checklist before go-live

1. Push branch and merge to `main` after review.
2. Deploy `main` on Cloudflare Pages.
3. Re-verify Zoho records (MX/SPF/DKIM/DMARC) are unchanged.
4. Replace placeholder WhatsApp number in `index.html` and `contact.html`.
5. Validate on mobile and desktop.
6. Submit sitemap in Google Search Console.

## 10. Risks and guardrails

- Do not delete or overwrite Zoho MX/TXT records while adjusting website DNS.
- Keep large image uploads optimized to avoid slow catalog pages.
- Do not store credentials/API keys in repo.
- Keep all domain/account ownership records in one internal document (outside repo).
