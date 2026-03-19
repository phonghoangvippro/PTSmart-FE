import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <Header />

      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6 space-y-12">
        {/* Hero Slider Section */}
        <section className="relative h-[400px] w-full rounded-3xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCJbOqFvUc5mIfiezLHo71OO3l8vlUcpTb3Dgi1274LnaD9yF4EzHEj8lW7fg2uGR82mRLkkZQ5kwYyYQA6RdPWEKe_kx0IzI7VPYeJ4Lu_KDckNle4BAHA22drcmzA2ZWLQ-xJ9WZpHdBF2sdCo2751C7m3IPzU307A0NOnY60Z95uCHWUZsm0Xkbr8jv1lDGFqCTIZz07Gyudgb0eXD0LVjJ5R5xZzFlScMi33636ru00btdbEPfbV8lvu6awe4BLQFFE3m-W3Q')" }}></div>
          <div className="relative z-20 h-full flex flex-col justify-center px-12 max-w-2xl text-white space-y-4">
            <span className="bg-accent-pink/20 text-accent-pink px-4 py-1 rounded-full text-sm font-bold w-fit border border-accent-pink/30">SIÊU TIỆC CÔNG NGHỆ</span>
            <h2 className="text-5xl font-extrabold leading-tight">Laptop Gaming <br/>Thế Hệ Mới</h2>
            <p className="text-lg text-white/80">Giảm giá lên đến 5,000,000đ khi thanh toán qua thẻ tín dụng. Hỗ trợ trả góp 0% lãi suất.</p>
            <div className="flex gap-4 pt-4">
              <button className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">Mua ngay</button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold transition-all border border-white/30">Xem chi tiết</button>
            </div>
          </div>
          {/* Slider Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            <div className="h-2 w-8 bg-white rounded-full"></div>
            <div className="h-2 w-2 bg-white/40 rounded-full"></div>
            <div className="h-2 w-2 bg-white/40 rounded-full"></div>
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">grid_view</span>
              Danh mục nổi bật
            </h2>
            <Link className="text-primary font-semibold flex items-center hover:underline text-sm" to="/laptops">
              Xem tất cả <span className="material-symbols-outlined text-base">chevron_right</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: 'smartphone', name: 'Điện thoại', count: '542 sản phẩm' },
              { icon: 'laptop_mac', name: 'Laptop', count: '218 sản phẩm' },
              { icon: 'tablet_android', name: 'Tablet', count: '105 sản phẩm' },
              { icon: 'headphones', name: 'Phụ kiện', count: '1,204 sản phẩm' }
            ].map((category, index) => (
              <Link key={index} to={category.name === 'Laptop' ? '/laptops' : '#'} className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group cursor-pointer">
                <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-4">
                  <span className="material-symbols-outlined text-4xl">{category.icon}</span>
                </div>
                <span className="font-bold text-lg">{category.name}</span>
                <span className="text-xs text-gray-400 mt-1">{category.count}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Sale Section */}
        <section className="bg-primary/5 dark:bg-primary/10 rounded-[40px] p-8 md:p-10 border border-primary/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-accent-pink fill-1">bolt</span>
                FLASH SALE
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-medium text-sm">Kết thúc sau:</span>
                <div className="flex gap-2">
                  <div className="size-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold">02</div>
                  <span className="font-bold text-primary">:</span>
                  <div className="size-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold">45</div>
                  <span className="font-bold text-primary">:</span>
                  <div className="size-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold">12</div>
                </div>
              </div>
            </div>
            <button className="text-primary font-bold hover:bg-primary/10 px-6 py-2 rounded-xl transition-colors">Xem tất cả Flash Sale</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { discount: '-30%', brand: 'Apple', name: 'iPhone 14 Pro Max 256GB - VN/A', price: '24.590.000đ', oldPrice: '34.990.000đ', progress: 'w-3/4', sold: 'Đã bán 24/30', status: 'Vừa cháy hàng!', statusColor: 'text-accent-pink', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7RbGNhnWaZDjHE1ZLOYl6sfVcsxg9LrOXGIoS10vOI72AVmkEQfRWvgFY6_bZpunrFKRnBY4mCtSMCisBUEGtaF8RO7wnyM_stzWnGQI7L7GTNno8E5SzpmuNFK8RhUgeFASkXoaHcfsfp4G1qUTnGRfwfKFfsN5itkDuycH08P-r9V0_GCxgEiHpzknLAENAtDn1vND_Co7lg655Ug97muR2y5PXm8Jh7klU-zmcLgqsubprRg8cc_FXaRxJxxd9GRqScoPUmQ' },
              { discount: '-15%', brand: 'Apple', name: 'MacBook Air M2 8GB/256GB', price: '26.990.000đ', oldPrice: '31.990.000đ', progress: 'w-1/4', sold: 'Đã bán 5/20', status: null, statusColor: null, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRMGeZhmfwYLCeQ2AWDEm37ywghQPHKmyx4o9XxLd9qO5rWevhoWSAKI7T_NNCvVUMgmYXFFusIU3oH8ner4hnuqBcTZAY-Q3v7hj5QqH_3L0YwGlrJ6g89OaHR1oawF-DVvjr62pgwsRO-2MSQpQGMNMs_s_Wy4ph6xVFqVebkYmmu9Lf89S5qp7EsDAuhmR2UKG3VPjVQoxG8DX3-jOQS8nUg511h-ksKcNhBqkokoebPqOnTACNCbHqhxbISgtLsia-ojGopg' },
              { discount: '-25%', brand: 'Apple', name: 'iPad Pro M2 11 inch WiFi 128GB', price: '21.490.000đ', oldPrice: '28.990.000đ', progress: 'w-1/2', sold: 'Đã bán 15/30', status: null, statusColor: null, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6NmpUqq--_nIzbEq6nFvFe8F89E9b6BCFx72S2FxBCN-O5GJB7OX9AyKhovv9oSXyAdAv-4fIl3E7-UWuKFpL2AETx7rSJbtGe9XUsEYedo2TknUkcBsG03yDrjzJztD3KhnjoFkyJ6ezNY4xp7JIsBAJZ4FTRYWLyYhOQkwB-s67panqtNm1tiEN0SiAsPrE922gwLHOt5eF9y3YHq_mhTCnnSe-RQ-a9BV9mWAmdf7ikY1MGnkPxwJJ219KWkIaf9X093GnGA' },
              { discount: '-50%', brand: 'Sony', name: 'Sony WH-1000XM5 Noise Canceling', price: '6.490.000đ', oldPrice: '12.990.000đ', progress: 'w-full', sold: 'Đã bán 50/50', status: 'Hết hàng', statusColor: 'text-red-500', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7O1hy_LrcTw6uJL9zcXAKK8AvymzEQLxoG7pkRenhoVzC118MnVLD4JnPIcuXNNblyuafuBBs0rypt2KxB0-tb1EIRSWKqzLzEWtZrPOwotsxS-FgMlLYgIvtKzeszmfmYruX45ZAII1PM4oL4VuBqNYHnbFS_cutgPhWj-HDqHcyVRC5ILhKjlhNCdTju1E6CvsCtRsgYZSb2OKJwDLiYSeh7kLDBz1_l52Tt4GXd0m9CBtdtVJWs8RcOXkUD-gqQP4rLX8isQ' }
            ].map((product, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-transparent hover:border-primary/20 hover:shadow-2xl transition-all relative group overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-accent-pink text-white text-xs font-bold px-3 py-1 rounded-full">{product.discount}</div>
                <button className="absolute top-4 right-4 z-10 size-10 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-accent-pink transition-colors">
                  <span className="material-symbols-outlined text-xl">favorite</span>
                </button>
                <div className="aspect-square w-full mb-4 bg-gray-50 dark:bg-gray-700 rounded-2xl overflow-hidden">
                  <img alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={product.image} />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-medium">{product.brand}</p>
                  <h3 className="font-bold text-lg line-clamp-2">{product.name}</h3>
                  <div className="flex items-end gap-3">
                    <span className="text-xl font-bold text-primary">{product.price}</span>
                    <span className="text-sm text-gray-400 line-through pb-0.5">{product.oldPrice}</span>
                  </div>
                  <div className="pt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-r from-accent-pink to-orange-400 ${product.progress} rounded-full`}></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.sold}</span>
                      {product.status && (
                        <span className={`text-[10px] font-bold ${product.statusColor} uppercase tracking-wider`}>{product.status}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter & Promotions */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-[#135bec] to-[#003da8] rounded-[40px] p-10 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl font-bold">Đăng ký nhận tin</h3>
              <p className="text-white/80 max-w-sm text-lg">Đừng bỏ lỡ các ưu đãi độc quyền dành riêng cho thành viên PTSmart mỗi tháng!</p>
              <div className="flex gap-2">
                <input className="bg-white/20 border-white/30 rounded-xl px-4 py-3 flex-1 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/40 focus:border-transparent outline-none" placeholder="Nhập email của bạn..." type="email" />
                <button className="bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors">Đăng ký</button>
              </div>
            </div>
            <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[180px] text-white/10 rotate-12 transition-transform group-hover:scale-110">mail</span>
          </div>
          <div className="bg-accent-pink rounded-[40px] p-10 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl font-bold">Thu cũ Đổi mới</h3>
              <p className="text-white/80 max-w-sm text-lg">Trợ giá lên đến 2.000.000đ khi nâng cấp máy mới tại hệ thống PTSmart toàn quốc.</p>
              <button className="bg-white text-accent-pink font-bold px-10 py-3 rounded-xl hover:bg-white/90 transition-colors w-fit">Tham gia ngay</button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[180px] text-white/10 -rotate-12 transition-transform group-hover:scale-110">sync</span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
