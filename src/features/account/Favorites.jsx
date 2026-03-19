import React from 'react';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';

const Favorites = () => {
  const products = [
    { category: 'Điện thoại', name: 'iPhone 15 Pro Max 256GB', price: '29.990.000₫', oldPrice: '34.990.000₫', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAby69XGp3QgXckfPw2OsjFdSkQB0J1xWuZlU15KJ-q-16t_-9Olxn2XrTBZzJR2Yrh7cOLLRj4uc2XgYzTmqyH4wHRayIjWmSKwUWjM53M9eKHdXOHvZHUn5kxspzhXBmfR8Gl7SHS7ZuFfFBm8NXn_8VYLtPlOxdDeHO6XkVxPjb3i-5EuYKuFg-lA1hHAsiMWz9E5RYtmlr8sPWEVxnJWkKvMTu9w6NXtvsFTj9iO4JgOOsk_AMKXKlFYEY4zmt1kcn1VvMkQg' },
    { category: 'Laptop', name: 'MacBook Air M2 13"', price: '24.590.000₫', oldPrice: '27.990.000₫', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAeMV78HsVHc-EKQm5kCdCu9s0rMbyIwABfI7665dpit6O-UylTOsjw9RTdTb1YKnqCG6NS29xldsTHrEpkS06T8yTbG7gimCk1ggwpTynZmSNpcGvhn6yqfx_xuV1Rtgq5fMZUIvPcGf8-RfZ_F9WJ2iSmjHrsmZu4dS6lbcuaztS0rnjx57DQn1efrEivkasXrP692SA4TDz4oPWK4KHwlwC-N0iN40c9Z12T1VUYkxVm1RzZPf1A9vnOcuwU6LYgIRTEoVu7g' },
    { category: 'Phụ kiện', name: 'Sony WH-1000XM5', price: '7.490.000₫', oldPrice: '8.990.000₫', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcDx2-fCL5DiPVovjVQAKCvXUA_tFPjLMZxK61Hl6DBTIhLGer2e6tPFGROfaHkMucHPr4ro-bPRwnCguEVqNR_VdEyB3tya2ErbpS3J8JstRj8RJNstzk7oNmKkdgNn8KF2Rs5tcz5lCC9dvhSdPGGL5UawR1mTReJ6mtgP4CwUaFwsMuIi904QYqK7_SrpGmVuJ7lSTmsBXqEzFs9S5C8j0PyilcCf5Y_bJNlK7XJ8V1SjpagswWQwFj9n8GYuBf3n5e8H4Xzg' },
    { category: 'Laptop', name: 'iPad Pro M2 11" 128GB', price: '19.290.000₫', oldPrice: '22.990.000₫', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4tCfET0Yi5pLtAJwq2ik8tjZC7Vru0IDCU3T1GaCFpBCrSILwWJ39piwFR7A2C0GVrGCBlenS6p2Jm3HF7vIaKp9d9CLNHtM1dDG540F55X37pR1N8-Y6U44_03QO6cHIbYAPqGrF4tH1CdhgcR6RBsZdSKG7g0IHWZ64KvDlU9vav-BFJLGT3enoaxC0YnzAARISM6yDmIZHqGsDnpjYVeBejzHiKBhutLUqxLetDOzz_4WCXqQ7MbdaKr6gEUEU5tpmjxpoIg' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-10 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Sản phẩm đã thích <span className="text-primary font-medium text-lg ml-1">({products.length})</span>
          </h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-lg text-sm font-medium shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              <span>Lọc</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-lg text-sm font-medium shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-lg">sort</span>
              <span>Sắp xếp</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product, index) => (
            <div key={index} className="group relative flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-transparent hover:border-primary/20 transition-all">
              <div className="w-full sm:w-40 h-40 rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden shrink-0">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url('${product.image}')` }}
                ></div>
              </div>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">{product.category}</span>
                    <button className="text-pink-400 hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </button>
                  </div>
                  <h3 className="text-slate-900 dark:text-white font-bold text-lg mt-1 line-clamp-1">{product.name}</h3>
                  <p className="text-primary text-xl font-bold mt-1">{product.price}</p>
                  <p className="text-slate-400 text-xs line-through">{product.oldPrice}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-primary text-white text-xs font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    Thêm vào giỏ
                  </button>
                  <button className="w-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Banner */}
        <div className="mt-12 bg-gradient-to-r from-primary to-pink-400 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Đừng bỏ lỡ ưu đãi!</h3>
              <p className="text-white/80 max-w-md">Chúng tôi sẽ thông báo cho bạn khi các sản phẩm trong danh sách yêu thích của bạn giảm giá.</p>
            </div>
            <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg">Bật thông báo ngay</button>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-64 w-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 h-48 w-48 bg-primary/20 rounded-full blur-2xl"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
