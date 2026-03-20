const API_BASE_URL = 'http://192.168.0.243:8000';

/**
 * Fetch articles list with pagination and optional category filter
 * @param {number} page
 * @param {string|null} category - e.g. 'review', 'huong-dan', 'news', 'tips'
 * @returns {Promise<any>}
 */
export const getArticles = async (page = 1, category = null) => {
  let url = `${API_BASE_URL}/api/articles?page=${page}`;
  if (category) url += `&category=${category}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi khi tải danh sách bài viết');
  }

  return data;
};

/**
 * Fetch featured articles
 * @returns {Promise<any>}
 */
export const getFeaturedArticles = async () => {
  const response = await fetch(`${API_BASE_URL}/api/articles/featured`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi khi tải bài viết nổi bật');
  }

  return data;
};

/**
 * Fetch article detail by slug
 * @param {string} slug
 * @returns {Promise<any>}
 */
export const getArticleBySlug = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/api/articles/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi khi tải bài viết');
  }

  return data;
};
