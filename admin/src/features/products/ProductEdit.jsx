import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getProducts, createProduct, updateProduct, uploadProductImages } from './productAPI';
import { getCategories } from '../categories/categoryAPI';
import { getBrands } from '../brands/brandAPI';
import './ProductEdit.css';

const IMG_BASE = 'http://192.168.0.243:8000';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnPage = searchParams.get('page') || '1';
  const isNew = !id;
  const backUrl = `/admin/products?page=${returnPage}`;

  const [product, setProduct] = useState({
    name: '',
    description: '',
    category_id: '',
    brand_id: '',
    price: '',
    sale_price: '',
    stock: 0,
    is_featured: false,
    status: 1,
    specifications: [],
  });
  const [categories, setCategories] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load categories and product data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load categories
        const catRes = await getCategories();
        const flatCats = Array.isArray(catRes) ? catRes : (catRes.data || []);
        const allCats = [];
        const flatten = (items, prefix = '') => {
          items.forEach(c => {
            allCats.push({ id: c.id, name: prefix + c.name });
            if (c.children && c.children.length > 0) {
              flatten(c.children, prefix + '— ');
            }
          });
        };
        flatten(flatCats);
        setCategories(allCats);

        // Load brands
        const brandsData = await getBrands();
        setBrandsList(brandsData);

        // Load product for edit
        // Backend không có GET /products/{id}, dùng list API với đúng trang
        if (id) {
          const productId = parseInt(id);
          const targetPage = parseInt(returnPage) || 1;
          let found = null;

          // Tìm trong trang hiện tại trước (nhanh nhất)
          const res = await getProducts(targetPage, 15);
          found = (res.data || []).find(p => p.id === productId) || null;

          // Nếu không thấy (ví dụ user vào URL trực tiếp không có ?page),
          // thử tìm ở các trang lân cận
          if (!found && targetPage > 1) {
            const prevRes = await getProducts(targetPage - 1, 15);
            found = (prevRes.data || []).find(p => p.id === productId) || null;
          }
          if (!found) {
            const nextRes = await getProducts(targetPage + 1, 15);
            found = (nextRes.data || []).find(p => p.id === productId) || null;
          }

          if (found) {
            setProduct({
              name: found.name || '',
              description: found.description || '',
              category_id: found.category_id || '',
              brand_id: found.brand_id || '',
              price: found.price || '',
              sale_price: found.sale_price || '',
              stock: found.stock || 0,
              is_featured: !!found.is_featured,
              status: found.status ?? 1,
              specifications: found.specifications || [],
            });
            if (found.thumbnail) {
              setThumbnailPreview(`${IMG_BASE}${found.thumbnail}`);
            }
            if (found.images && found.images.length > 0) {
              setExistingImages(found.images);
            }
          } else {
            setError(`Không tìm thấy sản phẩm ID: ${id}`);
          }
        }
      } catch (err) {
        console.error('Load error:', err);
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    const previews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description || '');
      formData.append('category_id', product.category_id);
      formData.append('brand_id', product.brand_id);
      formData.append('price', product.price);
      if (product.sale_price) formData.append('sale_price', product.sale_price);
      formData.append('stock', product.stock);
      formData.append('is_featured', product.is_featured ? '1' : '0');
      formData.append('status', product.status);

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      // Attach images for create
      if (isNew) {
        imageFiles.forEach((file, i) => {
          formData.append(`images[${i}]`, file);
        });
      }

      let result;
      if (isNew) {
        result = await createProduct(formData);
        // Upload additional images if any (for create with separate endpoint)
        if (imageFiles.length > 0 && result.data?.id) {
          try {
            await uploadProductImages(result.data.id, imageFiles);
          } catch (imgErr) {
            console.warn('Image upload failed:', imgErr);
          }
        }
      } else {
        result = await updateProduct(id, formData);
        // Upload new images for existing product
        if (imageFiles.length > 0) {
          try {
            await uploadProductImages(id, imageFiles);
          } catch (imgErr) {
            console.warn('Image upload failed:', imgErr);
          }
        }
      }

      navigate(backUrl);
    } catch (err) {
      setError(err.message || 'Lưu sản phẩm thất bại');
    } finally {
      setSaving(false);
    }
  };

  const addSpecification = () => {
    setProduct({
      ...product,
      specifications: [...(product.specifications || []), { name: '', value: '' }]
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

  if (loading) {
    return (
      <div className="admin-product-edit min-h-screen">
        <Sidebar />
        <main className="ml-64 min-h-screen">
          <Header title={isNew ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'} showSearch={false} />
          <div className="p-8 flex items-center justify-center h-[60vh]">
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
    <div className="admin-product-edit min-h-screen">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Header title={isNew ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'} showSearch={false} />

        <div className="p-4 md:p-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link className="hover:text-primary" to="/admin">Trang chủ</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link
                className="hover:text-primary" to={backUrl}>Sản phẩm</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-200 font-medium">
              {isNew ? 'Thêm mới' : 'Chỉnh sửa'}
            </span>
          </nav>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <span className="material-symbols-outlined">error</span>
              <span className="text-sm font-medium">{error}</span>
              <button onClick={() => setError(null)} className="ml-auto"><span className="material-symbols-outlined text-lg">close</span></button>
            </div>
          )}

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
                to={backUrl}
                className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Hủy
              </Link>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">info</span>
                  Thông tin cơ bản
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tên sản phẩm *</label>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:border-primary focus:ring-primary h-12"
                      type="text"
                      value={product.name}
                      onChange={(e) => setProduct({ ...product, name: e.target.value })}
                      placeholder="VD: iPhone 15 Pro Max 256GB"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Danh mục *</label>
                      <select
                        className="w-full rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:border-primary focus:ring-primary h-12"
                        value={product.category_id}
                        onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Thương hiệu *</label>
                      <select
                        className="w-full rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:border-primary focus:ring-primary h-12"
                        value={product.brand_id}
                        onChange={(e) => setProduct({ ...product, brand_id: e.target.value })}
                      >
                        <option value="">Chọn thương hiệu</option>
                        {brandsList.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Description */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">description</span>
                  Mô tả sản phẩm
                </h3>
                <textarea
                  className="w-full p-4 min-h-[200px] border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-primary dark:bg-slate-800"
                  placeholder="Nhập mô tả chi tiết sản phẩm tại đây..."
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                />
              </section>

              {/* Specifications */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">settings_input_component</span>
                  Thông số kỹ thuật
                </h3>
                <div className="space-y-3">
                  {(product.specifications || []).map((spec, index) => (
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
                      <button onClick={() => removeSpecification(index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                  <button onClick={addSpecification} className="flex items-center gap-2 text-sm font-bold text-primary mt-4 hover:underline">
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    Thêm thông số mới
                  </button>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Pricing & Inventory */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  Giá & Kho hàng
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-500">Giá bán gốc (₫) *</label>
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
                      value={product.sale_price}
                      onChange={(e) => setProduct({ ...product, sale_price: e.target.value })}
                    />
                  </div>
                  <hr className="border-slate-100 dark:border-slate-800 my-4" />
                  <div>
                    <label className="block text-sm font-semibold mb-2">Số lượng tồn kho *</label>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 h-12"
                      type="number"
                      value={product.stock}
                      onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </section>

              {/* Thumbnail Upload */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">image</span>
                  Ảnh đại diện (thumbnail)
                </h3>
                {thumbnailPreview ? (
                  <div className="relative group">
                    <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-48 object-contain rounded-lg bg-slate-50 border border-slate-200" />
                    <button
                      onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">add_photo_alternate</span>
                    <p className="text-xs font-medium text-slate-600">Click để tải lên ảnh thumbnail</p>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG tối đa 5MB</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                  </label>
                )}
              </section>

              {/* Product Images */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">collections</span>
                  Hình ảnh sản phẩm
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {/* Existing images */}
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img src={`${IMG_BASE}${img.image_url}`} alt="Product" className="w-full h-20 object-cover rounded-lg border border-slate-200" />
                    </div>
                  ))}
                  {/* New image previews */}
                  {imagePreviews.map((preview, i) => (
                    <div key={`new-${i}`} className="relative group">
                      <img src={preview} alt="New" className="w-full h-20 object-cover rounded-lg border border-primary/30" />
                      <button
                        onClick={() => removeNewImage(i)}
                        className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>
                  ))}
                </div>
                <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4 flex items-center justify-center gap-2 text-center hover:border-primary transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                  <span className="material-symbols-outlined text-lg text-slate-400">add</span>
                  <span className="text-xs font-medium text-slate-600">Thêm ảnh</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImagesChange} />
                </label>
              </section>

              {/* Status & Featured */}
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Trạng thái & Nổi bật</h3>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${product.status === 1 ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}>
                    <input type="radio" name="status" checked={product.status === 1} onChange={() => setProduct({ ...product, status: 1 })} className="text-primary focus:ring-primary" />
                    <span className="text-sm font-semibold">Đang kinh doanh</span>
                  </label>
                  <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${product.status === 0 ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}>
                    <input type="radio" name="status" checked={product.status === 0} onChange={() => setProduct({ ...product, status: 0 })} className="text-primary focus:ring-primary" />
                    <span className="text-sm font-semibold">Tạm ngưng / Ẩn</span>
                  </label>
                  <hr className="border-slate-100 dark:border-slate-800" />
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-amber-50 transition-colors">
                    <input type="checkbox" checked={product.is_featured} onChange={(e) => setProduct({ ...product, is_featured: e.target.checked })} className="text-amber-500 focus:ring-amber-500 rounded" />
                    <div>
                      <span className="text-sm font-semibold">Sản phẩm nổi bật</span>
                      <p className="text-[10px] text-slate-400">Hiển thị trên trang chủ</p>
                    </div>
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
