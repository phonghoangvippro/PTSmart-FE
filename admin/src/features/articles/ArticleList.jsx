import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';

const articles = [
  { id: 1, title: 'Trên tay MacBook Pro M3: Sức mạnh đồ họa vượt trội', tag: 'Review', author: 'Lê Minh Tuấn', date: '24/10/2023', views: '12,405', thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUKF8Z8jyqJ8l-nBMfH2bPO6tNtL7j5a952-NGnczDIXmVlQ91lnnuSoSPAcExs9B2VLQ7CcspogyLqmnBM2h7RDb0cKSBUtvIklGCmP77L2GFhi9OzCDi2odv-KAxEiDDaw_Jjq4ZKsh4j3NGLbtg_eMZRLmosH6KgN7PmjiSpfZtmr1YfX8rl3Cr6OiFQX-vzYEhSX7CKF8Rik4sXsOoeFJ-cQgIHddTjff5dkJ1HY9bKyhl3C8dJoTmTtKFr2LKdevO43oLgA' },
  { id: 2, title: 'iPhone 15 Pro Max vs S23 Ultra: Đâu là ông vua nhiếp ảnh?', tag: 'So Sánh', author: 'Nguyễn Thu Hà', date: '22/10/2023', views: '8,920', thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhk7WAUBipadvqpbxY87-q-oqwlGmg9FGi4h7NN7DiUpa2zpKP4IhOStpXvI-YDg48E3HVdVaWTm4Ef_x794j5zHtZB_ufLIWgEtZvQdDTxsnN3Fqjb0B0JAB7gHDB-i-VXbIfay5FT9wJnY_NQH8uNC6MYoJveUmWMXy201yNnKKnVZ44F9aO5Iet-x-rfPw3WcHDMRJJRFoZ3wdLiK4fIxOkf-6n4DmLBjvPbfkxmvHb3nWlwtXsX8X3SLUOWlSB6zDNve_PGA' },
  { id: 3, title: 'Tổng hợp các mẫu iPad đáng mua nhất cuối năm 2023', tag: 'Tư Vấn', author: 'Trần Hoàng Long', date: '20/10/2023', views: '5,310', thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIkcUbc-Bhh2V-5QcQi-_R9yP2MsQHUopPMd-jgti8NG-KoLHjKWFR91xS3X0srq-_9NwaW0_3kjOhvZT5AwC6eDF9Xw-LOyfTEdqxJBYF4HlK-E6HxadZ9Q_aqMzIV5PasTHQV-jPXILW4WCUY64ykMo6WfsEhUp3JLUmDoppXaYqAhZt_2xdiIeONs2DT8MmGivB7nAkvXb_tjs-4umPA8khBoR0FblNsVU4InwlUKr6Zg62zjInPv3yOj4IZNV4IrNmNqRkrA' },
  { id: 4, title: 'Lý do vì sao bạn nên sở hữu tai nghe chống ồn chủ động', tag: 'Kiến Thức', author: 'Lê Minh Tuấn', date: '18/10/2023', views: '3,450', thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD13VlRuDb4N7G4PdqaVamKKimqA4Veint-8AgA_7-L86YSoRrpIvJ2sgwIj1JXDtPk3H9R0KBgzT6fXIA2MpcijsgCr7j0lQ1HZtSTZsKQSyQG9zTfjFqFIf5e433UluXygiJj3L4sqb86uiowet_iWkkeJiHX52RiRMvlu_Zkj5EeSH6_GUTLT4eywzndGp5lCDXmzvuxE5wNFcpDzKuB7PSclF8pKkXxhN_KFNw1pfCBr-9uwQR-JjhUNrBXk4cJPx0ENCQEJg' },
];

const stats = [
  { label: 'Tổng bài viết', value: '1,284', sub: '+12% tháng này', subIcon: 'trending_up', subColor: 'text-emerald-600' },
  { label: 'Lượt xem bài', value: '42.5K', sub: 'Sắc nét & Hiệu quả', subIcon: 'visibility', subColor: 'text-primary' },
  { label: 'Thời gian đọc TB', value: '4:20', sub: 'Tối ưu trải nghiệm', subIcon: 'timer', subColor: 'text-slate-400' },
  { label: 'Bản nháp', value: '14', sub: 'Cần hoàn thiện', subIcon: 'edit_note', subColor: 'text-pink-600', border: 'border-l-4 border-pink-600' },
];

const ArticleList = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 ml-64 min-h-screen">
      <Header title="Quản lý Bài viết" />
      <div className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <nav className="flex text-xs text-slate-500 gap-2 mb-2"><span>Admin</span><span>/</span><span className="text-primary font-semibold">Bài viết</span></nav>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý Bài viết</h2>
            <p className="text-slate-500 mt-1 max-w-lg">Cập nhật tin tức công nghệ, đánh giá sản phẩm và xu hướng thiết bị điện tử mới nhất.</p>
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined">add</span> Viết bài mới
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 ${s.border || ''}`}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.border ? 'text-pink-600' : ''}`}>{s.value}</p>
              <div className={`mt-4 flex items-center gap-2 text-xs font-bold ${s.subColor}`}>
                <span className="material-symbols-outlined text-sm">{s.subIcon}</span><span>{s.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead><tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              <th className="px-8 py-5">Bài viết</th><th className="px-6 py-5">Tác giả</th><th className="px-6 py-5">Ngày đăng</th><th className="px-6 py-5">Lượt xem</th><th className="px-6 py-5 text-right">Thao tác</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map(a => (
                <tr key={a.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <img alt={a.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" src={a.thumb} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-snug hover:text-primary transition-colors cursor-pointer">{a.title}</h4>
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold mt-1 inline-block">{a.tag}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6"><span className="text-sm font-medium">{a.author}</span></td>
                  <td className="px-6 py-6 text-sm text-slate-500">{a.date}</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <span className="material-symbols-outlined text-primary text-base">visibility</span>{a.views}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-blue-50 transition-all"><span className="material-symbols-outlined text-xl">edit</span></button>
                      <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-pink-50 transition-all"><span className="material-symbols-outlined text-xl">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-8 py-5 bg-slate-50 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang hiển thị 1-4 trên tổng 1,284 bài viết</span>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg border border-slate-200 hover:bg-white"><span className="material-symbols-outlined">chevron_left</span></button>
              <button className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm shadow-md">1</button>
              <button className="px-4 py-2 rounded-lg bg-white text-slate-600 font-bold text-sm hover:bg-slate-100">2</button>
              <button className="px-4 py-2 rounded-lg bg-white text-slate-600 font-bold text-sm hover:bg-slate-100">3</button>
              <button className="p-2 rounded-lg border border-slate-200 hover:bg-white"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default ArticleList;
