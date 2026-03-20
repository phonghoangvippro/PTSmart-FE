import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getHomeData } from '../home/homeAPI';
import { getPromotions, getDiscountedProducts } from './promotionsAPI';

const API_BASE_URL = 'http://192.168.0.243:8000';

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/400x400';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const formatCurrency = (amount) => {
  if (!amount) return '0đ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Map promotion type to icon & color
const promoTypeConfig = {
  installment: { icon: 'credit_card', color: 'bg-blue-500', label: 'Trả góp' },
  trade_in: { icon: 'sync', color: 'bg-emerald-500', label: 'Thu đổi' },
  warranty: { icon: 'verified_user', color: 'bg-amber-500', label: 'Bảo hành' },
  combo: { icon: 'shopping_basket', color: 'bg-purple-500', label: 'Combo' },
  gift: { icon: 'redeem', color: 'bg-pink-500', label: 'Quà tặng' },
  discount: { icon: 'local_offer', color: 'bg-red-500', label: 'Giảm giá' },
};

const PromotionsPage = () => {
  const [banners, setBanners] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [expandedPromo, setExpandedPromo] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [homeData, promoData, discountData] = await Promise.all([
          getHomeData(),
          getPromotions(),
          getDiscountedProducts(1),
        ]);

        // Banners from home
        const heroBanners = homeData.banners?.filter(b => b.position === 'home_hero') || [];
        setBanners(heroBanners);

        // Promotions list
        setPromotions(promoData.data || promoData || []);

        // Discounted products
        setDiscountedProducts(discountData.data || []);
        setPagination({
          currentPage: discountData.current_page,
          lastPage: discountData.last_page,
          total: discountData.total,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Auto-slide banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Load more discounted products
  const handleLoadMore = async () => {
    if (!pagination || pagination.currentPage >= pagination.lastPage) return;
    try {
      setLoadingMore(true);
      const nextPage = pagination.currentPage + 1;
      const data = await getDiscountedProducts(nextPage);
      setDiscountedProducts((prev) => [...prev, ...(data.data || [])]);
      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
      });
    } catch (err) {
      console.error('Error loading more products:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Calculate remaining days for promotion
  const getRemainingDays = (endAt) => {
    if (!endAt) return null;
    const now = new Date();
    const end = new Date(endAt);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-10 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-10 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-xl">
              Có lỗi xảy ra: {error}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentBanner = banners[currentBannerIndex] || banners[0];

  return (
    <div>
      <Header />
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-10 py-8 space-y-12">

        {/* Hero Banner Slider */}
        {currentBanner && (
          <section className="relative h-[400px] w-full rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent z-10"></div>
            {banners.map((banner, index) => (
              <div
                key={banner.id || index}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                  index === currentBannerIndex ? 'opacity-100 z-0 scale-100 group-hover:scale-105' : 'opacity-0 -z-10 scale-110'
                }`}
                style={{ backgroundImage: `url('${getImageUrl(banner.image)}')` }}
              ></div>
            ))}

            <div className="relative z-20 h-full flex flex-col justify-center px-12 max-w-2xl text-white space-y-4">
              <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded mb-2 uppercase tracking-widest w-fit">
                Sự kiện đặc biệt
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{currentBanner.title}</h1>
              <p className="text-white/80 text-lg">{currentBanner.subtitle}</p>
              <div className="flex gap-4 pt-2">
                {currentBanner.link ? (
                  <Link to={currentBanner.link} className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                    Xem ngay <span className="material-symbols-outlined">trending_flat</span>
                  </Link>
                ) : (
                  <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                    Mua sắm ngay <span className="material-symbols-outlined">trending_flat</span>
                  </button>
                )}
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-xl font-bold transition-all">
                  Xem thêm
                </button>
              </div>
            </div>

            {/* Slider Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentBannerIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  ></button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Promotion Programs */}
        {promotions.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">campaign</span>
                Chương trình ưu đãi lớn
              </h2>
              <span className="text-sm text-slate-500">{promotions.length} chương trình</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promo) => {
                const config = promoTypeConfig[promo.type] || promoTypeConfig.discount;
                const remainingDays = getRemainingDays(promo.end_at);
                const isExpanded = expandedPromo === promo.id;

                return (
                  <div
                    key={promo.id}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Promo Header Image */}
                    <div className="h-48 overflow-hidden relative">
                      <img
                        alt={promo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={getImageUrl(promo.image)}
                      />
                      {/* Badge overlay */}
                      <div className={`absolute top-3 left-3 ${config.color} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg`}>
                        <span className="material-symbols-outlined text-sm">{config.icon}</span>
                        {config.label}
                      </div>
                      {/* Remaining days */}
                      {remainingDays !== null && remainingDays > 0 && (
                        <div className="absolute top-3 right-3 bg-slate-900/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                          Còn {remainingDays} ngày
                        </div>
                      )}
                      {remainingDays === 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Hết hạn
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-bold">{promo.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">{promo.description}</p>

                      {/* Products in this promotion */}
                      {promo.products && promo.products.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">
                              {promo.products.length} sản phẩm áp dụng
                            </span>
                            <button
                              onClick={() => setExpandedPromo(isExpanded ? null : promo.id)}
                              className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                            >
                              {isExpanded ? 'Thu gọn' : 'Xem SP'}
                              <span className={`material-symbols-outlined text-sm transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                expand_more
                              </span>
                            </button>
                          </div>

                          {/* Product avatars row */}
                          {!isExpanded && (
                            <div className="flex -space-x-2">
                              {promo.products.slice(0, 5).map((prod) => (
                                <div key={prod.id} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 overflow-hidden">
                                  <img
                                    src={getImageUrl(prod.thumbnail)}
                                    alt={prod.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              {promo.products.length > 5 && (
                                <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-primary">
                                  +{promo.products.length - 5}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Expanded product list */}
                          {isExpanded && (
                            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                              {promo.products.map((prod) => (
                                <Link
                                  key={prod.id}
                                  to={`/product/${prod.id}`}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                  <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                    <img
                                      src={getImageUrl(prod.thumbnail)}
                                      alt={prod.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-1">{prod.name}</p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-bold text-primary">
                                        {formatCurrency(prod.sale_price || prod.price)}
                                      </span>
                                      {prod.sale_price && (
                                        <span className="text-xs text-slate-400 line-through">
                                          {formatCurrency(prod.price)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <button className="w-full py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold hover:bg-primary hover:text-white transition-colors text-sm">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Deep Discount Products */}
        {discountedProducts.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary text-3xl">local_fire_department</span>
              <h2 className="text-2xl font-bold tracking-tight">Sản phẩm giảm giá sâu</h2>
              {pagination && (
                <span className="text-sm text-slate-400 ml-auto">{pagination.total} sản phẩm</span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {discountedProducts.map((product) => {
                const discountPercent = product.discount_percent || (product.sale_price
                  ? Math.round((1 - product.sale_price / product.price) * 100)
                  : 0);

                return (
                  <Link
                    to={`/product/${product.id}`}
                    key={product.id}
                    className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="relative aspect-square mb-4 bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden">
                      <img
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                        src={getImageUrl(product.thumbnail)}
                      />
                      {discountPercent > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                          -{discountPercent}%
                        </div>
                      )}
                    </div>
                    {product.brand && (
                      <p className="text-xs text-slate-400 font-medium mb-1">{product.brand.name}</p>
                    )}
                    <h4 className="font-medium text-sm md:text-base mb-1 line-clamp-2 flex-1">{product.name}</h4>
                    <div className="mt-auto space-y-1">
                      <p className="text-primary font-bold text-lg">{formatCurrency(product.sale_price)}</p>
                      <p className="text-slate-400 text-xs line-through">{formatCurrency(product.price)}</p>
                      {product.sold_count > 0 && (
                        <p className="text-xs text-slate-500">Đã bán {product.sold_count}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Load More Button */}
            {pagination && pagination.currentPage < pagination.lastPage && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-900 dark:text-slate-100 font-bold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      Xem thêm sản phẩm
                      <span className="material-symbols-outlined text-sm">expand_more</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        )}

        {/* Newsletter Promo Section */}
        <section className="bg-primary/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Nhận thông báo ưu đãi mới nhất</h2>
            <p className="text-slate-600 dark:text-slate-400">Đừng bỏ lỡ bất kỳ chương trình khuyến mãi nào. Đăng ký nhận bản tin từ PTSmart ngay!</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              className="flex-1 md:min-w-[300px] rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus:ring-primary focus:border-primary px-4 py-3"
              placeholder="Nhập email của bạn"
              type="email"
            />
            <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all">Đăng ký</button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PromotionsPage;
