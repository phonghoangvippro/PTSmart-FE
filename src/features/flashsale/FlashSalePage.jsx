import React from 'react';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';

const FlashSalePage = () => {
  const products = [
    { name: 'iPhone 15 Pro Max 256GB - Chính hãng VN/A', price: '28.490.000đ', oldPrice: '34.990.000đ', discount: 'Giảm 25%', sold: 12, remaining: 3, progress: 80, status: 'Sắp cháy hàng', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVbMw-H-on2cGXN_Fd-mMAi6ANIS94dPifKFZnQqi_ZeHw3O-BUFnWOS8gIaQXudpk9jd7SB0hvihe1HOg15Pq2cPRD189yROIGd18gFYMqgeu6nEvaznfZ-sgQB9m4t7r4wUsSCESNDOcKxziwAYxq5bdPR7SB9MR-SJMhaBiGDhTcYjryMJldtDoLXoS4QTBnCphQHePSLZKrmSrkAIXteJDDAzrnNQTk4P6T1XW03oxP0Wli0cxq3Ro-6PFl0IHP7PpKb25mQ' },
    { name: 'MacBook Air M2 13.6 inch (8GB/256GB)', price: '22.990.000đ', oldPrice: '27.990.000đ', discount: 'Giảm 18%', sold: 45, remaining: 15, progress: 75, status: 'Bán chạy', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_IO38ZFddX4I9Agj7_UdE8eT5szTDscmJrNNCKupntEBinZdiwvD6TRYXyMggFNM3OVkbbHOA0fv77_-k52Yq5uMa-hQHNq2-M_Dmtc-6s9D-qGT99OwNv5gvcMzI9oGkp_PJ5jUCYzT6EXb1NeHWvb2wqhToX_JGSTGUMhvv4LD3e8BzxCcx1TggWpN9wgNVgGYlpSWllrwKjZL0iq19r-86f6ALsy9ANpUGwsPsdfvnwSZ9Pueqg0XdioMpaTMOBwtzH68Ktw' },
    { name: 'Apple AirPods Pro (Gen 2) USB-C', price: '4.990.000đ', oldPrice: '6.190.000đ', discount: 'Giảm 40%', sold: 120, remaining: 5, progress: 95, status: 'Gần hết hàng', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY-P64bf2Q8l9AL_JsyLAWUWag_N7J-Nkt1vb3xTXLd0LL9tu9qhww77gQhefw6DEgiIc4SxT7IljF5QHjsruEXjFcPd55tQteHCocCUQYh4TyXa9tKB9VJ1KZpRHdn_KfRcTwlJKcCuVchkV1uBWHDJSVilzVXfXKxekEedIaljFrOd2FaGH43O4QsIBRqetWFX99DikwWYnMIeTT-1tzFksrBjnvucV37WoxTRdmf8ojWFe9LHNTVtIhLqPPEbOdalkvyIgAdA' },
    { name: 'Apple Watch Series 9 41mm (GPS) - Viền Nhôm', price: '8.490.000đ', oldPrice: '10.490.000đ', discount: 'Giảm 15%', sold: 25, remaining: 30, progress: 45, status: 'Sẵn hàng', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBSyDuElM82jupk0iWKrdoVJix7IZf2PIBhHwteLvHzBgJkxTSANX9VeWAldo4cXnJZBgzgthaqY14TqoMHR--Bc296h6KI829T9s6rVVDx4mH4Y4E7FjgjWFrAenN31EBX8u7Bv4_QK72uehQ7qw6ger37O7Y62F_u5pgoPUO1-cxZ_DF9L5zmVWg5miaP8cpU7k8bQhGL-wNBak78Ccklx4zAN5oFZbl_vg7q6WJtlj6wo12Ys24yrIK1MkP0PXOSgowNuHdMg' },
  ];

  return (
    <div>
      <Header />
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-6">
        {/* Hero Banner Flash Sale */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#f43f5e] to-rose-600 mb-8 p-8 md:p-12 text-white">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">emergency</span>
                Sự kiện giới hạn
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">FLASH SALE <br /> GIỜ VÀNG GIÁ SỐC</h1>
              <p className="text-rose-100 text-lg">Hàng ngàn sản phẩm công nghệ giảm đến 50% chỉ trong hôm nay.</p>
            </div>
            {/* Countdown Component */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center">
              <p className="text-sm font-bold mb-4 uppercase tracking-widest text-rose-100">Kết thúc sau</p>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-white text-[#f43f5e] w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-xl text-2xl md:text-4xl font-bold shadow-lg">02</div>
                  <span className="text-xs mt-2 font-medium">Giờ</span>
                </div>
                <div className="text-2xl md:text-4xl font-bold pt-4">:</div>
                <div className="flex flex-col items-center">
                  <div className="bg-white text-[#f43f5e] w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-xl text-2xl md:text-4xl font-bold shadow-lg">45</div>
                  <span className="text-xs mt-2 font-medium">Phút</span>
                </div>
                <div className="text-2xl md:text-4xl font-bold pt-4">:</div>
                <div className="flex flex-col items-center">
                  <div className="bg-white text-[#f43f5e] w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-xl text-2xl md:text-4xl font-bold shadow-lg">15</div>
                  <span className="text-xs mt-2 font-medium">Giây</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rose-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Time Slots Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-4 mb-8 py-4">
          <button className="flex-shrink-0 flex flex-col items-center justify-center px-8 py-3 bg-[#f43f5e] text-white rounded-xl shadow-lg shadow-[#f43f5e]/20">
            <span className="text-lg font-bold leading-none">Đang diễn ra</span>
            <span className="text-xs opacity-90 mt-1 uppercase">Kết thúc lúc 12:00</span>
          </button>
          {['12:00', '16:00', '20:00', '08:00'].map((time, i) => (
            <button key={i} className="flex-shrink-0 flex flex-col items-center justify-center px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl hover:border-[#f43f5e] transition-colors">
              <span className="text-lg font-bold leading-none">{time}</span>
              <span className="text-xs text-slate-500 mt-1 uppercase">{i === 3 ? 'Ngày mai' : 'Sắp diễn ra'}</span>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={index} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-6 overflow-hidden">
                <img className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt={product.name} src={product.image} />
                <div className="absolute top-3 left-3 bg-[#f43f5e] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">{product.discount}</div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap flex items-center gap-2 shadow-xl">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    Xem nhanh
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 min-h-[3rem]">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-[#f43f5e] text-xl font-bold">{product.price}</span>
                  <span className="text-slate-400 text-sm line-through">{product.oldPrice}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                    <span>Đã bán {product.sold}</span>
                    <span className="text-[#f43f5e]">Còn lại {product.remaining}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-4 rounded-full overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-[#f43f5e] to-rose-400 rounded-full" style={{ width: `${product.progress}%` }}></div>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold pointer-events-none uppercase">{product.status}</span>
                  </div>
                </div>
                <button className="w-full bg-[#f43f5e] hover:bg-rose-600 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-lg">bolt</span>
                  MUA NGAY
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="mt-12 text-center">
          <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 inline-flex items-center gap-2">
            Xem thêm hàng trăm ưu đãi khác
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>

        {/* Newsletter urgency section */}
        <section className="bg-slate-900 text-white py-12 mt-16 -mx-4 md:-mx-10 px-4 md:px-10 rounded-none">
          <div className="max-w-[1280px] mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Đừng bỏ lỡ các đợt Flash Sale tiếp theo!</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Đăng ký nhận thông báo để là người đầu tiên biết về các ưu đãi công nghệ hấp dẫn nhất từ PTSmart.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input className="flex-1 bg-slate-800 border-slate-700 rounded-lg focus:ring-[#f43f5e] px-4 py-3" placeholder="Địa chỉ email của bạn" type="email" />
              <button className="bg-[#f43f5e] hover:bg-rose-600 px-8 py-3 rounded-lg font-bold transition-colors">Đăng ký ngay</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FlashSalePage;
