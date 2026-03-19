import React from 'react';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';

const MyPromotions = () => {
  const vouchers = [
    {
      code: 'PTSMART50',
      title: 'Giảm 50.000đ',
      description: 'Đơn tối thiểu 200.000đ',
      expiry: 'HSD: 31/12/2023',
      icon: 'shopping_bag',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      labelColor: 'text-primary',
      labelText: 'Mã Giảm Giá',
      badge: { text: 'New', bg: 'bg-pink-500/10', color: 'text-pink-500' },
    },
    {
      code: 'FREESHIP20',
      title: 'Miễn phí vận chuyển',
      description: 'Tối đa 20.000đ cho mọi đơn hàng',
      expiry: 'HSD: 25/12/2023',
      icon: 'local_shipping',
      iconBg: 'bg-pink-500/10',
      iconColor: 'text-pink-500',
      labelColor: 'text-pink-500',
      labelText: 'Vận Chuyển',
      badge: null,
    },
    {
      code: 'PAYMENT100',
      title: 'Hoàn tiền 10%',
      description: 'Tối đa 100.000đ qua ví PTSmart',
      expiry: 'HSD: 15/01/2024',
      icon: 'payments',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      labelColor: 'text-primary',
      labelText: 'Thanh Toán',
      badge: { text: 'Hot', bg: 'bg-primary/10', color: 'text-primary' },
    },
    {
      code: 'FOODIE25',
      title: 'Giảm giá 25k',
      description: 'Áp dụng cho đối tác nhà hàng',
      expiry: 'Hết hạn sau 2 giờ',
      expiryUrgent: true,
      icon: 'restaurant',
      iconBg: 'bg-slate-100 dark:bg-slate-800',
      iconColor: 'text-slate-400',
      labelColor: 'text-slate-400',
      labelText: 'Ẩm Thực',
      badge: { text: 'Sắp hết', bg: 'bg-slate-200 dark:bg-slate-700', color: 'text-slate-500' },
      faded: true,
    },
  ];

  const recommendations = [
    { title: 'Combo Gà Rán 99k', desc: 'Giảm thêm 10k khi dùng mã', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9RwZaFsWinNGW3Km3ohQ2UMR2JR_XpcBsOTG6ty-8WuCR26Ub2Bd_7ma6ki3UfOX58EYiNhOodDYnVFKX4Nyny7Hs5oCtjhaU1ihS79q3IqOeJa7PvR0RU6VWaPBgGDFzxGjush_AGsH_G0rdUBBmhTBqZU4Ue8FNapo34PwnK1trXkm3wF-FvwbC-N0W_S0s7OEX1vxUGHruODD60E12aAosk2CBiup7hqfcZq1DO-zqJ70mQzHO2MVFjfCXuSDRv4NzibX8hA' },
    { title: 'Điện Máy Cuối Tuần', desc: 'Voucher giảm 5%', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqNQzsUG8f7IZaw_OS5V-7uZ5sYMCU_0n6IsrC5J9YzVBMKX2DT4nscUyh--UNG9r3FqjwA2JnUeyILHjzBzziGMKagBWh4PFsLKkXxtpI5O6eFQpxaVw0E-GXp7tko0a__Rxvg8cWmclbTrA70trcW30qHe7k38_kNaOkzAGjaIjFNDndGnooPXjsGj8tcD9m3UROWhnPwXu3Qlp9Hoh1IPjTnA4fo8DFNayXzZvuxD6Ar21KUP_C_D6gtajBI78jY_c3exj_Qg' },
    { title: 'Thời Trang & Mỹ Phẩm', desc: 'Mua 1 tặng 1', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG6B-UqWy9xiYXbWuQalbSLnY1_V2HXl86kf_P9ClrsaEZV8wj2ihOtAs5LPlm_kPwPW14n_H3kxLTjofmDNcSmUpy4e7V-AvPkFbkdjC9JKyD6fdtlMkwioKcGI8ysQ3wXW-PqZvap7hqcUCDEvOo7bvoDtA4kNmsd-hAAGYUhVRkKjEB4aPmJWFTU1Wve6ME4BmMiqITPFupdXLXhQJ22Eu8yMnPuizg_KGrUpMk1Dg4SFzJa6m66IJVlem5WiLYkctw_Nxvcg' },
  ];

  const tabs = ['Tất cả mã', 'Sắp hết hạn', 'Ưu đãi thanh toán', 'Voucher của tôi'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex flex-1 justify-center py-6 px-4 md:px-10">
        <div className="flex flex-col max-w-[960px] flex-1">
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-8 overflow-x-auto">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  className={`pb-3 pt-2 whitespace-nowrap text-sm tracking-wide border-b-[3px] ${
                    i === 0
                      ? 'border-b-primary text-primary font-bold'
                      : 'border-b-transparent text-slate-500 font-medium hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Promo */}
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-[60%]">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Đặc quyền dành riêng cho bạn!</h1>
              <p className="text-white/90 text-sm md:text-base mb-4 font-medium">Khám phá kho voucher giảm giá lên đến 500k mỗi ngày.</p>
              <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 inline-block">
                <span className="text-xs uppercase tracking-widest block opacity-80">Mã hot nhất hôm nay</span>
                <span className="text-xl font-bold">PT_SMART_NEW</span>
              </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none flex items-center justify-center">
              <span className="material-symbols-outlined text-[150px] rotate-12">local_activity</span>
            </div>
          </div>

          <h3 className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold leading-tight mb-6">Khuyến mãi cho bạn</h3>

          {/* Voucher Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vouchers.map((v, i) => (
              <div key={i} className={`group flex items-stretch rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md transition-shadow ${v.faded ? 'opacity-75' : ''}`} style={{ borderLeft: '4px solid #135bec' }}>
                <div className={`w-32 ${v.iconBg} flex flex-col items-center justify-center border-r-2 border-dashed border-slate-200 dark:border-slate-700 px-2 py-4 relative`}>
                  <div className="size-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mb-2 shadow-sm">
                    <span className={`material-symbols-outlined ${v.iconColor}`}>{v.icon}</span>
                  </div>
                  <span className={`${v.labelColor} font-bold text-center leading-tight text-sm`}>{v.labelText}</span>
                  <div className="absolute -top-3 -right-3 size-6 bg-[#f6f6f8] dark:bg-[#101622] rounded-full"></div>
                  <div className="absolute -bottom-3 -right-3 size-6 bg-[#f6f6f8] dark:bg-[#101622] rounded-full"></div>
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">{v.code}</p>
                      {v.badge && (
                        <span className={`${v.badge.bg} ${v.badge.color} text-[10px] px-2 py-0.5 rounded-full font-bold`}>{v.badge.text}</span>
                      )}
                    </div>
                    <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight">{v.title}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">{v.description}</p>
                    <p className={`text-[10px] mt-2 flex items-center gap-1 font-${v.expiryUrgent ? 'bold' : 'normal'} ${v.expiryUrgent ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
                      <span className="material-symbols-outlined text-[12px]">{v.expiryUrgent ? 'timer' : 'schedule'}</span>
                      {v.expiry}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button className="text-primary text-xs font-bold hover:underline">Điều kiện</button>
                    <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all transform active:scale-95">Dùng ngay</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Section */}
          <div className="mt-12">
            <h4 className="text-slate-900 dark:text-white text-lg font-bold mb-4">Có thể bạn sẽ thích</h4>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {recommendations.map((item, i) => (
                <div key={i} className="min-w-[200px] flex-shrink-0 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-full h-32 rounded-lg mb-3 bg-center bg-cover" style={{ backgroundImage: `url('${item.image}')` }}></div>
                  <p className="text-slate-900 dark:text-white font-bold text-sm">{item.title}</p>
                  <p className="text-slate-500 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyPromotions;
