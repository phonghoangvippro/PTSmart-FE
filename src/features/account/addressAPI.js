const API_BASE_URL = 'http://127.0.0.1:8000';

const getToken = () => localStorage.getItem('userToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

/**
 * Get all addresses
 * GET /api/addresses
 */
export const getAddresses = async () => {
  const response = await fetch(`${API_BASE_URL}/api/addresses`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tải địa chỉ');
  return data;
};

/**
 * Create a new address
 * POST /api/addresses
 */
export const createAddress = async (addressData) => {
  const response = await fetch(`${API_BASE_URL}/api/addresses`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(addressData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi thêm địa chỉ');
  return data;
};

/**
 * Update an address
 * PUT /api/addresses/{id}
 */
export const updateAddress = async (id, addressData) => {
  const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(addressData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi cập nhật địa chỉ');
  return data;
};

/**
 * Delete an address
 * DELETE /api/addresses/{id}
 */
export const deleteAddress = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi xóa địa chỉ');
  return data;
};

/**
 * Set address as default
 * PUT /api/addresses/{id}/default
 */
export const setDefaultAddress = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/addresses/${id}/default`, {
    method: 'PUT',
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi đặt địa chỉ mặc định');
  return data;
};
