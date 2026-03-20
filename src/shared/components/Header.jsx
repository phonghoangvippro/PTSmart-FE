import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCart } from '../../features/cart/cartAPI';
import { logoutUser } from '../../features/auth/authAPI';
import { searchAutocomplete } from '../../features/product/productAPI';
import './Header.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/40x40?text=SP';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + '₫';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Check login state
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [location]);

  // Fetch cart count
  const fetchCartCount = useCallback(async () => {
    if (!localStorage.getItem('userToken')) {
      setCartCount(0);
      return;
    }
    try {
      const cartRes = await getCart();
      const items = cartRes?.data?.items || [];
      const count = items.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    fetchCartCount();
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => {
      window.removeEventListener('cartUpdated', fetchCartCount);
    };
  }, [fetchCartCount, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search on route change
  useEffect(() => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults(null);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setShowDropdown(false);
    navigate('/login');
  };

  // Debounced autocomplete search
  const handleSearchInput = useCallback((value) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setSearchResults(null);
      setShowSearch(false);
      return;
    }

    setShowSearch(true);
    setSearchLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchAutocomplete(value.trim());
        setSearchResults(data);
      } catch {
        setSearchResults(null);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, []);

  // Navigate to full search results on Enter
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearch(false);
      navigate(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: 'Trang chủ', to: '/' },
    { label: 'Sản phẩm', to: '/san-pham' },
    { label: 'Khuyến mãi', to: '/khuyen-mai' },
    { label: 'Flash Sale', to: '/flash-sale', icon: 'bolt', iconColor: 'text-accent-pink' },
    { label: 'Tin tức', to: '/tin-tuc' },
    { label: 'Liên hệ', to: '/lien-he' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const suggestedProducts = searchResults?.products || [];
  const suggestedCategories = searchResults?.categories || [];

  return (
    <>
      {/* Header Section */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#e7ebf3] dark:border-gray-800">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-3 flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-3">
              <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-2xl">devices</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-primary">PTSmart</h1>
            </Link>
          </div>

          {/* Search Bar with Autocomplete */}
          <div className="flex-1 max-w-2xl hidden md:block relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
              <input
                className="w-full pl-12 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all"
                placeholder="Tìm kiếm điện thoại, laptop, phụ kiện..."
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => { if (searchResults) setShowSearch(true); }}
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSearchResults(null); setShowSearch(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </form>

            {/* Search Dropdown */}
            {showSearch && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 dark:border-gray-700 overflow-hidden z-[999] max-h-[480px] overflow-y-auto">
                {searchLoading ? (
                  <div className="p-6 flex items-center justify-center gap-3 text-sm text-slate-500">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    Đang tìm kiếm...
                  </div>
                ) : (
                  <>
                    {/* Category Suggestions */}
                    {suggestedCategories.length > 0 && (
                      <div className="px-4 pt-3 pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Danh mục</p>
                        <div className="flex flex-wrap gap-2">
                          {suggestedCategories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/san-pham?category=${cat.slug}`}
                              onClick={() => setShowSearch(false)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-medium rounded-full transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">category</span>
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Product Suggestions */}
                    {suggestedProducts.length > 0 && (
                      <div className="px-2 py-2">
                        {suggestedCategories.length > 0 && (
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Sản phẩm</p>
                        )}
                        {suggestedProducts.map((product) => (
                          <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            onClick={() => setShowSearch(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                          >
                            <img
                              src={getImageUrl(product.thumbnail)}
                              alt={product.name}
                              className="w-10 h-10 object-contain rounded-lg bg-slate-100 dark:bg-slate-700 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 dark:text-white group-hover:text-primary transition-colors truncate">
                                {product.name}
                              </p>
                              {product.category && (
                                <p className="text-[11px] text-slate-400">{product.category.name}</p>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-bold text-primary">
                                {formatPrice(product.sale_price || product.price)}
                              </p>
                              {product.sale_price && Number(product.sale_price) < Number(product.price) && (
                                <p className="text-[11px] text-slate-400 line-through">
                                  {formatPrice(product.price)}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* No results */}
                    {suggestedProducts.length === 0 && suggestedCategories.length === 0 && !searchLoading && (
                      <div className="p-6 text-center text-sm text-slate-500">
                        <span className="material-symbols-outlined text-3xl text-slate-300 mb-2">search_off</span>
                        <p>Không tìm thấy kết quả cho "<strong>{searchQuery}</strong>"</p>
                      </div>
                    )}

                    {/* View all results */}
                    {(suggestedProducts.length > 0 || suggestedCategories.length > 0) && (
                      <div className="border-t border-slate-100 dark:border-slate-700 p-2">
                        <button
                          onClick={() => { setShowSearch(false); navigate(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`); }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">search</span>
                          Xem tất cả kết quả cho "{searchQuery}"
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Utilities */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 size-4 bg-accent-pink text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <Link to="/account" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <span className="material-symbols-outlined">person</span>
            </Link>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2"></div>

            {/* Profile Image with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="size-10 rounded-full border-2 border-primary/20 group-hover:border-primary/50 p-0.5 overflow-hidden transition-all duration-300">
                      <img
                        alt="User Profile"
                        className="w-full h-full rounded-full object-cover"
                        src={user.avatar}
                      />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 dark:border-gray-700 overflow-hidden z-[999] animate-dropdown">
                      {/* User Info */}
                      <div className="p-5 bg-gradient-to-r from-primary/5 to-transparent border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-full border-2 border-primary/20 p-0.5 overflow-hidden shrink-0">
                            <img
                              alt="User Profile"
                              className="w-full h-full rounded-full object-cover"
                              src={user.avatar}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/account/profile"
                          className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="material-symbols-outlined text-xl text-gray-400">account_circle</span>
                          <span className="font-medium">Tài khoản của tôi</span>
                        </Link>
                        <Link
                          to="/account/orders"
                          className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="material-symbols-outlined text-xl text-gray-400">receipt_long</span>
                          <span className="font-medium">Đơn hàng của tôi</span>
                        </Link>
                        <Link
                          to="/account/favorites"
                          className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="material-symbols-outlined text-xl text-gray-400">favorite</span>
                          <span className="font-medium">Sản phẩm yêu thích</span>
                        </Link>
                        <Link
                          to="/account/address"
                          className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="material-symbols-outlined text-xl text-gray-400">location_on</span>
                          <span className="font-medium">Sổ địa chỉ</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 dark:border-gray-700 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full"
                        >
                          <span className="material-symbols-outlined text-xl">logout</span>
                          <span className="font-bold">Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm"
                >
                  <span className="material-symbols-outlined text-xl">login</span>
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Sub-bar */}
        <nav className="bg-white dark:bg-background-dark border-b border-[#e7ebf3] dark:border-gray-800">
          <div className="max-w-[1280px] mx-auto px-10 flex items-center justify-center md:justify-start gap-10 h-12 overflow-x-auto no-scrollbar">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                className={`text-sm h-full flex items-center transition-colors ${
                  isActive(link.to)
                    ? 'font-semibold text-primary border-b-2 border-primary'
                    : 'font-medium text-gray-600 dark:text-gray-400 hover:text-primary'
                } ${link.icon ? 'gap-1' : ''}`}
                to={link.to}
              >
                {link.icon && (
                  <span className={`material-symbols-outlined text-sm ${link.iconColor}`}>{link.icon}</span>
                )}
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
