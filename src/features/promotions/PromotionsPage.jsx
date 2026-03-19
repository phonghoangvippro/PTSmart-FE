import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';

const PromotionsPage = () => {
  const promoCards = [
    {
      title: 'Trả góp 0% lãi suất',
      description: 'Áp dụng cho iPhone 15 Series và các dòng Macbook mới nhất.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC3PJ_1YAdd9HEV4vDx-GW0J9KEm9IowogFO_iU5lr0Q8jeScA6Ox-MqTzR9Zs_r4MwdCyabUodpU9lAZF448J4BB8zZH7Gm4S7fxmhqNFfIrxvLRBktwqfGDeFCoEa0airHbfwzTqCXdqZi8durAlu4lZNCs_hlsX2TMdr1M3Tj3d8I7wm_Ip4VUhtBvaP__Ilb8OvJapZjRGO-bJohq_v_hUNBps_2EUYKmiia1ZckloigqK7k7mlnzkSY3t2H30gd80qjmY2Q',
    },
    {
      title: 'Thu cũ đổi mới',
      description: 'Trợ giá lên đến 2 triệu đồng khi nâng cấp smartphone đời mới.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1YDzMZED_1Y2OayGTsEfX2mq01b2r337ZcqBcjXq8Aw8498nVzOkvg2IwA1inshr8FAhqqJaAvF-r3LySEToyakYuMmVRoCnJtQdylTTigH7PpeHYVD6nhRfOhG4FEdVCyNZEssjmHUbR2plDxlr30KeilVaf1uaoZR9xim7dVjjM6KVg31XZ93qsWOV5ajvOBOr5AjDuuCarw19838EWNh-UUTN-OLsaYjxmvVvrrs1IPqbHKQp3aQxSqaoKmXAbWa1Qog2rlA',
    },
    {
      title: 'Bảo hành 2 năm',
      description: 'Yên tâm sử dụng sản phẩm với gói bảo hành mở rộng chính hãng.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRYRJaeZf5fLjvNJ6krkXu0B4aiR5YllNtwEwAuE3seT9YyGKJd9UfnlvBnCEBycfKtPa6l7jEfAAJg4cDyJvE7QIcHFzTh4yW8SiiyNFYFZR87OOrbQbdKEoCrcbBDtfbomSh5C919cCPqe8QQW2kmZbc-sIR2b4-27nlfl3XzbOV-UX5bjIpB9GfuRBQK-xSmGqYus7-HhucOiroNtRk_Rw-IXcsxOBPcYyQO2DHiq8TTxxj64bfHHOUGy4UP-qSA5OL6gpRtg',
    },
  ];

  const discountProducts = [
    { name: 'iPhone 15 Pro 128GB - Chính hãng VN/A', price: '24.990.000đ', oldPrice: '28.990.000đ', discount: '-15%', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2qGIMzgKqWdBgDqTdGGaI3P7IP_FHFSLGFvIThnUvu_ye3v0XytB-yyXctABCnOSSF2n5zpGZZljD-o84kzKLSa-hFgVyZ0d1GUoTIOXF7z9s-6bdEoEcPUpIPFp3oL7dnffr7SEG9ejM9qLNr8KKz_k9hl5kQJwky8OZfVmK30auN7OaWzRH4dAEDP2Db2GCJ9tn98IlS3roO_HD-de_2DM0N9M4YfbF0iVSbvRdiHADI1HCW19MKTFjVuem_SdpPwnyIGTc4Q' },
    { name: 'MacBook Air M2 (8GB/256GB)', price: '22.490.000đ', oldPrice: '27.990.000đ', discount: '-20%', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsEivReta5eBD-uADAb4ut6TJ-2P5MyhH51breR8e8ucB1tSFlWp1iCGDyJ5FW_mhXq6i5G2nk1CWaInNQQoHCKJt39_vcBvhJI7PAbKWlATvhq88rmVSQUYQr03wZMhu1o8a2J6yLTf7fmUQQ9UsYvoVfn3Q9NnAYpIrV4TR6dK2v8bByWNcO9V2_6L90xQHCvnbtnVw1B4E2bNlenc6dfBWnlsqkDy19yMx4VfgWmJG_c7Dy292F0mitcXQ2mvbf5yfSiBoH6w' },
    { name: 'Sony WH-1000XM5 Wireless Headphones', price: '6.290.000đ', oldPrice: '8.990.000đ', discount: '-30%', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVM0dKYbDjYAMrrGqRt4x6ALjAWa6vz2ejmIS1cm5jXkByBEAu4D8A9-J0FchlkvRHCC7a0F-_isNnloG0RfMzrJ5ATd12m0aWHEVK-KBNniLF4j5wVxwZLvpPUarGr3JrCYEtIqCASACoxIyIfiXZn6QIdrhH4Szz5QeQaxbcMDJNQnEOpdDDVqLPrHIYWJJxEd5Enysl4RtGVzwJ8QgD7QSW16ISHuokvsWzX3SnDwXysgXg4esMYnv-9yEYvjz_yNhsx8Ve4w' },
    { name: 'iPad Pro M2 11 inch 128GB WiFi', price: '19.990.000đ', oldPrice: '22.190.000đ', discount: '-10%', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB97sv7KWWJ7KD-aDn7176GJAgwk8B3nyRK0KLiC4EvNuPgA1kwzY_a1WiGkHJcS1_INqqhbIQVytqs-u0yMuJk7XhAewECluQFvMlD2n_z8FXzsSzm_wkhfmzDxFTwSIDhJ-APyjIaRWAf9KhTzCer4JikIzqnkRzfXTKQrMC6EfmulRimlbzbk-tAqK0mh93YDTC3KHbaKEHTKJnjOUEyOOLhqpDbAzCywfeRkyZqJXDv4Wzpv5O0yHibB2I9FRwLKTw7a5p9KQ' },
    { name: 'Apple Watch Series 9 GPS 41mm', price: '7.890.000đ', oldPrice: '10.490.000đ', discount: '-25%', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD-jdqpV61RCardYATWaFJ5GL3sHgseQ8j4QSzT-sfOgJChwHzSOQcaTxgzRP2LL7UZWudaiEcR5A7bgmyyLvdFOXMr-ks18Fyxjhxd_433KhelU4lgV2iTSh3epbKkX01GFTX3Rx-wQIZc9ohATFyulSvxk7Gy0pU8_begX_VHmG4lWAODlHj8QAXYAvQUB7ijc3pQykLUtRKZ20d3JEHDvhpFWjSn2_lldcr0h3nFfA9J-fe2PRi00V2UTXpu9LH7PCoTDR2cQ' },
  ];

  return (
    <div>
      <Header />
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-10 py-8 space-y-12">
        {/* Hero Banner Section */}
        <section>
          <div className="relative rounded-xl overflow-hidden min-h-[400px] flex items-center bg-slate-900">
            <div className="absolute inset-0 opacity-60">
              <img alt="Mega Summer Sale Banner" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXq9HavZZAlGQX0x3MxYAJ9fuitXCuDYv3D-C55Vgs-20xkTBWn8LJFfuAPpozRieztZMt5j8irZrMslirtr_TGALBeW9kYp49pSJVL-lKc6P-0tV2tt9bLGn9RPBQIXBOD8TWYWx2hnCiVXD1mnVB6qc-VEO4cQK-myqQdlYssl9WznxaNxsm8TGcEXvpYF8VDgT4_rfkqQIDCifn7H8tSDua7mb8pISUw3QHFgpHJVP-QjyQGCEgGQ2e1hz7H0kgDAed6zaNlg" />
            </div>
            <div className="relative z-10 p-8 md:p-16 max-w-2xl">
              <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded mb-4 uppercase tracking-widest">Sự kiện đặc biệt</span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">Siêu Sale Mùa Hè - Giảm Đến 50%</h1>
              <p className="text-white/80 text-lg mb-8">Nâng cấp công nghệ ngay hôm nay với hàng ngàn ưu đãi hấp dẫn dành riêng cho bạn. Miễn phí vận chuyển toàn quốc.</p>
              <div className="flex gap-4">
                <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2">
                  Mua sắm ngay <span className="material-symbols-outlined">trending_flat</span>
                </button>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-lg font-bold transition-all">
                  Xem thêm
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Major Promotion Programs */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Chương trình ưu đãi lớn</h2>
            <Link className="text-primary font-medium hover:underline text-sm flex items-center gap-1" to="#">
              Xem tất cả <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promoCards.map((promo, index) => (
              <div key={index} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-48 overflow-hidden">
                  <img alt={promo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={promo.image} />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">{promo.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{promo.description}</p>
                  <button className="w-full py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold hover:bg-primary hover:text-white transition-colors">Xem chi tiết</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Deep Discount Products */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">local_fire_department</span>
            <h2 className="text-2xl font-bold tracking-tight">Sản phẩm giảm giá sâu</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {discountProducts.map((product, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="relative aspect-square mb-4 bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden group">
                  <img alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform" src={product.image} />
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">{product.discount}</div>
                </div>
                <h4 className="font-medium text-sm md:text-base mb-1 line-clamp-2">{product.name}</h4>
                <div className="mt-auto">
                  <p className="text-primary font-bold text-lg">{product.price}</p>
                  <p className="text-slate-400 text-xs line-through mb-3">{product.oldPrice}</p>
                  <button className="w-full py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors">Thêm vào giỏ</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Promo Section */}
        <section className="bg-primary/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Nhận thông báo ưu đãi mới nhất</h2>
            <p className="text-slate-600 dark:text-slate-400">Đừng bỏ lỡ bất kỳ chương trình khuyến mãi nào. Đăng ký nhận bản tin từ PTSmart ngay!</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input className="flex-1 md:min-w-[300px] rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus:ring-primary focus:border-primary px-4" placeholder="Nhập email của bạn" type="email" />
            <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all">Đăng ký</button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PromotionsPage;
