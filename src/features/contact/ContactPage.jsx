import React from 'react';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';

const ContactPage = () => {
  return (
    <div>
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-primary/5 dark:bg-primary/10 py-16">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Liên hệ với chúng tôi</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">PTSmart luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn về sản phẩm và dịch vụ công nghệ thông minh.</p>
          </div>
        </div>

        {/* Main Contact Content */}
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 -mt-12 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form & Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Map Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-1">
                  <div className="relative w-full h-[400px] bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <span className="material-symbols-outlined text-primary text-5xl animate-bounce">location_on</span>
                        <p className="mt-2 text-slate-500 font-medium">Bản đồ đang tải...</p>
                      </div>
                    </div>
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCiT6N0xrBRCcKFaPsat1K__6NRbEZ6H-_a-VjnOnsz_1r5uLeDdLMBCxB_su-JOQFEN3Q5XD0bVzegUABBX8lGE2HYrMExTTjQq8E_ywZQFbyXivTGPsCp4rfz2i9lonXxkV2DRrfjN15FsRa7dG_xfk9bQ2NStTfeS8ChoP7RlhRGbmB-0cIFlMcl0BkgLX0ZdyUDEmBXZtB3mTyy4lsxdRQ3rj8j2wrdftzMzUn-sWeQyDmc6xrToFZ0vvJE5-smIe1q6P5pqA')" }}
                    ></div>
                    {/* Map Controls */}
                    <div className="absolute right-4 bottom-4 flex flex-col gap-2">
                      <button className="w-10 h-10 bg-white dark:bg-slate-800 rounded shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50">
                        <span className="material-symbols-outlined">add</span>
                      </button>
                      <button className="w-10 h-10 bg-white dark:bg-slate-800 rounded shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50">
                        <span className="material-symbols-outlined">remove</span>
                      </button>
                    </div>
                    <div className="absolute left-4 top-4">
                      <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">directions</span>
                        <span className="text-sm font-medium">Tìm đường đi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Form */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Gửi tin nhắn cho PTSmart</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Họ và tên</label>
                      <input className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Nhập họ tên của bạn" type="text" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                      <input className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="example@gmail.com" type="email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Số điện thoại</label>
                    <input className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Nhập số điện thoại" type="tel" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nội dung tin nhắn</label>
                    <textarea className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none" placeholder="Bạn cần chúng tôi hỗ trợ điều gì?" rows="4"></textarea>
                  </div>
                  <button className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2" type="submit">
                    Gửi tin nhắn
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-8">
              {/* Contact Info Card */}
              <div className="bg-primary rounded-xl p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-6">Thông tin liên hệ</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <span className="material-symbols-outlined">call</span>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Hotline hỗ trợ</p>
                        <p className="text-lg font-bold">1900 6789</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <span className="material-symbols-outlined">mail</span>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Email liên hệ</p>
                        <p className="text-lg font-bold">support@ptsmart.vn</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <span className="material-symbols-outlined">schedule</span>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Giờ làm việc</p>
                        <p className="text-lg font-bold">08:00 - 21:00 (Hàng ngày)</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 flex gap-4">
                    <a className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all" href="#">
                      <span className="material-symbols-outlined">public</span>
                    </a>
                    <a className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all" href="#">
                      <span className="material-symbols-outlined">chat</span>
                    </a>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-10">
                  <span className="material-symbols-outlined text-[150px]">contact_support</span>
                </div>
              </div>

              {/* Branches */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Hệ thống chi nhánh</h3>
                <div className="space-y-8">
                  {[
                    { name: 'Chi nhánh Hà Nội', address: 'Số 123 Cầu Giấy, Quận Cầu Giấy, Hà Nội', phone: '024 3333 9999' },
                    { name: 'Chi nhánh TP.HCM', address: 'Số 456 Lê Lợi, Quận 1, TP. Hồ Chí Minh', phone: '028 4444 8888' },
                    { name: 'Chi nhánh Đà Nẵng', address: 'Số 789 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng', phone: '023 5555 7777' },
                  ].map((branch, index, arr) => (
                    <div key={index} className={index < arr.length - 1 ? 'border-b border-slate-100 dark:border-slate-800 pb-6' : ''}>
                      <h4 className="font-bold text-primary mb-2">{branch.name}</h4>
                      <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-sm mt-0.5">location_on</span>
                        <p>{branch.address}</p>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mt-2">
                        <span className="material-symbols-outlined text-sm">call</span>
                        <p>{branch.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
