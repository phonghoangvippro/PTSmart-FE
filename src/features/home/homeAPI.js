const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Fetch home page data
 * @returns {Promise<any>}
 */
export const getHomeData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/home`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi khi tải dữ liệu trang chủ');
  }

  return data;
};
