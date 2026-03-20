import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getFlashSalePage } from './flashSaleAPI';

const API_BASE_URL = 'http://127.0.0.1:8000';

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/400x400';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const formatCurrency = (amount) => {
  if (!amount) return '0đ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

/**
 * Countdown hook – returns { hours, minutes, seconds } until endTime
 */
const useCountdown = (endTime) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!endTime) return;

    const calc = () => {
      const diff = Math.max(0, new Date(endTime).getTime() - Date.now());
      return {
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };

    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return timeLeft;
};

const pad = (n) => String(n).padStart(2, '0');

/**
 * Returns a status label based on sold percentage
 */
const getStatus = (soldPercent) => {
  if (soldPercent >= 90) return 'Gần hết hàng';
  if (soldPercent >= 70) return 'Sắp cháy hàng';
  if (soldPercent >= 40) return 'Bán chạy';
  return 'Sẵn hàng';
};

/* ─── Flash Sale Section Component ──────────────────────────────── */
const FlashSaleSection = ({ sale, isUpcoming = false }) => {
  const { hours, minutes, seconds } = useCountdown(isUpcoming ? sale.start_at : sale.end_at);

  return (
    <section className="mb-12">
      {/* Section Header with Countdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-[#f43f5e] fill-1">bolt</span>
            {sale.title || 'Flash Sale'}
          </h2>
          {isUpcoming && (
            <p className="text-sm text-slate-500 mt-1">Bắt đầu sau</p>
          )}
          {!isUpcoming && (
            <p className="text-sm text-slate-500 mt-1">Kết thúc sau</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {[
            { value: pad(hours), label: 'Giờ' },
            { value: pad(minutes), label: 'Phút' },
            { value: pad(seconds), label: 'Giây' },
          ].map((unit, i) => (
            <React.Fragment key={unit.label}>
              {i > 0 && <span className="text-2xl font-bold text-slate-400">:</span>}
              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 flex items-center justify-center rounded-xl text-2xl font-bold shadow-lg ${
                  isUpcoming
                    ? 'bg-primary text-white'
                    : 'bg-[#f43f5e] text-white'
                }`}>
                  {unit.value}
                </div>
                <span className="text-[10px] mt-1 font-medium text-slate-500">{unit.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sale.items?.map((item) => {
          const product = item.product;
          if (!product) return null;
          const soldPercent = item.sold_percent ?? (item.quantity > 0 ? Math.round((item.sold / item.quantity) * 100) : 0);
          const remaining = item.remaining ?? (item.quantity - item.sold);
          const discountPercent = item.discount_percent ?? Math.round((1 - item.flash_price / product.price) * 100);
          const isSoldOut = remaining <= 0;
          const status = getStatus(soldPercent);

          return (
            <Link
              to={`/product/${product.slug}`}
              key={`${sale.id}-${product.id}`}
              className={`group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 ${isSoldOut ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-6 overflow-hidden">
                <img
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  alt={product.name}
                  src={getImageUrl(product.thumbnail)}
                />
                {discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-[#f43f5e] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    Giảm {discountPercent}%
                  </div>
                )}
                {!isSoldOut && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap flex items-center gap-2 shadow-xl">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      Xem nhanh
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 min-h-[3rem]">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-[#f43f5e] text-xl font-bold">{formatCurrency(item.flash_price)}</span>
                  <span className="text-slate-400 text-sm line-through">{formatCurrency(product.price)}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                    <span>Đã bán {item.sold}</span>
                    <span className="text-[#f43f5e]">Còn lại {remaining}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-4 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#f43f5e] to-rose-400 rounded-full transition-all duration-500"
                      style={{ width: `${soldPercent}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold pointer-events-none uppercase">
                      {isSoldOut ? 'Hết hàng' : status}
                    </span>
                  </div>
                </div>
                <button
                  className={`w-full font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    isSoldOut
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-[#f43f5e] hover:bg-rose-600 text-white'
                  }`}
                  disabled={isSoldOut}
                >
                  <span className="material-symbols-outlined text-lg">bolt</span>
                  {isSoldOut ? 'HẾT HÀNG' : 'MUA NGAY'}
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

/* ─── Main Page ─────────────────────────────────────────────────── */
const FlashSalePage = () => {
  const [activeFlashSales, setActiveFlashSales] = useState([]);
  const [upcomingFlashSales, setUpcomingFlashSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pick the first active sale for the hero countdown
  const heroSale = activeFlashSales[0];
  const heroCountdown = useCountdown(heroSale?.end_at);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFlashSalePage();
        setActiveFlashSales(data.active || []);
        setUpcomingFlashSales(data.upcoming || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-6 flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f43f5e]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-6 flex justify-center items-center min-h-[400px]">
          <div className="text-red-500 font-bold p-8 text-center bg-red-50 rounded-xl">
            Có lỗi xảy ra: {error}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasActive = activeFlashSales.length > 0;
  const hasUpcoming = upcomingFlashSales.length > 0;
  const isEmpty = !hasActive && !hasUpcoming;

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
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                FLASH SALE <br /> GIỜ VÀNG GIÁ SỐC
              </h1>
              <p className="text-rose-100 text-lg">Hàng ngàn sản phẩm công nghệ giảm đến 50% chỉ trong hôm nay.</p>
            </div>
            {/* Countdown Component */}
            {heroSale && (
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center">
                <p className="text-sm font-bold mb-4 uppercase tracking-widest text-rose-100">Kết thúc sau</p>
                <div className="flex gap-4">
                  {[
                    { value: pad(heroCountdown.hours), label: 'Giờ' },
                    { value: pad(heroCountdown.minutes), label: 'Phút' },
                    { value: pad(heroCountdown.seconds), label: 'Giây' },
                  ].map((unit, i) => (
                    <React.Fragment key={unit.label}>
                      {i > 0 && <div className="text-2xl md:text-4xl font-bold pt-4">:</div>}
                      <div className="flex flex-col items-center">
                        <div className="bg-white text-[#f43f5e] w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-xl text-2xl md:text-4xl font-bold shadow-lg">
                          {unit.value}
                        </div>
                        <span className="text-xs mt-2 font-medium">{unit.label}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rose-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Time Slots Tabs */}
        {(hasActive || hasUpcoming) && (
          <div className="flex overflow-x-auto pb-4 gap-4 mb-8 py-4">
            {activeFlashSales.map((sale) => (
              <a
                key={`active-${sale.id}`}
                href={`#sale-active-${sale.id}`}
                className="flex-shrink-0 flex flex-col items-center justify-center px-8 py-3 bg-[#f43f5e] text-white rounded-xl shadow-lg shadow-[#f43f5e]/20"
              >
                <span className="text-lg font-bold leading-none">Đang diễn ra</span>
                <span className="text-xs opacity-90 mt-1 uppercase">
                  Kết thúc lúc {new Date(sale.end_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </a>
            ))}
            {upcomingFlashSales.map((sale) => (
              <a
                key={`upcoming-${sale.id}`}
                href={`#sale-upcoming-${sale.id}`}
                className="flex-shrink-0 flex flex-col items-center justify-center px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl hover:border-[#f43f5e] transition-colors"
              >
                <span className="text-lg font-bold leading-none">
                  {new Date(sale.start_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-xs text-slate-500 mt-1 uppercase">Sắp diễn ra</span>
              </a>
            ))}
          </div>
        )}

        {/* Empty State */}
        {isEmpty && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">flash_off</span>
            <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300 mb-2">Hiện chưa có Flash Sale nào</h2>
            <p className="text-slate-400">Vui lòng quay lại sau để không bỏ lỡ các ưu đãi hấp dẫn nhé!</p>
          </div>
        )}

        {/* Active Flash Sales */}
        {activeFlashSales.map((sale) => (
          <div key={sale.id} id={`sale-active-${sale.id}`}>
            <FlashSaleSection sale={sale} isUpcoming={false} />
          </div>
        ))}

        {/* Upcoming Flash Sales */}
        {hasUpcoming && (
          <>
            {hasActive && <hr className="border-slate-200 dark:border-slate-700 my-8" />}
            <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">schedule</span>
              Sắp diễn ra
            </h2>
            {upcomingFlashSales.map((sale) => (
              <div key={sale.id} id={`sale-upcoming-${sale.id}`}>
                <FlashSaleSection sale={sale} isUpcoming={true} />
              </div>
            ))}
          </>
        )}

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
