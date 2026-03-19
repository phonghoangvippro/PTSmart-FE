import React from 'react';
import './Header.css';

const Header = ({ title, showSearch = true }) => {
  const currentDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="admin-header h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h2>
        {showSearch && (
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-slate-400"
              placeholder="Tìm kiếm dữ liệu..."
              type="text"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-secondary rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
          <span className="material-symbols-outlined">mail</span>
        </button>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{currentDate}</span>
          <span className="material-symbols-outlined text-slate-400">calendar_today</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
