import React from 'react';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';

const Address = () => {
  const addresses = [
    {
      name: 'Nguyễn Văn A',
      address: '123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh',
      phone: '0901 234 567',
      isDefault: true,
      type: null,
      icon: 'stars',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      badgeBg: 'bg-primary/10',
      badgeColor: 'text-primary',
      badgeText: 'MẶC ĐỊNH',
    },
    {
      name: 'Trần Thị B',
      address: '456 Đường XYZ, Phường 2, Quận Tân Bình, TP. Hồ Chí Minh',
      phone: '0987 654 321',
      isDefault: false,
      type: 'Nhà riêng',
      icon: 'house',
      iconBg: 'bg-pink-400/10',
      iconColor: 'text-pink-400',
      badgeBg: 'bg-pink-400/10',
      badgeColor: 'text-pink-400',
      badgeText: 'Nhà riêng',
    },
    {
      name: 'Lê Văn C',
      address: 'Tòa nhà PTSmart, 789 Đại lộ Hòa Bình, Quận Ninh Kiều, Cần Thơ',
      phone: '0912 345 678',
      isDefault: false,
      type: 'Văn phòng',
      icon: 'corporate_fare',
      iconBg: 'bg-slate-100 dark:bg-slate-800',
      iconColor: 'text-slate-600 dark:text-slate-400',
      badgeBg: 'bg-slate-100 dark:bg-slate-800',
      badgeColor: 'text-slate-500',
      badgeText: 'Văn phòng',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-white">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight tracking-tight">Sổ địa chỉ</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Quản lý nơi nhận hàng của bạn</p>
              </div>
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all shadow-lg shadow-primary/20 font-bold text-sm">
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span className="hidden sm:inline">Thêm địa chỉ mới</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[
              { label: 'Tất cả', icon: 'all_inclusive', active: true },
              { label: 'Nhà riêng', icon: 'home', iconColor: 'text-pink-400' },
              { label: 'Văn phòng', icon: 'corporate_fare', iconColor: 'text-primary' },
            ].map((tab, i) => (
              <button
                key={i}
                className={`flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  tab.active
                    ? 'bg-primary text-white font-semibold shadow-sm'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/50'
                }`}
              >
                <span className={`material-symbols-outlined text-sm ${tab.active ? '' : tab.iconColor || ''}`}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Address Cards */}
          <div className="space-y-4">
            {addresses.map((addr, i) => (
              <div
                key={i}
                className={`group relative bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm transition-all hover:shadow-md ${
                  addr.isDefault ? 'border-2 border-primary' : 'border border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex items-center justify-center rounded-xl ${addr.iconBg} ${addr.iconColor} shrink-0 size-12`}>
                      <span className="material-symbols-outlined">{addr.icon}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold">{addr.name}</p>
                        <span className={`inline-flex items-center rounded-full ${addr.badgeBg} px-2.5 py-0.5 text-xs font-bold ${addr.badgeColor} uppercase`}>
                          {addr.badgeText}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-md">{addr.address}</p>
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <span className="material-symbols-outlined text-sm">call</span>
                        {addr.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    {!addr.isDefault && (
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Section */}
          <div className="mt-8 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">map</span>
                Bản đồ khu vực
              </h3>
            </div>
            <div className="h-64 bg-slate-200 dark:bg-slate-800 relative">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-80"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNdfcpdFoiVH2aChDJy45cacNFgZJDN7KR3_o3KqUviHaOeftHiSzGA7I09Y7qVK9N7QI2iYJNMM2YmINKMwpzpwHH3yPDxOTJKlNj8vNJMgApcGCmHK1HIfSQ35h1b8kJusOPyt4bFn1FBz4PzFs-NJOgGuuFfsd7BHhZWc-6RuIwt_5NaWNfXMhSm-dChliPHLCpXXpkyLAb9CzJXA9OjoYvZPVubufulszBz-OQ4xVl4Bi-MITYEYMsMPfz8g0HmN2QpEyZhA')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="material-symbols-outlined text-primary text-5xl drop-shadow-lg">location_on</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Address;
