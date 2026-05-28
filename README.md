Ruhani Creations by Sumati — Astro + PocketBase CMS
Project Overview

Ruhani Creations by Sumati is a fashion/catalog website migrated from a static HTML architecture to a scalable Astro-based frontend integrated with PocketBase as a Headless CMS.

The project focuses on:

scalable frontend architecture
CMS-driven product management
secure API integration
improved maintainability
deployment optimization
OWASP security hardening
Current Architecture
PocketBase CMS
       ↓
Astro Server APIs
       ↓
Astro Frontend
       ↓
Dynamic Catalog Rendering
Major Features
Astro Frontend
Astro-based architecture
reusable layouts
modular structure
dynamic rendering
SEO-friendly routing
scalable page management
PocketBase Headless CMS
centralized product management
dynamic product updates
image uploads
category-based filtering
scalable collection structure
Secure API Layer

Frontend does NOT directly communicate with PocketBase.

Instead:

Frontend → Astro APIs → PocketBase

Benefits:

backend abstraction
improved security
hidden CMS endpoints
controlled API responses
Categories Implemented

Currently supported categories:

women
girl-child

Products are dynamically fetched and rendered through CMS data.

Security Improvements

Security hardening performed using OWASP ZAP.

Implemented:

X-Frame-Options
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Content-Security-Policy improvements
Technologies Used
Technology	Purpose
Astro	Frontend Framework
PocketBase	Headless CMS
TypeScript	API Logic
Cloudflare/Vercel	Deployment
OWASP ZAP	Security Testing
Repository Structure
.
├── docs/
├── public/
├── src/
│   ├── layouts/
│   ├── pages/
│   ├── lib/
│   └── styles/
├── CHANGELOG.md
├── README.md
└── package.json
CMS Architecture
Collection
products
Product Fields
Field	Type
title	text
category	text
description	text
images	file
slug	text
actualPriceInr	number
discountPercent	number
netPriceInr	number
status	text
API Endpoints
Products API
/api/products

Fetches all products dynamically from PocketBase.

Category APIs

Examples:

/api/women
/api/girl-child
Dynamic Product API
/api/product/[slug]

Fetches product details dynamically using product slug.

Dynamic Rendering Flow
PocketBase Admin
       ↓
Create/Update Product
       ↓
Astro API Fetch
       ↓
Frontend Auto Updates

No frontend code modification required after CMS integration.

Setup Instructions
1. Clone Repository
git clone <repository-url>
2. Install Dependencies
npm install
3. Start Astro Development Server
npm run dev

Runs at:

http://localhost:4321
4. Setup PocketBase

Download PocketBase and run:

pocketbase serve

Admin panel:

http://127.0.0.1:8090/_/
5. Configure Environment Variables

Create:

.env

Add:

POCKETBASE_URL=http://127.0.0.1:8090
Security Architecture

Frontend only accesses Astro APIs.

PocketBase APIs remain abstracted behind the server layer.

This prevents:

direct backend exposure
CMS structure leakage
uncontrolled API access
Documentation

Detailed project documentation available:

File	Purpose
astro-migration.md	HTML to Astro migration process
owasp-zap-security-fixes.md	Security testing & fixes
pocketbase.md	CMS + API integration
CHANGELOG.md	Complete project evolution
Completed Implementations
Frontend
Astro migration
reusable layouts
dynamic rendering
Security
OWASP ZAP fixes
secure headers
API abstraction
CMS
PocketBase integration
centralized products collection
dynamic product management
APIs
Astro API layer
secure backend communication
scalable rendering flow
Future Improvements

Planned enhancements:

multiple product image galleries
primary image support
admin authentication
role-based access
inventory management
payment integration
image optimization
caching layer
API rate limiting
Current Status

The project has successfully evolved from:

Static HTML Website

to:

Astro + PocketBase CMS Architecture

with:

secure backend abstraction
scalable frontend rendering
CMS-driven product management
deployment-ready structure
improved maintainability
enhanced security posture
