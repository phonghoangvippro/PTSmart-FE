import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getBrands, createBrand, updateBrand, deleteBrand } from './brandAPI';

const IMG_BASE = 'http://192.168.0.243:8000';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formName, setFormName] = useState('');
  const [formLogo, setFormLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (err) {
      console.error('Failed to load brands:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  const openCreate = () => {
    setEditingBrand(null);
    setFormName('');
    setFormLogo(null);
    setLogoPreview(null);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (brand) => {
    setEditingBrand(brand);
    setFormName(brand.name);
    setFormLogo(null);
    setLogoPreview(brand.logo ? `${IMG_BASE}${brand.logo}` : null);
    setError(null);
    setShowModal(true);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) { setError('Tên thương hiệu không được để trống'); return; }
    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', formName.trim());
      if (formLogo) formData.append('logo', formLogo);

      if (editingBrand) {
        await updateBrand(editingBrand.id, formData);
      } else {
        await createBrand(formData);
      }
      setShowModal(false);
      fetchBrands();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa thương hiệu "${name}"?`)) return;
    setDeleting(id);
    try {
      await deleteBrand(id);
      fetchBrands();
    } catch (err) {
      alert('Xóa thất bại: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const filteredBrands = searchQuery
    ? brands.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : brands;

  const totalProducts = brands.reduce((sum, b) => sum + (b.products_count || 0), 0);
  const activeBrands = brands.filter(b => (b.products_count || 0) > 0).length;

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
            <button
              onClick={openCreate}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Thêm Thương hiệu Mới
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Tổng thương hiệu', value: brands.length, icon: 'verified', color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Có sản phẩm', value: activeBrands, icon: 'inventory', color: 'text-secondary', bg: 'bg-secondary/10' },
              { label: 'Tổng sản phẩm', value: totalProducts.toLocaleString(), icon: 'shopping_bag', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
              { label: 'Cập nhật cuối', value: brands.length > 0 ? new Date(brands[0].updated_at).toLocaleDateString('vi-VN') : '—', icon: 'update', color: 'text-slate-600', bg: 'bg-slate-100' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className={`material-symbols-outlined ${stat.color} ${stat.bg} p-2 rounded-lg`}>{stat.icon}</span>
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
                <span className="px-3 py-1 bg-slate-100 text-xs font-bold rounded-full text-slate-600">Tất cả ({brands.length})</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                  <input
                    className="pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm border-none focus:ring-2 focus:ring-primary/30 w-64"
                    placeholder="Tìm thương hiệu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                  <p className="mt-4 text-slate-500 font-medium">Đang tải...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                      <th className="px-8 py-4">Thương hiệu</th>
                      <th className="px-6 py-4">Slug</th>
                      <th className="px-6 py-4">Số sản phẩm</th>
                      <th className="px-6 py-4">Ngày tạo</th>
                      <th className="px-8 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBrands.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-8 py-16 text-center text-slate-400">
                          <span className="material-symbols-outlined text-4xl mb-2 block">verified</span>
                          {searchQuery ? 'Không tìm thấy thương hiệu phù hợp' : 'Chưa có thương hiệu nào'}
                        </td>
                      </tr>
                    ) : (
                      filteredBrands.map((brand) => (
                        <tr key={brand.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 p-2 flex items-center justify-center border border-slate-200/50">
                                {brand.logo ? (
                                  <img className="w-full h-full object-contain" alt={brand.name} src={`${IMG_BASE}${brand.logo}`} />
                                ) : (
                                  <span className="material-symbols-outlined text-xl text-slate-300">verified</span>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{brand.name}</p>
                                <p className="text-xs text-slate-500">ID: {brand.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="font-mono text-xs text-slate-600 py-1 px-2 bg-blue-50 rounded">{brand.slug}</span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{brand.products_count || 0}</span>
                              <span className="text-[10px] text-slate-400">sản phẩm</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-slate-500">
                            {new Date(brand.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEdit(brand)}
                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                title="Chỉnh sửa"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(brand.id, brand.name)}
                                disabled={deleting === brand.id}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                title="Xóa"
                              >
                                <span className="material-symbols-outlined text-lg">
                                  {deleting === brand.id ? 'progress_activity' : 'delete'}
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            <div className="p-6 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Hiển thị <span className="font-bold text-slate-900">{filteredBrands.length}</span> thương hiệu
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 mx-4 animate-in">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">{editingBrand ? 'edit' : 'add_circle'}</span>
              {editingBrand ? 'Chỉnh sửa Thương hiệu' : 'Thêm Thương hiệu Mới'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Tên thương hiệu *</label>
                <input
                  type="text"
                  className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary h-12 px-4"
                  placeholder="VD: Apple, Samsung..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Logo</label>
                {logoPreview ? (
                  <div className="relative group w-full h-32 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center p-4">
                    <img src={logoPreview} alt="Logo preview" className="max-h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => { setFormLogo(null); setLogoPreview(null); }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-slate-50">
                    <span className="material-symbols-outlined text-3xl text-slate-400 mb-1">add_photo_alternate</span>
                    <p className="text-xs text-slate-500">Click để tải lên logo</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                  </label>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
                  {saving ? 'Đang lưu...' : (editingBrand ? 'Cập nhật' : 'Tạo mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandList;
