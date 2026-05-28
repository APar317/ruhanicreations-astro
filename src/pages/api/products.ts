import PocketBase from 'pocketbase';

/**
 * Astro API endpoint that returns a list of products from PocketBase.
 *
 * Environment:
 *   PUBLIC_POCKETBASE_URL or POCKETBASE_URL - The base URL of the PocketBase instance (e.g., http://127.0.0.1:8090).
 *   POCKETBASE_COLLECTION - Optional collection name override (defaults to RuhaniCreationsBySumati_Girl_Child).
 *   POCKETBASE_ADMIN_EMAIL - Optional admin email for private collections.
 *   POCKETBASE_ADMIN_PASSWORD - Optional admin password for private collections.
 *
 * The endpoint is server‑side only; the frontend never contacts PocketBase directly.
 * It returns an array of product objects with the fields required by the catalog UI.
 */
export async function GET({ request }: { request: Request }) {
  const baseUrl = import.meta.env.PUBLIC_POCKETBASE_URL ?? process.env.POCKETBASE_URL ?? 'http://127.0.0.1:8090';
  const collectionName = import.meta.env.POCKETBASE_COLLECTION ?? process.env.POCKETBASE_COLLECTION ?? 'RuhaniCreationsBySumati_Girl_Child';

  const adminEmail = import.meta.env.POCKETBASE_ADMIN_EMAIL ?? process.env.POCKETBASE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.POCKETBASE_ADMIN_PASSWORD ?? process.env.POCKETBASE_ADMIN_PASSWORD;

  console.log(`[API /api/products] Fetching from PocketBase URL: ${baseUrl}, Collection: ${collectionName}`);

  // Initialise PocketBase client
  const pb = new PocketBase(baseUrl);

  // Authenticate as Admin if credentials are provided (useful if collection rules are private)
  if (adminEmail && adminPassword) {
    try {
      // Try older admin auth first (PocketBase <= v0.21)
      await pb.admins.authWithPassword(adminEmail, adminPassword);
      console.log('[API /api/products] Authenticated as PocketBase Admin successfully.');
    } catch (e) {
      try {
        // Try newer superusers auth (PocketBase >= v0.22)
        await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
        console.log('[API /api/products] Authenticated as PocketBase Superuser successfully.');
      } catch (authErr: any) {
        console.warn('[API /api/products] Authentication with credentials failed, proceeding as public visitor:', authErr?.message || authErr);
      }
    }
  }

  try {
    const records = await pb.collection(collectionName).getFullList({
      limit: 200,
      sort: '-created',
    });

    console.log(`[API /api/products] Fetched ${records.length} raw records from PocketBase.`);

    // Transform PocketBase records to the shape expected by the frontend.
    const products = records.map((rec: any) => {
      // Build absolute URLs for files in PocketBase file fields
      let images: string[] = [];
      const filesList = rec.Image || rec.images || rec.image;

      if (Array.isArray(filesList)) {
        images = filesList.map((filename: string) => pb.files.getURL(rec, filename));
      } else if (typeof filesList === 'string' && filesList) {
        images = [pb.files.getURL(rec, filesList)];
      }

      const actualPrice = Number(rec.Price ?? rec.actualPriceInr ?? rec.price ?? 0);
      const discountPercent = Number(rec.Discount ?? rec.discountPercent ?? rec.discount ?? 0);
      
      // Calculate net price if not explicitly provided in the record
      const calculatedNetPrice = Math.round(actualPrice * (1 - discountPercent / 100));
      const netPrice = Number(rec.netPriceInr ?? rec.PriceNet ?? rec.Price_net ?? rec.offerPrice ?? calculatedNetPrice);

      // Determine status safely
      const rawStatus = rec.Status ?? rec.status;
      const status = typeof rawStatus === 'string' && rawStatus 
        ? rawStatus 
        : (rec.available === true || rec.inStock === true ? 'in-stock' : 'sold');

      return {
        id: rec.id,
        title: rec.Title ?? rec.title ?? rec.name ?? 'Untitled Product',
        category: rec.Category ?? rec.category ?? 'Uncategorized',
        description: rec.Description ?? rec.description ?? '',
        images,
        actualPriceInr: actualPrice,
        discountPercent: discountPercent,
        netPriceInr: netPrice,
        status: status,
        slug: rec.slug ?? rec.id,
      };
    });

    console.log(`[API /api/products] Successfully transformed ${products.length} products for the frontend.`);
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
    });
  } catch (err: any) {
    console.error('[API /api/products] Error fetching from PocketBase:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err?.message || 'Failed to retrieve products from database',
        data: []
      }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}


