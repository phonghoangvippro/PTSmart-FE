import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getCart, updateCartItem, removeCartItem, clearCart } from './cartAPI';
import { getMyCoupons, applyCoupon } from '../checkout/couponAPI';
import './Cart.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/80x80?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + '₫';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Coupons
  const [discountAmount, setDiscountAmount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCart();
      setCart(res.data || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const cartItems = cart?.items || [];

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setUpdatingId(itemId);
      const res = await updateCartItem(itemId, newQuantity);
      setCart(res.data || cart);
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setUpdatingId(itemId);
      await removeCartItem(itemId);
      await fetchCart();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) return;
    try {
      setLoading(true);
      await clearCart();
      await fetchCart();
    } catch (err) {
      alert('Lỗi: ' + err.message);
      setLoading(false);
    }
  };

  const handleFetchCoupons = async () => {
    setShowCoupons(true);
    if (coupons.length > 0) return;
    try {
      const res = await getMyCoupons();
      setCoupons(res.data || []);
    } catch {
      // ignore
    }
  };

  const handleApplyPromo = async (code) => {
    // This is passed code or uses promoCode state
    const codeToApply = typeof code === 'string' ? code : promoCode;
    if (!codeToApply.trim()) return;
    
    try {
      setApplyingCoupon(true);
      setCouponError(null);
      
      const res = await applyCoupon(codeToApply, calculateSubtotal());
      setDiscountAmount(res.data?.discount || 0);
      setPromoCode(codeToApply);
      setShowCoupons(false);
    } catch (err) {
      setCouponError(err.message);
      setDiscountAmount(0);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setDiscountAmount(0);
    setCouponError(null);
  };

  const getItemPrice = (item) => {
    const product = item.product;
    if (!product) return 0;
    return Number(product.sale_price || product.price) || 0;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + getItemPrice(item) * item.quantity, 0);
  };

  const calculateDiscount = () => discountAmount;

  const calculateTotal = () => Math.max(0, calculateSubtotal() - calculateDiscount());

  // Loading
  if (loading) {
    return (
      <div className="cart-page min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="cart-page min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-10 py-6">
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-red-300 mb-4">error</span>
            <h2 className="text-2xl font-bold mb-4 text-red-500">{error}</h2>
            <p className="text-gray-500 mb-6">Vui lòng đăng nhập để xem giỏ hàng</p>
            <Link to="/login" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-all">
              Đăng nhập
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="cart-page min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-10 py-6">
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">shopping_cart</span>
            <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-500 mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <Link
              to="/san-pham"
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
                  {cartItems.map((item) => {
                    const product = item.product;
                    const price = getItemPrice(item);
                    const isUpdating = updatingId === item.id;

                    return (
                      <tr key={item.id} className={`group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors ${isUpdating ? 'opacity-50' : ''}`}>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                              <img className="w-full h-full object-cover" alt={product?.name} src={getImageUrl(product?.thumbnail)} />
                            </div>
                            <div>
                              <Link to={`/product/${product?.id}`} className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                {product?.name || item.product_name}
                              </Link>
                              {item.variant && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.variant.name || 'Mặc định'}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
                          {formatPrice(price)}
                          {product?.sale_price && Number(product.sale_price) < Number(product.price) && (
                            <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
                          )}
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center justify-center">
                            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={isUpdating || item.quantity <= 1}
                                className="p-1 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 disabled:opacity-30"
                              >
                                <span className="material-symbols-outlined text-lg">remove</span>
                              </button>
                              <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={isUpdating}
                                className="p-1 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 disabled:opacity-30"
                              >
                                <span className="material-symbols-outlined text-lg">add</span>
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-right font-bold text-gray-900 dark:text-white">
                          {formatPrice(price * item.quantity)}
                        </td>
                        <td className="px-6 py-6 text-center">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isUpdating}
                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30"
                          >
                            <span className="material-symbols-outlined">delete_outline</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <Link
                to="/san-pham"
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
              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mã giảm giá</label>
                <div className="flex gap-2 relative z-10">
                  <input
                    className="flex-grow text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="Nhập mã tại đây"
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      if (discountAmount > 0) handleRemovePromo();
                    }}
                    onFocus={handleFetchCoupons}
                    disabled={discountAmount > 0}
                  />
                  {discountAmount > 0 ? (
                    <button
                      onClick={handleRemovePromo}
                      className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 font-bold text-sm rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Hủy
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyPromo()}
                      disabled={applyingCoupon || !promoCode.trim()}
                      className="px-4 py-2 bg-primary/10 text-primary font-bold text-sm rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
                    >
                      {applyingCoupon ? '...' : 'Áp dụng'}
                    </button>
                  )}
                </div>
                {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}

                {/* Dropdown list */}
                {showCoupons && !discountAmount && coupons.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto w-full">
                    <div className="p-2 flex justify-between items-center bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Mã của bạn</span>
                      <button type="button" onClick={() => setShowCoupons(false)} className="text-gray-400 hover:text-gray-900">
                         <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                    {coupons.map(cp => {
                      const isEligible = calculateSubtotal() >= Number(cp.min_order || 0);
                      return (
                        <div key={cp.id} className={`p-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0 flex justify-between items-center ${isEligible ? 'hover:bg-primary/5 cursor-pointer' : 'opacity-50 grayscale'}`} 
                             onClick={() => {
                                if (isEligible) handleApplyPromo(cp.code);
                             }}>
                          <div>
                             <p className="font-bold text-primary flex items-center gap-1">
                               <span className="material-symbols-outlined text-sm">local_activity</span>
                               {cp.code}
                             </p>
                             <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">{cp.title}</p>
                             <p className="text-[10px] text-gray-500 mt-0.5 max-w-[200px] truncate">{cp.description}</p>
                          </div>
                          <div>
                            {isEligible ? (
                              <span className="text-[10px] bg-primary text-white px-2 py-1 rounded-full font-bold shadow-sm shadow-primary/30">Dùng</span>
                            ) : (
                              <span className="text-[10px] text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full whitespace-nowrap border border-red-100">Chưa đủ ĐK</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                {showCoupons && !discountAmount && (
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowCoupons(false)}></div>
                )}
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
