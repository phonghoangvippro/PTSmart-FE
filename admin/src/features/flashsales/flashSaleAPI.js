// Flash Sale API service for admin
const API_BASE_URL = 'http://127.0.0.1:8000';

const getToken = () => localStorage.getItem('adminToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

/**
 * Get all flash sales
 */
export const getFlashSales = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/flash-sales`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch flash sales');
  const result = await response.json();
  return result.data || result;
};

/**
 * Create a flash sale
 * { title, start_at, end_at, status, items: [{ product_id, flash_price, quantity }] }
 */
export const createFlashSale = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/flash-sales`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to create flash sale');
  return result;
};

/**
 * Update a flash sale
 */
export const updateFlashSale = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/flash-sales/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update flash sale');
  return result;
};

/**
 * Delete a flash sale
 */
export const deleteFlashSale = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/flash-sales/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Failed to delete flash sale');
  }
  return true;
};
