/**
 * Astro API endpoint that returns a list of products from PocketBase.
 *
 * Uses direct HTTP fetch to the PocketBase REST API — no SDK auth issues.
 *
 * Environment:
 *   PUBLIC_POCKETBASE_URL  – PocketBase base URL (default: http://127.0.0.1:8090)
 *   POCKETBASE_COLLECTION  – collection name (default: RuhaniCreationsBySumati_Girl_Child)
 *   POCKETBASE_ADMIN_EMAIL    – superuser email (optional, for private collections)
 *   POCKETBASE_ADMIN_PASSWORD – superuser password (optional, for private collections)
 */

export async function GET({ request }: { request: Request }) {
  const baseUrl = (
    import.meta.env.PUBLIC_POCKETBASE_URL ??
    process.env.POCKETBASE_URL ??
    'http://127.0.0.1:8090'
  ).replace(/\/+$/, '');

  const collectionName =
    import.meta.env.POCKETBASE_COLLECTION ??
    process.env.POCKETBASE_COLLECTION ??
    'RuhaniCreationsBySumati_Girl_Child';

  const adminEmail =
    import.meta.env.POCKETBASE_ADMIN_EMAIL ?? process.env.POCKETBASE_ADMIN_EMAIL ?? '';
  const adminPassword =
    import.meta.env.POCKETBASE_ADMIN_PASSWORD ?? process.env.POCKETBASE_ADMIN_PASSWORD ?? '';

  console.log(`[API /api/products] PocketBase: ${baseUrl}, Collection: ${collectionName}`);

  let authToken = '';

  // Attempt superuser auth if credentials are provided
  if (adminEmail && adminPassword) {
    try {
      // PocketBase v0.22+ uses _superusers collection
      const authRes = await fetch(`${baseUrl}/api/collections/_superusers/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: adminEmail, password: adminPassword }),
      });
      if (authRes.ok) {
        const authData = await authRes.json();
        authToken = authData.token ?? '';
        console.log('[API /api/products] Superuser auth OK.');
      } else {
        console.warn('[API /api/products] Superuser auth failed:', authRes.status);
      }
    } catch (e: any) {
      console.warn('[API /api/products] Auth error:', e?.message);
    }
  }

  /**
   * Build PocketBase file URL.
   * Format: {baseUrl}/api/files/{collectionIdOrName}/{recordId}/{filename}
   */
  function buildFileUrl(collectionRef: string, recordId: string, filename: string): string {
    return `${baseUrl}/api/files/${collectionRef}/${recordId}/${encodeURIComponent(filename)}`;
  }

  try {
    // Fetch all records — PocketBase default page size is 30, so use perPage=200
    const listUrl = `${baseUrl}/api/collections/${encodeURIComponent(collectionName)}/records?perPage=200&sort=-created`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const listRes = await fetch(listUrl, { headers });
    console.log(`[API /api/products] PocketBase list response: ${listRes.status}`);

    if (!listRes.ok) {
      const errText = await listRes.text();
      console.error('[API /api/products] PocketBase error body:', errText);
      throw new Error(`PocketBase returned ${listRes.status}: ${errText}`);
    }

    const listData = await listRes.json();
    const records: any[] = listData.items ?? [];

    console.log(`[API /api/products] Got ${records.length} records.`);
    if (records[0]) {
      console.log('[API /api/products] First record keys:', Object.keys(records[0]));
      console.log('[API /api/products] First record:', JSON.stringify(records[0]));
    }

    const products = records.map((rec: any) => {
      // Determine collection reference for file URLs
      const collectionRef = rec.collectionId ?? rec.collectionName ?? collectionName;

      // Image field — PocketBase schema uses capital 'Image', value is array of filenames
      let images: string[] = [];
      const filesList = rec.Image ?? rec.images ?? rec.image ?? rec.Images ?? null;

      if (Array.isArray(filesList)) {
        images = filesList
          .filter((f: any) => typeof f === 'string' && f.trim())
          .map((filename: string) => buildFileUrl(collectionRef, rec.id, filename));
      } else if (typeof filesList === 'string' && filesList.trim()) {
        images = [buildFileUrl(collectionRef, rec.id, filesList)];
      }

      console.log(`[API /api/products] Record ${rec.id} (${rec.Title ?? rec.title}): ${images.length} image(s) →`, images);

      // Prices — schema uses capital 'Price' and 'Discount'
      const actualPrice = Number(rec.Price ?? rec.actualPriceInr ?? rec.price ?? 0);
      const discountPercent = Number(rec.Discount ?? rec.discountPercent ?? rec.discount ?? 0);
      const calculatedNetPrice = discountPercent > 0
        ? Math.round(actualPrice * (1 - discountPercent / 100))
        : actualPrice;
      const netPrice = Number(
        rec.netPriceInr ?? rec.PriceNet ?? rec.Price_net ?? rec.offerPrice ?? calculatedNetPrice
      );

      // Status — default to 'in-stock' if field missing or unrecognized
      const rawStatus = (rec.Status ?? rec.status ?? '').toString().toLowerCase().trim();
      const status = (rawStatus === 'sold') ? 'sold' : 'in-stock';

      return {
        id: rec.id,
        collectionId: rec.collectionId,
        collectionName: rec.collectionName,
        title: rec.Title ?? rec.title ?? rec.name ?? 'Untitled Product',
        category: rec.Category ?? rec.category ?? 'Uncategorized',
        description: rec.Description ?? rec.description ?? '',
        images,
        actualPriceInr: actualPrice,
        discountPercent,
        netPriceInr: netPrice,
        status,
        slug: rec.slug ?? rec.id,
      };
    });

    console.log(`[API /api/products] Returning ${products.length} products.`);

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err: any) {
    console.error('[API /api/products] Fatal error:', err?.message ?? err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err?.message ?? 'Failed to retrieve products from database',
        data: [],
      }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
