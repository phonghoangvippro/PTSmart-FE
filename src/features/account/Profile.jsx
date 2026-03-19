import React, { useState } from 'react';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';

const Profile = () => {
  const [gender, setGender] = useState('nam');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex flex-1 justify-center py-10 px-4 md:px-10">
        <div className="flex flex-col max-w-[800px] flex-1">
          {/* Profile Header Card */}
          <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 mb-8">
            <div className="h-32 w-full opacity-20" style={{ background: 'linear-gradient(135deg, #135bec 0%, #ec4899 100%)' }}></div>
            <div className="px-8 pb-8 -mt-12 flex flex-col items-center sm:items-start sm:flex-row gap-6">
              <div className="relative">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-white dark:border-slate-900 shadow-lg"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBkusvbxWY31HceG9vKfX8fXnXvESkIJmE28794tzBhCQmMOfThK0T-FSAnYRRM1SvLtuM7RKlMJDNN4HH1T1ymam27MC5YQdAnLKY_hBvdNDeA0DlrCy3ypcOzKScyRbKhHxGZUcZm8S1HdVbKUlgiMqaR_pFeh2AM9SPVbvCmMA6pNitbWexXIxMatBLf75TLfjj0DPHx9HMfVfhkZ49pQ71kghZtTz321pHWUmMqLEKIVYZkr1zPh-LXqAQhFSpA7x5NrcDq7w')" }}
                ></div>
                <button className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90 transition-transform hover:scale-110">
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                </button>
              </div>
              <div className="flex flex-col pt-14 flex-1 text-center sm:text-left">
                <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Nguyễn Văn An</h1>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">Thành viên Kim cương</span>
                  <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-xs font-semibold">ID: PTS-8899</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <div className="flex items-center gap-2 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="material-symbols-outlined text-primary">person</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin cá nhân</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Họ và tên</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">badge</span>
                  <input className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Nhập họ và tên" type="text" defaultValue="Nguyễn Văn An" />
                </div>
              </div>
              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Số điện thoại</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">call</span>
                  <input className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Nhập số điện thoại" type="tel" defaultValue="0987 654 321" />
                </div>
              </div>
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                  <input className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Nhập địa chỉ email" type="email" defaultValue="an.nguyen@example.com" />
                </div>
              </div>
              {/* Birthday */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Ngày sinh</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">calendar_today</span>
                  <input className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" type="date" defaultValue="1995-05-15" />
                </div>
              </div>
              {/* Gender */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Giới tính</label>
                <div className="flex gap-4 h-[50px] items-center">
                  {[
                    { value: 'nam', label: 'Nam', activeClass: 'bg-primary text-white border-primary' },
                    { value: 'nu', label: 'Nữ', activeClass: 'bg-pink-500 text-white border-pink-500' },
                    { value: 'khac', label: 'Khác', activeClass: 'bg-slate-500 text-white border-slate-500' },
                  ].map((g) => (
                    <label key={g.value} className="flex-1 cursor-pointer" onClick={() => setGender(g.value)}>
                      <div className={`w-full py-3 text-center rounded-lg border transition-all font-medium ${
                        gender === g.value
                          ? g.activeClass
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        {g.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              {/* City */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Thành phố</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">location_on</span>
                  <select className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all" defaultValue="TP. Hồ Chí Minh">
                    <option>Hà Nội</option>
                    <option>TP. Hồ Chí Minh</option>
                    <option>Đà Nẵng</option>
                    <option>Cần Thơ</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">save</span>
                Cập nhật thông tin
              </button>
              <button className="px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                Hủy thay đổi
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
