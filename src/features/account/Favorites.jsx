import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getWishlist, removeFromWishlist } from './wishlistAPI';

const API_BASE_URL = 'http://192.168.0.243:8000';

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/160x160?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + '₫';

const Favorites = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getWishlist();
      setItems(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);
      await removeFromWishlist(productId);
      setItems((prev) => prev.filter((item) => item.product_id !== productId));
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-10 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Sản phẩm đã thích <span className="text-primary font-medium text-lg ml-1">({items.length})</span>
          </h2>
          <Link to="/account" className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-lg text-sm font-medium shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Tài khoản</span>
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-red-500 font-bold p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-xl">
            Có lỗi xảy ra: {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">favorite</span>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Chưa có sản phẩm yêu thích</h3>
            <p className="text-slate-500 mb-6">Hãy khám phá và thêm sản phẩm vào danh sách yêu thích của bạn!</p>
            <Link to="/san-pham" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              <span className="material-symbols-outlined">shopping_bag</span>
              Khám phá ngay
            </Link>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;

              const hasDiscount = product.sale_price && Number(product.sale_price) < Number(product.price);
              const displayPrice = hasDiscount ? product.sale_price : product.price;
              const isRemoving = removingId === item.product_id;

              return (
                <div
                  key={item.id}
                  className={`group relative flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-transparent hover:border-primary/20 transition-all ${
                    isRemoving ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <Link to={`/product/${product.id}`} className="w-full sm:w-40 h-40 rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden shrink-0 block">
                    <img
                      src={getImageUrl(product.thumbnail)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start">
                        {product.rating_avg && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-500 text-xs font-bold">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            {product.rating_avg}
                          </span>
                        )}
                        <button
                          onClick={() => handleRemove(item.product_id)}
                          disabled={isRemoving}
                          className="text-pink-400 hover:scale-110 transition-transform"
                          title="Bỏ yêu thích"
                        >
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                        </button>
                      </div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg mt-1 line-clamp-1 hover:text-primary transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-primary text-xl font-bold mt-1">{formatPrice(displayPrice)}</p>
                      {hasDiscount && (
                        <p className="text-slate-400 text-xs line-through">{formatPrice(product.price)}</p>
                      )}
                      <p className="text-slate-400 text-xs mt-1">
                        Đã thích {new Date(item.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex-1 bg-primary text-white text-xs font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Xem sản phẩm
                      </Link>
                      <button
                        onClick={() => handleRemove(item.product_id)}
                        disabled={isRemoving}
                        className="w-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                        title="Xóa khỏi yêu thích"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Promo Banner */}
        <div className="mt-12 bg-gradient-to-r from-primary to-pink-400 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Đừng bỏ lỡ ưu đãi!</h3>
              <p className="text-white/80 max-w-md">Chúng tôi sẽ thông báo cho bạn khi các sản phẩm trong danh sách yêu thích của bạn giảm giá.</p>
            </div>
            <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg">Bật thông báo ngay</button>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-64 w-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 h-48 w-48 bg-primary/20 rounded-full blur-2xl"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
