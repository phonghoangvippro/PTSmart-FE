import React, { useState, useEffect } from 'react';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getPaymentMethods, addPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod } from './paymentAPI';

const CARD_GRADIENTS = [
  'from-[#003c71] to-[#006135]',
  'from-primary to-pink-500',
  'from-[#1a1a2e] to-[#16213e]',
  'from-[#0f3460] to-[#533483]',
  'from-[#e94560] to-[#0f3460]',
];

const WALLET_ICONS = {
  MoMo: { bg: 'bg-[#a50064]', label: 'MoMo' },
  ZaloPay: { bg: 'bg-[#008fe5]', label: 'ZaloPay' },
  VNPay: { bg: 'bg-[#0058a3]', label: 'VNPay' },
};

const EMPTY_FORM = {
  type: 'card',
  provider: '',
  display_name: '',
  masked_number: '',
  card_holder: '',
  expiry: '',
};

const Payment = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  // Action loading
  const [actionId, setActionId] = useState(null);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPaymentMethods();
      setMethods(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const cards = methods.filter((m) => m.type === 'card');
  const wallets = methods.filter((m) => m.type === 'ewallet');

  const handleFormChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setFormError(null);
  };

  const openAddModal = (type = 'card') => {
    setForm({ ...EMPTY_FORM, type });
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.provider || !form.display_name) {
      setFormError('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    try {
      setFormSaving(true);
      setFormError(null);
      await addPaymentMethod(form);
      setShowModal(false);
      await fetchMethods();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa phương thức thanh toán này?')) return;
    try {
      setActionId(id);
      await deletePaymentMethod(id);
      await fetchMethods();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      setActionId(id);
      await setDefaultPaymentMethod(id);
      await fetchMethods();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex flex-1 justify-center py-10 px-4 md:px-10">
        <div className="flex flex-col max-w-[960px] flex-1">
          {/* Page Header */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-4 mb-1">
              <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
              <h1 className="text-2xl font-bold">Phương thức thanh toán</h1>
            </div>
            <p className="text-slate-500 text-sm ml-[52px]">Quản lý các nguồn tiền và thẻ đã liên kết của bạn</p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-red-500 font-bold p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-xl mb-6">{error}</div>
          )}

          {!loading && !error && (
            <>
              {/* Ví điện tử Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between pb-3">
                  <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold">Ví điện tử đã liên kết</h3>
                  <button
                    onClick={() => openAddModal('ewallet')}
                    className="text-primary text-sm font-medium cursor-pointer hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Thêm ví
                  </button>
                </div>
                {wallets.length === 0 ? (
                  <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">account_balance_wallet</span>
                    <p className="text-slate-500 text-sm">Chưa có ví điện tử nào được liên kết.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {wallets.map((w) => {
                      const wIcon = WALLET_ICONS[w.provider] || { bg: 'bg-primary', label: w.provider };
                      const isActioning = actionId === w.id;
                      return (
                        <div key={w.id} className={`flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm ${isActioning ? 'opacity-50' : ''}`}>
                          <div className="shrink-0">
                            <div className={`flex items-center justify-center size-14 rounded-lg ${wIcon.bg} text-white font-bold text-lg`}>
                              {wIcon.label.charAt(0)}
                            </div>
                          </div>
                          <div className="flex flex-col flex-1">
                            <p className="text-slate-900 dark:text-slate-100 text-base font-bold">{w.display_name || w.provider}</p>
                            {w.masked_number && <p className="text-slate-500 text-sm">{w.masked_number}</p>}
                          </div>
                          <div className="flex items-center gap-3">
                            {w.is_default ? (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Mặc định</span>
                            ) : (
                              <button
                                onClick={() => handleSetDefault(w.id)}
                                className="px-2 py-1 text-xs font-medium text-slate-500 hover:text-primary border border-slate-200 rounded hover:border-primary transition-colors"
                              >
                                Đặt mặc định
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(w.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Thẻ ngân hàng Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between pb-3">
                  <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold">Thẻ ngân hàng</h3>
                  <button
                    onClick={() => openAddModal('card')}
                    className="text-primary text-sm font-medium cursor-pointer hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Thêm thẻ
                  </button>
                </div>
                {cards.length === 0 ? (
                  <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">credit_card</span>
                    <p className="text-slate-500 text-sm">Chưa có thẻ ngân hàng nào được liên kết.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map((card, idx) => {
                      const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
                      const isActioning = actionId === card.id;
                      return (
                        <div key={card.id} className={`relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br ${gradient} shadow-lg min-h-[180px] flex flex-col justify-between ${isActioning ? 'opacity-50' : ''}`}>
                          {card.is_default && (
                            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold">MẶC ĐỊNH</div>
                          )}
                          <div className="flex justify-between items-start">
                            <div className="text-xl font-bold italic">{card.provider}</div>
                            <span className="material-symbols-outlined text-3xl opacity-80">contactless</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs opacity-80 uppercase tracking-widest">Số thẻ</p>
                            <p className="text-lg font-medium tracking-widest">{card.masked_number || '****'}</p>
                          </div>
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[10px] opacity-70 uppercase">Chủ thẻ</p>
                              <p className="text-sm font-bold uppercase">{card.card_holder || '—'}</p>
                            </div>
                            {card.expiry && (
                              <div className="text-right">
                                <p className="text-[10px] opacity-70 uppercase">Expires</p>
                                <p className="text-sm font-bold">{card.expiry}</p>
                              </div>
                            )}
                          </div>
                          {/* Card actions */}
                          <div className="absolute bottom-3 right-3 flex gap-1">
                            {!card.is_default && (
                              <button
                                onClick={() => handleSetDefault(card.id)}
                                className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg backdrop-blur-sm transition-colors"
                                title="Đặt mặc định"
                              >
                                <span className="material-symbols-outlined text-sm">star</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(card.id)}
                              className="p-1.5 bg-white/20 hover:bg-red-500/60 rounded-lg backdrop-blur-sm transition-colors"
                              title="Xóa"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add New Method Button */}
              <div className="mb-10">
                <button
                  onClick={() => openAddModal('card')}
                  className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 py-6 rounded-xl hover:border-primary hover:text-primary transition-colors group"
                >
                  <div className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 group-hover:text-primary">add</span>
                  </div>
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary">Thêm phương thức mới</span>
                </button>
              </div>
            </>
          )}

          {/* Footer Info */}
          <div className="mt-auto py-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-slate-400 text-xs">
              Thông tin thanh toán của bạn được mã hóa và bảo mật theo tiêu chuẩn quốc tế PCI DSS.<br />
              PTSmart không trực tiếp lưu trữ số thẻ của bạn.
            </p>
          </div>
        </div>
      </main>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => !formSaving && setShowModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {form.type === 'card' ? 'Thêm thẻ ngân hàng' : 'Thêm ví điện tử'}
              </h3>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type toggle */}
              <div className="flex gap-3">
                {[
                  { value: 'card', label: 'Thẻ ngân hàng', icon: 'credit_card' },
                  { value: 'ewallet', label: 'Ví điện tử', icon: 'account_balance_wallet' },
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

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {form.type === 'card' ? 'Nhà phát hành (Visa, Mastercard, NAPAS...)' : 'Nhà cung cấp (MoMo, ZaloPay, VNPay...)'}
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder={form.type === 'card' ? 'VD: Visa' : 'VD: MoMo'}
                  value={form.provider}
                  onChange={(e) => handleFormChange('provider', e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tên hiển thị</label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="VD: Visa ***1234"
                  value={form.display_name}
                  onChange={(e) => handleFormChange('display_name', e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Số thẻ / SĐT ẩn</label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="VD: ***1234"
                  value={form.masked_number}
                  onChange={(e) => handleFormChange('masked_number', e.target.value)}
                />
              </div>

              {form.type === 'card' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chủ thẻ</label>
                    <input
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none uppercase"
                      placeholder="NGUYEN VAN A"
                      value={form.card_holder}
                      onChange={(e) => handleFormChange('card_holder', e.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ngày hết hạn</label>
                    <input
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="MM/YY"
                      value={form.expiry}
                      onChange={(e) => handleFormChange('expiry', e.target.value)}
                    />
                  </div>
                </>
              )}

              {formError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-medium">{formError}</div>
              )}

              <button
                type="submit"
                disabled={formSaving}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                {formSaving ? 'Đang lưu...' : 'Thêm phương thức'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Payment;
