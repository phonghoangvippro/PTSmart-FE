import React, { useState } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';

const brandsData = [
  { id: 1, name: 'Apple Inc.', origin: 'Cupertino, California', code: 'BR-APL-2024', products: 342, status: 'active', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyjKsTDXxijYDjQI8N22IPtJB2gFkCPnz48jD47vKbZplmD7WttlBZMv5pw1DyjzV04jMgOiV3H83sE_3G7FsjUdVcWLuDiQgilw9OclYCc8HaFp-uQ6VWdctLWHAWP9_mndOIvPbIOmfD2hmOkRLxwo0Bqq6m9pBE6EM5LYtI5SQs36is55Q7x23QR4KBJGiPwVFZrzNWDzSOX28HAJRK_RekrcGce0KvlsbiE242_CcM8DlpsHG6AaU_2n2MUIT6R4LDdoLysw' },
  { id: 2, name: 'Samsung Electronics', origin: 'Suwon, South Korea', code: 'BR-SAM-2024', products: 289, status: 'active', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaFoBRlqekdE1fCXbi3juVi9cmEiyWI3iygxeyXH-H3S88sXLiwRGe7FEOcJsj8IYZ_DyIKWR0O11zceySSd-VEFQ8y83f11NDt-yEojw_j8_WPLdz30wvyP2ImfN2VkXqiyI3s6cYS2pVe55B5Jj2_2a02RTRtgCibOsQm9dkNZCBK4MoIldLflUE-B-IuSH44ZzWSsqU7BBubrsCqVM5e6RLWF6MIMT6OJlBc0x6WWI9pVNcsMBZIEG-p21abYZVVZ89lQJACw' },
  { id: 3, name: 'Sony Corporation', origin: 'Tokyo, Japan', code: 'BR-SNY-2024', products: 156, status: 'paused', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgYjOrg-re7kXqQv4IWZOI_wcedvKt-bloYqj5AaQf3Hd-8uhfX1jP9WNBTyIGV9plUBTrAJNKkUu0Ef-W0OTrfTtPFx_pD0CKB0E2LIAuidM-3Ya_n_-wwPzmbum9x3KFq9N4EsGRe8LwH4H8YKZygNJO_2qclf1bCLo14bbCs7yvJe6Curxp0iWsPUOSwDs3EsM4FJ_TAooHYzNS9fP7YshNFGqSfkd1AzqJtEZWp3I9yfn0Tk_WxD3puP1MBiwXzMuvHgC-5g' },
  { id: 4, name: 'Dell Technologies', origin: 'Round Rock, Texas', code: 'BR-DEL-2024', products: 212, status: 'active', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB51zfyllZIdh3P9Wu6osjArhEGvGYK51OTj6I9U-P9oT_nUpPTbhnu0QC6Zjb-u7oPU5ehj1oOyIZ3aoQ8XIW6cEUYb5ydxQtcSmItrnmai78SUQYBu6JvIZuHrQoRkqIn571PWNPNrW9BYaEe0qeas9K0rCSV0TspxkZNDZgM8qeYTmUk3rj8URRUtYWOXl6o8yOQCvq935gZG99PDowaGOBkTG0Wg0zW82jSFqTaa17mCeWCnX3-LU8CAQda3NAWpHJoQlMxAA' },
];

const stats = [
  { label: 'Tổng thương hiệu', value: '48', icon: 'verified', color: 'text-primary', bg: 'bg-primary/10', badge: '+12%' },
  { label: 'Tổng sản phẩm', value: '1,204', icon: 'inventory', color: 'text-secondary', bg: 'bg-secondary/10' },
  { label: 'Thương hiệu bán chạy', value: 'Apple Inc.', icon: 'trending_up', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { label: 'Cập nhật cuối', value: '2 giờ trước', icon: 'update', color: 'text-slate-600', bg: 'bg-slate-100' },
];

const BrandList = () => {
  const [currentPage] = useState(1);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Quản lý Thương hiệu" />
        <div className="p-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span>Trang chủ</span>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-primary font-bold">Thương hiệu</span>
              </nav>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Quản lý Thương hiệu</h2>
              <p className="text-slate-500 mt-1">Danh sách các đối tác cung ứng công nghệ chính thức</p>
            </div>
            <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
              <span className="material-symbols-outlined">add_circle</span>
              Thêm Thương hiệu Mới
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className={`material-symbols-outlined ${stat.color} ${stat.bg} p-2 rounded-lg`}>{stat.icon}</span>
                  {stat.badge && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{stat.badge}</span>
                  )}
                </div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h3 className="font-bold text-lg">Danh sách Thương hiệu</h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-xs font-bold rounded-full text-slate-600">Tất cả (48)</span>
                  <span className="px-3 py-1 bg-emerald-50 text-xs font-bold rounded-full text-emerald-700">Đang hoạt động (42)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                  Bộ lọc
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">
                  <span className="material-symbols-outlined text-sm">download</span>
                  Xuất file
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    <th className="px-8 py-4">Thương hiệu</th>
                    <th className="px-6 py-4">Mã định danh</th>
                    <th className="px-6 py-4">Số sản phẩm</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-8 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {brandsData.map((brand) => (
                    <tr key={brand.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 p-2 flex items-center justify-center border border-slate-200/50">
                            <img className="w-full h-full object-contain" alt={brand.name} src={brand.logo} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{brand.name}</p>
                            <p className="text-xs text-slate-500">{brand.origin}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-mono text-xs text-slate-600 py-1 px-2 bg-blue-50 rounded">{brand.code}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{brand.products}</span>
                          <span className="text-[10px] text-slate-400">SKUs</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {brand.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                            Tạm ngưng
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Chỉnh sửa">
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Xóa">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="p-6 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
              <p className="text-sm text-slate-500">Hiển thị <span className="font-bold text-slate-900">1 - 10</span> trong số <span className="font-bold text-slate-900">48</span> thương hiệu</p>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-white text-slate-400 disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold">1</button>
                <button className="w-8 h-8 rounded-lg hover:bg-white text-sm font-bold text-slate-500">2</button>
                <button className="w-8 h-8 rounded-lg hover:bg-white text-sm font-bold text-slate-500">3</button>
                <span className="px-1 text-slate-400">...</span>
                <button className="w-8 h-8 rounded-lg hover:bg-white text-sm font-bold text-slate-500">5</button>
                <button className="p-2 rounded-lg hover:bg-white text-slate-400">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Strategic Partners */}
          <div className="mt-8">
            <h4 className="font-bold mb-4 uppercase text-[10px] tracking-widest text-slate-400">Đối tác Chiến lược</h4>
            <div className="flex flex-wrap gap-3">
              {['Qualcomm Authorized', 'Intel Titanium', 'NVIDIA Elite', 'AMD Sustainable'].map((partner, i) => (
                <div key={i} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-blue-200">
                  <span className="material-symbols-outlined text-sm">{['bolt', 'verified', 'diamond', 'eco'][i]}</span>
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrandList;
