import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getContacts, markContactAsRead } from './contactAPI';

const statusCfg = {
  pending: { label: 'Chờ xử lý', cls: 'text-yellow-600 bg-yellow-50', dot: 'bg-yellow-500' },
  resolved: { label: 'Đã xử lý', cls: 'text-green-600 bg-green-50', dot: 'bg-green-500' },
};

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [unresolvedCount, setUnresolvedCount] = useState(0);

  const fetchContacts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await getContacts(page);
      setContacts(data.data || []);
      setCurrentPage(data.current_page || 1);
      setTotalPages(data.last_page || 1);
      setTotalItems(data.total || 0);
      
      // Calculate pending using a rough estimate if there is no endpoint for stats
      if (data.data) {
        setUnresolvedCount(data.data.filter(c => !c.is_read || c.status === 'pending').length);
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts(currentPage);
  }, [fetchContacts, currentPage]);

  const handleMarkAsRead = async (id) => {
    try {
      await markContactAsRead(id);
      // Update local state instead of refetching for better UX
      setContacts((prev) => 
        prev.map(c => 
          c.id === id 
            ? { ...c, is_read: 1, status: 'resolved' } 
            : c
        )
      );
    } catch (err) {
      alert('Đã xảy ra lỗi: ' + err.message);
    }
  };

  const pagesArray = [];
  for (let i = 1; i <= totalPages; i++) {
    pagesArray.push(i);
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Yêu cầu liên hệ" />
        <div className="p-8">
          <div className="mb-8 flex flex-col md:flex-row items-end justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                <span>Quản lý</span>
                <span>/</span>
                <span className="text-primary">Liên hệ</span>
              </nav>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Yêu cầu liên hệ</h2>
              <p className="text-slate-500">Quản lý và phản hồi các yêu cầu từ khách hàng PTSmart.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { l: 'Tổng yêu cầu', v: totalItems, bc: 'border-b-4 border-blue-500' }, 
              { l: 'Đang chờ xem', v: unresolvedCount, bc: 'border-b-4 border-yellow-500' }, 
              { l: 'Đã xử lý', v: totalItems - unresolvedCount, bc: 'border-b-4 border-green-500' }
            ].map((s, i) => (
              <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 ${s.bc}`}>
                <p className="text-slate-500 text-sm font-bold mb-1">{s.l}</p>
                <h3 className="text-3xl font-bold">{s.v}</h3>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                <span className="ml-3 font-semibold text-slate-500">Đang tải...</span>
              </div>
            ) : (
              <>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Khách hàng</th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Liên hệ</th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Chủ đề</th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Ngày gửi</th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Trạng thái</th>
                      <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {contacts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-slate-500">Không có yêu cầu liên hệ nào.</td>
                      </tr>
                    ) : (
                      contacts.map(c => { 
                        // Mặc định hoặc dọn chuẩn trạng thái nếu backend trả về is_read boolean hay 0/1
                        const isRead = c.is_read || c.status === 'resolved' || c.status === 1;
                        const statusKey = isRead ? 'resolved' : 'pending';
                        const st = statusCfg[statusKey]; 
                        const initials = c.name ? c.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'C';

                        return (
                          <tr key={c.id} className={`hover:bg-blue-50/30 transition-colors ${!isRead ? 'bg-slate-50/50' : ''}`}>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                  {initials}
                                </div>
                                <span className={!isRead ? "font-bold" : "font-medium"}>{c.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-sm">
                              <p>{c.email}</p>
                              <p className="text-slate-500">{c.phone}</p>
                            </td>
                            <td className="px-6 py-5">
                              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-blue-50 text-blue-700">
                                {c.subject || c.topic || 'Liên hệ'}
                              </span>
                              <p className={`text-sm mt-1 truncate max-w-[200px] ${!isRead ? 'font-bold text-slate-800' : 'text-slate-600'}`}>{c.message}</p>
                            </td>
                            <td className="px-6 py-5 text-sm text-slate-600">
                              {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-5">
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${st.cls}`}>
                                <span className={`w-2 h-2 rounded-full ${st.dot}`}></span>
                                <span className="text-xs font-bold uppercase">{st.label}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex justify-end gap-2">
                                {!isRead && (
                                  <button 
                                    onClick={() => handleMarkAsRead(c.id)} 
                                    className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                    title="Đánh dấu đã đọc"
                                  >
                                    <span className="material-symbols-outlined text-sm">done_all</span> Đã đọc
                                  </button>
                                )}
                                <a href={`mailto:${c.email}`} className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-blue-50 transition-colors">
                                  <span className="material-symbols-outlined">reply</span>
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                {totalPages > 1 && (
                  <div className="px-6 py-5 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
                    <p className="text-sm text-slate-500">Hiển thị yêu cầu trang {currentPage}/{totalPages}</p>
                    <div className="flex items-center gap-1">
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="w-8 h-8 rounded-lg hover:bg-white text-slate-400 flex items-center justify-center disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-xl">chevron_left</span>
                      </button>
                      
                      {pagesArray.map(page => (
                        <button 
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg font-bold text-sm flex items-center justify-center transition-colors ${currentPage === page ? 'bg-primary text-white' : 'hover:bg-white text-slate-600'}`}
                        >
                          {page}
                        </button>
                      ))}

                      <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="w-8 h-8 rounded-lg hover:bg-white text-slate-400 flex items-center justify-center disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-xl">chevron_right</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactList;
