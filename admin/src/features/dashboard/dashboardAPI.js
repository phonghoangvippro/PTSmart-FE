// Dashboard API service for admin
const API_BASE_URL = 'http://192.168.0.243:8000';

const getToken = () => localStorage.getItem('adminToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

/**
 * Get dashboard stats (revenue, orders, products, users)
 */
export const getDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};

/**
 * Get revenue chart data (monthly)
 */
export const getRevenueChart = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/revenue-chart`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch revenue chart');
  return response.json();
};

/**
 * Get recent orders
 */
export const getRecentOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/recent-orders`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch recent orders');
  return response.json();
};

/**
 * Get order status distribution
 */
export const getOrderStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/order-status`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch order status');
  return response.json();
};
