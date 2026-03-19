import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getProductById, updateProduct, createProduct } from './productAPI';
import './ProductEdit.css';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [product, setProduct] = useState({
    name: '',
    category: 'Điện thoại',
    brand: 'Apple',
    price: '0',
    salePrice: '0',
    stock: 0,
    description: '',
    status: 'active',
    images: [],
    specifications: []
  });

  useEffect(() => {
    if (!isNew) {
      const existingProduct = getProductById(id);
      if (existingProduct) {
        const priceNum = existingProduct.price.replace(/[^\d]/g, '') || '0';
        setProduct({
          ...existingProduct,
          price: priceNum,
          salePrice: priceNum,
          description: existingProduct.description || '',
          specifications: existingProduct.specifications || [],
          status: existingProduct.status || 'active'
        });
      }
    }
  }, [id, isNew]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNew) {
      createProduct(product);
    } else {
      updateProduct(id, product);
    }
    navigate('/admin/products');
  };

  const addSpecification = () => {
    setProduct({
      ...product,
      specifications: [...product.specifications, { name: '', value: '' }]
    });
  };

  const removeSpecification = (index) => {
    setProduct({
      ...product,
      specifications: product.specifications.filter((_, i) => i !== index)
    });
  };

  const updateSpecification = (index, field, value) => {
    const newSpecs = [...product.specifications];
    newSpecs[index][field] = value;
    setProduct({ ...product, specifications: newSpecs });
  };

  return (
    <div className="admin-product-edit min-h-screen">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Header title={isNew ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'} showSearch={false} />
        
        <div className="p-4 md:p-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link className="hover:text-primary" to="/admin">Trang chủ</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link className="hover:text-primary" to="/admin/products">Sản phẩm</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-200 font-medium">
              {isNew ? 'Thêm mới' : 'Chỉnh sửa'}
            </span>
          </nav>

          {/* Page Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {isNew ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
              </h1>
              <p className="text-slate-500 mt-1">Cập nhật thông tin chi tiết cho thiết bị điện tử của bạn.</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin/products"
                className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Hủy
              </Link>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-primary/20"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">info</span>
                  Thông tin cơ bản
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tên sản phẩm</label>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:border-primary focus:ring-primary h-12"
                      type="text"
                      value={product.name}
                      onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Danh mục</label>
                      <select
                        className="w-full rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:border-primary focus:ring-primary h-12"
                        value={product.category}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                      >
                        <option>Điện thoại</option>
                        <option>Laptop</option>
                        <option>Máy tính bảng</option>
                        <option>Phụ kiện</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Thương hiệu</label>
                      <select
                        className="w-full rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:border-primary focus:ring-primary h-12"
                        value={product.brand}
                        onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                      >
                        <option>Apple</option>
                        <option>Samsung</option>
                        <option>Xiaomi</option>
                        <option>Sony</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Description Card */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">description</span>
                  Mô tả sản phẩm
                </h3>
                <textarea
                  className="w-full p-4 min-h-[300px] border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-primary dark:bg-slate-800"
                  placeholder="Nhập mô tả chi tiết sản phẩm tại đây..."
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                />
              </section>

              {/* Specifications Section */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">settings_input_component</span>
                  Thông số kỹ thuật
                </h3>
                <div className="space-y-3">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        className="flex-1 rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 h-11 text-sm"
                        placeholder="Tên thông số (VD: RAM)"
                        type="text"
                        value={spec.name}
                        onChange={(e) => updateSpecification(index, 'name', e.target.value)}
                      />
                      <input
                        className="flex-1 rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 h-11 text-sm"
                        placeholder="Giá trị (VD: 8GB)"
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                      />
                      <button
                        onClick={() => removeSpecification(index)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addSpecification}
                    className="flex items-center gap-2 text-sm font-bold text-primary mt-4 hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    Thêm thông số mới
                  </button>
                </div>
              </section>
            </div>

            {/* Right Column: Sidebar Info */}
            <div className="space-y-6">
              {/* Pricing & Inventory */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  Giá & Kho hàng
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-500">Giá bán gốc (₫)</label>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 h-12 font-bold text-lg"
                      type="number"
                      value={product.price}
                      onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-accent-pink">Giá khuyến mãi (₫)</label>
                    <input
                      className="w-full rounded-lg border-accent-pink/30 dark:border-accent-pink/50 dark:bg-slate-800 h-12 font-bold text-lg text-accent-pink focus:ring-accent-pink"
                      type="number"
                      value={product.salePrice}
                      onChange={(e) => setProduct({ ...product, salePrice: e.target.value })}
                    />
                  </div>
                  <hr className="border-slate-100 dark:border-slate-800 my-4" />
                  <div>
                    <label className="block text-sm font-semibold mb-2">Số lượng tồn kho</label>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 h-12"
                      type="number"
                      value={product.stock}
                      onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </section>

              {/* Image Upload Section */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">image</span>
                  Hình ảnh sản phẩm
                </h3>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                  <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">add_photo_alternate</span>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Kéo thả hoặc Click để tải lên</p>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG tối đa 5MB</p>
                </div>
              </section>

              {/* Status Selection */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Trạng thái hiển thị</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-primary bg-primary/5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={product.status === 'active'}
                      onChange={() => setProduct({ ...product, status: 'active' })}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-semibold">Đang kinh doanh</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                    <input
                      type="radio"
                      name="status"
                      checked={product.status === 'draft'}
                      onChange={() => setProduct({ ...product, status: 'draft' })}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-semibold">Tạm ngưng / Nháp</span>
                  </label>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductEdit;
