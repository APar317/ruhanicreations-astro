/**
 * API Utility Functions for PocketBase Integration
 * Handles fetching products with proper error handling and security considerations
 */

export interface Product {
  id: string;
  title: string;
  category: string;
  price?: number;
  actualPriceInr?: number;
  discountPercent?: number;
  netPriceInr?: number;
  image?: string;
  images?: string[];
  description?: string;
  stock?: number;
  status?: "in-stock" | "sold";
  featured?: boolean;
  [key: string]: any; // Allow additional fields from PocketBase
}

export interface FetchProductsResponse {
  success: boolean;
  data?: Product[];
  error?: string;
}

/**
 * Fetch all products from PocketBase via Astro API endpoint
 * @returns Promise with products data or error
 */
export async function fetchProducts(): Promise<FetchProductsResponse> {
  try {
    const response = await fetch("/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!Array.isArray(data)) {
      console.warn("API returned invalid data structure, expected array");
      return {
        success: false,
        error: "Invalid data format from API",
        data: [],
      };
    }

    return {
      success: true,
      data: data as Product[],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Failed to fetch products:", errorMessage);

    return {
      success: false,
      error: errorMessage,
      data: [],
    };
  }
}

/**
 * Fetch products filtered by category
 * @param category - The category to filter by (e.g., 'girl-child', 'women')
 * @returns Promise with filtered products or error
 */
export async function fetchByCategory(
  category: string
): Promise<FetchProductsResponse> {
  try {
    if (!category || typeof category !== "string") {
      return {
        success: false,
        error: "Invalid category provided",
        data: [],
      };
    }

    const response = await fetch(
      `/api/products?category=${encodeURIComponent(category)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return {
        success: false,
        error: "Invalid data format from API",
        data: [],
      };
    }

    return {
      success: true,
      data: data as Product[],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Failed to fetch products for category "${category}":`, errorMessage);

    return {
      success: false,
      error: errorMessage,
      data: [],
    };
  }
}

/**
 * Transform PocketBase record to standardized product format
 * Handles mapping of different field names and ensures consistency
 * @param record - Raw record from PocketBase
 * @returns Standardized Product object
 */
export function transformPocketBaseRecord(record: any): Product {
  // Safely get values with fallbacks
  const getId = () => record.id || "";
  const getTitle = () => record.title || record.name || "Untitled";
  const getCategory = () => record.category || "Uncategorized";
  const getDescription = () => record.description || "";
  const getPrice = () =>
    typeof record.price === "number" ? record.price : 0;
  const getActualPrice = () =>
    typeof record.actualPriceInr === "number" ? record.actualPriceInr : 0;
  const getDiscount = () =>
    typeof record.discountPercent === "number" ? record.discountPercent : 0;
  const getNetPrice = () =>
    typeof record.netPriceInr === "number" ? record.netPriceInr : 0;
  const getImage = () => record.image || record.images?.[0] || "";
  const getImages = () =>
    Array.isArray(record.images) ? record.images : getImage() ? [getImage()] : [];
  const getStatus = () =>
    record.status === "sold" ? "sold" : record.stock > 0 ? "in-stock" : "sold";
  const getStock = () =>
    typeof record.stock === "number" ? record.stock : 0;
  const getFeatured = () => Boolean(record.featured);

  return {
    id: getId(),
    title: getTitle(),
    category: getCategory(),
    description: getDescription(),
    price: getPrice(),
    actualPriceInr: getActualPrice(),
    discountPercent: getDiscount(),
    netPriceInr: getNetPrice(),
    image: getImage(),
    images: getImages(),
    status: getStatus(),
    stock: getStock(),
    featured: getFeatured(),
  };
}

/**
 * Safe array filter for products
 * Removes any invalid entries
 * @param products - Array of products to validate
 * @returns Validated array of products
 */
export function validateProducts(products: any[]): Product[] {
  if (!Array.isArray(products)) {
    console.warn("validateProducts: input is not an array");
    return [];
  }

  return products
    .filter((product) => {
      // Ensure product has required fields
      return (
        product &&
        typeof product === "object" &&
        (product.id || product.title)
      );
    })
    .map((product) => {
      try {
        return transformPocketBaseRecord(product);
      } catch (error) {
        console.warn("Failed to transform product record:", product, error);
        return null;
      };
    })
    .filter((product): product is Product => product !== null);
}
