# API Reference

## Endpoint: `GET /api/products`

### Description
Fetches all products from PocketBase collection `RuhaniCreationsBySumati`.

### Usage

```javascript
// Fetch all products
fetch('/api/products')
  .then(response => response.json())
  .then(products => console.log(products));

// Fetch specific category
fetch('/api/products?category=girl-child')
  .then(response => response.json())
  .then(products => console.log(products));
```

### Query Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `category` | string | Filter by category (e.g., "girl-child", "women") | No |

### Response Format

#### Success (200 OK)
Returns JSON array of products:

```json
[
  {
    "id": "p-001",
    "title": "Little Mehfil Lehenga Set",
    "category": "girl-child",
    "actualPriceInr": 2799,
    "discountPercent": 10,
    "netPriceInr": 2519,
    "status": "in-stock",
    "description": "Occasion-ready lehenga set for girls with bright festive tones...",
    "image": "https://...",
    "images": [
      "https://...",
      "https://..."
    ],
    "stock": 5,
    "featured": true,
    "created": "2024-01-15T10:30:00.000Z",
    "updated": "2024-01-20T14:45:00.000Z"
  },
  {
    "id": "p-002",
    "title": "Junior Festive Dance Edit",
    "category": "girl-child",
    "actualPriceInr": 2499,
    "discountPercent": 12,
    "netPriceInr": 2199,
    "status": "in-stock",
    "description": "Traditional festive set for school functions...",
    "images": [
      "https://...",
      "https://..."
    ]
  }
]
```

#### Empty Result (200 OK)
When no products match the filter:

```json
[]
```

#### Error (400 Bad Request)
When query parameters are invalid:

```json
{
  "success": false,
  "error": "Invalid category parameter",
  "data": []
}
```

#### Error (500 Internal Server Error)
When PocketBase is unreachable or misconfigured:

```json
{
  "success": false,
  "error": "Failed to fetch from PocketBase: ...",
  "data": []
}
```

---

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique product identifier |
| `title` | string | Product name/title |
| `category` | string | Category name (girl-child, women, etc.) |
| `actualPriceInr` | number | Original/marked price in INR |
| `discountPercent` | number | Discount percentage (0-100) |
| `netPriceInr` | number | Final price after discount |
| `status` | string | "in-stock" or "sold" |
| `description` | string | Product description |
| `image` | string | URL to single image |
| `images` | array | Array of image URLs |
| `stock` | number | Available quantity (optional) |
| `featured` | boolean | Is product featured (optional) |
| `created` | string | Creation timestamp (ISO 8601) |
| `updated` | string | Last update timestamp (ISO 8601) |

---

## Examples

### Get All Products

**Request:**
```bash
curl http://localhost:3000/api/products
```

**Response:**
```json
[
  { "id": "p-001", "title": "...", ... },
  { "id": "p-002", "title": "...", ... },
  { "id": "p-003", "title": "...", ... }
]
```

### Get Girl Child Products Only

**Request:**
```bash
curl 'http://localhost:3000/api/products?category=girl-child'
```

**Response:**
```json
[
  {
    "id": "p-001",
    "title": "Little Mehfil Lehenga Set",
    "category": "girl-child",
    ...
  },
  {
    "id": "p-002",
    "title": "Junior Festive Dance Edit",
    "category": "girl-child",
    ...
  }
]
```

### Get Women Products Only

**Request:**
```bash
curl 'http://localhost:3000/api/products?category=women'
```

**Response:**
```json
[
  {
    "id": "p-004",
    "title": "Gulmohar Festive Kurta Set",
    "category": "women",
    ...
  }
]
```

### JavaScript Usage

```javascript
// Load all products
async function loadAllProducts() {
  const response = await fetch('/api/products');
  const products = await response.json();
  console.log(products);
}

// Load specific category
async function loadCategory(category) {
  const response = await fetch(`/api/products?category=${category}`);
  const products = await response.json();
  console.log(products);
}

// With error handling
async function safeLoadProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    if (!Array.isArray(products)) {
      throw new Error('Invalid response format');
    }
    console.log(`Loaded ${products.length} products`);
    return products;
  } catch (error) {
    console.error('Failed to load products:', error);
    return [];
  }
}
```

---

## Caching

Responses are cached for **5 minutes** (300 seconds):

```
Cache-Control: max-age=300
```

This means:
- Requests within 5 minutes get cached response
- After 5 minutes, fresh data fetched from PocketBase
- Reduces load on PocketBase server

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider:

1. Adding rate limiting to prevent abuse
2. Implementing API authentication
3. Setting stricter cache headers

---

## Security

✅ **Data Sanitization**
- Only allowed fields returned
- Sensitive fields removed

✅ **Input Validation**
- Category parameter validated
- Invalid requests rejected

✅ **Error Handling**
- Errors don't expose internal structure
- Generic error messages to client

✅ **No Credentials Exposed**
- PocketBase URL in server code
- No API keys transmitted to client
- All sensitive communication server-side

---

## Troubleshooting

### 500 Error: "PocketBase URL is not configured"

**Solution:** Add `PUBLIC_POCKETBASE_URL` to `.env`:
```env
PUBLIC_POCKETBASE_URL=http://localhost:8090
```

### 500 Error: "Failed to fetch from PocketBase"

**Solutions:**
1. Verify PocketBase is running
2. Verify URL in `.env` is correct
3. Check PocketBase collection name is `RuhaniCreationsBySumati`
4. Check network connectivity

### Empty array returned

**Check:**
1. Products exist in PocketBase collection
2. Collection name matches exactly
3. Products have required fields (id, title, category)

### Images not loading

**Check:**
1. Image URLs are complete (not relative paths)
2. PocketBase server is serving images
3. CORS is configured if needed
4. Image field names are `image` or `images`

---

## Production Considerations

1. **Update URL in .env**
   ```env
   PUBLIC_POCKETBASE_URL=https://your-production-pocketbase.com
   ```

2. **Add Rate Limiting**
   - Implement in Astro middleware
   - Prevent abuse

3. **Add Monitoring**
   - Log errors to monitoring service
   - Track API response times

4. **Increase Cache**
   - Change `max-age` based on product update frequency
   - Default: 300 seconds (5 minutes)

5. **CORS Configuration**
   - If PocketBase on different domain
   - Configure PocketBase CORS settings

---

## Related Files

- `src/pages/api/products.ts` - API endpoint implementation
- `src/lib/api.ts` - Utility functions for fetching
- `.env` - Configuration
- `POCKETBASE_INTEGRATION.md` - Detailed documentation

---

**Last Updated:** 2024-01-22
