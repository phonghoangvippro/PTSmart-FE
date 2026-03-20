const API_BASE_URL = 'http://192.168.0.243:8000';

const getToken = () => localStorage.getItem('userToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

export const getMyCoupons = async () => {
  const response = await fetch(`${API_BASE_URL}/api/coupons/my`, {
    method: 'GET',
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lỗi lấy mã giảm giá');
  return data;
};

export const applyCoupon = async (code, subtotal) => {
  const response = await fetch(`${API_BASE_URL}/api/coupons/apply`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ code, subtotal }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Mã giảm giá không hợp lệ');
  return data;
};
