import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import WishlistButton from '../../shared/components/WishlistButton';
import { getHomeData } from './homeAPI';
import './HomePage.css';

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

const HomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const homeData = await getHomeData();
        setData(homeData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { banners, categories, flash_sale, featured_products, new_products, best_sellers } = data || {};
  
  // Get hero banners
  const heroBanners = banners?.filter(b => b.position === 'home_hero') || [];

  // Auto-slide effect
  useEffect(() => {
    if (!heroBanners || heroBanners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % heroBanners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  if (loading) {
    return (
      <div className="homepage flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex justify-center items-center">
          <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-xl">
            Có lỗi xảy ra: {error}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentBanner = heroBanners[currentBannerIndex] || banners?.[0];

  return (
    <div className="homepage">
      <Header />

      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6 space-y-12">
        {/* Hero Slider Section */}
        {currentBanner && (
        <section className="relative h-[400px] w-full rounded-3xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent z-10 transition-opacity duration-500"></div>
          {heroBanners.map((banner, index) => (
            <div 
              key={banner.id || index}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                index === currentBannerIndex ? 'opacity-100 z-0 scale-100 group-hover:scale-105' : 'opacity-0 -z-10 scale-110'
              }`}
              style={{ backgroundImage: `url('${getImageUrl(banner.image)}')` }}
            ></div>
          ))}
          
          <div className="relative z-20 h-full flex flex-col justify-center px-12 max-w-2xl text-white space-y-4 transition-all duration-300">
            <span className="bg-accent-pink/20 text-accent-pink px-4 py-1 rounded-full text-sm font-bold w-fit border border-accent-pink/30 inline-block">
              {currentBanner.subtitle || 'SIÊU TIỆC CÔNG NGHỆ'}
            </span>
            <h2 className="text-5xl font-extrabold leading-tight">{currentBanner.title}</h2>
            <div className="flex gap-4 pt-4">
              {currentBanner.link ? (
                <Link to={currentBanner.link} className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                  Xem ngay
                </Link>
              ) : (
                <button className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">Mua ngay</button>
              )}
            </div>
          </div>
          
          {/* Slider Dots */}
          {heroBanners.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroBanners.map((_, index) => (
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

        {/* Categories Section */}
        {categories && categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">grid_view</span>
              Danh mục nổi bật
            </h2>
            {/* <Link className="text-primary font-semibold flex items-center hover:underline text-sm" to="/categories">
              Xem tất cả <span className="material-symbols-outlined text-base">chevron_right</span>
            </Link> */}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-7 md:grid-cols-4 gap-4">
            {categories.slice(0, 7).map((category) => (
              <Link key={category.id} to={`/san-pham?category=${category.slug}`} className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all group cursor-pointer text-center">
                <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-3">
                  <span className="material-symbols-outlined text-3xl">{category.icon || 'devices'}</span>
                </div>
                <span className="font-bold text-sm line-clamp-2">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>
        )}

        {/* Flash Sale Section */}
        {flash_sale && flash_sale.items?.length > 0 && (
        <section className="bg-primary/5 dark:bg-primary/10 rounded-[40px] p-8 md:p-10 border border-primary/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-accent-pink fill-1">bolt</span>
                {flash_sale.title || 'FLASH SALE'}
              </h2>
            </div>
            <button className="text-primary font-bold hover:bg-primary/10 px-6 py-2 rounded-xl transition-colors">Xem tất cả</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {flash_sale.items.map((item) => {
              const product = item.product;
              if (!product) return null;
              
              const discountPercentage = Math.round((1 - item.flash_price / product.price) * 100);
              const progressPercentage = item.quantity > 0 ? Math.round((item.sold / item.quantity) * 100) : 0;
              const isSoldOut = item.sold >= item.quantity;

              return (
              <Link to={`/product/${product.id}`} key={item.id} className="block bg-white dark:bg-gray-800 rounded-3xl p-5 border border-transparent hover:border-primary/20 hover:shadow-2xl transition-all relative group overflow-hidden">
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-accent-pink text-white text-xs font-bold px-3 py-1 rounded-full">-{discountPercentage}%</div>
                )}
                <WishlistButton productId={product.id} className="absolute top-4 right-4 z-10" />
                <div className="aspect-square w-full mb-4 bg-gray-50 dark:bg-gray-700 rounded-2xl overflow-hidden">
                  <img alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={getImageUrl(product.thumbnail)} />
                </div>
                <div className="space-y-2">
                  {product.brand && <p className="text-xs text-gray-400 font-medium">{product.brand.name || 'Unknown'}</p>}
                  <h3 className="font-bold text-base md:text-lg line-clamp-2 h-[56px] leading-tight">{product.name}</h3>
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-xl font-bold text-primary">{formatCurrency(item.flash_price)}</span>
                    <span className="text-sm text-gray-400 line-through pb-0.5">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="pt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-r from-accent-pink to-orange-400 rounded-full`} style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Đã bán {item.sold}/{item.quantity}
                      </span>
                      {isSoldOut && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Hết hàng</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )})}
          </div>
        </section>
        )}

        {/* Featured Products */}
        {featured_products && featured_products.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">star</span>
              Sản phẩm nổi bật
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {featured_products.slice(0, 10).map((product) => {
              const discountPercentage = product.sale_price ? Math.round((1 - product.sale_price / product.price) * 100) : 0;
              return (
              <Link to={`/product/${product.id}`} key={product.id} className="block bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all relative group overflow-hidden">
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-accent-pink text-white text-xs font-bold px-3 py-1 rounded-full">-{discountPercentage}%</div>
                )}
                <WishlistButton productId={product.id} className="absolute top-4 right-4 z-10" />
                <div className="aspect-square w-full mb-4 bg-gray-50 dark:bg-gray-700 rounded-2xl overflow-hidden">
                  <img alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={getImageUrl(product.thumbnail)} />
                </div>
                <div className="space-y-2">
                  {product.brand && <p className="text-xs text-gray-400 font-medium">{product.brand.name}</p>}
                  <h3 className="font-bold text-base line-clamp-2 h-[48px] leading-tight">{product.name}</h3>
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-lg font-bold text-primary">{formatCurrency(product.sale_price || product.price)}</span>
                    {product.sale_price && (
                      <span className="text-sm text-gray-400 line-through pb-0.5">{formatCurrency(product.price)}</span>
                    )}
                  </div>
                </div>
              </Link>
            )})}
          </div>
        </section>
        )}

        {/* New Products */}
        {new_products && new_products.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">new_releases</span>
              Sản phẩm mới nhất
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {new_products.slice(0, 5).map((product) => {
              const discountPercentage = product.sale_price ? Math.round((1 - product.sale_price / product.price) * 100) : 0;
              return (
              <Link to={`/product/${product.id}`} key={product.id} className="block bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all relative group overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">New</div>
                {discountPercentage > 0 && (
                  <div className="absolute top-12 left-4 z-10 bg-accent-pink text-white text-xs font-bold px-3 py-1 rounded-full">-{discountPercentage}%</div>
                )}
                <WishlistButton productId={product.id} className="absolute top-4 right-4 z-10" />
                <div className="aspect-square w-full mb-4 bg-gray-50 dark:bg-gray-700 rounded-2xl overflow-hidden">
                  <img alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={getImageUrl(product.thumbnail)} />
                </div>
                <div className="space-y-2">
                  {product.brand && <p className="text-xs text-gray-400 font-medium">{product.brand.name}</p>}
                  <h3 className="font-bold text-base line-clamp-2 h-[48px] leading-tight">{product.name}</h3>
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-lg font-bold text-primary">{formatCurrency(product.sale_price || product.price)}</span>
                    {product.sale_price && (
                      <span className="text-sm text-gray-400 line-through pb-0.5">{formatCurrency(product.price)}</span>
                    )}
                  </div>
                </div>
              </Link>
            )})}
          </div>
        </section>
        )}

        {/* Best Sellers */}
        {best_sellers && best_sellers.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">trending_up</span>
              Bán chạy nhất
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {best_sellers.slice(0, 5).map((product) => {
              const discountPercentage = product.sale_price ? Math.round((1 - product.sale_price / product.price) * 100) : 0;
              return (
              <Link to={`/product/${product.id}`} key={product.id} className="block bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all relative group overflow-hidden">
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-accent-pink text-white text-xs font-bold px-3 py-1 rounded-full">-{discountPercentage}%</div>
                )}
                <WishlistButton productId={product.id} className="absolute top-4 right-4 z-10" />
                <div className="aspect-square w-full mb-4 bg-gray-50 dark:bg-gray-700 rounded-2xl overflow-hidden">
                  <img alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={getImageUrl(product.thumbnail)} />
                </div>
                <div className="space-y-2">
                  {product.brand && <p className="text-xs text-gray-400 font-medium">{product.brand.name}</p>}
                  <h3 className="font-bold text-base line-clamp-2 h-[48px] leading-tight">{product.name}</h3>
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-lg font-bold text-primary">{formatCurrency(product.sale_price || product.price)}</span>
                    {product.sale_price && (
                      <span className="text-sm text-gray-400 line-through pb-0.5">{formatCurrency(product.price)}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Đã bán {product.sold_count || 0}
                  </div>
                </div>
              </Link>
            )})}
          </div>
        </section>
        )}

        {/* Newsletter & Promotions */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-[#135bec] to-[#003da8] rounded-[40px] p-10 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl font-bold">Đăng ký nhận tin</h3>
              <p className="text-white/80 max-w-sm text-lg">Đừng bỏ lỡ các ưu đãi độc quyền dành riêng cho thành viên PTSmart mỗi tháng!</p>
              <div className="flex gap-2">
                <input className="bg-white/20 border-white/30 rounded-xl px-4 py-3 flex-1 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/40 focus:border-transparent outline-none" placeholder="Nhập email của bạn..." type="email" />
                <button className="bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors">Đăng ký</button>
              </div>
            </div>
            <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[180px] text-white/10 rotate-12 transition-transform group-hover:scale-110">mail</span>
          </div>
          <div className="bg-accent-pink rounded-[40px] p-10 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl font-bold">Thu cũ Đổi mới</h3>
              <p className="text-white/80 max-w-sm text-lg">Trợ giá lên đến 2.000.000đ khi nâng cấp máy mới tại hệ thống PTSmart toàn quốc.</p>
              <button className="bg-white text-accent-pink font-bold px-10 py-3 rounded-xl hover:bg-white/90 transition-colors w-fit">Tham gia ngay</button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[180px] text-white/10 -rotate-12 transition-transform group-hover:scale-110">sync</span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;

