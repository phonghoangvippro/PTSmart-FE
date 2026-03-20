const API_BASE_URL = 'http://127.0.0.1:8000';

const getToken = () => localStorage.getItem('userToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

/**
 * Fetch current user profile
 * GET /api/auth/me
 */
export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tải thông tin');
  return data;
};

/**
 * Update user profile
 * PUT /api/profile
 */
export const updateProfile = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(profileData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi cập nhật thông tin');
  return data;
};

/**
 * Upload avatar
 * POST /api/profile/avatar  (form-data, field: avatar)
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(`${API_BASE_URL}/api/profile/avatar`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi tải ảnh đại diện');
  return data;
};

/**
 * Change password
 * PUT /api/profile/password
 */
export const changePassword = async (current_password, password, password_confirmation) => {
  const response = await fetch(`${API_BASE_URL}/api/profile/password`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ current_password, password, password_confirmation }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi khi đổi mật khẩu');
  return data;
};
