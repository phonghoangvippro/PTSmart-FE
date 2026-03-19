import React, { useState } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';

const discountsData = [
  { id: 1, code: 'TECHLUX2024', desc: 'Giảm giá năm mới', value: '-20%', startDate: '01/01/2024', endDate: '31/01/2024', used: 450, limit: 500, status: 'active' },
  { id: 2, code: 'WELCOMETL', desc: 'Người dùng mới', value: '-500,000đ', startDate: '15/12/2023', endDate: 'Vô thời hạn', used: 1234, limit: '∞', status: 'active' },
  { id: 3, code: 'BLACKFRIDAY', desc: 'Sự kiện năm 2023', value: '-50%', startDate: '20/11/2023', endDate: '30/11/2023', used: 2000, limit: 2000, status: 'expired' },
  { id: 4, code: 'FREESHIP', desc: 'Miễn phí vận chuyển', value: 'Ship 0đ', startDate: '01/01/2024', endDate: '31/12/2024', used: 85, limit: 1000, status: 'active' },
];

const stats = [
  { label: 'Tổng mã', value: '124', badge: '+12%', badgeColor: 'text-primary bg-primary/10' },
  { label: 'Đang áp dụng', value: '42', pulse: true },
  { label: 'Lượt dùng', value: '1.8k', icon: 'trending_up' },
  { label: 'Hết hạn (Tháng)', value: '8', icon: 'event_busy', iconColor: 'text-red-400' },
];

const DiscountList = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Quản lý Mã giảm giá" />
        <div className="p-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span>Trang chủ</span>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-primary font-bold">Quản lý Mã giảm giá</span>
              </nav>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Mã giảm giá</h2>
              <p className="text-slate-500 mt-1">Theo dõi và quản lý các chương trình khuyến mãi đang diễn ra.</p>
            </div>
            <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
              <span className="material-symbols-outlined">add_circle</span>
              Thêm Mã Mới
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{stat.value}</span>
                  {stat.badge && <span className={`px-2 py-1 rounded text-xs font-bold ${stat.badgeColor}`}>{stat.badge}</span>}
                  {stat.pulse && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>}
                  {stat.icon && <span className={`material-symbols-outlined ${stat.iconColor || 'text-slate-300'}`}>{stat.icon}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <button className="bg-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm border border-slate-200 flex items-center gap-2 hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-lg">filter_list</span>
                  Lọc kết quả
                </button>
                <div className="flex gap-1 bg-slate-200/50 p-1 rounded-lg">
                  {['Tất cả', 'Hoạt động', 'Đã hết hạn'].map((tab, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(['all', 'active', 'expired'][i])}
                      className={`px-4 py-1.5 text-xs font-bold transition-all rounded-md ${
                        activeTab === ['all', 'active', 'expired'][i]
                          ? 'bg-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500">Hiển thị <span className="text-slate-900 font-bold">1-10</span> của <span className="text-slate-900 font-bold">124</span></p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Mã giảm giá</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Giá trị</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Thời gian</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Lượt dùng</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Trạng thái</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-400 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {discountsData.map((item) => {
                    const usedPct = item.limit === '∞' ? 40 : Math.round((item.used / item.limit) * 100);
                    return (
                      <tr key={item.id} className={`group hover:bg-slate-50 transition-colors ${item.status === 'expired' ? 'opacity-60' : ''}`}>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className={`font-bold tracking-tight ${item.status === 'expired' ? 'text-slate-500' : 'text-primary'}`}>{item.code}</span>
                            <span className="text-[10px] text-slate-400">{item.desc}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                            item.status === 'expired' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {item.value}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col text-xs space-y-0.5">
                            <div className="flex items-center gap-2 text-slate-900">
                              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                              {item.startDate}
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                              <span className="material-symbols-outlined text-[14px]">event</span>
                              {item.endDate}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="w-full max-w-[100px] space-y-1">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span>{item.used.toLocaleString()}</span>
                              <span className="text-slate-400">/ {typeof item.limit === 'number' ? item.limit.toLocaleString() : item.limit}</span>
                            </div>
                            <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${item.status === 'expired' ? 'bg-slate-400' : 'bg-primary'}`} style={{ width: `${Math.min(usedPct, 100)}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {item.status === 'active' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Hoạt động
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                              Hết hạn
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Chỉnh sửa">
                              <span className="material-symbols-outlined text-xl">{item.status === 'expired' ? 'visibility' : 'edit_square'}</span>
                            </button>
                            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-between">
              <button className="px-4 py-2 text-sm font-bold text-slate-400 flex items-center gap-2 disabled:opacity-30" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
                Trước
              </button>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg bg-primary text-white font-bold text-xs">1</button>
                <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 font-bold text-xs">2</button>
                <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 font-bold text-xs">3</button>
                <span className="px-2 text-slate-400">...</span>
                <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 font-bold text-xs">12</button>
              </div>
              <button className="px-4 py-2 text-sm font-bold text-slate-600 flex items-center gap-2 hover:text-slate-900">
                Tiếp
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Promo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600 to-rose-500 text-white p-8 h-48 flex items-center group">
              <div className="relative z-10 space-y-2">
                <h3 className="text-2xl font-bold tracking-tight leading-tight">Flash Sale<br/>Sắp diễn ra</h3>
                <p className="text-sm opacity-90 max-w-[200px]">Chiến dịch giảm giá 50% cho toàn bộ linh kiện máy tính vào cuối tuần này.</p>
                <button className="mt-4 px-4 py-2 bg-white text-pink-600 rounded-full text-xs font-bold uppercase tracking-wider hover:scale-105 transition-transform">Xem chi tiết</button>
              </div>
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[160px] opacity-10 rotate-12 transition-transform group-hover:rotate-0">bolt</span>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-blue-500 text-white p-8 h-48 flex items-center group">
              <div className="relative z-10 space-y-2">
                <h3 className="text-2xl font-bold tracking-tight leading-tight">Mã giảm giá<br/>Mới nhất</h3>
                <p className="text-sm opacity-90 max-w-[200px]">Tự động gửi mã WELCOME20 cho tất cả đăng ký mới trong hệ thống.</p>
                <button className="mt-4 px-4 py-2 bg-white text-primary rounded-full text-xs font-bold uppercase tracking-wider hover:scale-105 transition-transform">Cài đặt gửi tin</button>
              </div>
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[160px] opacity-10 rotate-12 transition-transform group-hover:rotate-0">campaign</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiscountList;
