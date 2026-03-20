const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Fetch active flash sales (đang diễn ra)
 * @returns {Promise<any>}
 */
export const getActiveFlashSales = async () => {
  const response = await fetch(`${API_BASE_URL}/api/flash-sales/active`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi khi tải Flash Sale đang diễn ra');
  }

  return data;
};

/**
 * Fetch upcoming flash sales (sắp diễn ra)
 * @returns {Promise<any>}
 */
export const getUpcomingFlashSales = async () => {
  const response = await fetch(`${API_BASE_URL}/api/flash-sales/upcoming`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi khi tải Flash Sale sắp diễn ra');
  }

  return data;
};

/**
 * Fetch flash sale page data (active + upcoming in one call)
 * @returns {Promise<{active: Array, upcoming: Array}>}
 */
export const getFlashSalePage = async () => {
  const response = await fetch(`${API_BASE_URL}/api/flash-sales/page`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi khi tải trang Flash Sale');
  }

  return data;
};
