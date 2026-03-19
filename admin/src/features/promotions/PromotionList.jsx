import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';

const promos = [
  { id: 1, title: 'Đại tiệc Apple M3 Pro', tags: ['MacBook', '-20%'], dates: '01/10/2024 - 15/10/2024', remaining: 'Còn lại: 12 ngày', status: 'active', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiklqYdWq55s7e-2k_xYcrZW4gyRtaELUnJU1xgPwjb4QtWtOtinFdw9IS2WRvq6tfVbmp2p3lvP8U-Ps5HcMHm0YxkWW5MQRYMxWHD6w-LTRenSL2-kIIaovcri3_C84EsiusDRYNiVHVz5HYA4Iwx1F9De7SJuSzxFgg6fo6wIxETmiFaPfHZ8_8HanqeCbBl08ZCRVZGjZtlCckXWQySq4pngdoce-Gomm4CeInk4GcXXiwn0u2-TqV4b1M7Q0fnBBHLJwEtg' },
  { id: 2, title: 'Phụ kiện Gaming High-End', tags: ['Gaming', 'Mua 1 tặng 1'], dates: '20/10/2024 - 31/10/2024', remaining: 'Sắp bắt đầu', status: 'scheduled', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQGN4oSkxfZ2IsqttA69PgTC4RB5Y3_2yORGCmQ9yXt3B9aQQcGkY22tWq4JnpYBLPQNnUTaM8S3clhDigxSXtAptXm0lsB73RVhdo2pOYaO3yCvoOdyblEDNxSUdyayNgjcr_GMmo-9uD0ldiw4XLoazQt8bBcxchkcHs6TFntWunGgQkYS694B1pz1N3IdCvCXpEUygDgbUUdBWpk46vxtK4WP16BT3K8ErPUTah8rNdkep9Qe3KvgUT2NoDz8VlMtJcKL6f2w' },
  { id: 3, title: 'Lễ hội Smart Home', tags: ['IoT'], dates: '01/09/2024 - 15/09/2024', remaining: 'Hết hạn 14 ngày trước', status: 'ended', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB58h4C8FtGY071uPmZyx5L82W0ahw8Y_0lIEIjHhxIN0dwnpoZw3SV9_5GWn1IfrCORRCdcOxhPg3MJR2Tf_uz5IXHbgVJDYnhNNaL4nhxhQBOAJToNth0btS-9Nk6HsFitREyL8PucQkcTUWSLlzFbpG-s8T_D3einUZLKbFmZ_wO8UQxXcCik73--lAylorhz9F0J285_yl3rjNnfKSsfYKKLnwAunzVBHxopYESYIMJ1GeMeQ3XfPOWC2ce2E82WhjXgAOiQg' },
];

const statusCfg = {
  active: { label: 'Đang diễn ra', cls: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  scheduled: { label: 'Chờ lịch', cls: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  ended: { label: 'Đã kết thúc', cls: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
};

const PromotionList = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 ml-64 min-h-screen">
      <Header title="Quản lý Khuyến mãi" />
      <div className="p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <nav className="flex gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest"><span>Quản lý</span><span>/</span><span className="text-primary">Khuyến mãi</span></nav>
            <h2 className="text-3xl font-bold tracking-tight">Danh sách Khuyến mãi</h2>
          </div>
          <button className="bg-gradient-to-br from-pink-600 to-rose-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-pink-500/20 hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined">add_circle</span>Tạo Khuyến mãi mới
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[{ l: 'Tổng chiến dịch', v: '24', i: 'campaign', c: 'text-primary bg-blue-50', b: '+12%' }, { l: 'Đang hoạt động', v: '08', i: 'bolt', c: 'text-pink-600 bg-pink-50' }, { l: 'Chờ lịch', v: '05', i: 'schedule', c: 'text-slate-600 bg-slate-100' }, { l: 'Đã kết thúc', v: '11', i: 'history', c: 'text-slate-500 bg-slate-100' }].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                <span className={`material-symbols-outlined p-2 rounded-lg ${s.c}`}>{s.i}</span>
                {s.b && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{s.b}</span>}
              </div>
              <div className="mt-4">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{s.l}</p>
                <p className="text-3xl font-bold">{s.v}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left"><thead><tr className="bg-slate-50">
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Banner & Tiêu đề</th>
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Thời gian</th>
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Trạng thái</th>
            <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Hành động</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {promos.map(p => { const st = statusCfg[p.status]; return (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6"><div className="flex items-center gap-6">
                  <div className={`relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 group-hover:shadow-md transition-shadow ${p.status === 'ended' ? 'grayscale opacity-60' : ''}`}>
                    <img alt={p.title} className="w-full h-full object-cover" src={p.img} />
                  </div>
                  <div>
                    <p className={`font-bold text-lg mb-1 ${p.status === 'ended' ? 'text-slate-400 line-through' : ''}`}>{p.title}</p>
                    <div className="flex gap-2">{p.tags.map((t, i) => <span key={i} className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase ${p.status === 'ended' ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-700'}`}>{t}</span>)}</div>
                  </div>
                </div></td>
                <td className="px-8 py-6"><div className="flex items-center gap-2 text-sm font-semibold"><span className="material-symbols-outlined text-xs">event</span>{p.dates}</div><p className={`text-xs mt-1 ${p.status === 'ended' ? 'text-red-500' : 'text-slate-500'}`}>{p.remaining}</p></td>
                <td className="px-8 py-6"><span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${st.cls}`}><span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>{st.label}</span></td>
                <td className="px-8 py-6 text-right"><div className="flex justify-end gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-primary transition-all active:scale-90"><span className="material-symbols-outlined">{p.status === 'ended' ? 'archive' : 'edit'}</span></button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"><span className="material-symbols-outlined">delete</span></button>
                </div></td>
              </tr>);
            })}
          </tbody></table>
          <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hiển thị 1-3 của 24</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200">Trước</button>
              <button className="px-4 py-2 rounded-lg text-xs font-bold bg-primary text-white shadow-md">1</button>
              <button className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200">2</button>
              <button className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200">Sau</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default PromotionList;
