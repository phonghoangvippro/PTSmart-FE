import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';

const branches = [
  { id: 1, name: 'PTSmart Quận 1', abbr: 'Q1', type: 'Flagship Store', address: '123 Lê Lợi, Phường Bến Thành, Quận 1, TP. HCM', hotline: '1900 1234 (Ext 1)', hours: '08:00 - 22:00', status: 'active' },
  { id: 2, name: 'PTSmart Cầu Giấy', abbr: 'CG', type: 'Showroom & Service', address: '456 Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội', hotline: '1900 1234 (Ext 2)', hours: '08:30 - 21:30', status: 'active' },
  { id: 3, name: 'PTSmart Hoàn Kiếm', abbr: 'HK', type: 'Concept Store', address: '15 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội', hotline: '1900 1234 (Ext 3)', hours: '09:00 - 22:00', status: 'maintenance' },
  { id: 4, name: 'PTSmart Đà Nẵng', abbr: 'DN', type: 'Regional Hub', address: '78 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng', hotline: '1900 1234 (Ext 4)', hours: '08:00 - 21:00', status: 'active' },
];

const statusCfg = {
  active: { label: 'Hoạt động', cls: 'text-green-600 bg-green-50 border-green-100', dot: 'bg-green-500' },
  maintenance: { label: 'Sửa chữa', cls: 'text-pink-600 bg-pink-50 border-pink-100', dot: 'bg-pink-500' },
};

const BranchList = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 ml-64 min-h-screen">
      <Header title="Quản lý Chi nhánh" />
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">Hệ thống PTSmart</p>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý Chi nhánh</h2>
            <p className="text-slate-500 mt-1 max-w-md">Quản lý danh sách các điểm giao dịch, bảo hành và cửa hàng bán lẻ trên toàn quốc.</p>
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined">add_location</span>Thêm Chi Nhánh Mới
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
            <div className="z-10 relative">
              <p className="text-slate-500 text-sm font-medium">Tổng số chi nhánh</p>
              <h3 className="text-5xl font-bold mt-2">24</h3>
              <p className="text-emerald-600 text-xs font-bold mt-4 flex items-center gap-1"><span className="material-symbols-outlined text-sm">trending_up</span>+2 tháng này</p>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-slate-50 group-hover:text-blue-50 transition-colors">domain</span>
          </div>
          <div className="col-span-12 lg:col-span-8 bg-primary rounded-2xl p-1 overflow-hidden shadow-xl shadow-primary/10">
            <div className="bg-blue-600 h-full rounded-xl p-6 flex items-center justify-between text-white">
              <div className="max-w-md">
                <h4 className="text-2xl font-bold mb-2">Bản đồ mật độ hệ thống</h4>
                <p className="text-sm opacity-80">PTSmart đang mở rộng mạnh mẽ tại khu vực miền Trung và Tây Nguyên trong quý 3/2024.</p>
                <button className="mt-4 text-sm font-bold underline underline-offset-4 hover:opacity-70">Xem báo cáo chi tiết</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left"><thead><tr className="bg-slate-50">
            <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tên Chi Nhánh</th>
            <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Địa Chỉ</th>
            <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hotline</th>
            <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Giờ Mở Cửa</th>
            <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Trạng Thái</th>
            <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao Tác</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {branches.map(b => { const st = statusCfg[b.status]; return (
              <tr key={b.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary font-bold">{b.abbr}</div><div><p className="font-bold">{b.name}</p><p className="text-xs text-slate-500 mt-0.5">{b.type}</p></div></div></td>
                <td className="px-6 py-6 text-sm text-slate-500 max-w-xs">{b.address}</td>
                <td className="px-6 py-6 font-medium text-sm">{b.hotline}</td>
                <td className="px-6 py-6"><span className="bg-slate-100 px-3 py-1 rounded text-xs font-bold">{b.hours}</span></td>
                <td className="px-6 py-6 text-center"><span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${st.cls}`}><span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>{st.label}</span></td>
                <td className="px-8 py-6 text-right"><div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-500 hover:bg-blue-50 hover:text-primary rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                  <button className="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                </div></td>
              </tr>);
            })}
          </tbody></table>
          <div className="px-8 py-5 border-t border-slate-100 flex justify-between items-center">
            <p className="text-xs text-slate-500">Hiển thị 1-4 của 24 chi nhánh</p>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 flex items-center justify-center"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
              <button className="w-8 h-8 rounded-lg bg-primary text-white font-bold text-xs flex items-center justify-center">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-50 text-slate-500 text-xs flex items-center justify-center">2</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 flex items-center justify-center"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default BranchList;
