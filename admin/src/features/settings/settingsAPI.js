// Settings API service for admin
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

export const getSettings = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch settings');
  const result = await response.json();
  return result.data || result;
};

export const updateSettings = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
    method: 'POST',
    headers: authHeadersNoContentType(),
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update settings');
  return result;
};
