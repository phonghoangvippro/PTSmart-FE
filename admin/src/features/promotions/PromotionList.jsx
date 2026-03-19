import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getPromotions, createPromotion, updatePromotion, deletePromotion } from './promotionAPI';

const IMG_BASE = 'http://127.0.0.1:8000';

const statusCfg = {
  1: { label: 'Đang diễn ra', cls: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  0: { label: 'Đã kết thúc / Ẩn', cls: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
};

const PromotionList = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [type, setType] = useState('brand_sale');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [status, setStatus] = useState('1');
  const [productIds, setProductIds] = useState(''); // Comma separated

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPromotions();
      setPromotions(data);
    } catch (err) {
      console.error('Failed to load promotions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const openCreate = () => {
    setEditingPromo(null);
    setTitle('');
    setDescription('');
    setImage(null);
    setImagePreview(null);
    setType('brand_sale');
    setStartAt('');
    setEndAt('');
    setStatus('1');
    setProductIds('');
    setError(null);
    setShowModal(true);
  };

  const openEdit = (promo) => {
    setEditingPromo(promo);
    setTitle(promo.title || '');
    setDescription(promo.description || '');
    setImage(null);
    setImagePreview(promo.image ? `${IMG_BASE}${promo.image}` : null);
    setType(promo.type || 'brand_sale');
    
    // Format dates for datetime-local or date input. The API returns full ISO or SQL date
    setStartAt(promo.start_at ? promo.start_at.substring(0, 10) : '');
    setEndAt(promo.end_at ? promo.end_at.substring(0, 10) : '');
    setStatus(promo.status !== undefined ? promo.status.toString() : '1');
    
    // Extract product IDs if any
    const pIds = promo.products ? promo.products.map(p => p.id).join(', ') : '';
    setProductIds(pIds);
    
    setError(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !startAt || !endAt) { 
      setError('Vui lòng điền các trường bắt buộc (Tiêu đề, Ngày bắt đầu, Ngày kết thúc)'); 
      return; 
    }
    
    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('type', type);
      formData.append('start_at', startAt);
      formData.append('end_at', endAt);
      formData.append('status', status);
      
      if (image) {
        formData.append('image', image);
      }
      
      const pIdArray = productIds.split(',').map(id => id.trim()).filter(id => id !== '');
      pIdArray.forEach((id, index) => {
        formData.append(`product_id[${index}]`, id);
      });

      if (editingPromo) {
        await updatePromotion(editingPromo.id, formData);
      } else {
        await createPromotion(formData);
      }
      setShowModal(false);
      fetchPromotions();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Bạn có chắc muốn xóa khuyến mãi "${title}"?`)) return;
    setDeleting(id);
    try {
      await deletePromotion(id);
      fetchPromotions();
    } catch (err) {
      alert('Xóa thất bại: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const activeCount = promotions.filter(p => p.status === 1).length;
  const endedCount = promotions.filter(p => p.status === 0).length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Quản lý Khuyến mãi" />
        <div className="p-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <nav className="flex gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                <span>Quản lý</span><span>/</span><span className="text-primary">Khuyến mãi</span>
              </nav>
              <h2 className="text-3xl font-bold tracking-tight">Danh sách Khuyến mãi</h2>
            </div>
            <button 
              onClick={openCreate}
              className="bg-gradient-to-br from-pink-600 to-rose-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-pink-500/20 hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">add_circle</span>Tạo Khuyến mãi mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { l: 'Tổng chiến dịch', v: promotions.length, i: 'campaign', c: 'text-primary bg-blue-50' }, 
              { l: 'Đang hoạt động', v: activeCount, i: 'bolt', c: 'text-pink-600 bg-pink-50' }, 
              { l: 'Đã kết thúc', v: endedCount, i: 'history', c: 'text-slate-500 bg-slate-100' }
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start">
                  <span className={`material-symbols-outlined p-2 rounded-lg ${s.c}`}>{s.i}</span>
                </div>
                <div className="mt-4">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{s.l}</p>
                  <p className="text-3xl font-bold">{s.v}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                  <p className="mt-4 text-slate-500 font-medium">Đang tải...</p>
                </div>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Banner & Tiêu đề</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Loại KM</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Thời gian</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Trạng thái</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {promotions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-16 text-center text-slate-400">
                        Chưa có khuyến mãi nào
                      </td>
                    </tr>
                  ) : promotions.map(p => { 
                    const st = statusCfg[p.status] || statusCfg[0]; 
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-6">
                            <div className={`relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 group-hover:shadow-md transition-shadow ${p.status === 0 ? 'grayscale opacity-60' : ''}`}>
                              {p.image ? (
                                <img alt={p.title} className="w-full h-full object-cover" src={`${IMG_BASE}${p.image}`} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                                  <span className="material-symbols-outlined">image</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className={`font-bold text-lg mb-1 ${p.status === 0 ? 'text-slate-400 line-through' : ''}`}>{p.title}</p>
                              <p className="text-sm text-slate-500 line-clamp-2 w-64">{p.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                            {p.type}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <span className="material-symbols-outlined text-xs">event</span>
                            {p.start_at ? p.start_at.substring(0, 10) : ''} - {p.end_at ? p.end_at.substring(0, 10) : ''}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${st.cls}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>{st.label}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEdit(p)} className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-primary transition-all active:scale-90">
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button onClick={() => handleDelete(p.id, p.title)} disabled={deleting === p.id} className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 disabled:opacity-50">
                              <span className="material-symbols-outlined">{deleting === p.id ? 'progress_activity' : 'delete'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hiển thị tất cả {promotions.length}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 mx-4 animate-in max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">{editingPromo ? 'edit' : 'add_circle'}</span>
              {editingPromo ? 'Chỉnh sửa Khuyến mãi' : 'Thêm Khuyến mãi Mới'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">Tiêu đề *</label>
                  <input type="text" className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary px-4 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">Mô tả</label>
                  <textarea className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary px-4 py-2" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Loại khuyến mãi</label>
                  <select className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary px-4 py-2" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="brand_sale">Brand Sale</option>
                    <option value="category_sale">Category Sale</option>
                    <option value="flash_sale">Flash Sale</option>
                    <option value="holiday_sale">Holiday Sale</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Trạng thái</label>
                  <select className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary px-4 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="1">Đang diễn ra (Hiển thị) </option>
                    <option value="0">Đã kết thúc (Ẩn)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Ngày bắt đầu *</label>
                  <input type="date" className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary px-4 py-2" value={startAt} onChange={(e) => setStartAt(e.target.value)} required />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Ngày kết thúc *</label>
                  <input type="date" className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary px-4 py-2" value={endAt} onChange={(e) => setEndAt(e.target.value)} required />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">Hình ảnh Banner</label>
                  {imagePreview ? (
                    <div className="relative group w-full h-40 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center p-4 overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="max-h-full object-contain" />
                      <button type="button" onClick={() => { setImage(null); setImagePreview(null); }} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-slate-50">
                      <span className="material-symbols-outlined text-3xl text-slate-400 mb-1">add_photo_alternate</span>
                      <p className="text-xs text-slate-500">Click để tải lên hình ảnh</p>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">ID Sản phẩm áp dụng (Cách nhau bởi dấu phẩy)</label>
                  <input type="text" className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary px-4 py-2" placeholder="Ví dụ: 1, 2, 5, 10" value={productIds} onChange={(e) => setProductIds(e.target.value)} />
                  <p className="text-xs text-slate-400 mt-1">Để trống nếu không áp dụng cho sản phẩm cụ thể</p>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                  Hủy
                </button>
                <div className="flex-1"></div>
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
                  {saving ? 'Đang lưu...' : (editingPromo ? 'Cập nhật' : 'Tạo mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionList;
