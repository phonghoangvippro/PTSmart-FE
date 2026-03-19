import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getFlashSales, createFlashSale, updateFlashSale, deleteFlashSale } from './flashSaleAPI';
import { getProducts } from '../products/productAPI';

const formatCurrency = (v) => v ? new Intl.NumberFormat('vi-VN').format(Number(v)) + 'đ' : '0đ';
const formatDT = (d) => new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const getFlashSaleStatus = (fs) => {
  const now = new Date();
  const start = new Date(fs.start_at);
  const end = new Date(fs.end_at);
  if (fs.status === 0) return { label: 'Tắt', cls: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' };
  if (now < start) return { label: 'Sắp diễn ra', cls: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' };
  if (now >= start && now <= end) return { label: 'Đang diễn ra', cls: 'bg-green-100 text-green-700', dot: 'bg-green-500' };
  return { label: 'Đã kết thúc', cls: 'bg-red-100 text-red-600', dot: 'bg-red-500' };
};

const FlashSaleList = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [formStatus, setFormStatus] = useState(1);
  const [formItems, setFormItems] = useState([]);

  // Product picker
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Detail view
  const [expandedId, setExpandedId] = useState(null);

  const fetchFlashSales = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFlashSales();
      setFlashSales(data);
    } catch (err) {
      console.error('Failed to load flash sales:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFlashSales(); }, [fetchFlashSales]);

  const loadProducts = async () => {
    if (productsLoaded) return;
    try {
      const res = await getProducts(1, 100);
      setAllProducts(res.data || []);
      setProductsLoaded(true);
    } catch (err) { console.error(err); }
  };

  const openCreate = async () => {
    await loadProducts();
    setEditingSale(null);
    setFormTitle('');
    setFormStart('');
    setFormEnd('');
    setFormStatus(1);
    setFormItems([{ product_id: '', flash_price: '', quantity: '' }]);
    setError(null);
    setShowModal(true);
  };

  const openEdit = async (fs) => {
    await loadProducts();
    setEditingSale(fs);
    setFormTitle(fs.title);
    setFormStart(fs.start_at ? fs.start_at.replace('T', ' ').substring(0, 16) : '');
    setFormEnd(fs.end_at ? fs.end_at.replace('T', ' ').substring(0, 16) : '');
    setFormStatus(fs.status);
    setFormItems(
      (fs.items || []).map(it => ({
        product_id: it.product_id,
        flash_price: it.flash_price,
        quantity: it.quantity,
      }))
    );
    setError(null);
    setShowModal(true);
  };

  const addItem = () => setFormItems(prev => [...prev, { product_id: '', flash_price: '', quantity: '' }]);
  const removeItem = (i) => setFormItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const newItems = [...formItems];
    newItems[i][field] = value;
    setFormItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) { setError('Tiêu đề không được để trống'); return; }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: formTitle.trim(),
        start_at: formStart.replace('T', ' '),
        end_at: formEnd.replace('T', ' '),
        status: Number(formStatus),
      };
      // Only include items for create or if they exist
      const validItems = formItems.filter(it => it.product_id && it.flash_price && it.quantity);
      if (validItems.length > 0) {
        payload.items = validItems.map(it => ({
          product_id: Number(it.product_id),
          flash_price: Number(it.flash_price),
          quantity: Number(it.quantity),
        }));
      }

      if (editingSale) {
        await updateFlashSale(editingSale.id, payload);
      } else {
        if (validItems.length === 0) { setError('Cần ít nhất 1 sản phẩm'); setSaving(false); return; }
        await createFlashSale(payload);
      }
      setShowModal(false);
      fetchFlashSales();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Xóa flash sale "${title}"?`)) return;
    setDeleting(id);
    try {
      await deleteFlashSale(id);
      fetchFlashSales();
    } catch (err) {
      alert('Xóa thất bại: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const totalItems = flashSales.reduce((s, fs) => s + (fs.items?.length || 0), 0);
  const totalSold = flashSales.reduce((s, fs) => s + (fs.items || []).reduce((a, it) => a + (it.sold || 0), 0), 0);
  const activeCount = flashSales.filter(fs => {
    const now = new Date();
    return fs.status === 1 && new Date(fs.start_at) <= now && new Date(fs.end_at) >= now;
  }).length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Quản lý Flash Sale" />
        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span>Trang chủ</span>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-primary font-bold">Flash Sale</span>
              </nav>
              <h2 className="text-3xl font-bold tracking-tight">Flash Sale</h2>
              <p className="text-slate-500 mt-1">Quản lý các chiến dịch giảm giá chớp nhoáng.</p>
            </div>
            <button onClick={openCreate} className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
              <span className="material-symbols-outlined">add_circle</span>Tạo Flash Sale
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'TỔNG CHIẾN DỊCH', value: flashSales.length, icon: 'bolt', color: 'bg-amber-100 text-amber-700' },
              { label: 'ĐANG DIỄN RA', value: activeCount, icon: 'play_circle', color: 'bg-green-100 text-green-700' },
              { label: 'SẢN PHẨM FLASH', value: totalItems, icon: 'shopping_bag', color: 'bg-blue-100 text-blue-700' },
              { label: 'ĐÃ BÁN', value: totalSold, icon: 'trending_up', color: 'bg-pink-100 text-secondary-pink' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <div className={`size-8 rounded-lg ${s.color} flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-lg">{s.icon}</span>
                  </div>
                </div>
                <span className="text-3xl font-bold">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Flash Sale Cards */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-24 bg-white rounded-2xl border border-slate-200">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                  <p className="mt-4 text-slate-500 font-medium">Đang tải...</p>
                </div>
              </div>
            ) : flashSales.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-3 block">bolt</span>
                <p className="font-medium">Chưa có flash sale nào</p>
              </div>
            ) : (
              flashSales.map(fs => {
                const status = getFlashSaleStatus(fs);
                const isExpanded = expandedId === fs.id;
                const totalQty = (fs.items || []).reduce((s, i) => s + i.quantity, 0);
                const totalSoldFS = (fs.items || []).reduce((s, i) => s + (i.sold || 0), 0);

                return (
                  <div key={fs.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Card Header */}
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-amber-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-2xl text-amber-600" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{fs.title}</h3>
                          <p className="text-sm text-slate-500">
                            {formatDT(fs.start_at)} → {formatDT(fs.end_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${status.cls}`}>
                          <span className={`size-1.5 rounded-full ${status.dot}`}></span>
                          {status.label}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <span className="material-symbols-outlined text-sm">shopping_bag</span>
                          <span className="font-bold">{fs.items?.length || 0}</span> SP
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <span className="material-symbols-outlined text-sm">local_fire_department</span>
                          <span className="font-bold text-red-500">{totalSoldFS}</span>/{totalQty}
                        </div>
                        <button onClick={() => setExpandedId(isExpanded ? null : fs.id)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <span className="material-symbols-outlined">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                        </button>
                        <button onClick={() => openEdit(fs)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onClick={() => handleDelete(fs.id, fs.title)} disabled={deleting === fs.id} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
                          <span className="material-symbols-outlined text-lg">{deleting === fs.id ? 'progress_activity' : 'delete'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Expanded Items */}
                    {isExpanded && (fs.items || []).length > 0 && (
                      <div className="border-t border-slate-100">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                              <th className="px-6 py-3">Sản phẩm</th>
                              <th className="px-6 py-3">Giá gốc</th>
                              <th className="px-6 py-3">Giá flash</th>
                              <th className="px-6 py-3">Giảm</th>
                              <th className="px-6 py-3">Đã bán / Tổng</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {fs.items.map(item => {
                              const origPrice = Number(item.product?.price || 0);
                              const flashPrice = Number(item.flash_price);
                              const discount = origPrice > 0 ? Math.round((1 - flashPrice / origPrice) * 100) : 0;
                              const soldPct = item.quantity > 0 ? Math.round((item.sold / item.quantity) * 100) : 0;

                              return (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-4">
                                    <p className="font-medium text-sm">{item.product?.name || `Product #${item.product_id}`}</p>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-slate-500 line-through">{formatCurrency(origPrice)}</td>
                                  <td className="px-6 py-4 text-sm font-bold text-red-600">{formatCurrency(flashPrice)}</td>
                                  <td className="px-6 py-4">
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">-{discount}%</span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-bold">{item.sold}</span>
                                      <span className="text-slate-400">/</span>
                                      <span className="text-sm text-slate-500">{item.quantity}</span>
                                    </div>
                                    <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1">
                                      <div className={`h-full rounded-full transition-all ${soldPct >= 80 ? 'bg-red-500' : soldPct >= 50 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${soldPct}%` }}></div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })
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
              <span className="material-symbols-outlined text-amber-600">bolt</span>
              {editingSale ? 'Chỉnh sửa Flash Sale' : 'Tạo Flash Sale Mới'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1">Tiêu đề *</label>
                <input type="text" className="w-full rounded-lg border-slate-200 h-11 px-4" placeholder="VD: Flash Sale Giờ Vàng" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Bắt đầu *</label>
                  <input type="datetime-local" className="w-full rounded-lg border-slate-200 h-11 px-4" value={formStart} onChange={e => setFormStart(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Kết thúc *</label>
                  <input type="datetime-local" className="w-full rounded-lg border-slate-200 h-11 px-4" value={formEnd} onChange={e => setFormEnd(e.target.value)} />
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold">Sản phẩm Flash Sale</label>
                  <button type="button" onClick={addItem} className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                    <span className="material-symbols-outlined text-sm">add_circle</span>Thêm SP
                  </button>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {formItems.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center p-3 bg-slate-50 rounded-lg">
                      <select className="flex-[2] rounded-lg border-slate-200 h-10 text-sm" value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)}>
                        <option value="">Chọn sản phẩm</option>
                        {allProducts.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({formatCurrency(p.price)})</option>
                        ))}
                      </select>
                      <input type="number" className="flex-1 rounded-lg border-slate-200 h-10 text-sm" placeholder="Giá flash" value={item.flash_price} onChange={e => updateItem(i, 'flash_price', e.target.value)} />
                      <input type="number" className="w-20 rounded-lg border-slate-200 h-10 text-sm" placeholder="SL" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} />
                      <button type="button" onClick={() => removeItem(i)} className="p-1 text-red-500 hover:bg-red-50 rounded-lg">
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50">Hủy</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
                  {saving ? 'Đang lưu...' : (editingSale ? 'Cập nhật' : 'Tạo mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashSaleList;
