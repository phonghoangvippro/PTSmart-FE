// User API service for admin
const API_BASE_URL = 'http://192.168.0.243:8000';

const getToken = () => localStorage.getItem('adminToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

/**
 * Get paginated user list (supports ?search=)
 */
export const getUsers = async (page = 1, search = '') => {
  let url = `${API_BASE_URL}/api/admin/users?page=${page}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  const response = await fetch(url, { headers: authHeaders() });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

/**
 * Update user (role, status)
 */
export const updateUser = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update user');
  return result;
};
