// Category API service for admin
const API_BASE_URL = 'http://127.0.0.1:8000';

const getToken = () => localStorage.getItem('adminToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

/**
 * Get all categories (tree structure)
 */
export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

/**
 * Create a new category
 */
export const createCategory = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to create category');
  return result;
};

/**
 * Update a category
 */
export const updateCategory = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/categories/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update category');
  return result;
};

/**
 * Delete a category
 */
export const deleteCategory = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to delete category');
  return result;
};
