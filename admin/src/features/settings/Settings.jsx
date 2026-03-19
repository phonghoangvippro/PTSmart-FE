import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getBanners, createBanner, updateBanner, deleteBanner } from './bannerAPI';
import './Settings.css';

const IMG_BASE = 'http://127.0.0.1:8000';

const Settings = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Banner Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  
  // Banner Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [link, setLink] = useState('');
  const [position, setPosition] = useState('home_hero');
  const [sortOrder, setSortOrder] = useState('1');
  const [status, setStatus] = useState('1');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBanners();
      setBanners(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error('Failed to load banners:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const openCreate = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setLink('');
    setPosition('home_hero');
    setSortOrder('1');
    setStatus('1');
    setImage(null);
    setImagePreview(null);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (banner) => {
    setEditingBanner(banner);
    setTitle(banner.title || '');
    setSubtitle(banner.subtitle || '');
    setLink(banner.link || '');
    setPosition(banner.position || 'home_hero');
    setSortOrder(banner.sort_order ? banner.sort_order.toString() : '1');
    setStatus(banner.status !== undefined ? banner.status.toString() : '1');
    setImage(null);
    setImagePreview(banner.image ? `${IMG_BASE}${banner.image}` : null);
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
    if (!title.trim() || !position.trim()) {
      setError('Vui lòng điền các trường bắt buộc (Tiêu đề, Vị trí)');
      return;
    }

    if (!editingBanner && !image) {
      setError('Vui lòng chọn hình ảnh cho banner mới');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('subtitle', subtitle.trim());
      if (link) formData.append('link', link.trim());
      formData.append('position', position);
      formData.append('sort_order', sortOrder);
      formData.append('status', status);
      
      if (image) {
        formData.append('image', image);
      }

      if (editingBanner) {
        await updateBanner(editingBanner.id, formData);
      } else {
        await createBanner(formData);
      }
      setShowModal(false);
      fetchBanners();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, bTitle) => {
    if (!window.confirm(`Bạn có chắc muốn xóa banner "${bTitle}"?`)) return;
    setDeleting(id);
    try {
      await deleteBanner(id);
      fetchBanners();
    } catch (err) {
      alert('Xóa thất bại: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleSaveGeneral = () => {
    alert('Đã lưu thông tin chung thành công!');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen relative">
        <Header title="Cấu hình hệ thống" />
        <div className="p-8 pb-32">
          {/* Page Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Cài đặt hệ thống</h2>
              <p className="text-slate-500 mt-1">Quản lý không gian chung, cấu hình giao diện & banner PTSmart</p>
            </div>
            <button 
              onClick={handleSaveGeneral}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">save</span>
              Lưu thay đổi chung
            </button>
          </div>

          {/* Section 1: Thông tin chung */}
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">info</span>
              <h3 className="font-bold text-lg">Thông tin chung</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Logo Upload */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="space-y-3 w-full md:w-1/3">
                  <label className="text-sm font-semibold">Logo Website</label>
                  <div className="relative group">
                    <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center gap-3 overflow-hidden cursor-pointer group-hover:border-primary/50 transition-colors">
                      <div className="w-full h-full bg-white flex items-center justify-center p-4">
                        <div
                          className="w-full h-full bg-center bg-contain bg-no-repeat"
                          style={{
                            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB6cOpZqSEIs-1tJkz-usoaFS7JbvudTeA4Bf0AN7e9X_ATy3Km7x8Wyn7WjScq6o6TP1AmuvWsc_6W9YJlvU4ORp8PtKgPLqj-NeqE5WrC57NHPfc_dhb9AikwNZXOWkUgmZK8D7J9EBkB_5Q-ycfELFoim-wz-z9SMZ_UW0qW0u5nGi0JRp0W3qmuexIWXtDrbfZ2iIeRDSjU_PptSD9cz3p73KkVjNAnGVBH3RPsf8VHQPljyh_fwblDs0W-0uOYRQ4nFmfIRA')"
                          }}
                        ></div>
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                        <span className="text-white text-xs font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">upload</span> Thay đổi
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 max-w-[192px] leading-relaxed">Định dạng PNG, JPG. Kích thước 400x400px. Tối đa 2MB.</p>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Tên website</label>
                    <input
                      className="w-full rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary text-sm px-4 py-2.5"
                      type="text"
                      defaultValue="PTSmart - Đồ gia dụng thông minh"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Hotline liên hệ</label>
                    <input
                      className="w-full rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary text-sm px-4 py-2.5"
                      type="text"
                      defaultValue="1900 1234"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email hỗ trợ</label>
                    <input
                      className="w-full rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary text-sm px-4 py-2.5"
                      type="email"
                      defaultValue="support@ptsmart.vn"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Phí vận chuyển mặc định</label>
                    <div className="relative">
                      <input
                        className="w-full rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary text-sm px-4 py-2.5 pr-12 text-slate-900 font-bold"
                        type="number"
                        defaultValue="30000"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">VNĐ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Banner Slider */}
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">view_carousel</span>
                <div>
                  <h3 className="font-bold text-lg">Hệ thống Banner</h3>
                  <p className="text-xs text-slate-500">Quản lý banner slider tại trang chủ, flash sale...</p>
                </div>
              </div>
              <button 
                onClick={openCreate}
                className="text-sm font-bold bg-slate-100 hover:bg-primary hover:text-white px-4 py-2 rounded-lg text-primary flex items-center gap-2 transition-colors border border-transparent"
              >
                <span className="material-symbols-outlined text-sm">add</span> Thêm Banner Mới
              </button>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
                  <span className="ml-2 text-slate-500 font-medium">Đang tải data từ server...</span>
                </div>
              ) : banners.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  Chưa có banner nào. Click "Thêm Banner Mới" để tạo.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {banners.map(b => (
                    <div key={b.id} className="group relative flex flex-col gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 hover:border-primary/30 transition-colors hover:shadow-md hover:bg-white">
                      
                      {/* Image Preview Window */}
                      <div className="w-full h-40 rounded-xl overflow-hidden relative bg-slate-100 border border-black/5">
                        {b.image ? (
                          <img 
                            src={`${IMG_BASE}${b.image}`} 
                            alt={b.title} 
                            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${b.status === 0 ? 'grayscale opacity-70' : ''}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-3xl">image_not_supported</span>
                          </div>
                        )}
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3 backdrop-blur-[2px]">
                          <button 
                            onClick={() => openEdit(b)}
                            className="bg-white/20 hover:bg-white text-white hover:text-primary backdrop-blur-md px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span> Sửa
                          </button>
                          <button 
                            onClick={() => handleDelete(b.id, b.title)}
                            disabled={deleting === b.id}
                            className="bg-red-500/80 hover:bg-red-600 text-white backdrop-blur-md px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">{deleting === b.id ? 'progress_activity' : 'delete'}</span>
                          </button>
                        </div>

                        {/* Status Label */}
                        <div className="absolute top-3 right-3 shadow-sm">
                          {b.status === 1 ? (
                            <span className="bg-green-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shadow-sm">Đang bật</span>
                          ) : (
                            <span className="bg-slate-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shadow-sm">Đã tắt</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Info Text Area */}
                      <div className="flex-1 px-1 flex flex-col justify-between relative">
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase truncate max-w-[120px] border border-blue-200/50">{b.position}</span>
                                <span className="text-slate-400 font-bold text-xs">Thứ tự: {b.sort_order}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-lg line-clamp-1">{b.title}</h4>
                            <p className="text-slate-500 text-sm line-clamp-1 h-5">{b.subtitle}</p>
                         </div>
                         <div className="mt-3 pt-3 border-t border-slate-200 text-xs font-mono text-slate-400 truncate">
                            {b.link ? `Link: ${b.link}` : 'Không gán Link'}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </main>

      {/* Modal Cập nhật Banner */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          
          {/* Modal Container */}
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl p-8 mx-4 max-h-[90vh] overflow-y-auto animate-in border border-slate-100">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-800">
              <span className="material-symbols-outlined text-primary bg-blue-50 p-2 rounded-xl">
                {editingBanner ? 'edit_square' : 'add_photo_alternate'}
              </span>
              {editingBanner ? 'Chỉnh Sửa Banner' : 'Tạo Banner Mới'}
            </h3>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                <span className="material-symbols-outlined">error</span>
                <p className="mt-0.5 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tiêu đề Banner <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-4 py-3" 
                    placeholder="VD: Khuyến mãi mùa tựu trường" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phụ đề (Subtitle)</label>
                  <input 
                    type="text" 
                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-4 py-3" 
                    placeholder="VD: Giảm ngay 50% cho Học sinh - Sinh viên" 
                    value={subtitle} 
                    onChange={(e) => setSubtitle(e.target.value)} 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">URL Đích (Link)</label>
                  <input 
                    type="text" 
                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-4 py-3" 
                    placeholder="VD: /promotions/back-to-school" 
                    value={link} 
                    onChange={(e) => setLink(e.target.value)} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Vị trí chèn <span className="text-red-500">*</span></label>
                  <select 
                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-4 py-3" 
                    value={position} 
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    <option value="home_hero">Home Hero Slider (Trang chủ)</option>
                    <option value="flash_sale">Flash Sale</option>
                    <option value="category">Category Banner</option>
                    <option value="custom">Custom Position</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Thứ tự hiển thị (Sort Order)</label>
                  <input 
                    type="number" 
                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-4 py-3 font-mono" 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value)} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Trạng thái bật/tắt</label>
                  <select 
                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-4 py-3" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="1">Hiển thị (Active)</option>
                    <option value="0">Tạm Ẩn (Inactive)</option>
                  </select>
                </div>
              </div>

              {/* Upload Ảnh */}
              <div className="pt-4 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                      Hình ảnh Banner {!editingBanner && <span className="text-red-500">*</span>}
                  </label>
                  
                  {imagePreview ? (
                    <div className="relative group w-full h-56 bg-slate-100 rounded-2xl border-2 border-slate-200 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                         <button 
                            type="button" 
                            onClick={() => { setImage(null); setImagePreview(null); }} 
                            className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
                         >
                           <span className="material-symbols-outlined text-sm">delete</span> Xóa ảnh này
                         </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-blue-50/50 transition-all bg-slate-50 group">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all mb-4">
                         <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                      </div>
                      <p className="text-sm font-bold text-slate-700 mb-1">Click vào đây để tải file lên</p>
                      <p className="text-xs text-slate-500 font-medium">Hỗ trợ JPG, PNG, WEBP (Tối đa 10MB)</p>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
              </div>

              <div className="flex gap-4 pt-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-3.5 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors w-1/3"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="px-6 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 w-2/3 transition-all active:scale-95"
                >
                  {saving ? (
                    <><span className="material-symbols-outlined text-lg animate-spin">progress_activity</span> Đang xử lý...</>
                  ) : (
                    <><span className="material-symbols-outlined text-lg">{editingBanner ? 'save' : 'done'}</span> {editingBanner ? 'Lưu Thông Tin' : 'Tiến Hành Đăng Banner'}</>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
