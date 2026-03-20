const API_BASE_URL = 'http://127.0.0.1:8000';

const getToken = () => localStorage.getItem('userToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ── Payment Methods (saved cards / wallets) ──

/**
 * Get saved payment methods
 * GET /api/payment-methods
 */
export const getPaymentMethods = async () => {
  const response = await fetch(`${API_BASE_URL}/api/payment-methods`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tải phương thức thanh toán');
  return data;
};

/**
 * Add a new payment method
 * POST /api/payment-methods
 * body: { type, provider, display_name, masked_number, card_holder, expiry }
 */
export const addPaymentMethod = async (methodData) => {
  const response = await fetch(`${API_BASE_URL}/api/payment-methods`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(methodData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi thêm phương thức thanh toán');
  return data;
};

/**
 * Delete a payment method
 * DELETE /api/payment-methods/{id}
 */
export const deletePaymentMethod = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/payment-methods/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi xóa phương thức thanh toán');
  return data;
};

/**
 * Set payment method as default
 * PUT /api/payment-methods/{id}/default
 */
export const setDefaultPaymentMethod = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/payment-methods/${id}/default`, {
    method: 'PUT',
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi đặt mặc định');
  return data;
};

// ── Online Payments (VNPay / MoMo) ──

/**
 * Create VNPay payment link
 * POST /api/payments/vnpay/create  body: { order_id }
 */
export const createVnpayPayment = async (orderId) => {
  const response = await fetch(`${API_BASE_URL}/api/payments/vnpay/create`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ order_id: orderId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tạo thanh toán VNPay');
  return data;
};

/**
 * Create MoMo payment link
 * POST /api/payments/momo/create  body: { order_id }
 */
export const createMomoPayment = async (orderId) => {
  const response = await fetch(`${API_BASE_URL}/api/payments/momo/create`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ order_id: orderId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tạo thanh toán MoMo');
  return data;
};
