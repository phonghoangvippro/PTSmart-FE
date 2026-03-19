import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from './couponAPI';

const formatCurrency = (v) => v ? new Intl.NumberFormat('vi-VN').format(Number(v)) + 'đ' : '0đ';

const typeLabels = { fixed: 'Giảm tiền', percent: 'Giảm %', shipping: 'Free ship' };
const typeColors = {
  fixed: 'bg-emerald-100 text-emerald-700',
  percent: 'bg-purple-100 text-purple-700',
  shipping: 'bg-blue-100 text-blue-700',
};
const catLabels = { shopping: 'Mua sắm', shipping: 'Vận chuyển' };

const emptyForm = {
  code: '', title: '', description: '', type: 'fixed',
  discount_value: '', min_order: '', max_discount: '', usage_limit: '',
  expired_at: '', category: 'shopping', status: 1,
};

const DiscountList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const openCreate = () => {
    setEditingCoupon(null);
    setForm(emptyForm);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code || '',
      title: coupon.title || '',
      description: coupon.description || '',
      type: coupon.type || 'fixed',
      discount_value: coupon.discount_value || '',
      min_order: coupon.min_order || '',
      max_discount: coupon.max_discount || '',
      usage_limit: coupon.usage_limit || '',
      expired_at: coupon.expired_at ? coupon.expired_at.split('T')[0] : '',
      category: coupon.category || 'shopping',
      status: coupon.status ?? 1,
    });
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.title.trim()) { setError('Mã và tiêu đề không được để trống'); return; }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        discount_value: Number(form.discount_value) || 0,
        min_order: form.min_order ? Number(form.min_order) : undefined,
        max_discount: form.max_discount ? Number(form.max_discount) : undefined,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : undefined,
        status: Number(form.status),
      };
      // Remove undefined fields
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, payload);
      } else {
        await createCoupon(payload);
      }
      setShowModal(false);
      fetchCoupons();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Xóa mã giảm giá "${code}"?`)) return;
    setDeleting(id);
    try {
      await deleteCoupon(id);
      fetchCoupons();
    } catch (err) {
      alert('Xóa thất bại: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const isExpired = (d) => d && new Date(d) < new Date();

  const filteredCoupons = coupons.filter(c => {
    if (filterTab === 'active' && (c.status !== 1 || isExpired(c.expired_at))) return false;
    if (filterTab === 'expired' && !isExpired(c.expired_at)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
  });

  const activeCoupons = coupons.filter(c => c.status === 1 && !isExpired(c.expired_at)).length;
  const totalUsage = coupons.reduce((s, c) => s + (c.used_count || 0), 0);

  const getDiscountDisplay = (c) => {
    if (c.type === 'percent') return `-${c.discount_value}%`;
    if (c.type === 'shipping') return 'FREE SHIP';
    return `-${formatCurrency(c.discount_value)}`;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Quản lý Mã giảm giá" />
        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span>Trang chủ</span>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-primary font-bold">Mã giảm giá</span>
              </nav>
              <h2 className="text-3xl font-bold tracking-tight">Mã giảm giá</h2>
              <p className="text-slate-500 mt-1">Theo dõi và quản lý các chương trình khuyến mãi đang diễn ra.</p>
            </div>
            <button onClick={openCreate} className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
              <span className="material-symbols-outlined">add_circle</span>Thêm Mã Mới
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'TỔNG MÃ', value: coupons.length, extra: '+12%', extraCls: 'text-emerald-600 bg-emerald-50' },
              { label: 'ĐANG ÁP DỤNG', value: activeCoupons, extra: '●', extraCls: 'text-green-500' },
              { label: 'LƯỢT DÙNG', value: totalUsage.toLocaleString(), icon: 'trending_up' },
              { label: 'HẾT HẠN (THÁNG)', value: coupons.filter(c => isExpired(c.expired_at)).length, icon: 'event_busy' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{s.label}</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold">{s.value}</span>
                  {s.extra && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.extraCls}`}>{s.extra}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setFilterTab('all')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filterTab === 'all' ? 'bg-slate-100 text-primary font-bold' : 'text-slate-500 hover:text-primary'}`}>Tất cả</button>
                <button onClick={() => setFilterTab('active')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filterTab === 'active' ? 'bg-slate-100 text-primary font-bold' : 'text-slate-500 hover:text-primary'}`}>Hoạt động</button>
                <button onClick={() => setFilterTab('expired')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filterTab === 'expired' ? 'bg-slate-100 text-primary font-bold' : 'text-slate-500 hover:text-primary'}`}>Đã hết hạn</button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input className="pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm border-none focus:ring-2 focus:ring-primary/30 w-64" placeholder="Tìm mã giảm giá..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                      <th className="px-6 py-4">Mã giảm giá</th>
                      <th className="px-6 py-4">Giá trị</th>
                      <th className="px-6 py-4">Loại</th>
                      <th className="px-6 py-4">Thời gian</th>
                      <th className="px-6 py-4">Lượt dùng</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCoupons.length === 0 ? (
                      <tr><td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2 block">confirmation_number</span>
                        Không có mã giảm giá nào
                      </td></tr>
                    ) : (
                      filteredCoupons.map(c => {
                        const expired = isExpired(c.expired_at);
                        return (
                          <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-5">
                              <div>
                                <p className="font-bold text-primary">{c.code}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{c.title}</p>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-lg font-bold">{getDiscountDisplay(c)}</span>
                              {c.min_order && <p className="text-[10px] text-slate-400">Đơn tối thiểu: {formatCurrency(c.min_order)}</p>}
                              {c.max_discount && <p className="text-[10px] text-slate-400">Giảm tối đa: {formatCurrency(c.max_discount)}</p>}
                            </td>
                            <td className="px-6 py-5">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${typeColors[c.type] || 'bg-slate-100 text-slate-600'}`}>
                                {typeLabels[c.type] || c.type}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-sm">{new Date(c.created_at).toLocaleDateString('vi-VN')}</p>
                              <p className="text-xs text-slate-500">→ {new Date(c.expired_at).toLocaleDateString('vi-VN')}</p>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{c.used_count || 0}</span>
                                <span className="text-slate-400">/</span>
                                <span className="text-slate-500">{c.usage_limit || '∞'}</span>
                              </div>
                              {c.usage_limit && (
                                <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1.5">
                                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, ((c.used_count || 0) / c.usage_limit) * 100)}%` }}></div>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              {expired ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
                                  <span className="size-1.5 rounded-full bg-red-500"></span>Hết hạn
                                </span>
                              ) : c.status === 1 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-600">
                                  <span className="size-1.5 rounded-full bg-green-500"></span>Hoạt động
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                                  <span className="size-1.5 rounded-full bg-slate-400"></span>Tắt
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => openEdit(c)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"><span className="material-symbols-outlined text-lg">edit</span></button>
                                <button onClick={() => handleDelete(c.id, c.code)} disabled={deleting === c.id} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
                                  <span className="material-symbols-outlined text-lg">{deleting === c.id ? 'progress_activity' : 'delete'}</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
              <p className="text-sm text-slate-500">Hiển thị <span className="font-bold text-slate-900">{filteredCoupons.length}</span> mã giảm giá</p>
            </div>
          </div>
        </div>
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 mx-4 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">{editingCoupon ? 'edit' : 'add_circle'}</span>
              {editingCoupon ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Mã code *</label>
                  <input type="text" className="w-full rounded-lg border-slate-200 h-11 px-4 uppercase font-mono" placeholder="VD: SUMMER2026" value={form.code} onChange={e => setField('code', e.target.value.toUpperCase())} disabled={!!editingCoupon} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Loại *</label>
                  <select className="w-full rounded-lg border-slate-200 h-11" value={form.type} onChange={e => setField('type', e.target.value)}>
                    <option value="fixed">Giảm tiền cố định</option>
                    <option value="percent">Giảm theo %</option>
                    <option value="shipping">Miễn phí ship</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Tiêu đề *</label>
                <input type="text" className="w-full rounded-lg border-slate-200 h-11 px-4" placeholder="VD: Giảm 15% mùa hè" value={form.title} onChange={e => setField('title', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Mô tả</label>
                <textarea className="w-full rounded-lg border-slate-200 px-4 py-3 text-sm" rows="2" placeholder="Mô tả chi tiết điều kiện áp dụng..." value={form.description} onChange={e => setField('description', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Giá trị giảm *{form.type === 'percent' ? ' (%)' : ' (VNĐ)'}
                  </label>
                  <input type="number" className="w-full rounded-lg border-slate-200 h-11 px-4" value={form.discount_value} onChange={e => setField('discount_value', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Đơn tối thiểu (VNĐ)</label>
                  <input type="number" className="w-full rounded-lg border-slate-200 h-11 px-4" value={form.min_order} onChange={e => setField('min_order', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Giảm tối đa (VNĐ)</label>
                  <input type="number" className="w-full rounded-lg border-slate-200 h-11 px-4" placeholder="Chỉ áp dụng cho %" value={form.max_discount} onChange={e => setField('max_discount', e.target.value)} disabled={form.type !== 'percent'} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Số lượt dùng</label>
                  <input type="number" className="w-full rounded-lg border-slate-200 h-11 px-4" placeholder="Không giới hạn" value={form.usage_limit} onChange={e => setField('usage_limit', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Ngày hết hạn *</label>
                  <input type="date" className="w-full rounded-lg border-slate-200 h-11 px-4" value={form.expired_at} onChange={e => setField('expired_at', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Trạng thái</label>
                  <select className="w-full rounded-lg border-slate-200 h-11" value={form.status} onChange={e => setField('status', Number(e.target.value))}>
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Tắt</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">Hủy</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
                  {saving ? 'Đang lưu...' : (editingCoupon ? 'Cập nhật' : 'Tạo mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountList;
