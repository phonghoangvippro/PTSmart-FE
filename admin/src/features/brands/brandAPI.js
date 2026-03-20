// Brand API service for admin
const API_BASE_URL = 'http://192.168.0.243:8000';

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
 * Get all brands
 */
export const getBrands = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/brands`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch brands');
  const result = await response.json();
  return result.data || result;
};

/**
 * Create a new brand (FormData: name, logo)
 */
export const createBrand = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/brands`, {
    method: 'POST',
    headers: authHeadersNoContentType(),
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to create brand');
  return result;
};

/**
 * Update a brand (FormData with _method=PUT: name, logo)
 */
export const updateBrand = async (id, formData) => {
  formData.append('_method', 'PUT');
  const response = await fetch(`${API_BASE_URL}/api/admin/brands/${id}`, {
    method: 'POST',
    headers: authHeadersNoContentType(),
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update brand');
  return result;
};

/**
 * Delete a brand
 */
export const deleteBrand = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/brands/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Failed to delete brand');
  }
  return true;
};
