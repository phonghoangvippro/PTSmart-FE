import React, { useState, useEffect, useRef } from 'react';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { getProfile, updateProfile, uploadAvatar, changePassword } from './profileAPI';

const API_BASE_URL = 'http://127.0.0.1:8000';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const GENDER_OPTIONS = [
  { value: 'male', label: 'Nam', activeClass: 'bg-primary text-white border-primary' },
  { value: 'female', label: 'Nữ', activeClass: 'bg-pink-500 text-white border-pink-500' },
  { value: 'other', label: 'Khác', activeClass: 'bg-slate-500 text-white border-slate-500' },
];

const Profile = () => {
  const fileInputRef = useRef(null);

  // Profile data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    phone: '',
    birthday: '',
    gender: '',
    city: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  // Avatar upload
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pwForm, setPwForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getProfile();
        const u = res.user;
        setUser(u);
        setForm({
          name: u.name || '',
          phone: u.phone || '',
          birthday: u.birthday ? u.birthday.split('T')[0] : '',
          gender: u.gender || '',
          city: u.city || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaveMsg(null);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveMsg(null);
      const res = await updateProfile(form);
      setUser(res.user);
      // Update localStorage user info
      localStorage.setItem('user', JSON.stringify(res.user));
      setSaveMsg({ type: 'success', text: res.message || 'Cập nhật thành công!' });
    } catch (err) {
      setSaveMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setAvatarUploading(true);
      const res = await uploadAvatar(file);
      setUser((prev) => ({ ...prev, avatar: res.avatar }));
      // Update localStorage
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      stored.avatar = res.avatar;
      localStorage.setItem('user', JSON.stringify(stored));
    } catch (err) {
      alert('Lỗi upload ảnh: ' + err.message);
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.password !== pwForm.password_confirmation) {
      setPwMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
      return;
    }
    if (pwForm.password.length < 6) {
      setPwMsg({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
      return;
    }
    try {
      setPwSaving(true);
      setPwMsg(null);
      const res = await changePassword(pwForm.current_password, pwForm.password, pwForm.password_confirmation);
      setPwMsg({ type: 'success', text: res.message || 'Đổi mật khẩu thành công!' });
      setPwForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.message });
    } finally {
      setPwSaving(false);
    }
  };

  const handleReset = () => {
    if (!user) return;
    setForm({
      name: user.name || '',
      phone: user.phone || '',
      birthday: user.birthday ? user.birthday.split('T')[0] : '',
      gender: user.gender || '',
      city: user.city || '',
    });
    setSaveMsg(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex flex-1 justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex flex-1 justify-center items-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-red-400 mb-4">error</span>
            <p className="text-red-500 font-bold text-lg">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const avatarUrl = getImageUrl(user?.avatar);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex flex-1 justify-center py-10 px-4 md:px-10">
        <div className="flex flex-col max-w-[800px] flex-1">
          {/* Profile Header Card */}
          <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 mb-8">
            <div className="h-32 w-full opacity-20" style={{ background: 'linear-gradient(135deg, #135bec 0%, #ec4899 100%)' }}></div>
            <div className="px-8 pb-8 -mt-12 flex flex-col items-center sm:items-start sm:flex-row gap-6">
              <div className="relative">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center bg-slate-200 dark:bg-slate-700"
                  style={avatarUrl ? { backgroundImage: `url('${avatarUrl}')` } : {}}
                >
                  {!avatarUrl && (
                    <span className="material-symbols-outlined text-5xl text-slate-400">person</span>
                  )}
                  {avatarUploading && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAvatarClick}
                  disabled={avatarUploading}
                  className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90 transition-transform hover:scale-110"
                >
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div className="flex flex-col pt-14 flex-1 text-center sm:text-left">
                <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">{user?.name}</h1>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{user?.email}</span>
                  {user?.membership && (
                    <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-xs font-semibold">{user.membership}</span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold">ID: {user?.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile}>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
              <div className="flex items-center gap-2 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="material-symbols-outlined text-primary">person</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thông tin cá nhân</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Họ và tên</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">badge</span>
                    <input
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="Nhập họ và tên"
                      type="text"
                      value={form.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                    />
                  </div>
                </div>
                {/* Phone Number */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Số điện thoại</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">call</span>
                    <input
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="Nhập số điện thoại"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                    />
                  </div>
                </div>
                {/* Email (read-only) */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                    <input
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 outline-none cursor-not-allowed text-slate-500"
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      disabled
                    />
                  </div>
                  <p className="text-xs text-slate-400">Email không thể thay đổi</p>
                </div>
                {/* Birthday */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Ngày sinh</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">calendar_today</span>
                    <input
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      type="date"
                      value={form.birthday}
                      onChange={(e) => handleFormChange('birthday', e.target.value)}
                    />
                  </div>
                </div>
                {/* Gender */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Giới tính</label>
                  <div className="flex gap-4 h-[50px] items-center">
                    {GENDER_OPTIONS.map((g) => (
                      <label key={g.value} className="flex-1 cursor-pointer" onClick={() => handleFormChange('gender', g.value)}>
                        <div className={`w-full py-3 text-center rounded-lg border transition-all font-medium ${
                          form.gender === g.value
                            ? g.activeClass
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}>
                          {g.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                {/* City */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Thành phố</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">location_on</span>
                    <input
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="Nhập thành phố"
                      type="text"
                      value={form.city}
                      onChange={(e) => handleFormChange('city', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Save Message */}
              {saveMsg && (
                <div className={`mt-6 p-4 rounded-lg text-sm font-medium ${
                  saveMsg.type === 'success'
                    ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {saveMsg.text}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">save</span>
                  {saving ? 'Đang lưu...' : 'Cập nhật thông tin'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Hủy thay đổi
                </button>
              </div>
            </div>
          </form>

          {/* Change Password Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 mt-8">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">lock</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Đổi mật khẩu</h3>
              </div>
              <span className={`material-symbols-outlined text-slate-400 transition-transform ${showPasswordForm ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </div>

            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">key</span>
                    <input
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      type="password"
                      placeholder="Nhập mật khẩu hiện tại"
                      value={pwForm.current_password}
                      onChange={(e) => setPwForm((p) => ({ ...p, current_password: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Mật khẩu mới</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                      <input
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={pwForm.password}
                        onChange={(e) => setPwForm((p) => ({ ...p, password: e.target.value }))}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Xác nhận mật khẩu mới</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                      <input
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f6f6f8] dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        value={pwForm.password_confirmation}
                        onChange={(e) => setPwForm((p) => ({ ...p, password_confirmation: e.target.value }))}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>

                {pwMsg && (
                  <div className={`p-4 rounded-lg text-sm font-medium ${
                    pwMsg.type === 'success'
                      ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {pwMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={pwSaving}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">lock_reset</span>
                  {pwSaving ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </button>
              </form>
            )}
          </div>

          {/* Addresses Section */}
          {user?.addresses && user.addresses.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 mt-8">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Địa chỉ nhận hàng</h3>
              </div>
              <div className="space-y-4">
                {user.addresses.map((addr) => (
                  <div key={addr.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-sm">{addr.name}</span>
                      <span className="text-slate-400">|</span>
                      <span className="text-sm text-slate-500">{addr.phone}</span>
                      {addr.is_default && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full ml-2">Mặc định</span>
                      )}
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 text-[10px] font-medium rounded-full">
                        {addr.type === 'home' ? 'Nhà riêng' : addr.type === 'office' ? 'Văn phòng' : addr.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{addr.address}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
