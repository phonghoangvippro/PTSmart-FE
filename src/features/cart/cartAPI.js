// Cart API service — real API integration
const API_BASE_URL = 'http://127.0.0.1:8000';

const getToken = () => localStorage.getItem('userToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

/**
 * Get cart with items
 * GET /api/cart
 */
export const getCart = async () => {
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tải giỏ hàng');
  return data;
};

/**
 * Add product to cart
 * POST /api/cart/items
 * body: { product_id, variant_id, quantity }
 */
export const addCartItem = async (productId, quantity = 1, variantId = null) => {
  const response = await fetch(`${API_BASE_URL}/api/cart/items`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ product_id: productId, variant_id: variantId, quantity }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi thêm vào giỏ hàng');
  return data;
};

/**
 * Update cart item quantity
 * PUT /api/cart/items/{itemId}
 * body: { quantity }
 */
export const updateCartItem = async (itemId, quantity) => {
  const response = await fetch(`${API_BASE_URL}/api/cart/items/${itemId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ quantity }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi cập nhật giỏ hàng');
  return data;
};

/**
 * Remove item from cart
 * DELETE /api/cart/items/{itemId}
 */
export const removeCartItem = async (itemId) => {
  const response = await fetch(`${API_BASE_URL}/api/cart/items/${itemId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi xóa sản phẩm');
  return data;
};

/**
 * Clear entire cart
 * DELETE /api/cart/clear
 */
export const clearCart = async () => {
  const response = await fetch(`${API_BASE_URL}/api/cart/clear`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi xóa giỏ hàng');
  return data;
};

// ── Legacy compatibility for ProductDetail.jsx & Checkout.jsx ──

/**
 * Legacy: get cart items from localStorage (still used by Checkout.jsx)
 * TODO: Migrate Checkout.jsx to use getCart() async API
 */
export const getCartItems = () => {
  try {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  } catch {
    return [];
  }
};

/**
 * Legacy: add to cart (sync, used by ProductDetail.jsx)
 * TODO: Migrate ProductDetail.jsx to use addCartItem() async API
 */
export const addToCart = (product, variant = '', quantity = 1) => {
  const items = getCartItems();
  const existingItem = items.find(
    (item) => item.productId === product.id && item.variant === variant
  );
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    items.push({
      id: Date.now(),
      productId: product.id,
      name: product.name,
      variant: variant || 'Mặc định',
      price: parseInt(String(product.price).replace(/[^\d]/g, '')) || 0,
      quantity,
      image: product.image || product.thumbnail,
    });
  }
  localStorage.setItem('cartItems', JSON.stringify(items));
  return items;
};

/**
 * Legacy: update quantity (sync)
 */
export const updateCartItemQuantity = (itemId, quantity) => {
  const items = getCartItems();
  const item = items.find((i) => i.id === itemId);
  if (item) item.quantity = quantity;
  localStorage.setItem('cartItems', JSON.stringify(items));
  return items;
};

/**
 * Get cart total count
 */
export const getCartCount = () => {
  return getCartItems().reduce((total, item) => total + item.quantity, 0);
};
