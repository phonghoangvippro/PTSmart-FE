// Product API service for admin
// Real API integration with Laravel backend
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
 * Get paginated product list
 * @param {number} page - Page number (default 1)
 * @param {number} perPage - Items per page (default 15)
 * @returns {Promise} Paginated response with data[], current_page, last_page, total, etc.
 */
export const getProducts = async (page = 1, perPage = 15) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/products?page=${page}&per_page=${perPage}`,
    { headers: authHeaders() }
  );
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

/**
 * Create a new product (FormData for file uploads)
 * Fields: name, description, category_id, brand_id, price, sale_price, stock, is_featured, status, thumbnail, images[]
 */
export const createProduct = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
    method: 'POST',
    headers: authHeadersNoContentType(),
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to create product');
  return result;
};

/**
 * Update an existing product (FormData with _method=PUT for Laravel)
 */
export const updateProduct = async (id, formData) => {
  formData.append('_method', 'PUT');
  const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
    method: 'POST',
    headers: authHeadersNoContentType(),
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update product');
  return result;
};

/**
 * Delete a product
 */
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Failed to delete product');
  }
  return true;
};

/**
 * Upload images for a product
 * @param {number} id - Product ID
 * @param {FileList|File[]} files - Array of image files
 */
export const uploadProductImages = async (id, files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('images[]', files[i]);
  }
  const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}/images`, {
    method: 'POST',
    headers: authHeadersNoContentType(),
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to upload images');
  return result;
};
