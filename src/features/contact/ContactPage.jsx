import React, { useState, useEffect } from 'react';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getSettings, getBranches, submitContact } from './contactAPI';

// Helper function to calculate distance using Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const p = 0.017453292519943295;    // Math.PI / 180
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;
  return 12742 * Math.asin(Math.sqrt(a)); // R = 6371 km
};

const ContactPage = () => {
  const [settings, setSettings] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Nearest Branch mapping state
  const [activeBranch, setActiveBranch] = useState(null);
  const [locationError, setLocationError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch Settings separately to avoid Promise.all failure
      try {
        const settingsData = await getSettings();
        setSettings(settingsData);
      } catch (err) {
        console.error("Lỗi getSettings:", err);
      }

      // Fetch Branches separately
      try {
        const branchesData = await getBranches();
        setBranches(branchesData);
        
        if (branchesData && branchesData.length > 0) {
          // Defaults to the first branch if geolocation isn't ready
          setActiveBranch(branchesData[0]);

          // Attempt to find the nearest branch using Geolocation API
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
              const userLat = position.coords.latitude;
              const userLng = position.coords.longitude;
              
              let nearestBranch = branchesData[0];
              let minDistance = getDistance(userLat, userLng, nearestBranch.lat, nearestBranch.lng);

              for (let i = 1; i < branchesData.length; i++) {
                const b = branchesData[i];
                const dist = getDistance(userLat, userLng, b.lat, b.lng);
                if (dist < minDistance) {
                  minDistance = dist;
                  nearestBranch = b;
                }
              }
              setActiveBranch(nearestBranch);
            }, (error) => {
              setLocationError('Không thể xác định vị trí của bạn để tìm cửa hàng gần nhất.');
              // activeBranch is already default at index 0
            });
          }
        }
      } catch (err) {
        console.error("Lỗi getBranches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      setSubmitResult({ error: 'Vui lòng điền đầy đủ thông tin!' });
      return;
    }
    
    setSubmitLoading(true);
    setSubmitResult(null);
    try {
      const result = await submitContact({ name, email, phone, message });
      setSubmitResult({ success: result.message || 'Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất.' });
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setSubmitResult({ error: err.message });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
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
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 -mt-12 mb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form & Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Map Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-1 relative">
                  {locationError && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white shadow-md text-slate-700 text-xs px-3 py-1.5 rounded-full border border-slate-200">
                      {locationError}
                    </div>
                  )}
                  <div className="relative w-full h-[400px] bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden">
                    {activeBranch ? (
                      <iframe 
                        title={`Bản đồ đến ${activeBranch.name}`}
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight="0" 
                        marginWidth="0" 
                        src={`https://maps.google.com/maps?q=${activeBranch.lat},${activeBranch.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      ></iframe>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <span className="material-symbols-outlined text-primary text-5xl animate-bounce">location_off</span>
                          <p className="mt-2 text-slate-500 font-medium">Bản đồ không khả dụng</p>
                        </div>
                      </div>
                    )}
                    
                    {activeBranch && (
                      <div className="absolute left-4 top-4">
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${activeBranch.lat},${activeBranch.lng}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 text-slate-700 hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-primary/20"
                        >
                          <span className="material-symbols-outlined text-primary">directions</span>
                          <span className="text-sm font-bold">Chỉ đường tới điểm gần nhất</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Form */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Gửi tin nhắn cho PTSmart</h3>
                
                {submitResult?.success && (
                  <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-center gap-3">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span className="font-medium text-sm">{submitResult.success}</span>
                  </div>
                )}

                {submitResult?.error && (
                  <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-3">
                    <span className="material-symbols-outlined">error</span>
                    <span className="font-medium text-sm">{submitResult.error}</span>
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Họ và tên</label>
                      <input 
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                        placeholder="Nhập họ tên của bạn" 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                      <input 
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                        placeholder="example@gmail.com" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Số điện thoại</label>
                    <input 
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                      placeholder="Nhập số điện thoại" 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nội dung tin nhắn</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none" 
                      placeholder="Bạn cần chúng tôi hỗ trợ điều gì?" 
                      rows="4"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button 
                    className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50" 
                    type="submit"
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        Gửi tin nhắn
                        <span className="material-symbols-outlined text-[20px]">send</span>
                      </>
                    )}
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
                        <p className="text-lg font-bold">{settings?.hotline || '1900 6789'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <span className="material-symbols-outlined">mail</span>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Email liên hệ</p>
                        <p className="text-lg font-bold">{settings?.support_email || 'support@ptsmart.vn'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <span className="material-symbols-outlined">schedule</span>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Giờ làm việc</p>
                        <p className="text-lg font-bold">{settings?.working_hours || '08:00 - 21:00 (Hàng ngày)'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 flex gap-4">
                    <a className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all cursor-pointer">
                      <span className="material-symbols-outlined text-[20px]">public</span>
                    </a>
                    <a className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all cursor-pointer">
                      <span className="material-symbols-outlined text-[20px]">chat</span>
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
                {branches && branches.length > 0 ? (
                  <div className="space-y-6">
                    {branches.map((branch, index) => (
                      <div 
                        key={branch.id || index} 
                        className={`pb-6 ${index < branches.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''} ${activeBranch?.id === branch.id ? 'bg-primary/5 -mx-4 px-4 pt-4 rounded-xl' : ''}`}
                      >
                        <h4 className="font-bold text-primary mb-2 flex items-center justify-between">
                          {branch.name}
                          {activeBranch?.id === branch.id && (
                            <span className="text-[10px] bg-accent-pink text-white px-2 py-0.5 rounded-full lowercase tracking-wider">Gần nhất</span>
                          )}
                        </h4>
                        <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <span className="material-symbols-outlined text-sm mt-0.5 text-slate-400">location_on</span>
                          <p>{branch.address}</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mt-2">
                          <span className="material-symbols-outlined text-sm text-slate-400">call</span>
                          <p>{branch.phone}</p>
                        </div>
                        <button 
                          onClick={() => setActiveBranch(branch)}
                          className={`mt-3 text-xs font-bold transition-all ${activeBranch?.id === branch.id ? 'hidden' : 'text-primary hover:underline'}`}
                        >
                          Hiển thị trên bản đồ
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">Chưa có chi nhánh nào được kích hoạt.</p>
                )}
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
