// Contact API service for admin
const API_BASE_URL = 'http://127.0.0.1:8000';

const getToken = () => localStorage.getItem('adminToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

/**
 * Get paginated contacts
 */
export const getContacts = async (page = 1) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/contacts?page=${page}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch contacts');
  const result = await response.json();
  // Depending on Laravel Resource wrapping, it might be result.data.data
  return result.data || result;
};

/**
 * Mark contact as read
 */
export const markContactAsRead = async (id) => {
  // Can be POST / PATCH. Using POST as provided in typical examples.
  const response = await fetch(`${API_BASE_URL}/api/admin/contacts/${id}/read`, {
    method: 'POST',
    headers: authHeaders(),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to mark as read');
  return result;
};
