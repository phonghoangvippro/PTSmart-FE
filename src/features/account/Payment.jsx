import React from 'react';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';

const Payment = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex flex-1 justify-center py-10 px-4 md:px-10">
        <div className="flex flex-col max-w-[960px] flex-1">
          {/* Page Header */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-4 mb-1">
              <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
              <h1 className="text-2xl font-bold">Phương thức thanh toán</h1>
            </div>
            <p className="text-slate-500 text-sm ml-[52px]">Quản lý các nguồn tiền và thẻ đã liên kết của bạn</p>
          </div>

          {/* Ví điện tử Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold">Ví điện tử đã liên kết</h3>
              <span className="text-primary text-sm font-medium cursor-pointer hover:underline">Chỉnh sửa</span>
            </div>
            <div className="space-y-3">
              {/* MoMo */}
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="shrink-0">
                  <div
                    className="bg-no-repeat bg-center bg-contain size-14 rounded-lg bg-[#a50064]"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC9kak-nl8qwAeIRjP5nPBnoGadhbNv3trzZW68-w3BRks7tD_EmmZSQWt-OQBdmBUs3bN1I95NLtEjB-aXFlI1X2fsIpq_Ne_iRcOtaQt8lziuB85XPTmGdDkxcp3em6R7dykclFFhAhkaljl4_bVuZJbDFmDLFH7KWJDEryddSZWt4UCV8yCKYVROkVVw_qLIrdhFMGXb7cIXa3siOhBkoG4jW4-MwNQahrkPVtaDnN_Pk9yREKanN2EyQQyOFam4VUDqnFPIYA')" }}
                  ></div>
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-slate-900 dark:text-slate-100 text-base font-bold">Ví MoMo</p>
                  <p className="text-slate-500 text-sm">0987 *** 123</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Đã liên kết</span>
                  <input defaultChecked className="h-5 w-5 rounded-full border-slate-300 border-2 bg-transparent text-primary checked:bg-primary focus:ring-primary" name="default_payment" type="radio" />
                </div>
              </div>

              {/* ZaloPay */}
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="shrink-0">
                  <div
                    className="bg-no-repeat bg-center bg-contain size-14 rounded-lg bg-[#008fe5]"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC5pO1-LOB5hSGA3YqV6ksbaqqVfA12VF6F3AjW_rmfqGdMXDpV43pGfiM7WRFlgblOMVoBILpudAiYzUurhfMDeXhziEs2330f_acwma1p3eUaOymLaGiwNWzc6HCFTHeHr1fHF_5k-tip4e9oK7hORGUXWkdzP90XqKe31FJRBJeoDYb5ECxqLAM-sYRMcXgUyPWf6pEWNUuQO3qX0H18XYqAMGtV0xRhm4lHbA5SdBCEWg8W5qaLJkD9wvUmpX8jsmMDefd7GA')" }}
                  ></div>
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-slate-900 dark:text-slate-100 text-base font-bold">ZaloPay</p>
                  <p className="text-slate-500 text-sm">0987 *** 123</p>
                </div>
                <div className="flex items-center gap-3">
                  <input className="h-5 w-5 rounded-full border-slate-300 border-2 bg-transparent text-primary checked:bg-primary focus:ring-primary" name="default_payment" type="radio" />
                </div>
              </div>
            </div>
          </div>

          {/* Thẻ ngân hàng Section */}
          <div className="mb-8">
            <div className="pb-3">
              <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold">Thẻ ngân hàng</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vietcombank Card */}
              <div className="relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br from-[#003c71] to-[#006135] shadow-lg min-h-[180px] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="text-xl font-bold italic">Vietcombank</div>
                  <span className="material-symbols-outlined text-3xl opacity-80">contactless</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs opacity-80 uppercase tracking-widest">Số thẻ</p>
                  <p className="text-lg font-medium tracking-widest">**** **** **** 8888</p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] opacity-70 uppercase">Chủ thẻ</p>
                    <p className="text-sm font-bold uppercase">NGUYEN VAN A</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <span className="text-xs font-bold">NAPAS</span>
                  </div>
                </div>
              </div>

              {/* Visa Card */}
              <div className="relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br from-primary to-pink-500 shadow-lg min-h-[180px] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="text-xl font-black italic tracking-tighter">VISA</div>
                  <span className="material-symbols-outlined text-3xl opacity-80">contactless</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs opacity-80 uppercase tracking-widest">Card Number</p>
                  <p className="text-lg font-medium tracking-widest">**** **** **** 1234</p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] opacity-70 uppercase">Card Holder</p>
                    <p className="text-sm font-bold uppercase">NGUYEN VAN A</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] opacity-70 uppercase">Expires</p>
                    <p className="text-sm font-bold">12/26</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add New Method Button */}
          <div className="mb-10">
            <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 py-6 rounded-xl hover:border-primary hover:text-primary transition-colors group">
              <div className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 group-hover:text-primary">add</span>
              </div>
              <span className="text-lg font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary">Thêm phương thức mới</span>
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-auto py-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-slate-400 text-xs">
              Thông tin thanh toán của bạn được mã hóa và bảo mật theo tiêu chuẩn quốc tế PCI DSS.<br />
              PTSmart không trực tiếp lưu trữ số thẻ của bạn.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;
