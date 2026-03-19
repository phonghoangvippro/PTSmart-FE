import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getOrders } from './orderAPI';
import './MyOrders.css';

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const orders = getOrders();

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  }).filter(order => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return order.orderId.toLowerCase().includes(query) ||
           order.items.some(item => item.name.toLowerCase().includes(query));
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: {
        label: 'Đang xử lý',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400',
        dot: 'bg-blue-500'
      },
      shipping: {
        label: 'Đang giao',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-600 dark:text-yellow-400',
        dot: 'bg-yellow-500'
      },
      completed: {
        label: 'Hoàn thành',
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400',
        dot: 'bg-green-500'
      },
      cancelled: {
        label: 'Đã hủy',
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-600 dark:text-red-400',
        dot: 'bg-red-500'
      }
    };

    const config = statusConfig[status] || statusConfig.processing;
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full ${config.bg} ${config.text} flex items-center`}>
        <span className={`size-2 ${config.dot} rounded-full mr-2`}></span>
        {config.label}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

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
          <div className="flex gap-2">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="material-symbols-outlined mr-2 text-base">support_agent</span>
              Hỗ trợ đơn hàng
            </button>
          </div>
        </div>

        {/* Order Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
          <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-gray-800">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'processing', label: 'Chờ xử lý' },
              { id: 'shipping', label: 'Đang giao' },
              { id: 'completed', label: 'Hoàn thành' },
              { id: 'cancelled', label: 'Đã hủy' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
            <div className="flex gap-2">
              <select className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-primary">
                <option>30 ngày qua</option>
                <option>Trong năm 2024</option>
                <option>Trong năm 2023</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
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
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-primary transition-all overflow-hidden ${
                  order.status === 'cancelled' ? 'opacity-75 grayscale hover:grayscale-0' : ''
                }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Mã đơn:</span>
                      <span className="text-lg font-bold text-primary">{order.orderId}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <span className="material-symbols-outlined text-sm mr-1">calendar_today</span>
                      Ngày đặt: {formatDate(order.orderDate)}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex-1 flex items-center gap-4">
                      {order.items.length > 0 && (
                        <div className="relative">
                          <div className="h-20 w-20 flex-shrink-0 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden p-2">
                            <img alt={order.items[0].name} className="h-full w-full object-contain" src={order.items[0].image} />
                          </div>
                          {order.items.length > 1 && (
                            <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                              +{order.items.length - 1}
                            </div>
                          )}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{order.items[0]?.name}</h4>
                        {order.items.length === 1 ? (
                          <>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Số lượng: {order.items[0].quantity}</p>
                            {order.items[0].gift && (
                              <p className="text-sm font-medium text-accent-pink mt-1 italic">+ {order.items[0].gift}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Và {order.items.length - 1} sản phẩm khác</p>
                        )}
                        {order.cancelReason && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Lý do hủy: {order.cancelReason}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between lg:justify-end gap-8 border-t lg:border-t-0 pt-4 lg:pt-0">
                      <div className="text-left lg:text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tổng cộng</p>
                        <p className={`text-xl font-black text-gray-900 dark:text-white ${order.status === 'cancelled' ? 'line-through opacity-50' : ''}`}>
                          {formatPrice(order.total)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'completed' && (
                          <button className="px-5 py-2.5 border border-primary text-primary rounded-lg text-sm font-bold hover:bg-primary/5 transition-colors">
                            Mua lại
                          </button>
                        )}
                        {order.status === 'cancelled' && (
                          <button className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                            Mua lại
                          </button>
                        )}
                        <button className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>

                  {order.status === 'completed' && order.deliveryDate && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center text-xs text-gray-400">
                      <span className="material-symbols-outlined text-sm mr-1">verified</span>
                      Đã giao thành công vào {formatDate(order.deliveryDate)} bởi {order.shipper || 'Shopee Express'}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:text-primary transition-colors">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:text-primary transition-colors">3</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
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
