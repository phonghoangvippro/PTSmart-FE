import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from './addressAPI';

const TYPE_CONFIG = {
  home: { label: 'Nhà riêng', icon: 'house', iconBg: 'bg-pink-400/10', iconColor: 'text-pink-400', badgeBg: 'bg-pink-400/10', badgeColor: 'text-pink-400' },
  office: { label: 'Văn phòng', icon: 'corporate_fare', iconBg: 'bg-slate-100 dark:bg-slate-800', iconColor: 'text-slate-600 dark:text-slate-400', badgeBg: 'bg-slate-100 dark:bg-slate-800', badgeColor: 'text-slate-500' },
};

const EMPTY_FORM = { name: '', phone: '', address: '', type: 'home', is_default: false };

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  // Delete/Default loading
  const [actionId, setActionId] = useState(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAddresses();
      setAddresses(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (addr) => {
    setEditingId(addr.id);
    setForm({
      name: addr.name || '',
      phone: addr.phone || '',
      address: addr.address || '',
      type: addr.type || 'home',
      is_default: addr.is_default || false,
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleFormChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      setFormError('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    try {
      setFormSaving(true);
      setFormError(null);
      if (editingId) {
        await updateAddress(editingId, form);
      } else {
        await createAddress(form);
      }
      setShowModal(false);
      await fetchAddresses();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try {
      setActionId(id);
      await deleteAddress(id);
      await fetchAddresses();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      setActionId(id);
      await setDefaultAddress(id);
      await fetchAddresses();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setActionId(null);
    }
  };

  const filteredAddresses = addresses.filter((a) => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-white">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight tracking-tight">Sổ địa chỉ</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Quản lý nơi nhận hàng của bạn</p>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all shadow-lg shadow-primary/20 font-bold text-sm"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span className="hidden sm:inline">Thêm địa chỉ mới</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'Tất cả', icon: 'all_inclusive' },
              { id: 'home', label: 'Nhà riêng', icon: 'home', iconColor: 'text-pink-400' },
              { id: 'office', label: 'Văn phòng', icon: 'corporate_fare', iconColor: 'text-primary' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  filterType === tab.id
                    ? 'bg-primary text-white font-semibold shadow-sm'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/50'
                }`}
              >
                <span className={`material-symbols-outlined text-sm ${filterType === tab.id ? '' : tab.iconColor || ''}`}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-red-500 font-bold p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-xl">{error}</div>
          )}

          {/* Empty */}
          {!loading && !error && filteredAddresses.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">location_off</span>
              <h3 className="text-lg font-bold mb-2">Chưa có địa chỉ nào</h3>
              <p className="text-slate-500 text-sm mb-4">Thêm địa chỉ để thuận tiện khi đặt hàng.</p>
              <button onClick={openAddModal} className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                <span className="material-symbols-outlined">add</span>
                Thêm địa chỉ
              </button>
            </div>
          )}

          {/* Address Cards */}
          {!loading && !error && filteredAddresses.length > 0 && (
            <div className="space-y-4">
              {filteredAddresses.map((addr) => {
                const typeConf = TYPE_CONFIG[addr.type] || TYPE_CONFIG.home;
                const isActioning = actionId === addr.id;

                return (
                  <div
                    key={addr.id}
                    className={`group relative bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm transition-all hover:shadow-md ${
                      addr.is_default ? 'border-2 border-primary' : 'border border-slate-200 dark:border-slate-800'
                    } ${isActioning ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`flex items-center justify-center rounded-xl ${addr.is_default ? 'bg-primary/10 text-primary' : `${typeConf.iconBg} ${typeConf.iconColor}`} shrink-0 size-12`}>
                          <span className="material-symbols-outlined">{addr.is_default ? 'stars' : typeConf.icon}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-lg font-bold">{addr.name}</p>
                            {addr.is_default && (
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary uppercase">Mặc định</span>
                            )}
                            <span className={`inline-flex items-center rounded-full ${typeConf.badgeBg} px-2.5 py-0.5 text-xs font-bold ${typeConf.badgeColor}`}>
                              {typeConf.label}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-md">{addr.address}</p>
                          <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <span className="material-symbols-outlined text-sm">call</span>
                            {addr.phone}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => openEditModal(addr)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        {!addr.is_default && (
                          <>
                            <button
                              onClick={() => handleSetDefault(addr.id)}
                              className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Đặt mặc định"
                            >
                              <span className="material-symbols-outlined">star</span>
                            </button>
                            <button
                              onClick={() => handleDelete(addr.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => !formSaving && setShowModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editingId ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Họ và tên *</label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Nhập họ tên người nhận"
                  value={form.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Số điện thoại *</label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Nhập số điện thoại"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Địa chỉ chi tiết *</label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  rows={2}
                  value={form.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loại địa chỉ</label>
                <div className="flex gap-3">
                  {[
                    { value: 'home', label: 'Nhà riêng', icon: 'house' },
                    { value: 'office', label: 'Văn phòng', icon: 'corporate_fare' },
                  ].map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => handleFormChange('type', t.value)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border font-medium transition-all ${
                        form.type === t.value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(e) => handleFormChange('is_default', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Đặt làm địa chỉ mặc định</span>
              </label>

              {formError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-medium">{formError}</div>
              )}

              <button
                type="submit"
                disabled={formSaving}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">{editingId ? 'save' : 'add'}</span>
                {formSaving ? 'Đang lưu...' : editingId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Address;
