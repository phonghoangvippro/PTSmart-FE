import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getProducts } from './productAPI';
import './ProductList.css';

const ProductList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const products = getProducts();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price) => {
    return price.replace('₫', 'đ');
  };

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return { text: 'Hết hàng', color: 'text-accent-pink', bg: 'bg-accent-pink/10' };
    } else if (stock < 10) {
      return { text: 'Sắp hết', color: 'text-orange-500', bg: 'bg-orange-500/10' };
    }
    return { text: 'Còn hàng', color: 'text-green-500', bg: 'bg-green-500/10' };
  };

  const getCategoryBadge = (category) => {
    const badges = {
      'Điện thoại': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Laptop': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      'Máy tính bảng': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
    };
    return badges[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="admin-product-list flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Quản lý sản phẩm" showSearch={false} />
        
        <div className="p-8">
          {/* Page Title & Main Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Danh sách sản phẩm</h2>
              <p className="text-slate-500 mt-1">Quản lý thông tin, giá cả và tồn kho của các thiết bị điện tử.</p>
            </div>
            <Link
              to="/admin/products/new"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Thêm sản phẩm mới
            </Link>
          </div>

          {/* Utilities Bar: Search and Filters */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-background-light dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400"
                  placeholder="Tìm kiếm tên sản phẩm, thương hiệu..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-background-light dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Bộ lọc
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-background-light dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-lg">file_download</span>
                Xuất Excel
              </button>
            </div>
          </div>

          {/* Data Table Container */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Hình ảnh</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tên sản phẩm</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Giá bán</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Danh mục</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Thương hiệu</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Tồn kho</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock || 42);
                    return (
                      <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="size-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1">
                            <img
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                              alt={product.name}
                              src={product.image}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 dark:text-white">{product.name}</span>
                            <span className="text-xs text-slate-500">SKU: PTS-{product.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryBadge(product.category || 'Điện thoại')}`}>
                            {product.category || 'Điện thoại'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-600 dark:text-slate-400 font-medium uppercase tracking-tight">{product.brand}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-bold">{product.stock || 42}</span>
                            <span className={`text-[10px] ${stockStatus.color} font-bold uppercase tracking-widest`}>
                              {stockStatus.text}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/products/${product.id}/edit`}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <span className="material-symbols-outlined">edit</span>
                            </Link>
                            <button
                              className="p-2 text-accent-pink hover:bg-accent-pink/10 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500">
                Hiển thị <span className="font-bold text-slate-900 dark:text-white">1 - {filteredProducts.length}</span> của{' '}
                <span className="font-bold text-slate-900 dark:text-white">{filteredProducts.length}</span> sản phẩm
              </p>
              <div className="flex items-center gap-2">
                <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition-colors disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <button className="size-9 flex items-center justify-center rounded-lg bg-primary text-white font-bold transition-all shadow-md shadow-primary/10">1</button>
                <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors font-medium">2</button>
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

export default ProductList;
