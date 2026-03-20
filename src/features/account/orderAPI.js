const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Get the stored auth token
 */
const getToken = () => localStorage.getItem('userToken');

/**
 * Authenticated headers helper
 */
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

/**
 * Fetch orders list with pagination and optional status filter
 * @param {number} page
 * @param {string|null} status - e.g. 'pending', 'confirmed', 'shipping', 'completed', 'canceled'
 * @returns {Promise<any>}
 */
export const getOrders = async (page = 1, status = null) => {
  let url = `${API_BASE_URL}/api/orders?page=${page}`;
  if (status) url += `&status=${status}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi khi tải danh sách đơn hàng');
  }

  return data;
};

/**
 * Fetch order detail by ID
 * @param {number|string} orderId
 * @returns {Promise<any>}
 */
export const getOrderById = async (orderId) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
    method: 'GET',
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi khi tải chi tiết đơn hàng');
  }

  return data;
};

/**
 * Cancel an order
 * @param {number|string} orderId
 * @returns {Promise<any>}
 */
export const cancelOrder = async (orderId) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
    method: 'PUT',
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi khi hủy đơn hàng');
  }

  return data;
};

/**
 * Create a new order (real API)
 * POST /api/orders
 * body: { shipping_address_id, payment_method, note, coupon_code }
 */
export const createOrderAPI = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(orderData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tạo đơn hàng');
  return data;
};

/**
 * Legacy: createOrder (sync) — kept for backward compatibility
 */
export const createOrder = (orderData) => {
  return {
    id: Date.now(),
    orderId: `#PTS-${Math.floor(Math.random() * 1000000)}`,
    status: 'pending',
    orderDate: new Date().toISOString().split('T')[0],
    ...orderData,
  };
};

/**
 * Submit a review for a product
 * POST /api/reviews
 * body: { product_id, order_id, rating, comment }
 */
export const createReviewAPI = async (reviewData) => {
  const response = await fetch(`${API_BASE_URL}/api/reviews`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(reviewData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi đánh giá');
  return data;
};

