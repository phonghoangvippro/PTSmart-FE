import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';

const contacts = [
  { id: 1, name: 'Nguyễn Hoàng Nam', initials: 'NH', color: 'bg-blue-100 text-blue-700', email: 'nam.nguyen@gmail.com', phone: '090 123 4567', topic: 'Bảo hành', topicColor: 'bg-blue-50 text-blue-700', message: 'Lỗi màn hình iPhone 15 Pro Max...', date: '15/05/2024', status: 'pending' },
  { id: 2, name: 'Lê Thị Thu Thảo', initials: 'LT', color: 'bg-pink-100 text-pink-700', email: 'thao.le@yahoo.com', phone: '098 765 4321', topic: 'Tư vấn mua hàng', topicColor: 'bg-slate-100 text-slate-600', message: 'Hỏi về trả góp MacBook M3', date: '14/05/2024', status: 'resolved' },
  { id: 3, name: 'Phạm Văn Mạnh', initials: 'PV', color: 'bg-emerald-100 text-emerald-700', email: 'manh.pham@outlook.com', phone: '034 556 7890', topic: 'Khiếu nại', topicColor: 'bg-blue-50 text-blue-700', message: 'Giao hàng chậm trễ đơn #8821', date: '14/05/2024', status: 'pending' },
  { id: 4, name: 'Trần Diệu Linh', initials: 'TD', color: 'bg-indigo-100 text-indigo-700', email: 'linh.td@gmail.com', phone: '091 223 3344', topic: 'Hợp tác', topicColor: 'bg-slate-100 text-slate-600', message: 'Đề xuất cung ứng linh kiện', date: '13/05/2024', status: 'resolved' },
];

const statusCfg = {
  pending: { label: 'Pending', cls: 'text-yellow-600 bg-yellow-50', dot: 'bg-yellow-500' },
  resolved: { label: 'Resolved', cls: 'text-green-600 bg-green-50', dot: 'bg-green-500' },
};

const ContactList = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 ml-64 min-h-screen">
      <Header title="Yêu cầu liên hệ" />
      <div className="p-8">
        <div className="mb-8 flex flex-col md:flex-row items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Yêu cầu liên hệ</h2>
            <p className="text-slate-500">Quản lý và phản hồi các yêu cầu từ khách hàng PTSmart.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-2 border border-slate-200">
              <span className="material-symbols-outlined text-xl">filter_list</span>Bộ lọc
            </button>
            <button className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">download</span>Xuất báo cáo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[{ l: 'Tổng yêu cầu', v: '1,284', bc: 'border-b-4 border-blue-500' }, { l: 'Đang chờ', v: '42', bc: 'border-b-4 border-yellow-500' }, { l: 'Đã xử lý', v: '1,242', bc: 'border-b-4 border-green-500' }, { l: 'Thời gian TB', v: '14m', bc: 'border-b-4 border-pink-500' }].map((s, i) => (
            <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 ${s.bc}`}>
              <p className="text-slate-500 text-sm font-bold mb-1">{s.l}</p>
              <h3 className="text-3xl font-bold">{s.v}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left"><thead><tr className="bg-slate-50">
            <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Khách hàng</th>
            <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Liên hệ</th>
            <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Chủ đề</th>
            <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Ngày gửi</th>
            <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Trạng thái</th>
            <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Thao tác</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {contacts.map(c => { const st = statusCfg[c.status]; return (
              <tr key={c.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-5"><div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${c.color}`}>{c.initials}</div><span className="font-bold">{c.name}</span></div></td>
                <td className="px-6 py-5 text-sm"><p>{c.email}</p><p className="text-slate-500">{c.phone}</p></td>
                <td className="px-6 py-5"><span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${c.topicColor}`}>{c.topic}</span><p className="text-sm mt-1 text-slate-600 truncate max-w-[200px]">{c.message}</p></td>
                <td className="px-6 py-5 text-sm text-slate-600">{c.date}</td>
                <td className="px-6 py-5"><div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${st.cls}`}><span className={`w-2 h-2 rounded-full ${st.dot}`}></span><span className="text-xs font-bold uppercase">{st.label}</span></div></td>
                <td className="px-6 py-5 text-right"><div className="flex justify-end gap-2">
                  <button className="p-2 text-primary hover:bg-blue-100 rounded-lg transition-colors"><span className="material-symbols-outlined">visibility</span></button>
                  <button className={`p-2 rounded-lg transition-colors ${c.status === 'pending' ? 'text-pink-600 hover:bg-pink-50' : 'text-slate-300 cursor-not-allowed'}`}><span className="material-symbols-outlined">reply</span></button>
                </div></td>
              </tr>);
            })}
          </tbody></table>
          <div className="px-6 py-5 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
            <p className="text-sm text-slate-500">Hiển thị 1-4 trên 1,284 yêu cầu</p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg hover:bg-white text-slate-400 flex items-center justify-center"><span className="material-symbols-outlined text-xl">chevron_left</span></button>
              <button className="w-8 h-8 rounded-lg bg-primary text-white font-bold text-sm flex items-center justify-center">1</button>
              <button className="w-8 h-8 rounded-lg hover:bg-white text-slate-600 text-sm flex items-center justify-center">2</button>
              <button className="w-8 h-8 rounded-lg hover:bg-white text-slate-600 text-sm flex items-center justify-center">3</button>
              <button className="w-8 h-8 rounded-lg hover:bg-white text-slate-400 flex items-center justify-center"><span className="material-symbols-outlined text-xl">chevron_right</span></button>
            </div>
          </div>
        </div>

        <div className="mt-8 p-8 bg-gradient-to-br from-primary to-blue-500 rounded-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div><h4 className="text-2xl font-bold text-white mb-2">Tự động phản hồi?</h4><p className="text-white/80 max-w-lg">Kích hoạt AI hỗ trợ phản hồi nhanh cho các yêu cầu tư vấn mua hàng và bảo hành.</p></div>
            <button className="px-8 py-3 bg-white text-primary font-bold rounded-full shadow-xl hover:scale-105 transition-transform whitespace-nowrap">THIẾT LẬP NGAY</button>
          </div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </main>
  </div>
);

export default ContactList;
