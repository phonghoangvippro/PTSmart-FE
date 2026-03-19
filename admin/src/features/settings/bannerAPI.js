// Banner API service for admin
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

export const getBanners = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/banners`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch banners');
  const result = await response.json();
  return result.data || result;
};

export const createBanner = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/banners`, {
    method: 'POST',
    headers: authHeadersNoContentType(),
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to create banner');
  return result;
};

export const updateBanner = async (id, formData) => {
  formData.append('_method', 'PUT');
  const response = await fetch(`${API_BASE_URL}/api/admin/banners/${id}`, {
    method: 'POST',
    headers: authHeadersNoContentType(),
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update banner');
  return result;
};

export const deleteBanner = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/banners/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Failed to delete banner');
  }
  return true;
};
