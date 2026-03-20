// Article API service for admin
const API_BASE_URL = 'http://192.168.0.243:8000';

const getToken = () => localStorage.getItem('adminToken');

const authHeaders = (isJson = true) => {
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  };
  if (isJson) headers['Content-Type'] = 'application/json';
  return headers;
};

/**
 * Get paginated articles
 */
export const getArticles = async (page = 1) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/articles?page=${page}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch articles');
  return response.json();
};

/**
 * Create an article (FormData for thumbnail upload)
 * Fields: title, content, excerpt, thumbnail (file), category, read_time, is_feature, status, published_at
 */
export const createArticle = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/articles`, {
    method: 'POST',
    headers: authHeaders(false),
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to create article');
  return result;
};

/**
 * Update an article (FormData, uses _method PUT for Laravel)
 */
export const updateArticle = async (id, formData) => {
  formData.append('_method', 'PUT');
  const response = await fetch(`${API_BASE_URL}/api/admin/articles/${id}`, {
    method: 'POST',
    headers: authHeaders(false),
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update article');
  return result;
};

/**
 * Delete an article
 */
export const deleteArticle = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/articles/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Failed to delete article');
  }
  return true;
};
