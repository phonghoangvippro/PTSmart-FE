import React from 'react';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';

const NewsPage = () => {
  const articles = [
    {
      title: 'Đánh giá iPhone 15 Pro Max sau 6 tháng sử dụng',
      description: 'Cùng xem liệu chiếc flagship đình đám của Apple còn giữ vững phong độ về camera và hiệu năng sau thời gian dài trải nghiệm thực tế.',
      category: 'Review',
      readTime: '10 phút đọc',
      date: '12 Tháng 10, 2023',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0Rf3Af4-xvTJMdSfo8sixyS4RvRDszUYvBs6434SCLaqrCJZ1yzw9818cFpiI8z4cMORpiHYJGzyC13NGGk_K1s1l7Uw2f2SqjuzFBnnWHKQcFi9tGv11gMiTz4hXvZvbptaCOHvuSdRDxMewA4yLvXvxVrhkXh8LP1kbA7p453vyc8alFgyRhdRtrrzGrn9XOVbz4hZuQmsK1WyMEIAyu_g4LMPVW53N0p4gZyeZv1VRaysQhQzc3FvdzKrui1mNJbRzuyfJ1g',
    },
    {
      title: 'Cách tối ưu hóa pin cho MacBook chạy chip M1/M2/M3',
      description: 'Những mẹo nhỏ nhưng cực kỳ hữu ích giúp kéo dài tuổi thọ pin và thời gian sử dụng trong ngày cho chiếc laptop của bạn.',
      category: 'Hướng dẫn',
      readTime: '5 phút đọc',
      date: '10 Tháng 10, 2023',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiOLlECSu_dPy__CXtRWsaSTJYI5BVpbzAPbtPvFPkmBufPppIWVgNV3civcnK33QwrWEdse7kqszGgb7CyeZ-qe9zfi33xO5aRGEPHeqJ-GbAPFOXshGeM434LM15BGsL_V9ys8c1PN0olvCbglZtKMHaUlJ0hmUTOZasvFDJ6bfdHETQMgZv2XVck1iANXZ_MD4a0vond7QbqwANaK71kxrygl7DNOFWxO0XS2C8Ou5qWwLQR_6O9nN-gXTkTUUMfGi1-XsMkw',
    },
    {
      title: 'Trên tay Samsung Galaxy S24 Ultra: Kỷ nguyên AI bắt đầu',
      description: 'Samsung đã mang đến những tính năng AI cực kỳ ấn tượng trên chiếc điện thoại cao cấp nhất của mình.',
      category: 'Sản phẩm mới',
      readTime: '12 phút đọc',
      date: '08 Tháng 10, 2023',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQxoekSgazHnNy69eBnucs56nuZ3qDEGHedE5zdKeXgUV7H-oJqw_eIe7cjgduiysqEpgRS6zXjrCv2V2cpZ0ul8HQZrRl4UjprslJdWvH4y5q5IA7rcr5F1DGL-o7kJTrFNkqUSK0HU4MClomKnWO9mwjtJO7oUP4SNX5qLlLuEQIAlUcX_SdsCBCkmDDTd5-Kt1qNGbyyKLQu227L85ltB7R68hZHNUcm1b9vLmifR1VEax5aZUPKoUOi9GihbsuflBL5V5cFA',
    },
    {
      title: 'Top 5 tai nghe chống ồn đáng mua nhất cuối năm 2023',
      description: 'Dành riêng cho các tín đồ âm nhạc cần không gian yên tĩnh để làm việc và thư giãn.',
      category: 'Review',
      readTime: '8 phút đọc',
      date: '05 Tháng 10, 2023',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7zMKAqaDRKzKBDB4jG3pV3y956iKeGMubBAIPW0UNRWDXPoCdg_ziL41MIRvK0p4XnsEyYSx5i8x0cQe-LDpa5RhcP2BI_nLDtZ_OXzr89U8eX3hMlg12MozkCfcZBCWBHXA6IdKOkBg1yYQT_pP3bR3ChUnhB_yMG4Ahfm5SpSqklRXX0JQj3ivGiWodhbd-CMabaNPc8c7l199Batl8GYCrY1h72rQoOCbIyl-AOqX0uOLIZcoo6FWoNkM9gKZPyDMfAduNzg',
    },
    {
      title: 'Hướng dẫn cài đặt hệ thống Smart Home cơ bản cho người mới',
      description: 'Từng bước thiết lập căn nhà thông minh với chi phí tiết kiệm và hiệu quả tối đa.',
      category: 'Hướng dẫn',
      readTime: '15 phút đọc',
      date: '02 Tháng 10, 2023',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHqqIVVvo_iEkwGkfyVko83iHKToBfSKZTEJD2W_7w5EcB_1dtvS5DeFL4zT1_4ghL07Pp18TCnc2vOGO4mMbbE55zs6z2QjWgB-7rZvBJIGijYzb3Q3ZSCpdIRfb4xs6jloRg0xYajMPfj5A6iyfnIifd2olzFgtJtJ4tbt94bq9AizDL9uvlZWXLg44vAIJat21UFWoR90jK14aErhoXfGRm0R005qCaik_Uux0DlXzlDDH2WooRETBR9Vu7FgmBAHKQJflj9Q',
    },
    {
      title: 'Sự kiện Apple sắp tới: iPad Pro OLED và hơn thế nữa',
      description: 'Tổng hợp các tin đồn đáng tin cậy nhất về thế hệ máy tính bảng và máy tính Mac sắp ra mắt.',
      category: 'Thị trường',
      readTime: '6 phút đọc',
      date: '30 Tháng 09, 2023',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRG06NWzmMB-yZy3qWiD8adsAMbWOz9fYovlglF-FpryxfC0FXsZ4vcJMqQ8W0QX4Q_k-KUAvg8bvlXeMdXfGkEcJM7SQcA1eW7_JVRfKu3pbIsK2a34wQB7-0GXkJ7d0Ab7VzHjAYWFhmhALwKQrCEoBIIrH3IvkUeDIkwvKNjAhThZP_iVpVqYrs-Jtylspuh57NBbYwEb-wsDG7bRDCk-qsIem_NL9NIOdN3aKYnolmcspOUh0Q5AQhyMlNCVu2yzPmdupKBA',
    },
  ];

  return (
    <div>
      <Header />
      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-10">
        {/* Page Title & Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Tin tức Công nghệ</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">Cập nhật những thông tin mới nhất về review, hướng dẫn và sản phẩm công nghệ hàng đầu thế giới.</p>
        </div>

        {/* Categories & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          {['Tất cả', 'Review', 'Hướng dẫn', 'Sản phẩm mới', 'Thị trường'].map((cat, i) => (
            <button
              key={i}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                i === 0
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Article (Hero) */}
        <div className="group relative overflow-hidden rounded-2xl bg-slate-900 mb-12 h-[450px]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBP8Wi1x31Yjshp6o3YnyJsrdMBn7xAfUNcv5Q4eH9gNXFrbzVOn1BE5HA6eYOtCueQlPAIc94q69OhoDNBgJ-55oiUsQCgEXcBWP2eibwcmvWoCH4fdhDanNWhup4iw6rTQM_-_g4MgH9W9oIBLCM_RiM_PDBNle9EFWVqXaxlhZ9aMFfYtfuq5aaCJxHtlCRYrKaF_mVh7Luk8cy0UlGnqpkBOvrKYo-GktpVrJmA3UZd0EFOJXPDRuxTO2-RM9KL5k9Z7__1bQ')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-3xl">
            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-md mb-4">Tiêu điểm</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">iPhone 16: Mọi điều chúng ta biết cho đến thời điểm hiện tại</h2>
            <p className="text-slate-200 text-lg mb-6 line-clamp-2">Tin đồn về màn hình mới, cải tiến camera và chip xử lý AI vượt trội trên thế hệ iPhone tiếp theo đang làm nức lòng các fan công nghệ.</p>
            <a className="inline-flex items-center text-white font-bold group-hover:underline" href="#">
              Đọc bài viết <span className="material-symbols-outlined ml-2">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article key={index} className="flex flex-col group">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-sm">
                <div
                  className="absolute inset-0 bg-center bg-cover transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url('${article.image}')` }}
                ></div>
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded text-[10px] font-bold uppercase tracking-wider text-primary">{article.category}</div>
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors leading-snug">{article.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{article.description}</p>
                <div className="mt-auto flex items-center gap-3 text-[12px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> {article.readTime}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-16 flex items-center justify-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">2</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">3</button>
          <span className="px-2 text-slate-400">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">10</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewsPage;
