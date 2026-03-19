import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate admin login - store admin info in localStorage
    const adminData = {
      name: 'Admin PTSmart',
      email: email || 'admin@ptsmart.com',
      role: 'admin',
    };
    localStorage.setItem('admin', JSON.stringify(adminData));
    if (rememberMe) {
      localStorage.setItem('adminRememberMe', 'true');
    }
    navigate('/admin');
  };

  return (
    <main className="min-h-screen flex items-stretch">
      {/* Left Column: Visual/Lifestyle */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#135bec]">
        <div className="absolute inset-0 z-0 opacity-80 mix-blend-overlay">
          <img
            alt="Modern tech workspace with premium electronics gadgets"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXZuuEwlMHpJqwJriPKRB5No1HHIw0NdiGywKGeJASlzAsgba7aP91GvIP2bFgTYd5a5LRgA5ZWtcK1e0Q10BnKBECF0No6-2hzXdkn87STU33ja4D_l4AuTIkuIsOckfTlDO8g7kgtZyT9UrBi6kXEodgqw1APVdihBDuA_XL5C7CcVw6r1vF7AuhhjG75yyfkNh8Glq5zlAuZ3gI7jD6QsGsGb9UQD0wrAT5rfMDXK0s8pIAq3ypr17MdGXT4ajvp2d_W00fVA"
          />
        </div>
        {/* Editorial Overlay Content */}
        <div className="relative z-10 p-20 flex flex-col justify-between w-full">
          <div>
            <span className="font-display font-black text-4xl tracking-tighter text-white">
              PTSmart
            </span>
          </div>
          <div className="max-w-md">
            <h2 className="font-display text-5xl font-bold leading-tight text-white mb-6">
              Trải nghiệm công nghệ chuẩn xác.
            </h2>
            <p className="text-white/80 text-lg font-light leading-relaxed">
              Nâng tầm phong cách sống với hệ sinh thái thiết bị điện tử chính xác từ PTSmart. Khám phá sự khác biệt trong từng chi tiết.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="h-1 w-12 bg-white rounded-full"></div>
            <div className="h-1 w-4 bg-white/30 rounded-full"></div>
            <div className="h-1 w-4 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Right Column: Login Form */}
      <section className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-[440px]">
          {/* Header */}
          <div className="mb-12">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 flex items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-2xl">devices</span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-primary">PTSmart</span>
              </div>
            </div>
            <h1 className="font-display text-4xl font-bold text-[#0d121b] tracking-tight mb-3">
              Đăng nhập Quản trị viên
            </h1>
            <p className="text-gray-500 font-medium">
              Hệ thống quản trị thiết bị điện tử PTSmart.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-500 px-1">
                Email
              </label>
              <div className="relative group">
                <input
                  className="w-full px-5 py-4 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-400 outline-none"
                  placeholder="admin@ptsmart.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-500 px-1">
                Mật khẩu
              </label>
              <div className="relative group">
                <input
                  className="w-full px-5 py-4 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-400 outline-none pr-14"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Helpers */}
            <div className="flex items-center justify-between py-2">
              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-offset-0 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <a
                className="text-sm font-bold text-primary hover:text-blue-800 transition-colors"
                href="#"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Primary Action */}
            <button
              className="w-full primary-gradient text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              type="submit"
            >
              Đăng nhập
            </button>
          </form>


        </div>
      </section>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 w-full py-6 pointer-events-none">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] md:text-xs text-gray-400 font-medium">
            © 2024 PTSmart Precision Electronics. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              className="text-[10px] md:text-xs text-gray-400 hover:text-primary transition-colors pointer-events-auto uppercase tracking-tighter font-bold"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-[10px] md:text-xs text-gray-400 hover:text-primary transition-colors pointer-events-auto uppercase tracking-tighter font-bold"
              href="#"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default AdminLogin;
