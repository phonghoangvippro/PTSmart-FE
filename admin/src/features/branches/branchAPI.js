// Branch API service for admin
const API_BASE_URL = 'http://192.168.0.243:8000';

const getToken = () => localStorage.getItem('adminToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

/**
 * Get all branches
 */
export const getBranches = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/branches`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch branches');
  const result = await response.json();
  return result.data || result;
};

/**
 * Create a new branch
 */
export const createBranch = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/branches`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to create branch');
  return result;
};

/**
 * Update an existing branch
 */
export const updateBranch = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/branches/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update branch');
  return result;
};

/**
 * Delete a branch
 */
export const deleteBranch = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/branches/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Failed to delete branch');
  }
  return true;
};
