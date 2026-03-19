import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../../features/auth/authAPI';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: '/admin', icon: 'dashboard', label: 'Tổng quan' },
    { path: '/admin/products', icon: 'inventory_2', label: 'Sản phẩm' },
    { path: '/admin/categories', icon: 'category', label: 'Danh mục' },
    { path: '/admin/orders', icon: 'receipt_long', label: 'Đơn hàng' },
    { path: '/admin/users', icon: 'group', label: 'Người dùng' }
  ];

  return (
    <aside className="admin-sidebar w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-50">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-2xl">bolt</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary">PTSmart</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold leading-none">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive(item.path)
                ? 'active-nav bg-primary text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Settings & User Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Link
          to="/admin/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive('/admin/settings')
              ? 'active-nav bg-primary text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-medium text-sm">Cài đặt</span>
        </Link>

        <div className="mt-4 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <img
              className="size-8 rounded-full border border-white shadow-sm"
              alt="Admin user avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1TgKkYySx6ureakx8JpLLphBtnIhp9PP1hfZ1B4Fd9AzNUP3yEg0jl6CY8iCgGllZDw-sl3yqH8Wz26kYBUm0q8azpId-1onwsMesLMPdhfi3Q3YLLn3LahWp1BdRJpdZ821MsCmG_oERs1_BSnPF2zRXA_HWKZXk62Q2VFkU0n1HtWNuSFn0aA45gzogGODYfofe2eQAT40pULPlWbPpUCUsTibiD9BxPpJCtfz04Lm9yEjVpiQKJOAcPqbApHV0chwYOp_dRg"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Quản trị viên</p>
              <p className="text-[10px] text-slate-500 truncate">admin@ptsmart.vn</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full text-[10px] font-bold py-1 px-2 border border-primary/20 rounded-lg text-primary hover:bg-primary hover:text-white transition-all"
          >
            ĐĂNG XUẤT
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
