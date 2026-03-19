import React, { useState } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getOrders } from './orderAPI';
import './OrderList.css';

const OrderList = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const orders = getOrders();

  const filteredOrders = orders.filter(order => {
    if (activeTab !== 'all' && order.status !== activeTab) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return order.orderId.toLowerCase().includes(query) ||
           order.customerName.toLowerCase().includes(query);
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: 'Chờ xử lý',
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        dot: 'bg-yellow-500'
      },
      confirmed: {
        label: 'Đã xác nhận',
        bg: 'bg-blue-100',
        text: 'text-primary',
        dot: 'bg-primary'
      },
      shipping: {
        label: 'Đang giao',
        bg: 'bg-pink-100',
        text: 'text-secondary-pink',
        dot: 'bg-secondary-pink'
      },
      completed: {
        label: 'Hoàn thành',
        bg: 'bg-green-100',
        text: 'text-green-700',
        dot: 'bg-green-500'
      },
      cancelled: {
        label: 'Đã hủy',
        bg: 'bg-red-100',
        text: 'text-red-700',
        dot: 'bg-red-500'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${config.bg} ${config.text}`}>
        <span className={`size-1.5 rounded-full ${config.dot}`}></span>
        {config.label}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Quản lý Đơn hàng" showSearch={false} />
        
        <div className="p-8">
          {/* Page Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Quản lý Đơn hàng</h2>
              <p className="text-slate-500 mt-1">Theo dõi và xử lý tất cả đơn hàng trong hệ thống.</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Tổng đơn hàng', value: '1,250', icon: 'list_alt', color: 'bg-primary/10 text-primary', trend: '+12%', trendColor: 'bg-green-100 text-green-700' },
              { label: 'Đang chờ xử lý', value: '45', icon: 'pending', color: 'bg-yellow-100 text-yellow-700', trend: 'Cần xử lý', trendColor: 'bg-yellow-100 text-yellow-700' },
              { label: 'Doanh thu ngày', value: '85.4M', icon: 'payments', color: 'bg-green-100 text-green-700', trend: '-2.4%', trendColor: 'bg-red-100 text-red-700' },
              { label: 'Đang giao hàng', value: '128', icon: 'local_shipping', color: 'bg-pink-100 text-secondary-pink', trend: '+8%', trendColor: 'bg-pink-100 text-secondary-pink' }
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  <div className={`size-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-lg">{stat.icon}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${stat.trendColor}`}>{stat.trend}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-medium italic">* {i === 2 ? 'Đơn vị: VNĐ' : i === 0 ? 'So với tháng trước' : i === 1 ? 'Ưu tiên xử lý nhanh' : 'Đơn vị vận chuyển đã nhận'}</p>
              </div>
            ))}
          </div>

          {/* Main Table Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {/* Filters/Tabs */}
            <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                {['all', 'pending', 'shipping', 'completed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                      activeTab === tab
                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-primary'
                    }`}
                  >
                    {tab === 'all' ? 'Tất cả' : tab === 'pending' ? 'Chờ xử lý' : tab === 'shipping' ? 'Đang giao' : 'Hoàn thành'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                  <input
                    className="w-full sm:w-64 bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 dark:text-slate-100"
                    placeholder="Tìm kiếm mã đơn, khách hàng..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                  Bộ lọc
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-sm">download</span>
                  Xuất file
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
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
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                        Không có đơn hàng nào
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-primary">{order.orderId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                              <span className="text-xs font-bold">{order.customerName.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{order.customerName}</p>
                              <p className="text-[10px] text-slate-500">{order.phone}</p>
                              {order.email && (
                                <p className="text-[10px] text-slate-400">{order.email}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {order.items && order.items.length > 0 ? (
                            <div className="flex items-center gap-3">
                              <div className="size-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                <img
                                  className="w-full h-full object-cover"
                                  alt={order.items[0].name}
                                  src={order.items[0].image}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                  {order.items[0].name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Số lượng: {order.items[0].quantity}
                                  {order.items.length > 1 && ` + ${order.items.length - 1} sản phẩm khác`}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">Không có sản phẩm</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-slate-600 dark:text-slate-400">{formatDate(order.orderDate)}</p>
                          <p className="text-[10px] text-slate-400">{order.orderTime || '14:30 PM'}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                          {order.paymentMethod && (
                            <p className="text-[10px] text-slate-500 mt-1">{order.paymentMethod}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(order.status)}
                            {order.shipper && (
                              <p className="text-[10px] text-slate-500 mt-1">ĐVVC: {order.shipper}</p>
                            )}
                            {order.trackingNumber && (
                              <p className="text-[10px] text-slate-400">Mã: {order.trackingNumber}</p>
                            )}
                            {order.cancelReason && (
                              <p className="text-[10px] text-red-500 mt-1">{order.cancelReason}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {order.status === 'pending' && (
                              <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow-sm hover:shadow-md transition-all">
                                Xác nhận
                              </button>
                            )}
                            {order.status === 'confirmed' && (
                              <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Cập nhật
                              </button>
                            )}
                            {order.status === 'shipping' && (
                              <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Theo dõi
                              </button>
                            )}
                            {order.status === 'completed' && (
                              <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Chi tiết
                              </button>
                            )}
                            {order.status === 'cancelled' && (
                              <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Xem lại
                              </button>
                            )}
                            <button className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                              <span className="material-symbols-outlined text-lg">more_vert</span>
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
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500">
                Hiển thị <span className="font-bold text-slate-900 dark:text-white">1 - {filteredOrders.length}</span> trên tổng số{' '}
                <span className="font-bold text-slate-900 dark:text-white">{orders.length}</span> đơn hàng
              </p>
              <div className="flex items-center gap-2">
                <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition-colors disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <button className="size-9 flex items-center justify-center rounded-lg bg-primary text-white font-bold transition-all shadow-md shadow-primary/10">1</button>
                <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors font-medium">2</button>
                <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors font-medium">3</button>
                <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition-colors">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderList;
