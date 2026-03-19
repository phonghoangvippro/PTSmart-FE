import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getCartItems, clearCart } from '../cart/cartAPI';
import { getProductById } from '../product/productAPI';
import { createOrder } from '../account/orderAPI';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [promoCode, setPromoCode] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    // Check if coming from direct purchase (ProductDetail) or from cart
    const state = location.state;
    if (state && state.productId && state.quantity) {
      // Direct purchase from product detail
      const product = getProductById(state.productId);
      if (product) {
        setOrderItems([{
          id: product.id,
          name: product.name,
          variant: 'Mặc định',
          price: parseInt(product.price.replace(/[^\d]/g, '')) || 0,
          quantity: state.quantity || 1,
          image: product.image
        }]);
      }
    } else {
      // From cart
      const cartItems = getCartItems();
      if (cartItems.length === 0) {
        // Redirect to cart if empty
        navigate('/cart');
        return;
      }
      setOrderItems(cartItems);
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    // Create order
    const newOrder = createOrder({
      total: calculateTotal(),
      items: orderItems.map(item => ({
        id: item.id,
        name: item.name,
        variant: item.variant || 'Mặc định',
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      customerInfo: formData,
      paymentMethod: paymentMethod
    });
    // Clear cart if coming from cart
    if (!location.state || !location.state.productId) {
      clearCart();
    }
    // Redirect to orders page
    alert(`Đặt hàng thành công! Mã đơn hàng: ${newOrder.orderId}`);
    navigate('/account/orders');
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    // Mock discount calculation
    return promoCode ? 500000 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (orderItems.length === 0) {
    return (
      <div className="checkout-page">
        <Header />
        <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Không có sản phẩm để thanh toán</h2>
            <Link to="/laptops" className="text-primary hover:underline">Quay lại mua sắm</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page min-h-screen flex flex-col">
      <Header />

      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6 flex-grow">

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: User Info & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Receiver Info */}
              <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">local_shipping</span>
                  <h2 className="text-xl font-bold">1. Thông tin nhận hàng</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Họ và tên *</label>
                    <input
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-primary focus:border-primary px-4 py-3"
                      placeholder="Nhập họ tên người nhận"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Số điện thoại *</label>
                    <input
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-primary focus:border-primary px-4 py-3"
                      placeholder="Nhập số điện thoại"
                      type="tel"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email (Không bắt buộc)</label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-primary focus:border-primary px-4 py-3"
                      placeholder="Nhập email"
                      type="email"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Địa chỉ chi tiết *</label>
                    <textarea
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-primary focus:border-primary px-4 py-3"
                      placeholder="Số nhà, tên đường, Phường/Xã..."
                      rows="2"
                    ></textarea>
                  </div>
                </div>
              </section>

              {/* 2. Payment Method */}
              <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">payments</span>
                  <h2 className="text-xl font-bold">2. Phương thức thanh toán</h2>
                </div>
                <div className="space-y-3">
                  {/* Option 1: COD */}
                  <div className="relative">
                    <input
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="peer hidden"
                      id="cod"
                      name="payment"
                      type="radio"
                    />
                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                        paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      htmlFor="cod"
                    >
                      <span className={`material-symbols-outlined ${paymentMethod === 'cod' ? 'text-primary' : 'text-gray-400'}`}>payments</span>
                      <div className="flex-1">
                        <p className="font-semibold">Thanh toán khi nhận hàng (COD)</p>
                        <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi shipper giao hàng</p>
                      </div>
                      <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                        paymentMethod === 'cod' ? 'border-primary' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'cod' && (
                          <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Option 2: Bank Transfer */}
                  <div className="relative">
                    <input
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      className="peer hidden"
                      id="bank"
                      name="payment"
                      type="radio"
                    />
                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                        paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      htmlFor="bank"
                    >
                      <span className={`material-symbols-outlined ${paymentMethod === 'bank' ? 'text-primary' : 'text-gray-400'}`}>account_balance</span>
                      <div className="flex-1">
                        <p className="font-semibold">Chuyển khoản ngân hàng</p>
                        <p className="text-sm text-gray-500">Chuyển qua ứng dụng ngân hàng bằng QR code</p>
                      </div>
                      <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                        paymentMethod === 'bank' ? 'border-primary' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'bank' && (
                          <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Option 3: E-Wallet */}
                  <div className="relative">
                    <input
                      checked={paymentMethod === 'wallet'}
                      onChange={() => setPaymentMethod('wallet')}
                      className="peer hidden"
                      id="wallet"
                      name="payment"
                      type="radio"
                    />
                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                        paymentMethod === 'wallet' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'
                      }`}
                      htmlFor="wallet"
                    >
                      <span className={`material-symbols-outlined ${paymentMethod === 'wallet' ? 'text-primary' : 'text-gray-400'}`}>account_balance_wallet</span>
                      <div className="flex-1">
                        <p className="font-semibold">Ví điện tử (MoMo, ZaloPay)</p>
                        <p className="text-sm text-gray-500">Thanh toán nhanh qua ứng dụng ví điện tử</p>
                      </div>
                      <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                        paymentMethod === 'wallet' ? 'border-primary' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'wallet' && (
                          <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Order Summary */}
            <aside className="lg:sticky lg:top-24">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold mb-6">Đơn hàng của bạn</h2>

                {/* Item List */}
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                        <img className="w-full h-full object-cover" alt={item.name} src={item.image} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.variant}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-primary font-bold">{formatPrice(item.price)}</p>
                          <p className="text-xs">x{item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <input
                    className="flex-1 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary"
                    placeholder="Mã giảm giá"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (promoCode) {
                        alert('Mã giảm giá đã được áp dụng!');
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>

                {/* Calculations */}
                <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tạm tính</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className="text-green-600 font-medium">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Giảm giá</span>
                    <span className="text-accent-pink">-{formatPrice(calculateDiscount())}</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-lg font-bold">Tổng cộng</span>
                    <div className="text-right">
                      <p className="text-2xl font-black text-accent-pink leading-none">{formatPrice(calculateTotal())}</p>
                      <p className="text-[10px] text-gray-400 mt-1">(Đã bao gồm VAT)</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-accent-pink hover:bg-pink-600 text-white font-black text-lg rounded-xl shadow-lg shadow-pink-200 dark:shadow-none transition-all transform active:scale-[0.98]"
                >
                  ĐẶT HÀNG NGAY
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
