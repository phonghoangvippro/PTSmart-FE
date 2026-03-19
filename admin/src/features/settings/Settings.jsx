import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import './Settings.css';

const Settings = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Cấu hình hệ thống" />

        <div className="p-8">
          {/* Page Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Cài đặt hệ thống</h2>
              <p className="text-slate-500 mt-1">Quản lý thông tin chung và cấu hình giao diện website PTSmart</p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">save</span>
              Lưu thay đổi
            </button>
          </div>

          {/* Section 1: Thông tin chung */}
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              <h3 className="font-bold text-lg">Thông tin chung</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Logo Upload */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="space-y-3 w-full md:w-1/3">
                  <label className="text-sm font-semibold">Logo Website</label>
                  <div className="relative group">
                    <div className="w-48 h-48 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center gap-3 overflow-hidden cursor-pointer group-hover:border-primary/50 transition-colors">
                      <div className="w-full h-full bg-white flex items-center justify-center p-4">
                        <div
                          className="w-full h-full bg-center bg-contain bg-no-repeat"
                          style={{
                            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB6cOpZqSEIs-1tJkz-usoaFS7JbvudTeA4Bf0AN7e9X_ATy3Km7x8Wyn7WjScq6o6TP1AmuvWsc_6W9YJlvU4ORp8PtKgPLqj-NeqE5WrC57NHPfc_dhb9AikwNZXOWkUgmZK8D7J9EBkB_5Q-ycfELFoim-wz-z9SMZ_UW0qW0u5nGi0JRp0W3qmuexIWXtDrbfZ2iIeRDSjU_PptSD9cz3p73KkVjNAnGVBH3RPsf8VHQPljyh_fwblDs0W-0uOYRQ4nFmfIRA')"
                          }}
                        ></div>
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white text-xs font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">upload</span> Thay đổi
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Định dạng PNG, JPG. Kích thước đề xuất 400x400px. Tối đa 2MB.</p>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Tên website</label>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm"
                      type="text"
                      defaultValue="PTSmart - Đồ gia dụng thông minh"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Hotline liên hệ</label>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm"
                      type="text"
                      defaultValue="1900 1234"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Email hỗ trợ</label>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm"
                      type="email"
                      defaultValue="support@ptsmart.vn"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Phí vận chuyển mặc định (VNĐ)</label>
                    <div className="relative">
                      <input
                        className="w-full rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm pr-12"
                        type="number"
                        defaultValue="30000"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">VNĐ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Banner Slider */}
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">view_carousel</span>
                <h3 className="font-bold text-lg">Banner Slider Trang chủ</h3>
              </div>
              <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                <span className="material-symbols-outlined text-sm">add_circle</span> Thêm Banner
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Banner Item 1 */}
                <div className="flex flex-col md:flex-row gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="w-full md:w-48 h-28 rounded-lg overflow-hidden relative">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuClSyOnLtqiQohCGq6IHDf9UNoLP9pK4KGwW5QDFg7R7uKjue0SQGnnwPi3UNG8DG-_PCJmAt7FrJSJMSJxuzV-XL87cgZS9XejgZfkkVpx1wfbYiN0UqbWNZ2mUXh13RrFteJPQfalSXlQmwSjdrDCDhhIMvaGERmfTZniMqZHdikBO95CpSSxw0_AVuezozDjFFSf5cZBTgm_nEMlnBhsHc81HkcaKdKAstbwX1mbg_70ilR3wq5VS0_9Dt08X8kRKQtKqCp2mg')"
                      }}
                    ></div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="material-symbols-outlined text-white">edit</span>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Tiêu đề Banner</label>
                      <input
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm py-1.5"
                        type="text"
                        defaultValue="Giảm giá mùa hè 50%"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Liên kết (Link)</label>
                      <input
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm py-1.5"
                        type="text"
                        defaultValue="/khuyen-mai-he"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input defaultChecked className="rounded text-primary focus:ring-primary w-4 h-4" type="checkbox" />
                          <span className="text-xs font-medium">Hiển thị</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-500">Thứ tự:</span>
                          <input
                            className="w-12 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs py-1 text-center"
                            type="number"
                            defaultValue="1"
                          />
                        </div>
                      </div>
                      <button className="text-accent-pink hover:text-red-700 transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Banner Item 2 */}
                <div className="flex flex-col md:flex-row gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="w-full md:w-48 h-28 rounded-lg overflow-hidden relative">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBOotwljrlso7TybmY2PhCkSfYIdqKa1elS_WKqkMtvHNjfsS9FdHByZEZf3ENITnHX6YA1cdLUu8vOzzMLWB6I24G8PR-_oDmdPRgyKBJ0-l1W7WLGGfrRYsYgOjUpPyrNUo3RS7vFHE6Y5CNZEiBu7MoPwfR9Xp6nzc0c0sYirEv6QW_lpcJc3sLU6H0agkggiosrIWPjIX71jzkYv6sDXm6m6tO8Qz-elj0WrOoTOhGMNXHCWeECycgOglhoKWlmB0Riy5nokQ')"
                      }}
                    ></div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="material-symbols-outlined text-white">edit</span>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Tiêu đề Banner</label>
                      <input
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm py-1.5"
                        type="text"
                        defaultValue="Robot hút bụi thông minh"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Liên kết (Link)</label>
                      <input
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm py-1.5"
                        type="text"
                        defaultValue="/robot-hut-bui"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input defaultChecked className="rounded text-primary focus:ring-primary w-4 h-4" type="checkbox" />
                          <span className="text-xs font-medium">Hiển thị</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-500">Thứ tự:</span>
                          <input
                            className="w-12 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs py-1 text-center"
                            type="number"
                            defaultValue="2"
                          />
                        </div>
                      </div>
                      <button className="text-accent-pink hover:text-red-700 transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 py-4">
            <button className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Hủy bỏ
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
              Lưu cấu hình hệ thống
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
