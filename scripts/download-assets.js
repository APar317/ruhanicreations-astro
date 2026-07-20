import fs from 'fs';
import path from 'path';

// Trigger build: 2026-07-17T10:22:00Z
const PB_BASE = 'http://34.180.31.35';
const PB_COLLECTION = 'RuhaniCreationsBySumati_Girl_Child';
const PRODUCTS_DIR = path.join('public', 'assets', 'products');
const DATA_DIR = path.join('src', 'data');

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    console.log(`Downloaded image: ${destPath}`);
    return true;
  } catch (err) {
    console.error(`Failed to download ${url}:`, err.message);
    return false;
  }
}

async function run() {
  console.log('[Downloader] Starting asset download...');
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const listUrl = `${PB_BASE}/api/collections/${PB_COLLECTION}/records?perPage=200&sort=-created`;

  try {
    const res = await fetch(listUrl);
    if (!res.ok) throw new Error(`PocketBase list returned ${res.status}`);
    const data = await res.json();
    const records = data.items ?? [];
    console.log(`[Downloader] Fetched ${records.length} records from PocketBase.`);

    const products = [];

    for (const rec of records) {
      const filesList = rec.Image ?? rec.images ?? rec.image ?? rec.Images ?? null;
      let rawImages = [];
      if (Array.isArray(filesList)) {
        rawImages = filesList.filter(Boolean);
      } else if (typeof filesList === 'string' && filesList) {
        rawImages = [filesList];
      }

      const images = [];

      for (const filename of rawImages) {
        const remoteUrl = `${PB_BASE}/api/files/${rec.collectionId || rec.collectionName || PB_COLLECTION}/${rec.id}/${encodeURIComponent(filename)}`;
        const localFilename = `${rec.id}_${filename}`;
        const localPath = path.join(PRODUCTS_DIR, localFilename);
        
        // Download the image
        const success = await downloadImage(remoteUrl, localPath);
        if (success) {
          images.push(`/assets/products/${localFilename}`);
        } else {
          // Fallback to direct HTTP proxy link if download failed
          const cleanUrl = remoteUrl.replace(/^https?:\/\//, '');
          images.push(`https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}`);
        }
      }

      const actualPrice = Number(rec.Price ?? rec.actualPriceInr ?? rec.price ?? 0);
      const discountPercent = Number(rec.Discount ?? rec.discountPercent ?? 0);
      const netPrice = discountPercent > 0
        ? Math.round(actualPrice * (1 - discountPercent / 100))
        : actualPrice;
      const rawStatus = (rec.Status ?? rec.status ?? '').toString().toLowerCase();
      const status = rawStatus === 'sold' ? 'sold' : 'in-stock';

      products.push({
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
      });
    }

    const dataPath = path.join(DATA_DIR, 'products.json');
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
    console.log(`[Downloader] Successfully wrote ${products.length} products to ${dataPath}`);
  } catch (err) {
    console.warn('[Downloader] Warning: PocketBase VM is offline or unreachable.', err.message || err);
    console.warn('[Downloader] Proceeding with the existing product data in src/data/products.json.');
    const dataPath = path.join(DATA_DIR, 'products.json');
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, '[]');
    }
    process.exit(0); // Exit with success to avoid crashing the build
  }
}

run();
