import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import WishlistButton from '../../shared/components/WishlistButton';
import { fetchProductDetail, fetchProductReviews } from './productAPI';
import { addCartItem } from '../cart/cartAPI';
import './ProductDetail.css';

const API_BASE_URL = 'http://192.168.0.243:8000';

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/400x400?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + '₫';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewPagination, setReviewPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchProductDetail(id);
        setProduct(res.data || null);
        setRelated(res.related || []);
        setSelectedImage(0);
        setQuantity(1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product?.id && activeTab === 'reviews') {
      const loadReviews = async () => {
        try {
          const res = await fetchProductReviews(product.id);
          setReviews(res.data || []);
          setReviewPagination({ total: res.total, lastPage: res.last_page });
        } catch (err) {
          console.error('Error loading reviews:', err);
        }
      };
      loadReviews();
    }
  }, [product?.id, activeTab]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addCartItem(product.id, quantity, null);
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setAddingToCart(true);
      await addCartItem(product.id, quantity, null);
      navigate('/checkout');
    } catch (err) {
      alert('Lỗi: ' + err.message);
      setAddingToCart(false);
    }
  };

  const renderStars = (rating) => {
    const r = Number(rating) || 0;
    const fullStars = Math.floor(r);
    const hasHalfStar = r % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`f${i}`} className="material-symbols-outlined filled-icon text-lg">star</span>
        ))}
        {hasHalfStar && <span className="material-symbols-outlined filled-icon text-lg">star_half</span>}
        {[...Array(Math.max(0, emptyStars))].map((_, i) => (
          <span key={`e${i}`} className="material-symbols-outlined text-lg">star</span>
        ))}
      </>
    );
  };

  // Loading
  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error / Not found
  if (error || !product) {
    return (
      <div className="product-detail-page">
        <Header />
        <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6">
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
            <h2 className="text-2xl font-bold mb-4">{error || 'Sản phẩm không tồn tại'}</h2>
            <Link to="/san-pham" className="text-primary hover:underline">Quay lại danh sách sản phẩm</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasDiscount = product.sale_price && Number(product.sale_price) < Number(product.price);
  const displayPrice = hasDiscount ? product.sale_price : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.price) - Number(product.sale_price)) / Number(product.price)) * 100)
    : null;

  // Build image gallery from product.images + thumbnail
  const images = [];
  if (product.thumbnail) images.push(getImageUrl(product.thumbnail));
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      const url = getImageUrl(img.image_url || img.url || img);
      if (!images.includes(url)) images.push(url);
    });
  }
  if (images.length === 0) images.push('https://placehold.co/400x400?text=No+Image');

  return (
    <div className="product-detail-page">
      <Header />

      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link className="hover:text-primary" to="/">Trang chủ</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          {product.category && (
            <>
              <Link className="hover:text-primary" to={`/san-pham?category=${product.category.slug}`}>{product.category.name}</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
            </>
          )}
          <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden aspect-square border border-[#e7ebf3] dark:border-gray-800 p-8 flex items-center justify-center">
              <img alt={product.name} className="w-full h-auto object-contain" src={images[selectedImage] || images[0]} />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.slice(0, 5).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white dark:bg-gray-900 rounded-lg p-2 overflow-hidden transition-colors ${
                      selectedImage === index
                        ? 'border-2 border-primary'
                        : 'border border-[#e7ebf3] dark:border-gray-800 hover:border-primary/50'
                    }`}
                  >
                    <img alt={`View ${index + 1}`} className="w-full h-full object-contain" src={img} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-7 flex flex-col">
            {product.brand && (
              <p className="text-sm text-slate-400 mb-1">{product.brand.name}</p>
            )}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-3xl font-bold text-[#0d121b] dark:text-white mb-2 leading-tight">{product.name}</h1>
              <WishlistButton productId={product.id} size="md" className="shrink-0 mt-1" />
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-yellow-400">
                {renderStars(product.rating_avg)}
              </div>
              <span className="text-sm text-[#4c669a] underline decoration-dotted">{product.review_count || 0} đánh giá</span>
              <span className="h-4 w-px bg-gray-300"></span>
              <span className="text-sm text-[#4c669a]">Đã bán {product.sold_count > 1000 ? `${(product.sold_count / 1000).toFixed(1)}k` : product.sold_count || 0}</span>
            </div>

            {/* Price Section */}
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 mb-6">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-3xl font-bold text-primary">{formatPrice(displayPrice)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                    <span className="bg-accent-pink text-white text-xs font-bold px-2 py-1 rounded">-{discountPercent}%</span>
                  </>
                )}
              </div>
              {product.stock > 0 ? (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Còn hàng ({product.stock} sản phẩm)
                </p>
              ) : (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  Hết hàng
                </p>
              )}
            </div>

            {/* Selection and Actions */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold">Số lượng:</span>
                <div className="flex items-center border border-[#e7ebf3] dark:border-gray-800 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >-</button>
                  <span className="px-4 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                    className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >+</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock <= 0}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                  {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={addingToCart || product.stock <= 0}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl bg-accent-pink text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-accent-pink/20 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">bolt</span>
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Sections */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="border-b border-[#e7ebf3] dark:border-gray-800 mb-8 flex gap-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 font-medium transition-colors ${activeTab === 'description' ? 'text-primary font-bold border-b-2 border-primary' : 'text-[#4c669a] hover:text-primary'}`}
              >Mô tả sản phẩm</button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-4 font-medium transition-colors ${activeTab === 'specs' ? 'text-primary font-bold border-b-2 border-primary' : 'text-[#4c669a] hover:text-primary'}`}
              >Thông số kỹ thuật</button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 font-medium transition-colors ${activeTab === 'reviews' ? 'text-primary font-bold border-b-2 border-primary' : 'text-[#4c669a] hover:text-primary'}`}
              >Đánh giá ({product.review_count || 0})</button>
            </div>

            {activeTab === 'description' && (
              <article className="prose prose-slate max-w-none dark:prose-invert">
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p className="text-gray-500">Chưa có mô tả cho sản phẩm này.</p>
                )}
              </article>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-4">
                {product.specifications ? (
                  <div dangerouslySetInnerHTML={{ __html: product.specifications }} />
                ) : (
                  <p className="text-gray-500">Chưa có thông số kỹ thuật.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-[#e7ebf3] dark:border-gray-800">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-2">rate_review</span>
                    <p className="text-slate-500">Chưa có đánh giá nào cho sản phẩm này.</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="flex gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl border border-[#e7ebf3] dark:border-gray-800">
                      <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                        {(review.user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold">{review.user?.name || 'Ẩn danh'}</h5>
                          <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 mb-3">
                          {[...Array(review.rating || 5)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined filled-icon text-xs">star</span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            {/* Related Products */}
            {related.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-[#e7ebf3] dark:border-gray-800 overflow-hidden mb-8">
                <div className="p-4 bg-primary text-white font-bold">Sản phẩm liên quan</div>
                <div className="p-4 space-y-4">
                  {related.slice(0, 4).map((rp) => {
                    const rpHasDiscount = rp.sale_price && Number(rp.sale_price) < Number(rp.price);
                    return (
                      <Link key={rp.id} to={`/product/${rp.id}`} className="flex gap-3 group">
                        <img
                          src={getImageUrl(rp.thumbnail)}
                          alt={rp.name}
                          className="w-16 h-16 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{rp.name}</p>
                          <p className="text-sm font-bold text-primary mt-1">{formatPrice(rpHasDiscount ? rp.sale_price : rp.price)}</p>
                          {rpHasDiscount && (
                            <p className="text-xs text-slate-400 line-through">{formatPrice(rp.price)}</p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Warranty Promo */}
            <div className="rounded-xl bg-gradient-to-br from-primary to-accent-pink p-6 text-white overflow-hidden relative group">
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-2">Gói bảo hành vàng</h4>
                <p className="text-sm opacity-90 mb-4">Chỉ từ 990k - 1 đổi 1 trong 12 tháng tại hệ thống PTSmart.</p>
                <button className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold">Tìm hiểu thêm</button>
              </div>
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">shield</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
