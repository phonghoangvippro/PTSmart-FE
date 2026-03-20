import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getArticleBySlug } from './newsAPI';

const API_BASE_URL = 'http://192.168.0.243:8000';

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/800x450';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const CATEGORY_MAP = {
  news: 'Tin tức',
  review: 'Review',
  'huong-dan': 'Hướng dẫn',
  tips: 'Mẹo hay',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getArticleBySlug(slug);
        setArticle(res.data || res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
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

  if (error || !article) {
    return (
      <div>
        <Header />
        <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-10 flex flex-col justify-center items-center min-h-[400px] gap-4">
          <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-xl">
            {error || 'Không tìm thấy bài viết.'}
          </div>
          <Link to="/tin-tuc" className="text-primary font-bold hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined">arrow_back</span> Quay lại danh sách
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="max-w-[860px] mx-auto px-4 md:px-10 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link to="/tin-tuc" className="hover:text-primary transition-colors">Tin tức</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-slate-600 dark:text-slate-300 line-clamp-1">{article.title}</span>
        </nav>

        {/* Category Badge */}
        {article.category && (
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-md mb-4">
            {CATEGORY_MAP[article.category] || article.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
          {article.author && (
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">person</span>
              {article.author.name}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            {formatDate(article.published_at)}
          </span>
          {article.read_time && (
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              {article.read_time}
            </span>
          )}
          {article.view_count > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              {article.view_count.toLocaleString('vi-VN')} lượt xem
            </span>
          )}
        </div>

        {/* Thumbnail */}
        {article.thumbnail && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-10 shadow-lg">
            <img
              src={getImageUrl(article.thumbnail)}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium italic border-l-4 border-primary pl-6 mb-10">
            {article.excerpt}
          </p>
        )}

        {/* Article Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
            prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-lg
            prose-strong:text-slate-900 dark:prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Back to list */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <Link
            to="/tin-tuc"
            className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Quay lại danh sách bài viết
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
