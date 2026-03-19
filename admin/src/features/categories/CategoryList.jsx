import React, { useState, useEffect } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getCategories, createCategory, updateCategory, deleteCategory } from './categoryAPI';
import './CategoryList.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    parent_id: null,
    sort_order: 1,
    status: 1,
  });

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Fetch categories error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Count totals
  const totalCategories = categories.reduce((sum, cat) => sum + 1 + (cat.children?.length || 0), 0);
  const activeCategories = categories.reduce((sum, cat) => {
    let count = cat.status === 1 ? 1 : 0;
    count += (cat.children || []).filter(c => c.status === 1).length;
    return sum + count;
  }, 0);
  const totalProducts = categories.reduce((sum, cat) => sum + (cat.products_count || 0), 0);

  // Open create modal
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', icon: '', parent_id: null, sort_order: 1, status: 1 });
    setError('');
    setShowModal(true);
  };

  // Open edit modal
  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      icon: cat.icon || '',
      parent_id: cat.parent_id || null,
      sort_order: cat.sort_order || 1,
      status: cat.status,
    });
    setError('');
    setShowModal(true);
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        showSuccess('Cập nhật danh mục thành công!');
      } else {
        await createCategory(formData);
        showSuccess('Tạo danh mục thành công!');
      }
      setShowModal(false);
      setLoading(true);
      await fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setDeleteConfirm(null);
      showSuccess('Xóa danh mục thành công!');
      setLoading(true);
      await fetchCategories();
    } catch (err) {
      setDeleteConfirm(null);
      setError(err.message);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Get parent categories for select dropdown (only top-level)
  const parentOptions = categories.filter(c => !c.parent_id);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen">
          <Header title="Danh mục sản phẩm" />
          <div className="p-8 flex items-center justify-center h-[80vh]">
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
              <p className="mt-4 text-slate-500 font-medium">Đang tải dữ liệu...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Danh mục sản phẩm" />

        <div className="p-8">
          {/* Success Toast */}
          {successMsg && (
            <div className="fixed top-6 right-6 z-[9999] bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slideIn">
              <span className="material-symbols-outlined">check_circle</span>
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* Page Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Danh mục sản phẩm</h2>
              <p className="text-slate-500 mt-1">Tổ chức các mặt hàng của bạn theo từng nhóm chuyên biệt</p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Thêm danh mục mới
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">grid_view</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Tổng số danh mục</p>
                <p className="text-2xl font-bold">{totalCategories}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Đang hoạt động</p>
                <p className="text-2xl font-bold">{activeCategories}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">inventory</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Tổng sản phẩm</p>
                <p className="text-2xl font-bold">{new Intl.NumberFormat('vi-VN').format(totalProducts)}</p>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên danh mục</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Danh mục con</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Số SP</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {categories.map((cat) => (
                    <React.Fragment key={cat.id}>
                      {/* Parent category row */}
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-400">#{cat.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined text-lg">{cat.icon || 'category'}</span>
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{cat.slug}</td>
                        <td className="px-6 py-4 text-sm text-center font-bold">{cat.children?.length || 0}</td>
                        <td className="px-6 py-4 text-sm text-center font-bold">{cat.products_count || 0}</td>
                        <td className="px-6 py-4">
                          {cat.status === 1 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Kích hoạt
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                              Tạm khóa
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleOpenEdit(cat)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Sửa">
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button onClick={() => setDeleteConfirm(cat)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Children rows */}
                      {cat.children && cat.children.map((child) => (
                        <tr key={child.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors bg-slate-50/30">
                          <td className="px-6 py-3 text-sm font-medium text-slate-400">#{child.id}</td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3 pl-8">
                              <span className="text-slate-300 mr-1">└</span>
                              <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                <span className="material-symbols-outlined text-base">{child.icon || 'label'}</span>
                              </div>
                              <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">{child.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-400">{child.slug}</td>
                          <td className="px-6 py-3 text-sm text-center text-slate-400">—</td>
                          <td className="px-6 py-3 text-sm text-center text-slate-400">—</td>
                          <td className="px-6 py-3">
                            {child.status === 1 ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                                Kích hoạt
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                                Tạm khóa
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => handleOpenEdit(child)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Sửa">
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button onClick={() => setDeleteConfirm(child)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500">
                Tổng <span className="font-bold text-slate-900 dark:text-white">{totalCategories}</span> danh mục
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">error</span>
                    {error}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Tên danh mục *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                    placeholder="VD: Laptop Gaming"
                  />
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Icon (Material Symbols)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none pr-14"
                      placeholder="VD: laptop, smartphone, headphones"
                    />
                    {formData.icon && (
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                        {formData.icon}
                      </span>
                    )}
                  </div>
                </div>

                {/* Parent Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Danh mục cha</label>
                  <select
                    value={formData.parent_id || ''}
                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                  >
                    <option value="">— Không có (danh mục gốc) —</option>
                    {parentOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Order & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Thứ tự sắp xếp</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Trạng thái</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                    >
                      <option value={1}>Kích hoạt</option>
                      <option value={0}>Tạm khóa</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? 'Đang lưu...' : (editingCategory ? 'Cập nhật' : 'Tạo mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-red-500">warning</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Xóa danh mục?</h3>
            <p className="text-slate-500 mb-6">
              Bạn có chắc chắn muốn xóa danh mục <strong>"{deleteConfirm.name}"</strong>?
              {deleteConfirm.children?.length > 0 && (
                <span className="block mt-1 text-red-500 text-sm font-medium">
                  Danh mục này có {deleteConfirm.children.length} danh mục con!
                </span>
              )}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all"
              >
                Xóa danh mục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
