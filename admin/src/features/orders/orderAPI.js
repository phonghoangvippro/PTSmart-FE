// Order API service for admin
const API_BASE_URL = 'http://192.168.0.243:8000';

const getToken = () => localStorage.getItem('adminToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

/**
 * Get paginated order list
 */
export const getOrders = async (page = 1, perPage = 20) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/orders?page=${page}&per_page=${perPage}`,
    { headers: authHeaders() }
  );
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

/**
 * Get order detail
 */
export const getOrderDetail = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/orders/${id}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch order detail');
  const result = await response.json();
  return result.data || result;
};

/**
 * Update order status
 * @param {number} id - Order ID
 * @param {string} status - New status: pending, confirmed, shipping, completed, cancelled
 */
export const updateOrderStatus = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/orders/${id}/status`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update order status');
  return result;
};
