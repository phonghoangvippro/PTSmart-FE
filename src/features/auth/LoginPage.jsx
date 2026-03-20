import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAPI, registerAPI } from './authAPI';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);

  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginView) {
        const data = await loginAPI(email, password);

        // Store user info and token in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userToken', data.token);

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        navigate('/');
      } else {
        // Register logic
        if (password !== confirmPassword) {
          throw new Error('Mật khẩu xác nhận không khớp');
        }
        const data = await registerAPI({ 
          name, 
          email, 
          password, 
          password_confirmation: confirmPassword, 
          phone 
        });

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userToken', data.token);

        navigate('/');
      }
    } catch (err) {
      setError(err.message || (isLoginView ? 'Đăng nhập thất bại. Vui lòng thử lại.' : 'Đăng ký thất bại. Vui lòng thử lại.'));
    } finally {
      setLoading(false);
    }
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
            <Link to="/" className="font-display font-black text-4xl tracking-tighter text-white hover:opacity-80 transition-opacity">
              PTSmart
            </Link>
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
              <Link to="/" className="flex items-center gap-3">
                <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-2xl">devices</span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-primary">PTSmart</span>
              </Link>
            </div>
            <h1 className="font-display text-4xl font-bold text-[#0d121b] tracking-tight mb-3">
              {isLoginView ? 'Đăng nhập' : 'Đăng ký'}
            </h1>
            <p className="text-gray-500 font-medium">
              {isLoginView ? 'Chào mừng trở lại với hệ thống PTSmart.' : 'Tạo tài khoản mới để trải nghiệm hết các tiện ích của PTSmart.'}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}
            {/* Extra Register Fields */}
            {!isLoginView && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-500 px-1">Tên hiển thị</label>
                  <input
                    className="w-full px-5 py-4 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-400 outline-none"
                    placeholder="Họ và tên"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-500 px-1">Điện thoại</label>
                  <input
                    className="w-full px-5 py-4 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-400 outline-none"
                    placeholder="0XXXXXXXXX"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-500 px-1">
                Email
              </label>
              <div className="relative group">
                <input
                  className="w-full px-5 py-4 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-400 outline-none"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  required
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

            {/* Confirm Password Field for Register */}
            {!isLoginView && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-500 px-1">Xác nhận mật khẩu</label>
                <div className="relative group">
                  <input
                    className="w-full px-5 py-4 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-400 outline-none pr-14"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Helpers (Only show in login view) */}
            {isLoginView && (
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
            )}

            {/* Primary Action */}
            <button
              className="w-full primary-gradient text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : (isLoginView ? 'Đăng nhập' : 'Đăng ký ngay')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">
                {isLoginView ? 'Hoặc đăng nhập với' : 'Hoặc đăng ký bằng'}
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <button className="flex items-center justify-center gap-3 px-6 py-3.5 bg-gray-100 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-300 group">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-bold text-gray-600 text-sm">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 px-6 py-3.5 bg-gray-100 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-300 group">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-bold text-gray-600 text-sm">Facebook</span>
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center">
            <p className="text-gray-500 font-medium">
              {isLoginView ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
              <button 
                type="button" 
                onClick={() => {
                  setIsLoginView(!isLoginView);
                  setError('');
                }} 
                className="text-accent-pink font-bold hover:underline ml-1"
              >
                {isLoginView ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
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

export default LoginPage;
