// Auth API service for user
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
 * Register API call
 * @param {object} userData 
 * @returns {Promise<{message: string, user: object, token: string}>}
 */
export const registerAPI = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Đăng ký thất bại');
  }

  return data;
};

/**
 * Get the stored auth token
 */
export const getUserToken = () => {
  return localStorage.getItem('userToken');
};

/**
 * Create authenticated fetch headers
 */
export const authHeaders = () => {
  const token = getUserToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

/**
 * Logout API call
 */
export const logoutAPI = async () => {
  const token = getUserToken();
  if (!token) return;

  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error('Logout API error:', err);
  }
};

/**
 * Logout - call API and clear stored data
 */
export const logoutUser = async () => {
  await logoutAPI();
  localStorage.removeItem('user');
  localStorage.removeItem('userToken');
  localStorage.removeItem('rememberMe');
};
