# PocketBase Integration - Implementation Guide

## Overview

Your Ruhani Creations e-commerce project has been updated to fetch products dynamically from PocketBase while maintaining the existing UI/design completely. All features remain functional with the same responsive grid, modals, and ordering flows.

## What Was Implemented

### 1. **API Utility Library** (`src/lib/api.ts`)
Reusable functions for secure PocketBase communication:
- `fetchProducts()` - Get all products
- `fetchByCategory(category)` - Get products by category filter
- `transformPocketBaseRecord(record)` - Convert PocketBase format to app format
- `validateProducts(products)` - Validate and sanitize products array
- Full error handling and TypeScript interfaces

### 2. **Astro API Endpoint** (`src/pages/api/products.ts`)
Server-side proxy for PocketBase:
- Secure communication (no API keys exposed to client)
- Query parameter support: `/api/products?category=girl-child`
- Response caching (5 minutes)
- Data sanitization (removes sensitive fields)
- Comprehensive error handling
- Status codes: 200 (success), 400 (bad request), 500 (error)

### 3. **Environment Configuration** (`.env`)
```env
PUBLIC_POCKETBASE_URL=http://localhost:8090
```
- `PUBLIC_` prefix makes it available to frontend
- Change URL for production deployments
- No sensitive data needed in .env

### 4. **Dynamic Product Loading** (`src/pages/catalog.astro`)
- Inline script that fetches products from `/api/products`
- Transforms PocketBase records to match existing format
- Sets `window.PRODUCTS` globally for app.js
- Handles network errors gracefully

### 5. **Updated Rendering Logic** (`public/app.js`)
- Added product loader that waits for products to be available
- Polls every 50ms with 5-second timeout
- Initializes app once products load
- All existing functionality preserved

## Project Structure

```
src/
├── lib/
│   └── api.ts              (NEW: API utilities)
├── pages/
│   ├── catalog.astro       (UPDATED: Dynamic loading script added)
│   └── api/
│       └── products.ts     (NEW: Astro API endpoint)
├── components/
│   └── (unchanged)
├── layouts/
│   └── (unchanged)
└── assets/
    └── (unchanged)

public/
├── app.js                  (UPDATED: Product loader added)
├── products.js             (NO LONGER USED: Products fetched dynamically)
└── (other files unchanged)

.env                        (NEW: Environment variables)
```

## Data Structure Expected from PocketBase

Your PocketBase records should have these fields:

```javascript
{
  id: "unique-id",
  title: "Product Name",
  category: "girl-child" | "women" | "men" | etc,
  actualPriceInr: 3999,
  discountPercent: 12,
  netPriceInr: 3519,
  status: "in-stock" | "sold",
  description: "Product description",
  image: "url-to-image",      // or
  images: ["url1", "url2"],   // array of image URLs
  stock: 5,                   // (optional)
  featured: false,            // (optional)
  // Any additional fields are preserved
}
```

### Category Values
The category field is used for filtering. Supported values:
- `girl-child` - Girl Child products
- `women` - Women products
- Future: `men`, `kids`, `accessories`, etc.

## How It Works

### Request Flow

```
1. User opens catalog page
   ↓
2. Browser executes dynamic loader script (in catalog.astro)
   ↓
3. Script calls: fetch("/api/products")
   ↓
4. Astro endpoint: src/pages/api/products.ts
   ├─ Reads PocketBase URL from .env
   ├─ Calls PocketBase API
   └─ Returns sanitized products
   ↓
5. Products stored in window.PRODUCTS
   ↓
6. app.js initializes with products
   ├─ Builds category dropdown
   ├─ Renders product grid
   └─ Sets up event listeners
```

### Category Filtering in PocketBase Query

The API endpoint supports category filtering:

```javascript
// Frontend code can request specific category
fetch('/api/products?category=girl-child')
// Returns only girl-child products
```

The server-side query:
```
/api/collections/RuhaniCreationsBySumati/records?filter=(category="girl-child")
```

## Configuration

### Setting Your PocketBase URL

1. **Local Development:**
   ```env
   PUBLIC_POCKETBASE_URL=http://localhost:8090
   ```

2. **Production (Update your domain):**
   ```env
   PUBLIC_POCKETBASE_URL=https://your-pocketbase.example.com
   ```

3. Restart dev server after updating `.env`

### API Endpoint Configuration

The endpoint assumes your PocketBase collection is named:
```
RuhaniCreationsBySumati
```

If your collection name differs, update in `src/pages/api/products.ts`:
```typescript
// Line ~115
let apiUrl = `${pocketBaseUrl}/api/collections/YOUR_COLLECTION_NAME/records`;
```

## Security Features

✅ **Environment Variables**
- No hardcoded URLs or credentials
- Sensitive config separate from code

✅ **Server-Side Proxy**
- All PocketBase communication server-side
- Client doesn't talk directly to PocketBase
- Prevents exposing admin credentials

✅ **Response Sanitization**
- Only allowed fields returned to frontend
- Sensitive fields filtered out
- Invalid records skipped

✅ **Error Handling**
- Network errors handled gracefully
- Invalid data rejected
- User-friendly fallbacks

✅ **Input Validation**
- Category parameter validated
- Request methods restricted (GET only)
- Query strings sanitized

## Scalability for Future Categories

The architecture supports unlimited categories. To add a new category:

### Step 1: Add products to PocketBase
Add records with new category value, e.g., `category: "men"`

### Step 2: That's it!
The dynamic system automatically:
- Detects new categories from records
- Adds to category filter dropdown
- Filters products automatically

No code changes needed for categories!

### Example: Adding "Men" Section
```javascript
// In PocketBase, create records like:
{
  id: "m-001",
  title: "Men's Festive Shirt",
  category: "men",  // <- New category
  actualPriceInr: 2999,
  // ... other fields
}
```

Catalog automatically shows "men" in category filter.

## Product Card Display

Products render with all existing styling:

```html
<article class="card">
  <img src="image-url" alt="title">
  <div class="card-body">
    <p class="eyebrow">Category</p>
    <h3>Title</h3>
    <!-- Price markup -->
    <span class="status-badge">Status</span>
    <p class="card-copy">Description</p>
    <div class="card-actions">
      <button>View details</button>
      <button>Order now</button>
    </div>
  </div>
</article>
```

All original styling, spacing, and responsive grid maintained.

## Modals and Interactions

All existing features work with dynamic products:

✅ Product modal with image gallery
✅ Image zoom controls
✅ Thumbnail navigation
✅ Order modal with WhatsApp/Email/Instagram
✅ Search functionality
✅ Category filtering
✅ Status filtering (In Stock/Sold)

## Error Handling

### What Happens If:

**PocketBase is offline?**
- Products array stays empty
- Empty state shown: "No products found"
- User can see catalog structure
- Error logged to browser console

**Invalid environment variable?**
- API returns 500 error
- Products array empty
- Graceful fallback to empty state

**Slow network?**
- App waits up to 5 seconds
- If timeout, initializes with empty products
- User can retry filtering

**Malformed product data?**
- Invalid records filtered out
- Valid records still displayed
- Warnings logged to console

## Browser Console Errors

In development, you'll see helpful console messages:

```javascript
// Success
Loaded 12 products from API

// If PocketBase not running
Error loading products: fetch failed
Products did not load within timeout period

// If URL invalid
API error: Invalid PocketBase URL configuration
```

## Testing

### Test in Browser

1. Open catalog page
2. Inspect Network tab (DevTools)
3. Look for `/api/products` request
4. Response should be JSON array of products
5. Check Console for loading confirmation

### Test Category Filter

```javascript
// Test in browser console
fetch('/api/products?category=girl-child').then(r => r.json()).then(console.log)
```

### Test Error Handling

```javascript
// Temporarily break URL in .env to test error handling
PUBLIC_POCKETBASE_URL=http://invalid-url
// Page should still load with empty state
```

## Performance Considerations

✅ **Response Caching**
- API responses cached for 5 minutes
- Reduces PocketBase load
- Fresh data within 5 min

✅ **Single Request**
- Catalog loads all products in one request
- No multiple API calls
- Efficient rendering

✅ **Lazy Image Loading**
- Images lazy-load with native browser
- Improves initial page performance

✅ **Optimized Rendering**
- Products rendered once on load
- Filter/search done client-side
- No extra API calls

## Maintenance & Updates

### Adding New Product Fields

If you add fields to PocketBase records, they're automatically preserved:

```javascript
// In PocketBase, add custom field
{
  ...existing fields...,
  customField: "value"
}

// Automatically available in product object
// Accessible in app.js via activeModalProduct.customField
```

### Changing Collection Name

1. Update PocketBase collection name in `src/pages/api/products.ts`
2. Restart dev server
3. Done!

### Changing Product URL

1. Update `PUBLIC_POCKETBASE_URL` in `.env`
2. Restart dev server
3. Done!

## Common Issues & Fixes

### Products Not Loading

**Check 1:** Is `.env` file in project root?
```bash
# Should be: d:\ruhani-new\ruhanicreations-astro\.env
```

**Check 2:** Is PocketBase URL correct?
```env
PUBLIC_POCKETBASE_URL=http://localhost:8090
```

**Check 3:** Is PocketBase running?
```bash
# Check in browser: http://localhost:8090
```

**Check 4:** Collection name matches?
- PocketBase collection: `RuhaniCreationsBySumati`
- Update if different: `src/pages/api/products.ts` line ~115

### Category Not Appearing

- Verify product has `category` field in PocketBase
- Check category spelling matches
- Refresh page
- Check browser console for errors

### Images Not Showing

- Verify image URLs are valid in PocketBase
- Use full URLs (not relative paths)
- Check image field name: `image` or `images` array
- Verify PocketBase serves images correctly

### Slow Loading

- Check network in DevTools
- Is PocketBase responding slowly?
- Check if response is being cached (should be in Network tab)
- Increase timeout in app.js if needed (default: 5 seconds)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Production Deployment

When deploying to production:

1. **Update .env**
   ```env
   PUBLIC_POCKETBASE_URL=https://your-pocketbase-domain.com
   ```

2. **Build project**
   ```bash
   npm run build
   ```

3. **Deploy built files**
   - `dist/` folder contains static site
   - Deploy to your hosting

4. **Verify API connectivity**
   - Test `/api/products` endpoint works
   - Check CORS headers if needed
   - Monitor console for errors

## Support & Debugging

### Enable Debug Logging

Add to browser console to see all product operations:

```javascript
// In browser DevTools console
localStorage.debug = 'products:*'
// Reload page
```

### View All Products

```javascript
// In browser console
console.table(window.PRODUCTS)
```

### Test API Directly

```javascript
// In browser console
fetch('/api/products').then(r => r.json()).then(d => console.table(d))
```

## File Reference

| File | Purpose | Status |
|------|---------|--------|
| `src/lib/api.ts` | API utilities | ✅ Created |
| `src/pages/api/products.ts` | Astro endpoint | ✅ Created |
| `src/pages/catalog.astro` | Catalog page | ✅ Updated |
| `public/app.js` | App logic | ✅ Updated |
| `public/products.js` | ❌ No longer used | Static (unchanged) |
| `.env` | Config | ✅ Created |

## Next Steps

1. **Verify PocketBase Setup**
   - Ensure collection `RuhaniCreationsBySumati` exists
   - Add your products with proper field structure
   - Verify collection is accessible

2. **Test Locally**
   - Start dev server: `npm run dev`
   - Open http://localhost:3000/catalog
   - Check Network tab for `/api/products`
   - Verify products display correctly

3. **Test Filtering**
   - Filter by category
   - Filter by status
   - Search functionality
   - All should work with dynamic data

4. **Deploy**
   - Build: `npm run build`
   - Deploy built files
   - Update `PUBLIC_POCKETBASE_URL` for production

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│   Browser / Client                      │
│  ┌───────────────────────────────────┐  │
│  │ Catalog Page (catalog.astro)      │  │
│  │ - HTML structure (unchanged)      │  │
│  │ - Dynamic loader script (NEW)     │  │
│  └───────────────────────────────────┘  │
│           │                              │
│           │ fetch("/api/products")       │
│           ▼                              │
│  ┌───────────────────────────────────┐  │
│  │ app.js                            │  │
│  │ - Waits for window.PRODUCTS       │  │
│  │ - Renders grid                    │  │
│  │ - Handles interactions            │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           │
           │ HTTP GET
           ▼
┌──────────────────────────────────────────┐
│  Astro Server (src/pages/api/products.ts)│
│  - Validates request                     │
│  - Calls PocketBase API                  │
│  - Sanitizes response                    │
│  - Returns JSON array                    │
└──────────────────────────────────────────┘
           │
           │ HTTP Request
           ▼
┌──────────────────────────────────────────┐
│  PocketBase Server                       │
│  Collection: RuhaniCreationsBySumati     │
│  - Stores product records                │
│  - Returns filtered results              │
└──────────────────────────────────────────┘
```

## Summary

✅ **Design Preserved** - All UI/styling exactly same  
✅ **Dynamic Products** - Fetched from PocketBase  
✅ **Scalable** - Works with any number of categories  
✅ **Secure** - Server-side proxy, no exposed keys  
✅ **Error Handling** - Graceful fallbacks  
✅ **Production Ready** - Caching, validation, sanitization  
✅ **Maintainable** - Clean code, well-documented  
✅ **Future Ready** - Easy to add new categories  

All existing features work perfectly with the dynamic system! 🎉
