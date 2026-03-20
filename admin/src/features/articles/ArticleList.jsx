import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getArticles, createArticle, updateArticle, deleteArticle } from './articleAPI';

const API_BASE = 'http://192.168.0.243:8000';
const catLabels = { 'huong-dan': 'Hướng dẫn', 'review': 'Review', 'so-sanh': 'So sánh', 'tu-van': 'Tư vấn', 'tin-tuc': 'Tin tức', 'kien-thuc': 'Kiến thức' };
const catColors = { 'huong-dan': 'bg-emerald-50 text-emerald-700', 'review': 'bg-blue-50 text-blue-700', 'so-sanh': 'bg-purple-50 text-purple-700', 'tu-van': 'bg-amber-50 text-amber-700', 'tin-tuc': 'bg-pink-50 text-pink-700', 'kien-thuc': 'bg-teal-50 text-teal-700' };

const emptyForm = { title: '', content: '', excerpt: '', category: 'tin-tuc', read_time: '', is_feature: false, status: 1, published_at: '' };

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0, from: 0, to: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchArticles = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getArticles(page);
      setArticles(res.data || []);
      setPagination({ currentPage: res.current_page, lastPage: res.last_page, total: res.total, from: res.from || 0, to: res.to || 0 });
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const openCreate = () => {
    setEditingArticle(null);
    setForm(emptyForm);
    setThumbnail(null);
    setThumbnailPreview('');
    setError(null);
    setShowModal(true);
  };

  const openEdit = (article) => {
    setEditingArticle(article);
    setForm({
      title: article.title || '',
      content: article.content || '',
      excerpt: article.excerpt || '',
      category: article.category || 'tin-tuc',
      read_time: article.read_time || '',
      is_feature: article.is_feature || false,
      status: article.status ?? 1,
      published_at: article.published_at ? article.published_at.split('T')[0] : '',
    });
    setThumbnail(null);
    setThumbnailPreview(article.thumbnail ? `${API_BASE}${article.thumbnail}` : '');
    setError(null);
    setShowModal(true);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Tiêu đề không được để trống'); return; }
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('content', form.content);
      if (form.excerpt) fd.append('excerpt', form.excerpt);
      if (form.category) fd.append('category', form.category);
      if (form.read_time) fd.append('read_time', form.read_time);
      fd.append('is_feature', form.is_feature ? 'true' : 'false');
      fd.append('status', String(form.status));
      if (form.published_at) fd.append('published_at', form.published_at);
      if (thumbnail) fd.append('thumbnail', thumbnail);

      if (editingArticle) {
        await updateArticle(editingArticle.id, fd);
      } else {
        await createArticle(fd);
      }
      setShowModal(false);
      fetchArticles(pagination.currentPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Xóa bài viết "${title}"?`)) return;
    setDeleting(id);
    try {
      await deleteArticle(id);
      fetchArticles(pagination.currentPage);
    } catch (err) {
      alert('Xóa thất bại: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const filteredArticles = articles.filter(a => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return a.title.toLowerCase().includes(q);
  });

  const publishedCount = articles.filter(a => a.status === 1).length;
  const draftCount = articles.filter(a => a.status === 0).length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Quản lý Bài viết" />
        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <nav className="flex text-xs text-slate-500 gap-2 mb-2"><span>Admin</span><span>/</span><span className="text-primary font-semibold">Bài viết</span></nav>
              <h2 className="text-3xl font-bold tracking-tight">Quản lý Bài viết</h2>
              <p className="text-slate-500 mt-1 max-w-lg">Cập nhật tin tức công nghệ, đánh giá sản phẩm và xu hướng thiết bị điện tử mới nhất.</p>
            </div>
            <button onClick={openCreate} className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
              <span className="material-symbols-outlined">add</span> Viết bài mới
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Tổng bài viết', value: pagination.total, icon: 'description', color: 'text-primary' },
              { label: 'Đã xuất bản', value: publishedCount, icon: 'check_circle', color: 'text-emerald-600' },
              { label: 'Bản nháp', value: draftCount, icon: 'edit_note', color: 'text-pink-600' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">{s.value}</p>
                  <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
            <div className="relative max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400" placeholder="Tìm kiếm bài viết..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
              </div>
            ) : (
              <>
                <table className="w-full text-left">
                  <thead><tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    <th className="px-8 py-5">Bài viết</th><th className="px-6 py-5">Danh mục</th><th className="px-6 py-5">Ngày đăng</th><th className="px-6 py-5">Trạng thái</th><th className="px-6 py-5 text-right">Thao tác</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredArticles.length === 0 ? (
                      <tr><td colSpan="5" className="px-8 py-16 text-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2 block">description</span>
                        Chưa có bài viết nào
                      </td></tr>
                    ) : (
                      filteredArticles.map(a => (
                        <tr key={a.id} className="group hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              {a.thumbnail && (
                                <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                                  <img alt={a.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" src={`${API_BASE}${a.thumbnail}`} />
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-slate-900 leading-snug">{a.title}</h4>
                                {a.excerpt && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{a.excerpt}</p>}
                                {a.read_time && <span className="text-[10px] text-slate-400">{a.read_time} đọc</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${catColors[a.category] || 'bg-slate-100 text-slate-600'}`}>
                              {catLabels[a.category] || a.category || '—'}
                            </span>
                          </td>
                          <td className="px-6 py-6 text-sm text-slate-500">
                            {a.published_at ? new Date(a.published_at).toLocaleDateString('vi-VN') : (a.created_at ? new Date(a.created_at).toLocaleDateString('vi-VN') : '—')}
                          </td>
                          <td className="px-6 py-6">
                            {a.status === 1 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-600">
                                <span className="size-1.5 rounded-full bg-green-500"></span>Xuất bản
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                                <span className="size-1.5 rounded-full bg-slate-400"></span>Nháp
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => openEdit(a)} className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-blue-50 transition-all"><span className="material-symbols-outlined text-xl">edit</span></button>
                              <button onClick={() => handleDelete(a.id, a.title)} disabled={deleting === a.id} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-pink-50 transition-all disabled:opacity-50">
                                <span className="material-symbols-outlined text-xl">{deleting === a.id ? 'progress_activity' : 'delete'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="px-8 py-5 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {pagination.total > 0
                      ? `Hiển thị ${pagination.from}-${pagination.to} trên ${pagination.total} bài viết`
                      : 'Không có bài viết'}
                  </span>
                  {pagination.lastPage > 1 && (
                    <div className="flex gap-2">
                      <button onClick={() => fetchArticles(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1} className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50">
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>
                      {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => fetchArticles(p)} className={`px-4 py-2 rounded-lg font-bold text-sm ${p === pagination.currentPage ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
                          {p}
                        </button>
                      ))}
                      <button onClick={() => fetchArticles(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.lastPage} className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50">
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 mx-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">{editingArticle ? 'edit' : 'add'}</span>
              {editingArticle ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Tiêu đề *</label>
                <input type="text" className="w-full rounded-lg border-slate-200 h-11 px-4" placeholder="Nhập tiêu đề bài viết" value={form.title} onChange={e => setField('title', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Tóm tắt</label>
                <input type="text" className="w-full rounded-lg border-slate-200 h-11 px-4" placeholder="Mô tả ngắn gọn bài viết" value={form.excerpt} onChange={e => setField('excerpt', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Nội dung *</label>
                <textarea className="w-full rounded-lg border-slate-200 px-4 py-3 text-sm font-mono" rows="8" placeholder="Nội dung bài viết (HTML)..." value={form.content} onChange={e => setField('content', e.target.value)} />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-semibold mb-2">Ảnh đại diện</label>
                <div className="flex items-start gap-4">
                  {thumbnailPreview && (
                    <div className="w-32 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                      <span className="material-symbols-outlined text-slate-400">cloud_upload</span>
                      <span className="text-xs text-slate-500 mt-1">Chọn ảnh</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Danh mục</label>
                  <select className="w-full rounded-lg border-slate-200 h-11" value={form.category} onChange={e => setField('category', e.target.value)}>
                    {Object.entries(catLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Thời gian đọc</label>
                  <input type="text" className="w-full rounded-lg border-slate-200 h-11 px-4" placeholder="VD: 5 phút" value={form.read_time} onChange={e => setField('read_time', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Ngày xuất bản</label>
                  <input type="date" className="w-full rounded-lg border-slate-200 h-11 px-4" value={form.published_at} onChange={e => setField('published_at', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Trạng thái</label>
                  <select className="w-full rounded-lg border-slate-200 h-11" value={form.status} onChange={e => setField('status', Number(e.target.value))}>
                    <option value={1}>Xuất bản</option>
                    <option value={0}>Bản nháp</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_feature" className="rounded border-slate-300 text-primary focus:ring-primary/20" checked={form.is_feature} onChange={e => setField('is_feature', e.target.checked)} />
                <label htmlFor="is_feature" className="text-sm font-medium">Bài viết nổi bật</label>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50">Hủy</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
                  {saving ? 'Đang lưu...' : (editingArticle ? 'Cập nhật' : 'Xuất bản')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
