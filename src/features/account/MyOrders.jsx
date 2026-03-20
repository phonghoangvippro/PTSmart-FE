import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getOrders, getOrderById, cancelOrder } from './orderAPI';
import './MyOrders.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/80x80';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const STATUS_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chờ xử lý' },
  { id: 'confirmed', label: 'Đã xác nhận' },
  { id: 'shipping', label: 'Đang giao' },
  { id: 'completed', label: 'Hoàn thành' },
  { id: 'canceled', label: 'Đã hủy' },
];

const STATUS_CONFIG = {
  pending: { label: 'Chờ xử lý', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  confirmed: { label: 'Đã xác nhận', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  shipping: { label: 'Đang giao', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', dot: 'bg-yellow-500' },
  completed: { label: 'Hoàn thành', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' },
  canceled: { label: 'Đã hủy', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
};

const PAYMENT_LABELS = {
  cod: 'Thanh toán khi nhận hàng',
  momo: 'Ví MoMo',
  vnpay: 'VNPay',
  bank_transfer: 'Chuyển khoản',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Order detail modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Cancel state
  const [cancellingId, setCancellingId] = useState(null);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + '₫';
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getOrders(currentPage);
      setOrders(res.data || []);
      setPagination({
        currentPage: res.current_page,
        lastPage: res.last_page,
        total: res.total,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleViewDetail = async (orderId) => {
    try {
      setDetailLoading(true);
      const res = await getOrderById(orderId);
      setSelectedOrder(res.data || res);
    } catch (err) {
      alert('Lỗi khi tải chi tiết đơn hàng: ' + err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    try {
      setCancellingId(orderId);
      await cancelOrder(orderId);
      // Refresh orders list
      await fetchOrders();
      // If detail modal is open for this order, close it
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full ${config.bg} ${config.text} flex items-center`}>
        <span className={`size-2 ${config.dot} rounded-full mr-2`}></span>
        {config.label}
      </span>
    );
  };

  // Client-side status + search filter
  const displayedOrders = orders.filter((order) => {
    // Filter by status tab
    if (activeTab !== 'all' && order.status !== activeTab) return false;
    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        order.order_code?.toLowerCase().includes(q) ||
        order.items?.some((item) => item.product_name?.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="my-orders-page min-h-screen flex flex-col">
      <Header />

      <main className="max-w-[1280px] mx-auto w-full px-4 md:px-10 py-6 flex-grow">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Đơn hàng của tôi</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Theo dõi trạng thái và lịch sử mua sắm của bạn tại PTSmart.</p>
          </div>
          <Link to="/account" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined mr-2 text-base">arrow_back</span>
            Tài khoản
          </Link>
        </div>

        {/* Order Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
          <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-gray-800">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'font-bold border-b-2 border-primary text-primary'
                    : 'text-gray-500 dark:text-gray-400 hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <span className="material-symbols-outlined text-sm">search</span>
              </span>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-primary focus:border-primary"
                placeholder="Tìm theo Mã đơn hàng hoặc Tên sản phẩm..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-xl mb-8">
            Có lỗi xảy ra: {error}
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <div className="space-y-4">
            {displayedOrders.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">shopping_bag</span>
                <h3 className="text-xl font-bold mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào trong danh mục này.</p>
                <Link
                  to="/laptops"
                  className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                  Mua sắm ngay
                </Link>
              </div>
            ) : (
              displayedOrders.map((order) => {
                const firstItem = order.items?.[0];
                const isCanceled = order.status === 'canceled';

                return (
                  <div
                    key={order.id}
                    className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-primary transition-all overflow-hidden ${
                      isCanceled ? 'opacity-75 grayscale hover:grayscale-0' : ''
                    }`}
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Mã đơn:</span>
                          <span className="text-lg font-bold text-primary">{order.order_code}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-4">
                          <span className="flex items-center">
                            <span className="material-symbols-outlined text-sm mr-1">calendar_today</span>
                            {formatDate(order.created_at)}
                          </span>
                          <span className="flex items-center">
                            <span className="material-symbols-outlined text-sm mr-1">payments</span>
                            {PAYMENT_LABELS[order.payment_method] || order.payment_method}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        <div className="flex-1 flex items-center gap-4">
                          {firstItem && (
                            <div className="relative">
                              <div className="h-20 w-20 flex-shrink-0 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden p-2">
                                <img
                                  alt={firstItem.product_name}
                                  className="h-full w-full object-contain"
                                  src={getImageUrl(firstItem.product?.thumbnail)}
                                />
                              </div>
                              {order.items.length > 1 && (
                                <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                  +{order.items.length - 1}
                                </div>
                              )}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{firstItem?.product_name}</h4>
                            {order.items.length === 1 ? (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Số lượng: {firstItem?.quantity} × {formatPrice(firstItem?.price)}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Và {order.items.length - 1} sản phẩm khác
                              </p>
                            )}
                            {order.note && (
                              <p className="text-sm text-gray-400 mt-1 italic">Ghi chú: {order.note}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-8 border-t lg:border-t-0 pt-4 lg:pt-0">
                          <div className="text-left lg:text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tổng cộng</p>
                            <p className={`text-xl font-black text-gray-900 dark:text-white ${isCanceled ? 'line-through opacity-50' : ''}`}>
                              {formatPrice(order.total)}
                            </p>
                            {order.discount > 0 && (
                              <p className="text-xs text-green-500 font-medium">Giảm {formatPrice(order.discount)}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={cancellingId === order.id}
                                className="px-5 py-2.5 border border-red-300 text-red-500 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                {cancellingId === order.id ? 'Đang hủy...' : 'Hủy đơn'}
                              </button>
                            )}
                            {(order.status === 'completed' || isCanceled) && (
                              <Link
                                to="/laptops"
                                className="px-5 py-2.5 border border-primary text-primary rounded-lg text-sm font-bold hover:bg-primary/5 transition-colors"
                              >
                                Mua lại
                              </Link>
                            )}
                            <button
                              onClick={() => handleViewDetail(order.id)}
                              className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                            >
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.lastPage > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${
                  page === currentPage
                    ? 'bg-primary text-white'
                    : 'border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:text-primary'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage >= pagination.lastPage}
              onClick={() => setCurrentPage((p) => Math.min(pagination.lastPage, p + 1))}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}

        {/* Order Detail Modal */}
        {(selectedOrder || detailLoading) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => !detailLoading && setSelectedOrder(null)}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {detailLoading ? (
                <div className="p-12 flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : selectedOrder && (
                <>
                  <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Chi tiết đơn hàng</h3>
                      <p className="text-primary font-bold mt-1">{selectedOrder.order_code}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Status & Payment */}
                    <div className="flex flex-wrap gap-4">
                      {getStatusBadge(selectedOrder.status)}
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {PAYMENT_LABELS[selectedOrder.payment_method] || selectedOrder.payment_method}
                      </span>
                      <span className="text-sm text-gray-500">Ngày đặt: {formatDate(selectedOrder.created_at)}</span>
                    </div>

                    {/* Shipping Address */}
                    {selectedOrder.address && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-1">
                        <p className="font-bold text-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-base text-primary">location_on</span>
                          Địa chỉ nhận hàng
                        </p>
                        <p className="text-sm font-semibold">{selectedOrder.address.name} — {selectedOrder.address.phone}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.address.address}</p>
                      </div>
                    )}

                    {/* Items */}
                    <div>
                      <p className="font-bold text-sm mb-3">Sản phẩm ({selectedOrder.items?.length})</p>
                      <div className="space-y-3">
                        {selectedOrder.items?.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="w-16 h-16 flex-shrink-0 bg-white dark:bg-gray-700 rounded-lg overflow-hidden p-1 border border-gray-100 dark:border-gray-600">
                              <img src={getImageUrl(item.product?.thumbnail)} alt={item.product_name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link to={`/product/${item.product?.slug || item.product_id}`} className="font-bold text-sm line-clamp-1 hover:text-primary transition-colors">
                                {item.product_name}
                              </Link>
                              <p className="text-xs text-gray-500 mt-1">SL: {item.quantity} × {formatPrice(item.price)}</p>
                            </div>
                            <p className="font-bold text-primary text-sm whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tạm tính</span>
                        <span className="font-medium">{formatPrice(selectedOrder.subtotal)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-green-500">
                          <span>Giảm giá</span>
                          <span className="font-medium">−{formatPrice(selectedOrder.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phí vận chuyển</span>
                        <span className="font-medium">{selectedOrder.shipping_fee > 0 ? formatPrice(selectedOrder.shipping_fee) : 'Miễn phí'}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-800 text-lg font-black">
                        <span>Tổng cộng</span>
                        <span className="text-primary">{formatPrice(selectedOrder.total)}</span>
                      </div>
                    </div>

                    {/* Note */}
                    {selectedOrder.note && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-sm">
                        <span className="font-bold">Ghi chú:</span> {selectedOrder.note}
                      </div>
                    )}

                    {/* Actions */}
                    {selectedOrder.status === 'pending' && (
                      <button
                        onClick={() => { handleCancelOrder(selectedOrder.id); }}
                        disabled={cancellingId === selectedOrder.id}
                        className="w-full py-3 border-2 border-red-300 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {cancellingId === selectedOrder.id ? 'Đang hủy...' : 'Hủy đơn hàng'}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Bottom Assistance */}
        <div className="mt-16 p-8 bg-gradient-to-r from-primary to-blue-700 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/20">
          <div className="flex items-center gap-6">
            <div className="size-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">contact_support</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Bạn cần trợ giúp với đơn hàng?</h3>
              <p className="text-blue-100 opacity-90">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 cho mọi thắc mắc.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button className="px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap">Chat với hỗ trợ</button>
            <button className="px-8 py-3 bg-accent-pink text-white font-bold rounded-xl hover:bg-pink-600 transition-colors whitespace-nowrap">Hotline: 1900 8888</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;
