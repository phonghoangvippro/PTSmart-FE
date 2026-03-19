import React, { useState, useEffect } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getDashboardStats, getRevenueChart, getRecentOrders, getOrderStatus } from './dashboardAPI';
import './Dashboard.css';

// Format number to Vietnamese currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
};

// Format growth percentage
const formatGrowth = (value) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value}%`;
};

// Status label map
const statusMap = {
  pending: { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700' },
  shipping: { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-700' },
  completed: { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-700' },
  canceled: { label: 'Đã hủy', color: 'bg-pink-100 text-pink-700' },
};

// Payment method map
const paymentMap = {
  cod: 'COD',
  momo: 'MoMo',
  vnpay: 'VNPay',
  bank_transfer: 'Chuyển khoản',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, revenueRes, ordersRes, statusRes] = await Promise.all([
          getDashboardStats(),
          getRevenueChart(),
          getRecentOrders(),
          getOrderStatus(),
        ]);
        setStats(statsRes);
        setRevenueData(revenueRes);
        setRecentOrders(ordersRes.data || []);
        setOrderStatus(statusRes);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Build stat cards from API data
  const statCards = stats ? [
    {
      label: 'Tổng doanh thu',
      value: formatCurrency(stats.total_revenue),
      icon: 'payments',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
      growth: stats.revenue_growth,
    },
    {
      label: 'Tổng đơn hàng',
      value: new Intl.NumberFormat('vi-VN').format(stats.total_orders),
      icon: 'shopping_cart',
      bgColor: 'bg-secondary/10',
      iconColor: 'text-secondary',
      growth: stats.orders_growth,
    },
    {
      label: 'Tổng sản phẩm',
      value: new Intl.NumberFormat('vi-VN').format(stats.total_products),
      icon: 'inventory_2',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
      growth: stats.products_growth,
    },
    {
      label: 'Tổng người dùng',
      value: new Intl.NumberFormat('vi-VN').format(stats.total_users),
      icon: 'person_add',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      growth: stats.users_growth,
    }
  ] : [];

  // Build revenue chart SVG path from API data
  const buildChartPath = () => {
    if (!revenueData || !revenueData.data) return { linePath: '', areaPath: '', points: [] };

    const data = revenueData.data;
    const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
    const width = 400;
    const height = 150;
    const padding = 10;

    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * width,
      y: padding + (1 - d.revenue / maxRevenue) * (height - 2 * padding),
      revenue: d.revenue,
    }));

    if (points.length < 2) return { linePath: '', areaPath: '', points: [] };

    let linePath = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const cp1x = (points[i - 1].x + points[i].x) / 2;
      const cp1y = points[i - 1].y;
      const cp2x = cp1x;
      const cp2y = points[i].y;
      linePath += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${points[i].x},${points[i].y}`;
    }

    const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

    return { linePath, areaPath, points };
  };

  // Build order status pie chart segments
  const buildPieSegments = () => {
    if (!orderStatus) return [];
    const { percentages } = orderStatus;
    const segments = [];
    const colors = {
      completed: '#10b981',
      confirmed: '#135bec',
      shipping: '#6366f1',
      pending: '#f59e0b',
      canceled: '#ec4899',
    };
    const labels = {
      completed: 'Hoàn thành',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao',
      pending: 'Chờ xử lý',
      canceled: 'Đã hủy',
    };

    let offset = 0;
    for (const [key, pct] of Object.entries(percentages)) {
      if (pct > 0) {
        segments.push({ key, pct, color: colors[key], label: labels[key], offset: -offset });
        offset += pct;
      }
    }
    return segments;
  };

  const { linePath, areaPath, points } = buildChartPath();
  const pieSegments = buildPieSegments();

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen">
          <Header title="Dashboard Tổng quan" />
          <div className="p-8 flex items-center justify-center h-[80vh]">
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
              <p className="mt-4 text-slate-500 font-medium">Đang tải dữ liệu...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Dashboard Tổng quan" />
        
        <div className="p-8">
          {/* Page Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Tổng quan</h2>
              <p className="text-slate-500 mt-1">Tổng quan hiệu suất kinh doanh của hệ thống.</p>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`size-12 ${stat.bgColor} ${stat.iconColor} rounded-xl flex items-center justify-center`}>
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                    stat.growth >= 0 
                      ? 'text-emerald-500 bg-emerald-500/10' 
                      : 'text-red-500 bg-red-500/10'
                  }`}>
                    {formatGrowth(stat.growth)}
                    <span className="material-symbols-outlined text-xs ml-1">
                      {stat.growth >= 0 ? 'trending_up' : 'trending_down'}
                    </span>
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Line Chart: Revenue */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold">Biểu đồ Doanh thu</h3>
                  <p className="text-slate-500 text-sm">Thống kê theo từng tháng năm {revenueData?.year || ''}</p>
                </div>
              </div>
              <div className="relative h-[300px] w-full mt-4">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 150">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#135bec" stopOpacity="0.2"></stop>
                      <stop offset="100%" stopColor="#135bec" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  {areaPath && <path d={areaPath} fill="url(#chartGradient)"></path>}
                  {linePath && <path d={linePath} fill="none" stroke="#135bec" strokeLinecap="round" strokeWidth="3"></path>}
                  {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} fill="#135bec" r="4"></circle>
                  ))}
                </svg>
              </div>
              <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'].map((month, i) => (
                  <span key={i}>{month}</span>
                ))}
              </div>
            </div>

            {/* Pie Chart: Order Status */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
              <h3 className="text-lg font-bold mb-1">Trạng thái Đơn hàng</h3>
              <p className="text-slate-500 text-sm mb-8">Tổng quan hiệu suất xử lý</p>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative size-48">
                  <svg className="size-full -rotate-90" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" fill="transparent" r="16" stroke="#e2e8f0" strokeWidth="8"></circle>
                    {pieSegments.map((seg) => (
                      <circle
                        key={seg.key}
                        cx="16"
                        cy="16"
                        fill="transparent"
                        r="16"
                        stroke={seg.color}
                        strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                        strokeDashoffset={seg.offset}
                        strokeWidth="8"
                      ></circle>
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{orderStatus?.total || 0}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Đơn hàng</span>
                  </div>
                </div>
                <div className="mt-8 w-full space-y-3">
                  {pieSegments.map((seg) => (
                    <div key={seg.key} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full" style={{ backgroundColor: seg.color }}></div>
                        <span className="text-slate-600 dark:text-slate-400">{seg.label}</span>
                      </div>
                      <span className="font-bold">{seg.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          {stats?.top_products && stats.top_products.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold">Top sản phẩm bán chạy</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Sản phẩm</th>
                      <th className="px-6 py-4">Giá</th>
                      <th className="px-6 py-4">Đã bán</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {stats.top_products.map((product, i) => (
                      <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-sm text-slate-400">{i + 1}</td>
                        <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                        <td className="px-6 py-4 text-sm font-bold text-primary">{formatCurrency(product.price)}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                            {product.sold_count} đã bán
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Orders */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold">Đơn hàng gần đây</h3>
              <button className="text-sm font-bold text-primary hover:underline">Xem tất cả</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Mã Đơn</th>
                    <th className="px-6 py-4">Khách hàng</th>
                    <th className="px-6 py-4">Sản phẩm</th>
                    <th className="px-6 py-4">Giá trị</th>
                    <th className="px-6 py-4">Thanh toán</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4">Ngày đặt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentOrders.map((order) => {
                    const status = statusMap[order.status] || { label: order.status, color: 'bg-slate-100 text-slate-700' };
                    const productNames = order.items?.map(item => item.product_name).join(', ') || '';
                    return (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-sm text-slate-700 dark:text-slate-300">{order.order_code}</td>
                        <td className="px-6 py-4 text-sm">
                          <div>
                            <p className="font-medium">{order.user?.name}</p>
                            <p className="text-slate-400 text-xs">{order.user?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate">{productNames}</td>
                        <td className="px-6 py-4 text-sm font-bold text-primary">{formatCurrency(order.total)}</td>
                        <td className="px-6 py-4 text-sm font-medium">{paymentMap[order.payment_method] || order.payment_method}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 ${status.color} text-xs font-bold rounded-full`}>{status.label}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
