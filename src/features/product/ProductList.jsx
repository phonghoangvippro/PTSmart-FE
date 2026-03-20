import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import WishlistButton from '../../shared/components/WishlistButton';
import { fetchProducts } from './productAPI';
import { addCartItem } from '../cart/cartAPI';
import './ProductList.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/300x300?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + '₫';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá: Thấp → Cao' },
  { value: 'price_desc', label: 'Giá: Cao → Thấp' },
  { value: 'best_selling', label: 'Bán chạy nhất' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
  { value: 'discount', label: 'Giảm giá sâu nhất' },
];

const RATING_OPTIONS = [5, 4, 3];

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state from URL params
  const currentPage = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const rating = searchParams.get('rating') || '';
  const onSale = searchParams.get('on_sale') || '';
  const isFeatured = searchParams.get('is_featured') || '';

  // Local filter form state (for price range — applied on button click)
  const [priceFrom, setPriceFrom] = useState(minPrice);
  const [priceTo, setPriceTo] = useState(maxPrice);
  const [searchInput, setSearchInput] = useState(search);
  const [addingToCartId, setAddingToCartId] = useState(null);

  // Sync local inputs when URL params change externally
  useEffect(() => { setPriceFrom(minPrice); }, [minPrice]);
  useEffect(() => { setPriceTo(maxPrice); }, [maxPrice]);
  useEffect(() => { setSearchInput(search); }, [search]);

  const updateFilters = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParams);
    // Reset to page 1 on any filter change (unless page itself is being set)
    if (!('page' in updates)) newParams.set('page', '1');
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
    window.scrollTo(0, 0);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const filters = { page: currentPage, sort };
        if (search) filters.search = search;
        if (category) filters.category = category;
        if (brand) filters.brand = brand;
        if (minPrice) filters.min_price = minPrice;
        if (maxPrice) filters.max_price = maxPrice;
        if (rating) filters.rating = rating;
        if (onSale) filters.on_sale = onSale;
        if (isFeatured) filters.is_featured = isFeatured;
        filters.per_page = 12;

        const res = await fetchProducts(filters);
        setProducts(res.data || []);
        setPagination({
          currentPage: res.current_page,
          lastPage: res.last_page,
          total: res.total,
          perPage: res.per_page,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [currentPage, search, category, brand, sort, minPrice, maxPrice, rating, onSale, isFeatured]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const handleApplyPrice = () => {
    updateFilters({ min_price: priceFrom, max_price: priceTo });
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setPriceFrom('');
    setPriceTo('');
    setSearchInput('');
  };

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    try {
      setAddingToCartId(productId);
      await addCartItem(productId, 1, null);
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setAddingToCartId(null);
    }
  };

  const getDiscountPercent = (price, salePrice) => {
    if (!salePrice || Number(salePrice) >= Number(price)) return null;
    return Math.round(((Number(price) - Number(salePrice)) / Number(price)) * 100);
  };

  const hasActiveFilters = search || category || brand || minPrice || maxPrice || rating || onSale || isFeatured || sort !== 'newest';

  return (
    <div className="product-listing-page">
      <Header />

      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-5">
            {/* Search */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">Tìm kiếm</h3>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  className="w-full text-sm rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-primary px-3 py-2"
                  placeholder="Tên sản phẩm..."
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 shrink-0">
                  <span className="material-symbols-outlined text-sm">search</span>
                </button>
              </form>
            </div>

            {/* Category Filter */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">Danh mục</h3>
              <ul className="space-y-2">
                {[
                  { value: '', label: 'Tất cả' },
                  { value: 'laptop', label: 'Laptop' },
                  { value: 'laptop-gaming', label: 'Laptop Gaming' },
                  { value: 'laptop-van-phong', label: 'Laptop Văn Phòng' },
                  { value: 'iphone', label: 'iPhone' },
                  { value: 'samsung-phone', label: 'Samsung' },
                  { value: 'xiaomi-phone', label: 'Xiaomi' },
                  { value: 'ipad', label: 'iPad' },
                  { value: 'tai-nghe', label: 'Tai Nghe' },
                  { value: 'ban-phim-chuot', label: 'Bàn Phím & Chuột' },
                ].map((cat) => (
                  <li key={cat.value}>
                    <button
                      onClick={() => updateFilters({ category: cat.value })}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                        category === cat.value
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">Khoảng giá</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    className="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-primary px-3 py-2"
                    placeholder="Từ"
                    type="number"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                  />
                  <span className="text-slate-400 text-sm">-</span>
                  <input
                    className="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-primary px-3 py-2"
                    placeholder="Đến"
                    type="number"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: 'Dưới 10tr', min: '', max: '10000000' },
                    { label: '10-20tr', min: '10000000', max: '20000000' },
                    { label: '20-30tr', min: '20000000', max: '30000000' },
                    { label: 'Trên 30tr', min: '30000000', max: '' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => { setPriceFrom(preset.min); setPriceTo(preset.max); updateFilters({ min_price: preset.min, max_price: preset.max }); }}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleApplyPrice}
                  className="w-full py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">Đánh giá</h3>
              <div className="space-y-2">
                {RATING_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => updateFilters({ rating: rating === String(r) ? '' : String(r) })}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                      rating === String(r) ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex text-yellow-400">
                      {[...Array(r)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">trở lên</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">Bộ lọc nhanh</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateFilters({ on_sale: onSale ? '' : '1' })}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    onSale ? 'bg-accent-pink/10 text-accent-pink font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">local_offer</span>
                  Đang giảm giá
                </button>
                <button
                  onClick={() => updateFilters({ is_featured: isFeatured ? '' : '1' })}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isFeatured ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">stars</span>
                  Sản phẩm nổi bật
                </button>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                Xóa bộ lọc
              </button>
            )}
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold">
                  {search ? `Kết quả: "${search}"` : category ? category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Tất cả sản phẩm'}
                </h2>
                {pagination && <span className="text-sm text-slate-500">({pagination.total} sản phẩm)</span>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Sắp xếp:</span>
                <select
                  value={sort}
                  onChange={(e) => updateFilters({ sort: e.target.value })}
                  className="text-sm border-none bg-slate-100 dark:bg-slate-800 rounded-lg focus:ring-primary py-1.5 pl-3 pr-8 font-semibold"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filters chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Tìm: {search}
                    <button onClick={() => updateFilters({ search: '' })}><span className="material-symbols-outlined text-xs">close</span></button>
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Danh mục: {category}
                    <button onClick={() => updateFilters({ category: '' })}><span className="material-symbols-outlined text-xs">close</span></button>
                  </span>
                )}
                {brand && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Thương hiệu: {brand}
                    <button onClick={() => updateFilters({ brand: '' })}><span className="material-symbols-outlined text-xs">close</span></button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Giá: {minPrice ? formatPrice(minPrice) : '0'} - {maxPrice ? formatPrice(maxPrice) : '∞'}
                    <button onClick={() => { setPriceFrom(''); setPriceTo(''); updateFilters({ min_price: '', max_price: '' }); }}><span className="material-symbols-outlined text-xs">close</span></button>
                  </span>
                )}
                {rating && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    ≥ {rating} sao
                    <button onClick={() => updateFilters({ rating: '' })}><span className="material-symbols-outlined text-xs">close</span></button>
                  </span>
                )}
                {onSale && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-pink/10 text-accent-pink text-xs font-medium rounded-full">
                    Đang giảm giá
                    <button onClick={() => updateFilters({ on_sale: '' })}><span className="material-symbols-outlined text-xs">close</span></button>
                  </span>
                )}
                {isFeatured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Nổi bật
                    <button onClick={() => updateFilters({ is_featured: '' })}><span className="material-symbols-outlined text-xs">close</span></button>
                  </span>
                )}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="text-red-500 font-bold p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</div>
            )}

            {/* Empty */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
                <h3 className="text-lg font-bold mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-slate-500 text-sm mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                <button onClick={handleClearFilters} className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700">
                  <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => {
                  const hasDiscount = product.sale_price && Number(product.sale_price) < Number(product.price);
                  const discountPercent = getDiscountPercent(product.price, product.sale_price);
                  const displayPrice = hasDiscount ? product.sale_price : product.price;

                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="product-card group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative flex flex-col"
                    >
                      {discountPercent && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-accent-pink text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            Giảm {discountPercent}%
                          </span>
                        </div>
                      )}
                      {product.is_featured && !discountPercent && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            Nổi bật
                          </span>
                        </div>
                      )}
                      <WishlistButton productId={product.id} className="absolute top-3 right-3 z-10" />
                      <div className="aspect-square w-full p-6 bg-white flex items-center justify-center overflow-hidden">
                        <img
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          src={getImageUrl(product.thumbnail)}
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-xs font-semibold">{product.rating_avg || '0.0'}</span>
                          <span className="text-xs text-slate-400">
                            ({product.review_count || 0})
                          </span>
                          {product.sold_count > 0 && (
                            <span className="text-xs text-slate-400 ml-1">
                              · Đã bán {product.sold_count > 1000 ? `${(product.sold_count / 1000).toFixed(1)}k` : product.sold_count}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-1">{product.name}</h3>
                        {product.brand && (
                          <p className="text-xs text-slate-400 mb-2">{product.brand.name}</p>
                        )}
                        <div className="mt-auto">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-primary">{formatPrice(displayPrice)}</span>
                            {hasDiscount && (
                              <span className="text-sm text-slate-400 line-through">{formatPrice(product.price)}</span>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleAddToCart(e, product.id)}
                            disabled={addingToCartId === product.id || product.stock <= 0}
                            className="w-full py-3 bg-slate-900 dark:bg-primary text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary dark:hover:bg-primary/80 transition-all disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-lg">shopping_bag</span>
                            {addingToCartId === product.id ? 'Đang thêm...' : 'Thêm vào giỏ'}
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.lastPage > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => updateFilters({ page: Math.max(1, currentPage - 1) })}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-primary transition-all disabled:opacity-30"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {Array.from({ length: pagination.lastPage }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === pagination.lastPage || Math.abs(p - currentPage) <= 2)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === '...' ? (
                      <span key={`dots-${i}`} className="px-2 text-slate-400">...</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => updateFilters({ page: item })}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                          item === currentPage
                            ? 'bg-primary text-white font-bold shadow-lg shadow-primary/30'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                <button
                  onClick={() => updateFilters({ page: Math.min(pagination.lastPage, currentPage + 1) })}
                  disabled={currentPage === pagination.lastPage}
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-primary transition-all disabled:opacity-30"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductList;
