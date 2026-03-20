const API_BASE_URL = 'http://127.0.0.1:8000';

const getToken = () => localStorage.getItem('userToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

/**
 * Get wishlist items
 * GET /api/wishlist
 */
export const getWishlist = async () => {
  const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tải danh sách yêu thích');
  return data;
};

/**
 * Add product to wishlist
 * POST /api/wishlist  body: { product_id }
 */
export const addToWishlist = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ product_id: productId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi thêm vào yêu thích');
  return data;
};

/**
 * Remove product from wishlist
 * DELETE /api/wishlist/{productId}
 */
export const removeFromWishlist = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/api/wishlist/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi xóa khỏi yêu thích');
  return data;
};
