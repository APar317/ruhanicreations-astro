# Quick Start Guide - PocketBase Integration

## ⚡ 3 Simple Steps to Get Started

### Step 1: Configure PocketBase URL

Edit `.env` file in your project root:

```env
PUBLIC_POCKETBASE_URL=http://localhost:8090
```

Update this to match your PocketBase instance URL:
- **Local:** `http://localhost:8090`
- **Production:** `https://your-pocketbase-domain.com`

### Step 2: Create PocketBase Collection

Create a collection named `RuhaniCreationsBySumati` with products containing:

```javascript
{
  id: "unique-id",
  title: "Product Name",
  category: "girl-child",  // or "women", etc.
  actualPriceInr: 3999,
  discountPercent: 12,
  status: "in-stock",      // or "sold"
  description: "Description",
  images: ["image-url-1", "image-url-2"],  // array or single image field
  // ... other fields (automatically preserved)
}
```

### Step 3: Start Development

```bash
npm run dev
```

Visit `http://localhost:3000/catalog` and products should display! 🎉

---

## 📁 New/Modified Files

### Created Files
- ✅ `src/lib/api.ts` - API utilities
- ✅ `src/pages/api/products.ts` - Astro API endpoint  
- ✅ `.env` - Environment configuration
- ✅ `POCKETBASE_INTEGRATION.md` - Full documentation

### Modified Files
- ✅ `src/pages/catalog.astro` - Added dynamic loader script
- ✅ `public/app.js` - Added product loader logic

### Unchanged Files
- ✅ Everything else (all styling, design, components)
- ✅ `public/products.js` - No longer used but left as-is

---

## 🔍 How to Verify It Works

1. **Check Products Load:**
   - Open DevTools (F12)
   - Go to Network tab
   - Refresh catalog page
   - Look for `/api/products` request
   - Response should show your products as JSON

2. **Check Console:**
   - Open DevTools Console
   - You should see: `Loaded X products from API`
   - If error, message will show what went wrong

3. **Test Filtering:**
   - Use category dropdown
   - Use status filter
   - Search for products
   - All should work with your dynamic data

---

## 🚀 Common Tasks

### Change PocketBase Collection Name

If your collection isn't named `RuhaniCreationsBySumati`:

1. Open `src/pages/api/products.ts`
2. Find line ~115: `let apiUrl = ...`
3. Change collection name:
   ```typescript
   let apiUrl = `${pocketBaseUrl}/api/collections/YOUR_COLLECTION_NAME/records`;
   ```
4. Save and restart dev server

### Add New Category

Just add products with new category value in PocketBase:

```javascript
{
  category: "men"  // or "accessories", "kids", etc.
}
```

The dropdown automatically updates! No code changes needed.

### Deploy to Production

1. Update `.env`:
   ```env
   PUBLIC_POCKETBASE_URL=https://your-production-url.com
   ```

2. Build:
   ```bash
   npm run build
   ```

3. Deploy `dist/` folder to your hosting

---

## ❌ Troubleshooting

### Products Not Loading?

**Check 1:** Is `.env` file in project root?
```bash
ls .env  # Should exist
```

**Check 2:** Is PocketBase running?
```bash
# Test URL in browser
http://localhost:8090
# Should show PocketBase admin interface
```

**Check 3:** Does collection exist?
- In PocketBase admin: Collections > `RuhaniCreationsBySumati`
- Check spelling exactly

**Check 4:** Do products have required fields?
```javascript
// Each product needs at least:
{
  id: "some-id",
  title: "Product Name",
  category: "category-name"
}
```

### Category Not Showing in Dropdown?

- Product record must have `category` field
- Category value must match exactly (case-sensitive)
- Refresh page after adding new category

### Images Not Displaying?

- Use full URLs (not relative paths)
- PocketBase must be able to serve images
- Image field should be `images` (array) or `image` (string)

### Still Stuck?

Check browser console (F12) for specific error messages.

---

## 📚 Documentation

For detailed documentation, see: `POCKETBASE_INTEGRATION.md`

Key sections:
- Architecture overview
- Data structure details
- Security features
- Scalability guide
- Production deployment
- Performance optimization

---

## ✨ What's Preserved

✅ All UI/Design - Exact same styling
✅ All Components - Modals, cards, filters
✅ All Interactions - Search, filtering, ordering
✅ All Responsive Design - Mobile, tablet, desktop
✅ All Animations - Hover effects, transitions
✅ All Features - Zoom, image gallery, checkout flows

Only the data source changed: Static → Dynamic PocketBase

---

## 🎯 Next: Add "Women" Section

Once "Girl Child" is working:

1. Add products with `category: "women"` in PocketBase
2. Refresh catalog
3. "Women" appears in category dropdown automatically
4. No code changes needed!

Same process for any future categories: Men, Kids, Accessories, etc.

---

**Ready? Start dev server and test! 🚀**

```bash
npm run dev
# Then visit: http://localhost:3000/catalog
```
