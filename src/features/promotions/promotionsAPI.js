const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Fetch promotions list
 * @returns {Promise<any>}
 */
export const getPromotions = async () => {
  const response = await fetch(`${API_BASE_URL}/api/promotions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi khi tải danh sách khuyến mãi');
  }

  return data;
};

/**
 * Fetch discounted products with pagination
 * @param {number} page - page number
 * @returns {Promise<any>}
 */
export const getDiscountedProducts = async (page = 1) => {
  const response = await fetch(`${API_BASE_URL}/api/products/discounted?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi khi tải sản phẩm giảm giá');
  }

  return data;
};
