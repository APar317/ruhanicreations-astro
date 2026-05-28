PocketBase CMS + Astro API Integration Documentation
Project

Ruhani Creations by Sumati

Objective

This document explains the complete implementation process of integrating PocketBase as a Headless CMS with the Astro frontend architecture.

The objective of this integration was to:

remove hardcoded frontend product management
create scalable CMS-driven architecture
dynamically manage products
secure backend communication
abstract CMS APIs behind Astro server-side endpoints
improve maintainability and scalability
Initial Problem

Initially, the catalog system was based on:

static product arrays
hardcoded product JavaScript
manually managed product images
frontend-only rendering

Problems with this architecture:

difficult product management
repeated frontend code updates
poor scalability
static asset dependency
larger repository size
direct frontend data management
difficult CMS integration
Solution Overview

The architecture was redesigned using:

PocketBase CMS
       ↓
Astro Server APIs
       ↓
Frontend Rendering

This introduced:

centralized product management
dynamic rendering
secure backend abstraction
scalable architecture
Why PocketBase

PocketBase was selected because it provides:

lightweight backend
built-in database
admin dashboard
file upload support
REST APIs
fast local setup
simple CMS management

It was suitable for:

small-to-medium ecommerce architecture
rapid prototyping
local development
CMS-based rendering
PocketBase Installation

PocketBase was downloaded from the official website and extracted locally.

Directory:

D:\pocketbase
Starting PocketBase

Run:

pocketbase serve

Admin panel becomes available at:

http://127.0.0.1:8090/_/
CMS Collection Architecture

Instead of creating separate collections like:

women_products
girl_child_products

a centralized scalable collection structure was implemented.

Final Collection Structure

Created collection:

products
Why Single Collection

Using a centralized collection provides:

scalability
easier filtering
simpler APIs
better maintenance
reusable frontend rendering

Future categories can be added without changing architecture.

Example:

title	category
Lehenga	women
Kids Dress	girl-child
Product Fields

The following fields were created inside the products collection.

Field	Type
title	text
category	text
description	text/editor
images	file
slug	text
actualPriceInr	number
discountPercent	number
netPriceInr	number
status	text
Category Structure

Current categories:

women
girl-child

The frontend dynamically filters products based on category values.

Product Image Handling

PocketBase file upload system was used for product images.

Initially:

single image testing performed

Future-ready architecture:

multiple product images supported
primary image support planned
Product Addition Flow

Products are now added directly through PocketBase Admin Dashboard.

Flow:

PocketBase Admin
       ↓
Create Record
       ↓
Upload Images
       ↓
Save Product
       ↓
Frontend Updates Dynamically

No frontend code modification required.

Astro API Integration
Objective

Frontend should NOT directly communicate with PocketBase APIs.

Instead:

Frontend → Astro API → PocketBase

This prevents exposing backend CMS architecture.

API Endpoint Created

Created:

src/pages/api/products.ts
Purpose of API Layer

The Astro API layer:

fetches records from PocketBase
formats product data
returns safe frontend JSON
abstracts backend logic
prevents direct CMS exposure
Environment Configuration

Created .env configuration:

POCKETBASE_URL=http://127.0.0.1:8090
PocketBase SDK Installation

Installed PocketBase SDK:

npm install pocketbase
API Response Flow
Browser
   ↓
/api/products
   ↓
PocketBase

Frontend only communicates with Astro APIs.

PocketBase internal APIs remain abstracted.

Security Benefits

This architecture prevents:

direct backend exposure
frontend CMS API leakage
exposing internal backend structure
exposing admin configurations
Catalog Integration

catalog.astro was updated to fetch data dynamically from:

/api/products

Products now render dynamically.

Dynamic Rendering Verification

Verified that:

adding products in PocketBase
editing records
changing product images
updating descriptions

automatically updates frontend rendering.

Removal of Static Architecture

Removed:

public/products.js

Removed:

public/assets/products/

Reason:

products are now CMS-driven
frontend no longer depends on static assets
Current Product Rendering Flow
PocketBase CMS
       ↓
Astro API Endpoint
       ↓
Frontend Catalog
       ↓
Dynamic Product Rendering
Product Detail Architecture

Dynamic product detail flow implemented using:

/api/product/[slug]

Slug-based routing allows:

dynamic product pages
SEO-friendly URLs
scalable product rendering
Why Slug-Based Architecture

Example:

/product/red-lehenga

instead of:

/product?id=123

Benefits:

cleaner URLs
SEO improvement
easier frontend routing
Frontend Verification

Verified:

products rendering dynamically
categories rendering correctly
API responses working properly
images loading correctly
no static product dependency remaining
Security Verification

Verified through browser inspection that:

Frontend only accesses:

/api/products

and NOT direct PocketBase APIs.

This confirms:

secure API abstraction
hidden backend architecture
Current Features Completed
CMS Features
centralized products collection
category-based architecture
dynamic product updates
image upload support
Astro Features
server-side API integration
dynamic catalog rendering
CMS abstraction layer
scalable architecture
Future Improvements

Potential future upgrades:

multiple product image gallery
primary image selector
admin authentication
role-based CMS access
inventory management
order management
product search optimization
caching layer
image optimization
Final Architecture
PocketBase CMS
       ↓
Astro API Layer
       ↓
Astro Frontend
       ↓
Catalog Rendering
Conclusion

The project was successfully migrated from a static frontend product architecture to a dynamic CMS-driven architecture using PocketBase and Astro APIs.

The implementation now provides:

centralized product management
dynamic frontend rendering
scalable architecture
secure API abstraction
simplified maintenance
deployment-ready CMS integration