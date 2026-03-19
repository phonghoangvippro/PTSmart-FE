import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import './CategoryList.css';

const CategoryList = () => {
  const categories = [
    { id: '#DM01', name: 'Điện thoại', icon: 'smartphone', description: 'Các dòng smartphone đời mới nhất, iPhone, Samsung', count: '1,240', status: 'active' },
    { id: '#DM02', name: 'Laptop', icon: 'laptop_mac', description: 'Máy tính xách tay văn phòng, Gaming, Macbook', count: '856', status: 'active' },
    { id: '#DM03', name: 'Phụ kiện', icon: 'headphones', description: 'Tai nghe, Sạc dự phòng, Ốp lưng, Cáp sạc', count: '2,100', status: 'active' },
    { id: '#DM04', name: 'Máy tính bảng', icon: 'tablet', description: 'iPad Pro, iPad Air, Samsung Tab S Series', count: '185', status: 'locked' },
    { id: '#DM05', name: 'Đồng hồ', icon: 'watch', description: 'Smartwatch, Apple Watch, Garmin', count: '312', status: 'active' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Danh mục sản phẩm" />

        <div className="p-8">
          {/* Page Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Danh mục sản phẩm</h2>
              <p className="text-slate-500 mt-1">Tổ chức các mặt hàng của bạn theo từng nhóm chuyên biệt</p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">add_circle</span>
              Thêm danh mục mới
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">grid_view</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Tổng số danh mục</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Đang hoạt động</p>
                <p className="text-2xl font-bold">10</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">inventory</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Tổng sản phẩm</p>
                <p className="text-2xl font-bold">2,450</p>
              </div>
            </div>
          </div>

          {/* Data Table Container */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên danh mục</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mô tả</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Số lượng SP</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-400">{cat.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{cat.description}</td>
                      <td className="px-6 py-4 text-sm text-center font-bold">{cat.count}</td>
                      <td className="px-6 py-4">
                        {cat.status === 'active' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Kích hoạt
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Tạm khóa
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Sửa">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button className="p-2 text-accent-pink hover:bg-accent-pink/10 rounded-lg transition-colors" title="Xóa">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500">
                Hiển thị <span className="font-bold text-slate-900 dark:text-white">1 - 5</span> của{' '}
                <span className="font-bold text-slate-900 dark:text-white">12</span> danh mục
              </p>
              <div className="flex items-center gap-2">
                <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition-colors disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <button className="size-9 flex items-center justify-center rounded-lg bg-primary text-white font-bold transition-all shadow-md shadow-primary/10">1</button>
                <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors font-medium">2</button>
                <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors font-medium">3</button>
                <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition-colors">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryList;
