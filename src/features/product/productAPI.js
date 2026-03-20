// Product API service — real API integration
const API_BASE_URL = 'http://192.168.0.243:8000';

/**
 * Get all products (paginated, with filters & sort)
 * Supported params: search, category, category_id, brand, brand_id,
 *   min_price, max_price, rating, on_sale, is_featured, sort, per_page, page
 */
export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });
  if (!params.has('page')) params.set('page', '1');
  const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tải sản phẩm');
  return data;
};

/**
 * Get featured products
 * GET /api/products/featured
 */
export const fetchFeaturedProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/products/featured`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tải sản phẩm nổi bật');
  return data;
};

/**
 * Get product detail by slug or id (returns { data, related })
 * GET /api/products/{slugOrId}
 */
export const fetchProductDetail = async (slugOrId) => {
  const response = await fetch(`${API_BASE_URL}/api/products/${slugOrId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Không tìm thấy sản phẩm');
  return data;
};

/**
 * Get product reviews (paginated)
 * GET /api/products/{productId}/reviews?page=1
 */
export const fetchProductReviews = async (productId, page = 1) => {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews?page=${page}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tải đánh giá');
  return data;
};

/**
 * Autocomplete search — lightweight suggestions
 * GET /api/products/search?q=keyword
 * Returns { products: [...], categories: [...] }
 */
export const searchAutocomplete = async (query) => {
  const response = await fetch(`${API_BASE_URL}/api/products/search?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tìm kiếm');
  return data;
};

/**
 * Full search (uses products list with search param)
 * GET /api/products?search=query&page=1
 */
export const searchProductsAPI = async (query, page = 1) => {
  const response = await fetch(`${API_BASE_URL}/api/products?search=${encodeURIComponent(query)}&page=${page}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tìm kiếm');
  return data;
};

/**
 * Get products by category
 * GET /api/products?category={slug}&page=1
 */
export const fetchProductsByCategory = async (categorySlug, page = 1) => {
  const response = await fetch(`${API_BASE_URL}/api/products?category=${encodeURIComponent(categorySlug)}&page=${page}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tải sản phẩm theo danh mục');
  return data;
};

// ── Legacy compatibility (sync, used by Checkout.jsx) ──

/**
 * Legacy: getProducts (sync) — returns empty array
 * TODO: Migrate consumers to use fetchProducts() async
 */
export const getProducts = () => [];

/**
 * Legacy: getProductById (sync) — returns null
 * TODO: Migrate Checkout.jsx to use fetchProductDetail() async
 */
export const getProductById = (id) => null;

/**
 * Legacy: searchProducts (sync)
 */
export const searchProducts = (query) => [];

/**
 * Legacy: getProductsByCategory (sync)
 */
export const getProductsByCategory = (category) => [];
