import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';

const flashSalesData = [
  { id: 1, name: 'Midnight Tech Rush', code: 'FS-2024-001', dates: '24/05/2024 - 25/05/2024', time: '00:00 - 02:00 (2 Giờ)', products: 42, status: 'running', icon: 'bolt', iconBg: 'bg-blue-50 text-blue-600' },
  { id: 2, name: 'Summer Gadget Carnival', code: 'FS-2024-002', dates: '01/06/2024 - 03/06/2024', time: '09:00 - 21:00 (Hàng ngày)', products: 15, status: 'upcoming', icon: 'stars', iconBg: 'bg-pink-50 text-pink-600' },
  { id: 3, name: 'Weekly Clearance', code: 'FS-2024-003', dates: '15/05/2024 - 17/05/2024', time: 'Kết thúc lúc 23:59', products: 8, status: 'ended', icon: 'schedule', iconBg: 'bg-slate-200 text-slate-500' },
];

const statusCfg = {
  running: { label: 'Đang chạy', cls: 'bg-emerald-100 text-emerald-700' },
  upcoming: { label: 'Sắp diễn ra', cls: 'bg-blue-100 text-blue-700' },
  ended: { label: 'Đã kết thúc', cls: 'bg-slate-200 text-slate-600' },
};

const FlashSaleList = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 ml-64 min-h-screen">
      <Header title="Quản lý Flash Sale" />
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">Campaign Management</p>
            <h2 className="text-3xl font-bold tracking-tight">Flash Sale</h2>
            <p className="text-slate-500 mt-1">Quản lý các chiến dịch giảm giá chớp nhoáng.</p>
          </div>
          <button className="bg-gradient-to-br from-pink-600 to-rose-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-pink-500/20 hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined">add_circle</span> Thêm Flash Sale
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[{ l: 'Đang Diễn Ra', v: '03', b: '+12%', bc: 'border-l-4 border-blue-600' }, { l: 'Sắp Diễn Ra', v: '12' }, { l: 'Sản Phẩm Tham Gia', v: '1,204' }, { l: 'Tổng Doanh Thu', v: '4.2B ₫' }].map((s, i) => (
            <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 ${s.bc || ''}`}>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{s.l}</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{s.v}</span>
                {s.b && <span className="text-emerald-500 text-xs font-bold mb-1 flex items-center"><span className="material-symbols-outlined text-sm">trending_up</span>{s.b}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg">Danh Sách Chiến Dịch</h3>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg bg-slate-100 text-sm font-bold flex items-center gap-2 hover:bg-slate-200"><span className="material-symbols-outlined text-sm">filter_list</span>Bộ lọc</button>
              <button className="px-4 py-2 rounded-lg bg-slate-100 text-sm font-bold flex items-center gap-2 hover:bg-slate-200"><span className="material-symbols-outlined text-sm">file_download</span>Xuất</button>
            </div>
          </div>
          <table className="w-full text-left"><thead><tr className="bg-slate-50">
            <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Chiến Dịch</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Thời Gian</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">SP</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-center">Trạng Thái</th>
            <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Thao Tác</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {flashSalesData.map(r => { const st = statusCfg[r.status]; return (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6"><div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-lg flex items-center justify-center ${r.iconBg}`}><span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>{r.icon}</span></div><div><p className="font-bold">{r.name}</p><p className="text-xs text-slate-500 mt-1">ID: {r.code}</p></div></div></td>
                <td className="px-6 py-6 text-sm"><p className="font-medium">{r.dates}</p><p className="text-xs text-slate-500">{r.time}</p></td>
                <td className="px-6 py-6"><div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">+{r.products}</div></td>
                <td className="px-6 py-6 text-center"><span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase ${st.cls}`}>{st.label}</span></td>
                <td className="px-8 py-6 text-right"><div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"><span className="material-symbols-outlined text-xl">edit_square</span></button><button className="p-2 rounded-lg hover:bg-red-50 text-red-500"><span className="material-symbols-outlined text-xl">delete</span></button></div></td>
              </tr>);
            })}
          </tbody></table>
          <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center">
            <p className="text-xs text-slate-500">Hiển thị 1-3 của 12</p>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 flex items-center justify-center"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
              <button className="w-8 h-8 rounded-lg bg-primary text-white font-bold text-xs flex items-center justify-center">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-50 text-slate-500 text-xs flex items-center justify-center">2</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 flex items-center justify-center"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 rounded-2xl p-8 flex gap-6 items-start border border-blue-100">
            <div className="bg-primary text-white p-3 rounded-xl"><span className="material-symbols-outlined">lightbulb</span></div>
            <div>
              <h4 className="font-bold text-lg text-blue-900">Mẹo tối ưu Flash Sale</h4>
              <p className="text-blue-800/70 mt-2 text-sm">Chiến dịch khung 20h-22h có tỉ lệ chuyển đổi cao hơn 35%.</p>
            </div>
          </div>
          <div className="bg-pink-50 rounded-2xl p-8 flex gap-6 items-start border border-pink-100">
            <div className="bg-pink-600 text-white p-3 rounded-xl"><span className="material-symbols-outlined">warning</span></div>
            <div>
              <h4 className="font-bold text-lg text-pink-900">Cảnh báo tồn kho</h4>
              <p className="text-pink-800/70 mt-2 text-sm">5 sản phẩm "Summer Gadget Carnival" tồn kho thấp (&lt;10).</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default FlashSaleList;
