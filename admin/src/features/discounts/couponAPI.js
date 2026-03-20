// Coupon API service for admin
const API_BASE_URL = 'http://192.168.0.243:8000';

const getToken = () => localStorage.getItem('adminToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

/**
 * Get all coupons
 */
export const getCoupons = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/coupons`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch coupons');
  const result = await response.json();
  return result.data || result;
};

/**
 * Create a coupon
 * Fields: code, title, description, type (fixed|percent|shipping),
 *         discount_value, min_order, max_discount, usage_limit, expired_at, category, status
 */
export const createCoupon = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/coupons`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to create coupon');
  return result;
};

/**
 * Update a coupon
 */
export const updateCoupon = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/coupons/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update coupon');
  return result;
};

/**
 * Delete a coupon
 */
export const deleteCoupon = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/coupons/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Failed to delete coupon');
  }
  return true;
};
