import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getCart, clearCart } from '../cart/cartAPI';
import { createOrderAPI } from '../account/orderAPI';
import { createVnpayPayment, createMomoPayment } from '../account/paymentAPI';
import { getAddresses } from '../account/addressAPI';
import './Checkout.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/80x80?text=SP';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + '₫';

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // New address form (inline)
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', address: '', type: 'home' });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cartRes, addrRes] = await Promise.all([
          getCart(),
          getAddresses().catch(() => ({ data: [] })),
        ]);

        const items = cartRes?.data?.items || [];
        if (items.length === 0) {
          navigate('/cart');
          return;
        }
        setCartItems(items);

        const addrs = addrRes?.data || addrRes || [];
        setAddresses(addrs);
        const defaultAddr = addrs.find((a) => a.is_default);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        else if (addrs.length > 0) setSelectedAddressId(addrs[0].id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.sale_price || item.product?.price || 0;
    return sum + Number(price) * item.quantity;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAddressId && !showNewAddress) {
      alert('Vui lòng chọn hoặc thêm địa chỉ giao hàng!');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // 1. Create order
      const orderPayload = {
        payment_method: paymentMethod,
        note: note || undefined,
        coupon_code: couponCode || undefined,
      };

      if (selectedAddressId) {
        orderPayload.shipping_address_id = selectedAddressId;
      }

      const orderRes = await createOrderAPI(orderPayload);
      const orderId = orderRes?.data?.id || orderRes?.order?.id || orderRes?.id;

      if (!orderId) {
        throw new Error('Không nhận được mã đơn hàng');
      }

      // 2. Handle payment redirect
      if (paymentMethod === 'vnpay') {
        const vnpayRes = await createVnpayPayment(orderId);
        if (vnpayRes.payment_url) {
          window.location.href = vnpayRes.payment_url;
          return;
        }
      } else if (paymentMethod === 'momo') {
        const momoRes = await createMomoPayment(orderId);
        if (momoRes.payment_url) {
          window.location.href = momoRes.payment_url;
          return;
        }
      }

      // 3. COD or fallback — clear cart and go to orders
      await clearCart().catch(() => {});
      alert('Đặt hàng thành công!');
      navigate('/account/orders');
    } catch (err) {
      setError(err.message);
      alert('Lỗi: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page min-h-screen flex flex-col">
        <Header />
        <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6 flex-grow">
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_cart</span>
            <h2 className="text-2xl font-bold mb-4">Không có sản phẩm để thanh toán</h2>
            <Link to="/san-pham" className="text-primary hover:underline">Quay lại mua sắm</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const paymentOptions = [
    { id: 'cod', icon: 'payments', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán bằng tiền mặt khi shipper giao hàng' },
    { id: 'vnpay', icon: 'credit_card', label: 'VNPay', desc: 'Thanh toán qua cổng VNPay (ATM, Visa, Mastercard, QR)' },
    { id: 'momo', icon: 'account_balance_wallet', label: 'Ví MoMo', desc: 'Thanh toán nhanh qua ví MoMo' },
  ];

  return (
    <div className="checkout-page min-h-screen flex flex-col">
      <Header />

      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6 flex-grow">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Shipping Address */}
              <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">local_shipping</span>
                  <h2 className="text-xl font-bold">1. Địa chỉ giao hàng</h2>
                </div>

                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                          selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => { setSelectedAddressId(addr.id); setShowNewAddress(false); }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{addr.name}</p>
                            <span className="text-xs text-gray-500">|</span>
                            <p className="text-sm text-gray-500">{addr.phone}</p>
                            {addr.is_default && (
                              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Mặc định</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{addr.address}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-4">Chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.</p>
                )}

                {!showNewAddress ? (
                  <button
                    type="button"
                    onClick={() => setShowNewAddress(true)}
                    className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Thêm địa chỉ mới
                  </button>
                ) : (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                    <h4 className="font-semibold text-sm">Địa chỉ mới</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input className="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900 px-4 py-2.5 text-sm" placeholder="Họ và tên" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} />
                      <input className="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900 px-4 py-2.5 text-sm" placeholder="Số điện thoại" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                    </div>
                    <input className="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-900 px-4 py-2.5 text-sm" placeholder="Địa chỉ chi tiết" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
                    <p className="text-[11px] text-gray-400">* Địa chỉ sẽ được lưu tự động khi đặt hàng.</p>
                  </div>
                )}
              </section>

              {/* 2. Payment Method */}
              <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">payments</span>
                  <h2 className="text-xl font-bold">2. Phương thức thanh toán</h2>
                </div>
                <div className="space-y-3">
                  {paymentOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                        paymentMethod === opt.id ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className={`material-symbols-outlined ${paymentMethod === opt.id ? 'text-primary' : 'text-gray-400'}`}>{opt.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold">{opt.label}</p>
                        <p className="text-sm text-gray-500">{opt.desc}</p>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === opt.id}
                        onChange={() => setPaymentMethod(opt.id)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                        paymentMethod === opt.id ? 'border-primary' : 'border-gray-300'
                      }`}>
                        {paymentMethod === opt.id && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* 3. Note */}
              <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">edit_note</span>
                  <h2 className="text-xl font-bold">3. Ghi chú</h2>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-primary focus:border-primary px-4 py-3 text-sm"
                  placeholder="Ghi chú cho đơn hàng (không bắt buộc)..."
                  rows="2"
                ></textarea>
              </section>
            </div>

            {/* Right Column: Order Summary */}
            <aside className="lg:sticky lg:top-24">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold mb-6">Đơn hàng của bạn</h2>

                {/* Item List */}
                <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2">
                  {cartItems.map((item) => {
                    const product = item.product;
                    const price = Number(product?.sale_price || product?.price || 0);
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                          <img className="w-full h-full object-contain" alt={product?.name} src={getImageUrl(product?.thumbnail)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold line-clamp-1">{product?.name}</p>
                          {item.variant && <p className="text-xs text-gray-500">{item.variant.name}</p>}
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-primary font-bold">{formatPrice(price)}</p>
                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon Code */}
                <div className="flex gap-2 mb-6">
                  <input
                    className="flex-1 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary px-3 py-2"
                    placeholder="Mã giảm giá"
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>

                {/* Calculations */}
                <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tạm tính ({cartItems.length} sản phẩm)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className="text-green-600 font-medium">Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-lg font-bold">Tổng cộng</span>
                    <div className="text-right">
                      <p className="text-2xl font-black text-accent-pink leading-none">{formatPrice(subtotal)}</p>
                      <p className="text-[10px] text-gray-400 mt-1">(Đã bao gồm VAT)</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-accent-pink hover:bg-pink-600 text-white font-black text-lg rounded-xl shadow-lg shadow-pink-200 dark:shadow-none transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : paymentMethod === 'cod' ? (
                    'ĐẶT HÀNG NGAY'
                  ) : paymentMethod === 'vnpay' ? (
                    <>
                      <span className="material-symbols-outlined text-lg">credit_card</span>
                      THANH TOÁN VNPAY
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                      THANH TOÁN MOMO
                    </>
                  )}
                </button>

                <p className="text-[11px] text-gray-400 text-center mt-4 px-4 leading-relaxed">
                  Bằng cách nhấn Đặt hàng, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của PTSmart.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-4 flex justify-center gap-6 opacity-60">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">Bảo mật SSL</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">p2p</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">Đổi trả 30 ngày</span>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
