import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getProducts } from './productAPI';
import './ProductList.css';

const ProductList = () => {
  const products = getProducts();

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="material-symbols-outlined text-yellow-400 text-sm fill-1">star</span>
        ))}
        {hasHalfStar && (
          <span className="material-symbols-outlined text-yellow-400 text-sm fill-1" style={{ clipPath: 'inset(0 50% 0 0)' }}>star</span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-sm">star</span>
        ))}
      </>
    );
  };

  return (
    <div className="product-listing-page">
      <Header />
      
      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6">

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            {/* Category Filter */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                Danh mục
                <span className="material-symbols-outlined text-slate-400">expand_more</span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input defaultChecked className="rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary">Tất cả sản phẩm</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary">iPhone (Apple)</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary">Samsung Galaxy</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary">Xiaomi/Redmi</span>
                  </label>
                </li>
              </ul>
            </div>

            {/* Price Filter */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Khoảng giá</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input className="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-primary" placeholder="Từ" type="number" />
                  <span className="text-slate-400">-</span>
                  <input className="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-primary" placeholder="Đến" type="number" />
                </div>
                <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full relative">
                  <div className="absolute inset-y-0 left-1/4 right-1/4 bg-primary rounded-full"></div>
                  <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-3 h-3 bg-white border-2 border-primary rounded-full shadow cursor-pointer"></div>
                  <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-3 h-3 bg-white border-2 border-primary rounded-full shadow cursor-pointer"></div>
                </div>
                <button className="w-full py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-colors">Áp dụng</button>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Thương hiệu</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary transition-all flex items-center justify-center">
                  <img alt="Apple" className="h-4 dark:invert opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBahsrGAwppUxRXxa-WEuYQ17YuCCI5365FVh2Ze3_KbuC0aPRjwklOZCapVsGy0X0gimdZ-9jYOBFY9KRMggZiJkbGgpiyGNyRCmDuo_3UrUEt2DPVqxC8ToHdGXLmntGfRoxnzQE_rY-I3iue3g82UQ8tn1j9pOTuxVN7nmeeIPFCf9eiLKKmndh_Gwc3Ct11W9jL6uHsu3YXum1JKPZZ542HnzKGVtevTzz0A-etn67wm8kxPJBq0nWJ6JlJzi1HRiLGkbEbHQ" />
                </button>
                <button className="p-2 border border-primary bg-primary/5 rounded-lg transition-all flex items-center justify-center">
                  <img alt="Samsung" className="h-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBctHvlXVoET3JBAOrMMIs7G3fZiFnrGrx_0vjniX_D5bK04DYlQdRiYEE5kYbIKvrhQZNrXQbtfqYNHD1nY8dwCSWAwC_u-9xVTfx0CsjEGrW03WXTMHmnQ22Iy7684761Qj90R-FQkm8Quhr0LXK7cASSquJNfFm-jD9j6HjWWgiW6sW_1IMUySzvREPvpiXcCRRzAeIotRHqKBjpHbJD6Dpr9o7GdPtbJh6QRnC-_kBro-UBDMaLGq2-dawhBx_Lh_QZ-ExvPQ" />
                </button>
                <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary transition-all flex items-center justify-center">
                  <img alt="Xiaomi" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-9fveBrvkVsu5lC_kR9sbTYtwH8dH5MwtMTrrKhG3LWLFEQpKbfzvymlaKQY831RwIGM1lT9HVOpXC-docdL1LxxPsGgLtgGff-XXSJgPIFYGRecaXW2G8mU7tpBxiqSuvvjknAuEuobPNswDw8jpNXh1YrzPAJNQS1vamEBrZt57rPpiaB2Crb6qmDkpX_WivLW8rKWBf3mVm8jvI9-sFW-naW3zKNac4fiIZPWhcsMy6Glah4DNUJEWpxqBIHzrW1-Z7ACxpg" />
                </button>
                <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary transition-all flex items-center justify-center">
                  <img alt="ASUS" className="h-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY6y7E0Xq6g0EZoAr3KdpQy5mxPy7xh-nRALEbTIZtbfpQz90J6u9XQckIZqtVEERR5kca5afy9tdIE8VFbRhBeziNlVzeJveaZRHfzts3u781ewG_f2JEnnHg1hh354eWfIkcWdQNDG5K4DZ7n0OKkJuhossr55Vge5d4o7v_TAebGD83bPBTBR7kpHIDh6yAWWSlZjwnrFAo2MRESbPyPygE87wtVravIT_d4ax4XMPt84sD1OY3QaA3PtvqQRbuvw8ECXZDbQ" />
                </button>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Đánh giá</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="text-primary focus:ring-primary" name="rating" type="radio" />
                  <div className="flex text-yellow-400 text-sm">
                    <span className="material-symbols-outlined fill-1 text-base">star</span>
                    <span className="material-symbols-outlined fill-1 text-base">star</span>
                    <span className="material-symbols-outlined fill-1 text-base">star</span>
                    <span className="material-symbols-outlined fill-1 text-base">star</span>
                    <span className="material-symbols-outlined fill-1 text-base">star</span>
                  </div>
                  <span className="text-xs text-slate-500">(5 sao)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="text-primary focus:ring-primary" name="rating" type="radio" />
                  <div className="flex text-yellow-400 text-sm">
                    <span className="material-symbols-outlined fill-1 text-base">star</span>
                    <span className="material-symbols-outlined fill-1 text-base">star</span>
                    <span className="material-symbols-outlined fill-1 text-base">star</span>
                    <span className="material-symbols-outlined fill-1 text-base">star</span>
                    <span className="material-symbols-outlined text-base">star</span>
                  </div>
                  <span className="text-xs text-slate-500">trở lên</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold">Điện thoại di động</h2>
                <span className="text-sm text-slate-500">(124 sản phẩm)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Sắp xếp:</span>
                <select className="text-sm border-none bg-slate-100 dark:bg-slate-800 rounded-lg focus:ring-primary py-1.5 pl-3 pr-8 font-semibold">
                  <option>Mới nhất</option>
                  <option>Giá: Thấp đến Cao</option>
                  <option>Giá: Cao đến Thấp</option>
                  <option>Bán chạy nhất</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="product-card group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative flex flex-col">
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`${product.badgeColor === 'accent-pink' ? 'bg-accent-pink' : 'bg-primary'} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm`}>
                        {product.badge}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-accent-pink transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">favorite</span>
                  </button>
                  <div className="aspect-square w-full p-6 bg-white flex items-center justify-center overflow-hidden">
                    <img alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" src={product.image} />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-yellow-400 text-sm fill-1">star</span>
                      <span className="text-xs font-semibold">{product.rating}</span>
                      <span className="text-xs text-slate-400">
                        ({product.reviews >= 1000 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews} đánh giá)
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-3">{product.name}</h3>
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-primary">{product.price}</span>
                        {product.oldPrice && (
                          <span className="text-sm text-slate-400 line-through">{product.oldPrice}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="w-full py-3 bg-slate-900 dark:bg-primary text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary dark:hover:bg-primary/80 transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">shopping_bag</span>
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-2">
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-white font-bold shadow-lg shadow-primary/30 transition-all">1</button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-all">2</button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-all">3</button>
              <span className="px-2 text-slate-400">...</span>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-all">10</button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductList;
