import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getCartItems, updateCartItemQuantity, removeCartItem, clearCart } from './cartAPI';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState(getCartItems());
  const [promoCode, setPromoCode] = useState('');

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(itemId, newQuantity);
    setCartItems(getCartItems());
  };

  const handleRemoveItem = (itemId) => {
    removeCartItem(itemId);
    setCartItems(getCartItems());
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      clearCart();
      setCartItems(getCartItems());
    }
  };

  const handleApplyPromo = () => {
    // Handle promo code logic here
    alert('Mã giảm giá đã được áp dụng!');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return 0; // Can be calculated based on promo code
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <Header />
        <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-10 py-6">
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">shopping_cart</span>
            <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-500 mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <Link
              to="/laptops"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-all"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Tiếp tục mua sắm
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-10 py-6">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          Giỏ hàng của bạn
          <span className="text-sm font-normal text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            ({cartItems.length} sản phẩm)
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Đơn giá</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Số lượng</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thành tiền</th>
                    <th className="text-center px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {cartItems.map((item) => (
                    <tr key={item.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                            <img className="w-full h-full object-cover" alt={item.name} src={item.image} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{item.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.variant}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-1 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                            >
                              <span className="material-symbols-outlined text-lg">remove</span>
                            </button>
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-1 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                            >
                              <span className="material-symbols-outlined text-lg">add</span>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right font-bold text-gray-900 dark:text-white">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                      <td className="px-6 py-6 text-center">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined">delete_outline</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <Link
                to="/laptops"
                className="flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Tiếp tục mua sắm
              </Link>
              <button
                onClick={handleClearCart}
                className="text-gray-500 text-sm hover:text-red-500 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
                Xóa tất cả giỏ hàng
              </button>
            </div>
          </div>

          {/* Right Column: Summary Card */}
          <aside className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sticky top-28">
              <h3 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h3>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mã giảm giá</label>
                <div className="flex gap-2">
                  <input
                    className="flex-grow text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="Nhập mã tại đây"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-primary/10 text-primary font-bold text-sm rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Giảm giá</span>
                  <span className="font-medium text-green-500">- {formatPrice(calculateDiscount())}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-gray-900 dark:text-white">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold">Tổng cộng</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-primary">{formatPrice(calculateTotal())}</span>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">(Đã bao gồm VAT)</p>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <span>TIẾN HÀNH THANH TOÁN</span>
                <span className="material-symbols-outlined">chevron_right</span>
              </Link>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="material-symbols-outlined text-green-500">verified</span>
                  <span>Bảo mật thanh toán 100%</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="material-symbols-outlined text-blue-500">local_shipping</span>
                  <span>Giao hàng nhanh từ 2-4 giờ</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
