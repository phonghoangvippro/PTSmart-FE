import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getProducts, deleteProduct } from './productAPI';
import './ProductList.css';

const formatCurrency = (value) => {
  if (!value) return '0đ';
  return new Intl.NumberFormat('vi-VN').format(Number(value)) + 'đ';
};

const IMG_BASE = 'http://192.168.0.243:8000';

const ProductList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getProducts(page, 15);
      setProducts(res.data || []);
      setPagination({
        currentPage: res.current_page,
        lastPage: res.last_page,
        total: res.total,
        from: res.from || 0,
        to: res.to || 0,
      });
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      fetchProducts(pagination.currentPage);
    } catch (err) {
      alert('Xóa sản phẩm thất bại: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.lastPage) return;
    fetchProducts(page);
  };

  // Client-side search filter
  const filteredProducts = searchQuery
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Hết hàng', color: 'text-accent-pink', bg: 'bg-accent-pink/10' };
    if (stock < 10) return { text: 'Sắp hết', color: 'text-orange-500', bg: 'bg-orange-500/10' };
    return { text: 'Còn hàng', color: 'text-green-500', bg: 'bg-green-500/10' };
  };

  const getStatusBadge = (status) => {
    return status === 1
      ? { text: 'Đang bán', cls: 'bg-emerald-100 text-emerald-700' }
      : { text: 'Ẩn', cls: 'bg-slate-100 text-slate-500' };
  };

  // Build page buttons
  const buildPageButtons = () => {
    const { currentPage, lastPage } = pagination;
    const pages = [];
    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < lastPage - 2) pages.push('...');
      pages.push(lastPage);
    }
    return pages;
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

          {/* Utilities Bar */}
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
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                  <p className="mt-4 text-slate-500 font-medium">Đang tải danh sách sản phẩm...</p>
                </div>
              </div>
            ) : (
              <>
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
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Đã bán</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="px-6 py-16 text-center text-slate-400">
                            <span className="material-symbols-outlined text-4xl mb-2 block">inventory_2</span>
                            {searchQuery ? 'Không tìm thấy sản phẩm phù hợp' : 'Chưa có sản phẩm nào'}
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => {
                          const stockStatus = getStockStatus(product.stock);
                          const statusBadge = getStatusBadge(product.status);
                          const thumbUrl = product.thumbnail
                            ? `${IMG_BASE}${product.thumbnail}`
                            : null;

                          return (
                            <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="size-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1">
                                  {thumbUrl ? (
                                    <img className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt={product.name} src={thumbUrl} />
                                  ) : (
                                    <span className="material-symbols-outlined text-2xl text-slate-300">image</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-900 dark:text-white">{product.name}</span>
                                  <span className="text-xs text-slate-500">
                                    {product.is_featured && (
                                      <span className="inline-flex items-center gap-1 text-amber-600 mr-2">
                                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        Nổi bật
                                      </span>
                                    )}
                                    ★ {product.rating_avg} ({product.review_count})
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  {product.sale_price ? (
                                    <>
                                      <span className="font-bold text-primary">{formatCurrency(product.sale_price)}</span>
                                      <span className="text-xs text-slate-400 line-through">{formatCurrency(product.price)}</span>
                                    </>
                                  ) : (
                                    <span className="font-bold text-primary">{formatCurrency(product.price)}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                  {product.category?.name || '—'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-slate-600 dark:text-slate-400 font-medium uppercase tracking-tight">
                                  {product.brand?.name || '—'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex flex-col items-center">
                                  <span className="text-sm font-bold">{product.stock}</span>
                                  <span className={`text-[10px] ${stockStatus.color} font-bold uppercase tracking-widest`}>
                                    {stockStatus.text}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="text-sm font-bold text-slate-700">{product.sold_count}</span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusBadge.cls}`}>
                                  {statusBadge.text}
                                </span>
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
                                    onClick={() => handleDelete(product.id, product.name)}
                                    disabled={deleting === product.id}
                                    className="p-2 text-accent-pink hover:bg-accent-pink/10 rounded-lg transition-colors disabled:opacity-50"
                                    title="Xóa"
                                  >
                                    <span className="material-symbols-outlined">
                                      {deleting === product.id ? 'progress_activity' : 'delete'}
                                    </span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500">
                    Hiển thị <span className="font-bold text-slate-900 dark:text-white">{pagination.from} - {pagination.to}</span> của{' '}
                    <span className="font-bold text-slate-900 dark:text-white">{pagination.total}</span> sản phẩm
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage <= 1}
                      className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </button>
                    {buildPageButtons().map((page, i) =>
                      page === '...' ? (
                        <span key={`dots-${i}`} className="px-1 text-slate-400">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`size-9 flex items-center justify-center rounded-lg font-medium transition-all ${
                            page === pagination.currentPage
                              ? 'bg-primary text-white font-bold shadow-md shadow-primary/10'
                              : 'border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage >= pagination.lastPage}
                      className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition-colors disabled:opacity-50"
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
    </div>
  );
};

export default ProductList;
