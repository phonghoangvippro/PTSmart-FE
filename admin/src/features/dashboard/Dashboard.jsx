import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    {
      label: 'Tổng doanh thu',
      value: '1.250.000.000đ',
      icon: 'payments',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
      trend: '+12.5%',
      trendColor: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      label: 'Tổng đơn hàng',
      value: '1,450',
      icon: 'shopping_cart',
      bgColor: 'bg-secondary/10',
      iconColor: 'text-secondary',
      trend: '+5.2%',
      trendColor: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      label: 'Tổng sản phẩm',
      value: '850',
      icon: 'inventory_2',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
      trend: '+2.1%',
      trendColor: 'text-slate-500 bg-slate-100'
    },
    {
      label: 'Tổng người dùng',
      value: '3,200',
      icon: 'person_add',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      trend: '+10.8%',
      trendColor: 'text-emerald-500 bg-emerald-500/10'
    }
  ];

  const recentOrders = [
    { id: '#ORD-23091', customer: 'Nguyễn Văn A', product: 'iPhone 15 Pro Max...', price: '34.990.000đ', status: 'Đã giao', statusColor: 'bg-emerald-100 text-emerald-700' },
    { id: '#ORD-23092', customer: 'Trần Thị B', product: 'MacBook Air M2 13"...', price: '28.500.000đ', status: 'Đang xử lý', statusColor: 'bg-blue-100 text-blue-700' },
    { id: '#ORD-23093', customer: 'Lê Hoàng C', product: 'Samsung Galaxy S23...', price: '21.490.000đ', status: 'Đã hủy', statusColor: 'bg-pink-100 text-pink-700' }
  ];

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
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`size-12 ${stat.bgColor} ${stat.iconColor} rounded-xl flex items-center justify-center`}>
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <span className={`flex items-center text-xs font-bold ${stat.trendColor} px-2 py-1 rounded-full`}>
                    {stat.trend} <span className="material-symbols-outlined text-xs ml-1">trending_up</span>
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
                  <p className="text-slate-500 text-sm">Thống kê theo từng tháng năm 2023</p>
                </div>
                <select className="text-xs font-bold border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:ring-primary">
                  <option>Năm 2023</option>
                  <option>Năm 2022</option>
                </select>
              </div>
              <div className="relative h-[300px] w-full mt-4">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 150">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#135bec" stopOpacity="0.2"></stop>
                      <stop offset="100%" stopColor="#135bec" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <path d="M0,130 C20,110 40,120 60,90 C80,60 100,80 120,50 C140,20 160,40 180,30 C200,20 220,60 240,70 C260,80 280,40 300,50 C320,60 340,30 360,20 C380,10 400,15 400,15 L400,150 L0,150 Z" fill="url(#chartGradient)"></path>
                  <path d="M0,130 C20,110 40,120 60,90 C80,60 100,80 120,50 C140,20 160,40 180,30 C200,20 220,60 240,70 C260,80 280,40 300,50 C320,60 340,30 360,20 C380,10 400,15 400,15" fill="none" stroke="#135bec" strokeLinecap="round" strokeWidth="3"></path>
                  <circle cx="60" cy="90" fill="#135bec" r="4"></circle>
                  <circle cx="120" cy="50" fill="#135bec" r="4"></circle>
                  <circle cx="180" cy="30" fill="#135bec" r="4"></circle>
                  <circle cx="360" cy="20" fill="#135bec" r="4"></circle>
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
                    <circle cx="16" cy="16" fill="transparent" r="16" stroke="#10b981" strokeDasharray="65 100" strokeWidth="8"></circle>
                    <circle cx="16" cy="16" fill="transparent" r="16" stroke="#135bec" strokeDasharray="20 100" strokeDashoffset="-65" strokeWidth="8"></circle>
                    <circle cx="16" cy="16" fill="transparent" r="16" stroke="#ec4899" strokeDasharray="15 100" strokeDashoffset="-85" strokeWidth="8"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">1.4k</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Đơn hàng</span>
                  </div>
                </div>
                <div className="mt-8 w-full space-y-3">
                  {[
                    { label: 'Đã hoàn thành', percent: '65%', color: 'bg-emerald-500' },
                    { label: 'Đang xử lý', percent: '20%', color: 'bg-primary' },
                    { label: 'Đã hủy', percent: '15%', color: 'bg-secondary' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`size-3 rounded-full ${item.color}`}></div>
                        <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                      </div>
                      <span className="font-bold">{item.percent}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
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
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentOrders.map((order, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-sm text-slate-700 dark:text-slate-300">{order.id}</td>
                      <td className="px-6 py-4 text-sm font-medium">{order.customer}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{order.product}</td>
                      <td className="px-6 py-4 text-sm font-bold text-primary">{order.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 ${order.statusColor} text-xs font-bold rounded-full`}>{order.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="material-symbols-outlined text-slate-400 hover:text-primary">more_vert</button>
                      </td>
                    </tr>
                  ))}
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
