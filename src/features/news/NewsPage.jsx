import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getArticles, getFeaturedArticles } from './newsAPI';

const API_BASE_URL = 'http://127.0.0.1:8000';

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/800x450';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const CATEGORIES = [
  { label: 'Tất cả', value: null },
  { label: 'Tin tức', value: 'news' },
  { label: 'Review', value: 'review' },
  { label: 'Hướng dẫn', value: 'huong-dan' },
  { label: 'Mẹo hay', value: 'tips' },
];

const categoryLabel = (slug) => {
  const found = CATEGORIES.find((c) => c.value === slug);
  return found ? found.label : slug;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured articles once
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getFeaturedArticles();
        setFeatured(res.data || []);
      } catch {
        // silently ignore — featured is optional
      }
    };
    fetchFeatured();
  }, []);

  // Fetch articles list whenever page or category changes
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getArticles(currentPage, activeCategory);
        setArticles(res.data || []);
        setPagination({
          currentPage: res.current_page,
          lastPage: res.last_page,
          total: res.total,
          links: res.links,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [currentPage, activeCategory]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const heroArticle = featured[0];

  if (loading && articles.length === 0) {
    return (
      <div>
        <Header />
        <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-10 flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div>
        <Header />
        <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-10 flex justify-center items-center min-h-[400px]">
          <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-xl">
            Có lỗi xảy ra: {error}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-10">
        {/* Page Title & Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Tin tức Công nghệ</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">Cập nhật những thông tin mới nhất về review, hướng dẫn và sản phẩm công nghệ hàng đầu thế giới.</p>
        </div>

        {/* Categories & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.value
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Article (Hero) */}
        {heroArticle && (
          <Link to={`/tin-tuc/${heroArticle.slug}`} className="group block relative overflow-hidden rounded-2xl bg-slate-900 mb-12 h-[450px]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url('${getImageUrl(heroArticle.thumbnail)}')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-3xl">
              <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-md mb-4">Tiêu điểm</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{heroArticle.title}</h2>
              <p className="text-slate-200 text-lg mb-6 line-clamp-2">{heroArticle.excerpt}</p>
              <span className="inline-flex items-center text-white font-bold group-hover:underline">
                Đọc bài viết <span className="material-symbols-outlined ml-2">arrow_forward</span>
              </span>
            </div>
          </Link>
        )}

        {/* Article Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link to={`/tin-tuc/${article.slug}`} key={article.id} className="flex flex-col group">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-sm">
                  <div
                    className="absolute inset-0 bg-center bg-cover transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundImage: `url('${getImageUrl(article.thumbnail)}')` }}
                  ></div>
                  <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded text-[10px] font-bold uppercase tracking-wider text-primary">
                    {categoryLabel(article.category)}
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors leading-snug">{article.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="mt-auto flex items-center gap-3 text-[12px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> {article.read_time || '5 phút'}
                    </span>
                    <span>•</span>
                    <span>{formatDate(article.published_at)}</span>
                    {article.author && (
                      <>
                        <span>•</span>
                        <span>{article.author.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">article</span>
              <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300 mb-2">Chưa có bài viết nào</h2>
              <p className="text-slate-400">Vui lòng quay lại sau để đọc những tin tức mới nhất.</p>
            </div>
          )
        )}

        {/* Pagination */}
        {pagination && pagination.lastPage > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors ${
                  page === currentPage
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage >= pagination.lastPage}
              onClick={() => setCurrentPage((p) => Math.min(pagination.lastPage, p + 1))}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NewsPage;
