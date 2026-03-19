// Promotion API service for admin
const API_BASE_URL = 'http://127.0.0.1:8000';

const getToken = () => localStorage.getItem('adminToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

const authHeadersNoContentType = () => ({
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

/**
 * Get all promotions
 */
export const getPromotions = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/promotions`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch promotions');
  const result = await response.json();
  return result.data || result;
};

/**
 * Create a new promotion (FormData)
 */
export const createPromotion = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/promotions`, {
    method: 'POST',
    headers: authHeadersNoContentType(),
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to create promotion');
  return result;
};

/**
 * Update an existing promotion (FormData with _method=PUT)
 */
export const updatePromotion = async (id, formData) => {
  formData.append('_method', 'PUT');
  const response = await fetch(`${API_BASE_URL}/api/admin/promotions/${id}`, {
    method: 'POST',
    headers: authHeadersNoContentType(),
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update promotion');
  return result;
};

/**
 * Delete a promotion
 */
export const deletePromotion = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/promotions/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Failed to delete promotion');
  }
  return true;
};
