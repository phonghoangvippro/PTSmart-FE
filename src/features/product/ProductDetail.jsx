import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getProductById } from './productAPI';
import { addToCart } from '../cart/cartAPI';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(parseInt(id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div className="product-detail-page">
        <Header />
        <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Sản phẩm không tồn tại</h2>
            <Link to="/laptops" className="text-primary hover:underline">Quay lại danh sách sản phẩm</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Mock data for product detail
  const productDetail = {
    ...product,
    images: [
      product.image,
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB8I6Ym1WMcs2-YGte428tUx_gcOBll13hC6eNUk_GMz4geYGXKVhA7cP4oqJsm2d58KGpoeahPlEdQ_RM0MgXkz_ZJQSMgjfqVMZAwnZ06E_b8e1drjEkRzP0ETTyyAn4oPqAqXtROAVSWN4N7p5ffciKMEJUyfOaR3r7_CtWWuc3Nmge18So1ZN1ly4p5VOC3rZn2eUWaiqcAuOzHoEvts1iN918-4zEwQR2Tnp4tV4hP6ITcOW4R_FLTE-RYrzfO7hm8j3f-kg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4TSb1H-An0FUk__jpR16UxEGnHBMxpgAVoSJlmix0Wz3lytHlzG9cF5RRdvTBAcpbOj0F-yiGPXYjI6NJhlwQLWnsM0t5QjC576bA9MkXDzYsKM34GLYX9eVs9Ba3p2HPBHVFUkahwYpmEMxBCWZ7sFZxnJtf4ouzwucAPGzgeYImWQvSoT9CwLAf6k0fbvuTdmvNWuv3MfQ8dIML6sakvfao25rzMd_URyzCQBLr49RGRoXNuA1dmAawxE7TCSAJIr2DHLlVTg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKwfc0jgs8Mx1L-jidwmHxPRXqW7W5Krs__zOoW8o8NM-9mtw4sNyL1RUrFtr2MKJ3CTG-okNkYFgLlxfdHiKohpona6isDX8TvFbHF02Lzv1mLVYvNYRO_2HliypvuI2eSQ1Xj4efxGpQekhyzk465lUCy2yKDat2aKb2j8ghes2lTZK61ndmDfE4f-RtE-nNZETjgC8nBBYfSG4OsZ2-qDuZEQRpjp_lqfI04ct1V0PcDR14AcBEHcVM657XnPlKh2fnvM_JnA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgUlPTichiQ2jfujA8tCocufd_5hE1fcGKZzA3JjbePgEm6tlY1wkOygmHmWcBJ3KJ_UlzIj-HcOR9xLElBCyoKLzkAAnxguPYkSOdAjFX48oBdasEcR-O2ewbhGdStlGjnaLbLcvkIS3L50B5ATTpGY414w7O5ZOoG_mHTVYnPQsTHN-laKDcHe_gU0XW_Q6ySDpSGWbciWJQL9HGv0sLW6jtxA1Yc5GLqqCgGprljEKCTbTw2c1zsjJpKcQts2o5npRHAUwM4A'
    ],
    specs: {
      screen: '6.7 inch, Super Retina XDR',
      os: 'iOS 17',
      rearCamera: '48MP + 12MP + 12MP',
      frontCamera: '12MP',
      chipset: 'Apple A17 Pro 6 nhân',
      ram: '8 GB',
      storage: '256 GB',
      battery: '4422 mAh, 20W'
    },
    description: {
      title1: 'Mạnh mẽ vượt trội với Chip A17 Pro',
      content1: `${product.name} đánh dấu bước nhảy vọt lớn nhất từ trước đến nay về hiệu năng đồ họa. Sử dụng chip A17 Pro tiến trình 3nm đầu tiên trong ngành, thiết bị mang lại trải nghiệm chơi game mượt mà chưa từng có và khả năng xử lý đa nhiệm tuyệt vời.`,
      title2: 'Khung viền Titan bền bỉ',
      content2: 'Sản phẩm được chế tác từ Titan chuẩn hàng không vũ trụ, mang đến độ bền cực cao nhưng lại có trọng lượng nhẹ nhất. Các cạnh bo tròn tinh tế tạo cảm giác cầm nắm thoải mái hơn.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3NXB5OylqsswiXBRBZe1KpYu9nonCKqouQy9T9zrreine9T4xQBVbs0bEgb3Y09wEgdGX1DiDJcktwRhUh-DIFNJnHBFK846IyKqEKtv-NI4Pi9YcRj9sRxzGGOI6qsC78jR4jEP1PAjjnd4MHkWEjK8zsiwP8M1mv4U5BrA34y2xaD7AdykKLRMFz-nqEaosOz--Uz6s1L_Qv0Md0li_f9-nnE7yXwH7sbpbVyTT1OYLdgDD8zkBN4fVDTOoLVXd3RMi2P4SKw'
    },
    sold: '1.2k',
    inStock: true,
    stockLocation: 'PTSmart 123 Thái Hà',
    promotions: [
      'Giảm thêm 500.000₫ khi thanh toán qua Apple Pay.',
      'Tặng ốp lưng chính hãng trị giá 1.200.000₫.'
    ]
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="material-symbols-outlined filled-icon text-lg">star</span>
        ))}
        {hasHalfStar && (
          <span className="material-symbols-outlined filled-icon text-lg">star_half</span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="material-symbols-outlined text-lg">star</span>
        ))}
      </>
    );
  };

  return (
    <div className="product-detail-page">
      <Header />

      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link className="hover:text-primary" to="/">Trang chủ</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link className="hover:text-primary" to="/laptops">Điện thoại</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden aspect-square border border-[#e7ebf3] dark:border-gray-800 p-8 flex items-center justify-center">
              <img alt={product.name} className="w-full h-auto object-contain" src={productDetail.images[selectedImage]} />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {productDetail.images.slice(0, 5).map((img, index) => (
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
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-7 flex flex-col">
            <h1 className="text-3xl font-bold text-[#0d121b] dark:text-white mb-2 leading-tight">{product.name}</h1>
            
            {/* Ratings */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-yellow-400">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-[#4c669a] underline decoration-dotted">{product.reviews} đánh giá</span>
              <span className="h-4 w-px bg-gray-300"></span>
              <span className="text-sm text-[#4c669a]">Đã bán {productDetail.sold}</span>
            </div>

            {/* Price Section */}
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 mb-6">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-3xl font-bold text-primary">{product.price}</span>
                {product.oldPrice && (
                  <span className="text-lg text-gray-400 line-through">{product.oldPrice}</span>
                )}
                {product.discount && (
                  <span className="bg-accent-pink text-white text-xs font-bold px-2 py-1 rounded">-15%</span>
                )}
              </div>
              {productDetail.inStock && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Còn hàng tại {productDetail.stockLocation}
                </p>
              )}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              <div className="p-3 border border-[#e7ebf3] dark:border-gray-800 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">memory</span>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Chipset</p>
                  <p className="text-sm font-medium">{productDetail.specs.chipset}</p>
                </div>
              </div>
              <div className="p-3 border border-[#e7ebf3] dark:border-gray-800 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">smartphone</span>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Màn hình</p>
                  <p className="text-sm font-medium">{productDetail.specs.screen}</p>
                </div>
              </div>
              <div className="p-3 border border-[#e7ebf3] dark:border-gray-800 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">camera</span>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Camera</p>
                  <p className="text-sm font-medium">{productDetail.specs.rearCamera}</p>
                </div>
              </div>
            </div>

            {/* Selection and Actions */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold">Số lượng:</span>
                <div className="flex items-center border border-[#e7ebf3] dark:border-gray-800 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    addToCart(product, '', quantity);
                    alert('Đã thêm sản phẩm vào giỏ hàng!');
                  }}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors"
                >
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={() => {
                    navigate('/checkout', {
                      state: {
                        productId: product.id,
                        quantity: quantity
                      }
                    });
                  }}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl bg-accent-pink text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-accent-pink/20"
                >
                  <span className="material-symbols-outlined">bolt</span>
                  Mua ngay
                </button>
              </div>
            </div>

            {/* Promotions */}
            <div className="mt-8 p-4 border border-dashed border-primary rounded-xl bg-primary/5">
              <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">card_giftcard</span>
                Khuyến mãi đặc biệt
              </h4>
              <ul className="text-sm space-y-2">
                {productDetail.promotions.map((promo, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-primary">•</span>
                    {promo}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detail Sections */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Details & Description */}
          <div className="lg:col-span-8">
            <div className="border-b border-[#e7ebf3] dark:border-gray-800 mb-8 flex gap-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-[#4c669a] hover:text-primary'
                }`}
              >
                Mô tả sản phẩm
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-4 font-medium transition-colors ${
                  activeTab === 'specs'
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-[#4c669a] hover:text-primary'
                }`}
              >
                Thông số kỹ thuật
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 font-medium transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-[#4c669a] hover:text-primary'
                }`}
              >
                Đánh giá ({product.reviews})
              </button>
            </div>

            {activeTab === 'description' && (
              <article className="prose prose-slate max-w-none dark:prose-invert">
                <h3 className="text-2xl font-bold mb-4">{productDetail.description.title1}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {productDetail.description.content1}
                </p>
                <div className="rounded-xl overflow-hidden mb-6">
                  <img alt="Product Lifestyle" className="w-full" src={productDetail.description.image} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{productDetail.description.title2}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {productDetail.description.content2}
                </p>
              </article>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-500 w-1/3">Màn hình</td>
                      <td className="py-3 font-medium">{productDetail.specs.screen}</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-500">Hệ điều hành</td>
                      <td className="py-3 font-medium">{productDetail.specs.os}</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-500">Camera sau</td>
                      <td className="py-3 font-medium">{productDetail.specs.rearCamera}</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-500">Camera trước</td>
                      <td className="py-3 font-medium">{productDetail.specs.frontCamera}</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-500">Chipset</td>
                      <td className="py-3 font-medium">{productDetail.specs.chipset}</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-500">RAM</td>
                      <td className="py-3 font-medium">{productDetail.specs.ram}</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-500">Bộ nhớ trong</td>
                      <td className="py-3 font-medium">{productDetail.specs.storage}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-500">Pin</td>
                      <td className="py-3 font-medium">{productDetail.specs.battery}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <div className="flex gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl border border-[#e7ebf3] dark:border-gray-800">
                  <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">NV</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold">Nguyễn Văn A</h5>
                      <span className="text-xs text-gray-400">2 ngày trước</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined filled-icon text-xs">star</span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Máy quá đẹp, nhẹ hơn hẳn đời trước. Pin dùng rất trâu, shop giao hàng nhanh.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Full Specs Table Side */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-[#e7ebf3] dark:border-gray-800 overflow-hidden">
              <div className="p-4 bg-primary text-white font-bold">
                Thông số kỹ thuật chi tiết
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-500 w-1/3">Màn hình</td>
                      <td className="py-3 font-medium">{productDetail.specs.screen}</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-500">Hệ điều hành</td>
                      <td className="py-3 font-medium">{productDetail.specs.os}</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-500">Camera sau</td>
                      <td className="py-3 font-medium">{productDetail.specs.rearCamera}</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-500">Camera trước</td>
                      <td className="py-3 font-medium">{productDetail.specs.frontCamera}</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-500">Chipset</td>
                      <td className="py-3 font-medium">{productDetail.specs.chipset}</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-500">RAM</td>
                      <td className="py-3 font-medium">{productDetail.specs.ram}</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-gray-500">Bộ nhớ trong</td>
                      <td className="py-3 font-medium">{productDetail.specs.storage}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-500">Pin</td>
                      <td className="py-3 font-medium">{productDetail.specs.battery}</td>
                    </tr>
                  </tbody>
                </table>
                <button className="w-full mt-4 py-2 text-primary font-bold text-sm bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                  Xem tất cả thông số
                </button>
              </div>
            </div>

            {/* Related Products Ad */}
            <div className="mt-8 rounded-xl bg-gradient-to-br from-primary to-accent-pink p-6 text-white overflow-hidden relative group">
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
