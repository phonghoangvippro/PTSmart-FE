import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import './Account.css';

const Account = () => {
  return (
    <div className="account-page min-h-screen flex flex-col">
      <Header />

      <main className="max-w-[1280px] mx-auto w-full px-4 md:px-10 py-6 flex-grow">

        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Tài khoản của tôi</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Quản lý thông tin tài khoản và đơn hàng của bạn.</p>
        </div>

        {/* Account Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* My Orders */}
          <Link
            to="/account/orders"
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-2xl">shopping_bag</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Đơn hàng của tôi</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Xem lịch sử và theo dõi đơn hàng</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">chevron_right</span>
            </div>
          </Link>

          <Link
            to="/account/profile"
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:border-primary hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-2xl">person</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Thông tin cá nhân</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Cập nhật thông tin tài khoản</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">chevron_right</span>
            </div>
          </Link>

          {/* Favorites */}
          <Link
            to="/account/favorites"
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:border-primary hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-2xl">favorite</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Sản phẩm yêu thích</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Danh sách sản phẩm đã lưu</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">chevron_right</span>
            </div>
          </Link>

          {/* Addresses */}
          <Link
            to="/account/address"
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:border-primary hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-2xl">location_on</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Địa chỉ nhận hàng</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quản lý địa chỉ giao hàng</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">chevron_right</span>
            </div>
          </Link>

          {/* Payment Methods */}
          <Link
            to="/account/payment"
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:border-primary hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-2xl">credit_card</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Phương thức thanh toán</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quản lý thẻ và ví điện tử</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">chevron_right</span>
            </div>
          </Link>

          {/* Promotions */}
          <Link
            to="/account/promotions"
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:border-primary hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white text-2xl">local_offer</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Khuyến mãi cho bạn</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Xem các ưu đãi đặc biệt</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">chevron_right</span>
            </div>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
