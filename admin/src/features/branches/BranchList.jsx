import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getBranches, createBranch, updateBranch, deleteBranch } from './branchAPI';

const BranchList = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBranches();
      // Handle Laravel resource or raw array
      setBranches(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error('Failed to load branches:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const openCreate = () => {
    setEditingBranch(null);
    setName('');
    setAddress('');
    setPhone('');
    setLat('');
    setLng('');
    setError(null);
    setShowModal(true);
  };

  const openEdit = (branch) => {
    setEditingBranch(branch);
    setName(branch.name || '');
    setAddress(branch.address || '');
    setPhone(branch.phone || '');
    setLat(branch.lat || '');
    setLng(branch.lng || '');
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !phone.trim() || !lat || !lng) {
      setError('Vui lòng điền đầy đủ các thông tin (Tên, Địa chỉ, SĐT, Vĩ độ, Kinh độ)');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim(),
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };

      if (editingBranch) {
        await updateBranch(editingBranch.id, payload);
      } else {
        await createBranch(payload);
      }
      setShowModal(false);
      fetchBranches();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, branchName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa chi nhánh "${branchName}"?`)) return;
    setDeleting(id);
    try {
      await deleteBranch(id);
      fetchBranches();
    } catch (err) {
      alert('Xóa thất bại: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  // Helper to generate an abbreviation (e.g. PTSmart Đà Nẵng -> PĐ)
  const getAbbr = (str) => {
    if (!str) return 'CN';
    const words = str.split(' ').filter(w => w.length > 0);
    if (words.length > 1) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen relative">
        <Header title="Quản lý Chi nhánh" />
        <div className="p-8 pb-32">
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">Hệ thống PTSmart</p>
              <h2 className="text-3xl font-bold tracking-tight">Quản lý Chi nhánh</h2>
              <p className="text-slate-500 mt-1 max-w-md">Quản lý danh sách các điểm giao dịch, bảo hành và cửa hàng bán lẻ trên toàn quốc.</p>
            </div>
            <button 
              onClick={openCreate}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">add_location</span>Thêm Chi Nhánh Mới
            </button>
          </div>

          <div className="grid grid-cols-12 gap-6 mb-8">
            <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="z-10 relative">
                <p className="text-slate-500 text-sm font-medium">Tổng số chi nhánh</p>
                <h3 className="text-5xl font-bold mt-2">{branches.length}</h3>
                <p className="text-emerald-600 text-xs font-bold mt-4 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span>Online & Sẵn sàng
                </p>
              </div>
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-slate-50 group-hover:text-blue-50 transition-colors">domain</span>
            </div>
            <div className="col-span-12 lg:col-span-8 bg-primary rounded-2xl p-1 overflow-hidden shadow-xl shadow-primary/10">
              <div className="bg-blue-600 h-full rounded-xl p-6 flex flex-col justify-center relative overflow-hidden text-white">
                <div className="z-10 max-w-md">
                  <h4 className="text-2xl font-bold mb-2">Bản đồ vị trí</h4>
                  <p className="text-sm opacity-80 leading-relaxed">Hệ thống đã tự động ghi nhận tọa độ (vĩ độ, kinh độ) để hiển thị chi nhánh gần nhất cho khách hàng trên toàn quốc.</p>
                  <button className="mt-4 text-sm font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors border border-white/20">Cập nhật thống kê</button>
                </div>
                <span className="material-symbols-outlined absolute right-4 -bottom-10 text-[180px] text-white opacity-5">map</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                <span className="ml-3 font-semibold text-slate-500">Đang tải chi nhánh...</span>
              </div>
            ) : (
              <>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Tên Chi Nhánh</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Địa Chỉ</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Hotline</th>
                      <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">Tọa độ Bản Đồ</th>
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right border-b border-slate-200">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {branches.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-8 py-16 text-center text-slate-400">
                          Chưa có chi nhánh nào
                        </td>
                      </tr>
                    ) : (
                      branches.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary font-bold shadow-sm shadow-blue-500/10">
                                {getAbbr(b.name)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{b.name}</p>
                                <p className="text-[10px] uppercase font-semibold text-emerald-500 tracking-widest mt-1">Hoạt động</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-sm text-slate-600 max-w-[250px] leading-relaxed">
                            {b.address}
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-2 font-semibold text-slate-700">
                              <span className="material-symbols-outlined text-sm text-slate-400">call</span>
                              {b.phone}
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <span className="bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-500 flex flex-col gap-0.5 w-max">
                              <span>Lat: {b.lat || 'N/A'}</span>
                              <span>Lng: {b.lng || 'N/A'}</span>
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => openEdit(b)}
                                className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-primary rounded-lg transition-colors border border-transparent hover:border-blue-100"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button 
                                onClick={() => handleDelete(b.id, b.name)}
                                disabled={deleting === b.id}
                                className="w-9 h-9 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100 disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-lg">
                                  {deleting === b.id ? 'progress_activity' : 'delete'}
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Tất cả {branches.length} chi nhánh</p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8 mx-4 animate-in">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-800">
              <span className="material-symbols-outlined text-primary bg-blue-50 p-2 rounded-xl">{editingBranch ? 'edit_square' : 'add_location_alt'}</span>
              {editingBranch ? 'Cập nhật Chi nhánh' : 'Thiết lập Chi nhánh mới'}
            </h3>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-start gap-3">
                <span className="material-symbols-outlined">error</span>
                <p className="mt-0.5">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tên chi nhánh <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-4 py-3" 
                  placeholder="VD: PTSmart Phan Thiết" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  autoFocus
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Địa chỉ <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-4 py-3" 
                    placeholder="VD: 99 Trần Hưng Đạo, Phan Thiết" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    required 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Hotline (Điện thoại) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-4 py-3 font-mono" 
                    placeholder="VD: 0292 123 4567" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Vĩ độ (Latitude) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">explore</span>
                    <input 
                      type="number" 
                      step="any"
                      className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-4 py-3 pl-11 font-mono text-sm" 
                      placeholder="VD: 10.0452" 
                      value={lat} 
                      onChange={(e) => setLat(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kinh độ (Longitude) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">explore</span>
                    <input 
                      type="number" 
                      step="any"
                      className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all px-4 py-3 pl-11 font-mono text-sm" 
                      placeholder="VD: 105.7469" 
                      value={lng} 
                      onChange={(e) => setLng(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-100 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors w-1/3"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 w-2/3 transition-all active:scale-95"
                >
                  {saving ? (
                    <><span className="material-symbols-outlined text-lg animate-spin">progress_activity</span> Đang xử lý...</>
                  ) : (
                    <><span className="material-symbols-outlined text-lg">{editingBranch ? 'save' : 'check_circle'}</span> {editingBranch ? 'Lưu Thay Đổi' : 'Tạo Chi Nhánh Mới'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchList;
