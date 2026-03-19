// Auth API service for admin
const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Login API call
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{message: string, user: object, token: string}>}
 */
export const loginAPI = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Đăng nhập thất bại');
  }

  return data;
};

/**
 * Get the stored auth token
 */
export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

/**
 * Create authenticated fetch headers
 */
export const authHeaders = () => {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

/**
 * Logout - clear stored data
 */
export const logoutAdmin = () => {
  localStorage.removeItem('admin');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminRememberMe');
};
