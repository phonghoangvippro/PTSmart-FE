import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getOrders, getOrderDetail, updateOrderStatus } from './orderAPI';
import './OrderList.css';

const formatCurrency = (v) => v ? new Intl.NumberFormat('vi-VN').format(Number(v)) + 'đ' : '0đ';
const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');
const formatDateTime = (d) => new Date(d).toLocaleString('vi-VN');

const statusConfig = {
  pending:   { label: 'Chờ xử lý',   bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  confirmed: { label: 'Đã xác nhận', bg: 'bg-blue-100',   text: 'text-primary',    dot: 'bg-primary' },
  shipping:  { label: 'Đang giao',   bg: 'bg-pink-100',   text: 'text-secondary-pink', dot: 'bg-secondary-pink' },
  completed: { label: 'Hoàn thành',  bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500' },
  cancelled: { label: 'Đã hủy',     bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
};

const paymentLabels = { cod: 'COD', momo: 'MoMo', vnpay: 'VNPay', bank_transfer: 'Chuyển khoản' };

// Next valid status transitions
const nextStatus = {
  pending: 'confirmed',
  confirmed: 'shipping',
  shipping: 'completed',
};
const nextStatusLabel = {
  pending: 'Xác nhận',
  confirmed: 'Giao hàng',
  shipping: 'Hoàn thành',
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0, from: 0, to: 0 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getOrders(page);
      setOrders(res.data || []);
      setPagination({ currentPage: res.current_page, lastPage: res.last_page, total: res.total, from: res.from || 0, to: res.to || 0 });
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const openDetail = async (id) => {
    setDetailLoading(true);
    setSelectedOrder(null);
    try {
      const detail = await getOrderDetail(id);
      setSelectedOrder(detail);
    } catch (err) {
      alert('Không thể tải chi tiết đơn hàng: ' + err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const cfg = statusConfig[newStatus];
    if (!window.confirm(`Chuyển trạng thái đơn hàng sang "${cfg?.label}"?`)) return;
    setUpdatingStatus(id);
    try {
      await updateOrderStatus(id, newStatus);
      fetchOrders(pagination.currentPage);
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert('Cập nhật thất bại: ' + err.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Filter
  const filteredOrders = orders.filter(o => {
    if (activeTab !== 'all' && o.status !== activeTab) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return o.order_code.toLowerCase().includes(q) || (o.user?.name || '').toLowerCase().includes(q);
  });

  // Compute stats from real data
  const totalOrders = pagination.total;
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const shippingCount = orders.filter(o => o.status === 'shipping').length;
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);

  const getStatusBadge = (status) => {
    const cfg = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${cfg.bg} ${cfg.text}`}>
        <span className={`size-1.5 rounded-full ${cfg.dot}`}></span>
        {cfg.label}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Quản lý Đơn hàng" showSearch={false} />
        <div className="p-8">
          {/* Page Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Quản lý Đơn hàng</h2>
              <p className="text-slate-500 mt-1">Theo dõi và xử lý tất cả đơn hàng trong hệ thống.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Tổng đơn hàng', value: totalOrders, icon: 'list_alt', color: 'bg-primary/10 text-primary' },
              { label: 'Chờ xử lý', value: pendingCount, icon: 'pending', color: 'bg-yellow-100 text-yellow-700' },
              { label: 'Tổng doanh thu', value: formatCurrency(totalRevenue), icon: 'payments', color: 'bg-green-100 text-green-700' },
              { label: 'Đang giao', value: shippingCount, icon: 'local_shipping', color: 'bg-pink-100 text-secondary-pink' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  <div className={`size-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-lg">{stat.icon}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Tabs & Search */}
            <div className="border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-lg shrink-0">
                {[
                  { key: 'all', label: 'Tất cả' },
                  { key: 'pending', label: 'Chờ xử lý' },
                  { key: 'confirmed', label: 'Đã xác nhận' },
                  { key: 'shipping', label: 'Đang giao' },
                  { key: 'completed', label: 'Hoàn thành' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                      activeTab === tab.key ? 'bg-white text-primary shadow-sm font-bold' : 'text-slate-500 hover:text-primary'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                  <input
                    className="w-64 bg-slate-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
                    placeholder="Tìm mã đơn, khách hàng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-sm">download</span>Xuất file
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                  <p className="mt-4 text-slate-500 font-medium">Đang tải đơn hàng...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã đơn</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày đặt</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng tiền</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                            <span className="material-symbols-outlined text-4xl mb-2 block">receipt_long</span>
                            Không có đơn hàng nào
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <button onClick={() => openDetail(order.id)} className="text-sm font-bold text-primary hover:underline">
                                {order.order_code}
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center">
                                  <span className="text-xs font-bold">{(order.user?.name || '?').charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">{order.user?.name || '—'}</p>
                                  <p className="text-[10px] text-slate-400">{order.user?.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {order.items && order.items.length > 0 ? (
                                <div>
                                  <p className="text-sm font-medium truncate max-w-[200px]">{order.items[0].product_name}</p>
                                  <p className="text-xs text-slate-500">
                                    x{order.items[0].quantity}
                                    {order.items.length > 1 && ` + ${order.items.length - 1} SP khác`}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-sm text-slate-400">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-slate-600">{formatDate(order.created_at)}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold">{formatCurrency(order.total)}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5 uppercase">{paymentLabels[order.payment_method] || order.payment_method}</p>
                            </td>
                            <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {nextStatus[order.status] && (
                                  <button
                                    onClick={() => handleStatusUpdate(order.id, nextStatus[order.status])}
                                    disabled={updatingStatus === order.id}
                                    className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                                  >
                                    {updatingStatus === order.id ? '...' : nextStatusLabel[order.status]}
                                  </button>
                                )}
                                <button
                                  onClick={() => openDetail(order.id)}
                                  className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                                  title="Chi tiết"
                                >
                                  <span className="material-symbols-outlined text-lg text-slate-500">visibility</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
                  <p className="text-sm text-slate-500">
                    Hiển thị <span className="font-bold text-slate-900">{pagination.from} - {pagination.to}</span> trên tổng số{' '}
                    <span className="font-bold text-slate-900">{pagination.total}</span> đơn hàng
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchOrders(pagination.currentPage - 1)}
                      disabled={pagination.currentPage <= 1}
                      className="size-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white text-slate-500 transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </button>
                    {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => fetchOrders(p)}
                        className={`size-9 flex items-center justify-center rounded-lg font-medium transition-all ${
                          p === pagination.currentPage
                            ? 'bg-primary text-white font-bold shadow-md shadow-primary/10'
                            : 'border border-slate-200 hover:bg-white text-slate-600'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => fetchOrders(pagination.currentPage + 1)}
                      disabled={pagination.currentPage >= pagination.lastPage}
                      className="size-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white text-slate-500 transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Order Detail Drawer */}
      {(selectedOrder || detailLoading) && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setSelectedOrder(null); setDetailLoading(false); }}></div>
          <div className="relative bg-white w-full max-w-lg shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold">Chi tiết đơn hàng</h3>
              <button onClick={() => { setSelectedOrder(null); setDetailLoading(false); }} className="p-2 hover:bg-slate-100 rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center py-32">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
              </div>
            ) : selectedOrder && (
              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary font-bold text-lg">{selectedOrder.order_code}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(selectedOrder.created_at)}</p>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                {/* Status Update */}
                {nextStatus[selectedOrder.status] && (
                  <button
                    onClick={() => handleStatusUpdate(selectedOrder.id, nextStatus[selectedOrder.status])}
                    disabled={updatingStatus === selectedOrder.id}
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updatingStatus === selectedOrder.id
                      ? <><span className="material-symbols-outlined text-lg animate-spin">progress_activity</span> Đang cập nhật...</>
                      : <><span className="material-symbols-outlined text-lg">arrow_forward</span> Chuyển sang: {statusConfig[nextStatus[selectedOrder.status]]?.label}</>
                    }
                  </button>
                )}

                {/* Customer */}
                <section className="bg-slate-50 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Khách hàng</h4>
                  <p className="font-bold">{selectedOrder.user?.name}</p>
                  <p className="text-sm text-slate-500">{selectedOrder.user?.email}</p>
                  {selectedOrder.user?.phone && <p className="text-sm text-slate-500">{selectedOrder.user.phone}</p>}
                </section>

                {/* Shipping Address */}
                {selectedOrder.address && (
                  <section className="bg-slate-50 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Địa chỉ giao hàng</h4>
                    <p className="font-bold">{selectedOrder.address.name}</p>
                    <p className="text-sm text-slate-500">{selectedOrder.address.phone}</p>
                    <p className="text-sm text-slate-500">{selectedOrder.address.address}</p>
                  </section>
                )}

                {/* Items */}
                <section>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Sản phẩm ({selectedOrder.items?.length || 0})</h4>
                  <div className="space-y-3">
                    {(selectedOrder.items || []).map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.product_name}</p>
                          <p className="text-xs text-slate-500">x{item.quantity} × {formatCurrency(item.price)}</p>
                        </div>
                        <p className="font-bold text-sm ml-4">{formatCurrency(Number(item.price) * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Payment Summary */}
                <section className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tạm tính</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  {Number(selectedOrder.discount) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Giảm giá</span>
                      <span className="text-red-500">-{formatCurrency(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Phí vận chuyển</span>
                    <span>{Number(selectedOrder.shipping_fee) > 0 ? formatCurrency(selectedOrder.shipping_fee) : 'Miễn phí'}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-100">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-slate-500">Thanh toán</span>
                    <span className="font-medium uppercase">{paymentLabels[selectedOrder.payment_method] || selectedOrder.payment_method}</span>
                  </div>
                  {selectedOrder.note && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                      <span className="font-bold">Ghi chú: </span>{selectedOrder.note}
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
