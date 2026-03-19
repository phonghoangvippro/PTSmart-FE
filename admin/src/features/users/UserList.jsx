import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import { getUsers, updateUser } from './userAPI';
import './UserList.css';

const roleLabels = { admin: 'Quản trị viên', customer: 'Khách hàng' };
const roleStyles = { admin: 'bg-primary/10 text-primary', customer: 'bg-slate-100 text-slate-700' };

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0, from: 0, to: 0 });
  const [editModal, setEditModal] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [editStatus, setEditStatus] = useState(1);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const fetchUsers = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const res = await getUsers(page, search);
      setUsers(res.data || []);
      setPagination({ currentPage: res.current_page, lastPage: res.last_page, total: res.total, from: res.from || 0, to: res.to || 0 });
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounced search
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => fetchUsers(1, value), 400));
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.lastPage) return;
    fetchUsers(page, searchQuery);
  };

  const openEditModal = (user) => {
    setEditModal(user);
    setEditRole(user.role);
    setEditStatus(user.status);
  };

  const handleEditSubmit = async () => {
    if (!editModal) return;
    setSaving(true);
    try {
      await updateUser(editModal.id, { role: editRole, status: Number(editStatus) });
      setEditModal(null);
      fetchUsers(pagination.currentPage, searchQuery);
    } catch (err) {
      alert('Cập nhật thất bại: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 1 ? 0 : 1;
    const action = newStatus === 0 ? 'khóa' : 'mở khóa';
    if (!window.confirm(`Bạn muốn ${action} tài khoản "${user.name}"?`)) return;
    setUpdatingId(user.id);
    try {
      await updateUser(user.id, { status: newStatus, role: user.role });
      fetchUsers(pagination.currentPage, searchQuery);
    } catch (err) {
      alert('Cập nhật thất bại: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Client-side tab filter
  const filteredUsers = users.filter(u => {
    if (activeTab === 'admin') return u.role === 'admin';
    if (activeTab === 'customer') return u.role === 'customer';
    if (activeTab === 'locked') return u.status === 0;
    return true;
  });

  const adminCount = users.filter(u => u.role === 'admin').length;
  const customerCount = users.filter(u => u.role === 'customer').length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Quản lý Người dùng" />
        <div className="p-8">
          {/* Page Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Quản lý Người dùng</h2>
              <p className="text-slate-500 mt-1">Quản lý danh sách khách hàng, quản trị viên và phân quyền truy cập hệ thống.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Tổng người dùng', value: pagination.total, icon: 'group', color: 'bg-primary/10 text-primary' },
              { label: 'Quản trị viên', value: adminCount, icon: 'admin_panel_settings', color: 'bg-amber-100 text-amber-700' },
              { label: 'Khách hàng', value: customerCount, icon: 'person', color: 'bg-green-100 text-green-700' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.label}</span>
                  <div className={`size-8 rounded-lg ${s.color} flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-lg">{s.icon}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{s.value}</h3>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-6 border-b border-slate-200">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'admin', label: 'Quản trị viên' },
              { key: 'customer', label: 'Khách hàng' },
              { key: 'locked', label: 'Bị khóa' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 border-b-2 font-bold text-sm tracking-wide transition-all ${
                  activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-background-light border-none rounded-lg focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400"
                  placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-background-light text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors">
              <span className="material-symbols-outlined text-lg">file_download</span>Xuất CSV
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                  <p className="mt-4 text-slate-500 font-medium">Đang tải...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Họ và tên</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Số điện thoại</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vai trò</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tạo</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                            <span className="material-symbols-outlined text-4xl mb-2 block">group</span>
                            Không có người dùng nào
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map(user => {
                          const initials = user.name ? user.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : '?';
                          const colors = ['bg-primary/10 text-primary', 'bg-orange-100 text-orange-600', 'bg-emerald-100 text-emerald-600', 'bg-pink-100 text-pink-600'];
                          const colorIdx = user.id % colors.length;

                          return (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {user.avatar ? (
                                    <img alt="" className="w-9 h-9 rounded-full object-cover" src={user.avatar} />
                                  ) : (
                                    <div className={`w-9 h-9 rounded-full ${colors[colorIdx]} flex items-center justify-center font-bold text-sm`}>
                                      {initials}
                                    </div>
                                  )}
                                  <span className="font-bold">{user.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-slate-600">{user.email}</td>
                              <td className="px-6 py-4 text-slate-600">{user.phone || '—'}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleStyles[user.role] || 'bg-slate-100 text-slate-600'}`}>
                                  {roleLabels[user.role] || user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {user.status === 1 ? (
                                  <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>Hoạt động
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>Bị khóa
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500">
                                {new Date(user.created_at).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => openEditModal(user)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Chỉnh sửa">
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleToggleStatus(user)}
                                    disabled={updatingId === user.id}
                                    className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${user.status === 0 ? 'text-primary hover:bg-primary/10' : 'text-accent-pink hover:bg-accent-pink/10'}`}
                                    title={user.status === 0 ? 'Mở khóa' : 'Khóa'}
                                  >
                                    <span className="material-symbols-outlined text-lg">
                                      {updatingId === user.id ? 'progress_activity' : (user.status === 0 ? 'lock_open' : 'lock')}
                                    </span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
                  <p className="text-sm text-slate-500">
                    Hiển thị <span className="font-bold text-slate-900">{pagination.from} - {pagination.to}</span> của{' '}
                    <span className="font-bold text-slate-900">{pagination.total}</span> người dùng
                  </p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1} className="size-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white text-slate-500 transition-colors disabled:opacity-50">
                      <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </button>
                    {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => handlePageChange(p)} className={`size-9 flex items-center justify-center rounded-lg font-medium transition-all ${p === pagination.currentPage ? 'bg-primary text-white font-bold shadow-md shadow-primary/10' : 'border border-slate-200 hover:bg-white text-slate-600'}`}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.lastPage} className="size-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white text-slate-500 transition-colors disabled:opacity-50">
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Edit User Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditModal(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 mx-4">
            <button onClick={() => setEditModal(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold mb-2">Chỉnh sửa người dùng</h3>
            <p className="text-sm text-slate-500 mb-6">{editModal.name} — {editModal.email}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Vai trò</label>
                <select className="w-full rounded-lg border-slate-200 h-11" value={editRole} onChange={e => setEditRole(e.target.value)}>
                  <option value="customer">Khách hàng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Trạng thái</label>
                <select className="w-full rounded-lg border-slate-200 h-11" value={editStatus} onChange={e => setEditStatus(Number(e.target.value))}>
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Bị khóa</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditModal(null)} className="flex-1 px-4 py-3 border border-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50">Hủy</button>
              <button onClick={handleEditSubmit} disabled={saving} className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
                {saving ? 'Đang lưu...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
