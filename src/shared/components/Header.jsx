import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCartCount } from '../../features/cart/cartAPI';
import './Header.css';

const Header = () => {
  const cartCount = getCartCount();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // Check login state
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    setUser(null);
    setShowDropdown(false);
    navigate('/login');
  };

  const navLinks = [
    { label: 'Trang chủ', to: '/' },
    { label: 'Sản phẩm', to: '/laptops' },
    { label: 'Khuyến mãi', to: '/khuyen-mai' },
    { label: 'Flash Sale', to: '/flash-sale', icon: 'bolt', iconColor: 'text-accent-pink' },
    { label: 'Tin tức', to: '/tin-tuc' },
    { label: 'Liên hệ', to: '/lien-he' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

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
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
              <input className="w-full pl-12 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all" placeholder="Tìm kiếm điện thoại, laptop, phụ kiện..." type="text" />
            </div>
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
                  <span className={`material-symbols-outlined text-sm ${isActive(link.to) ? link.iconColor : link.iconColor}`}>{link.icon}</span>
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
