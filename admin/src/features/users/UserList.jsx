import React from 'react';
import Sidebar from '../../shared/components/Sidebar';
import Header from '../../shared/components/Header';
import './UserList.css';

const UserList = () => {
  const users = [
    {
      name: 'Nguyễn Tùng Bò',
      initials: 'NV',
      avatar: null,
      email: 'nguyenvana@gmail.com',
      phone: '0901234567',
      role: 'Khách hàng',
      roleStyle: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      status: 'active',
      initialsColor: 'bg-primary/10 text-primary',
    },
    {
      name: 'Trần Thị Bích',
      initials: null,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN-xG8c8fcn417_tWHlymtP_FFGSkLS48kMUak3pgk-C9a54b28HoB3THhzpNFw1tV1ZT4WzzZdE35eAHxPx1XbbO97t8iwCzvR_Z52MT2R69A5RUoWTn4TNxKUakIn_4DLvEzFrHtGyuwOI6CTWnTWpgaRIcoMpzIZrmmhJOcL81b7aDNs1wf7FvCZYR4jbGaJwhh0qQS7KCXIdYXwsEbHAf-t8sbbYGUIGAyoaCiEuCaEVP-rQ39qBmeMljs-oSFlenFnFoCbw',
      email: 'tranthib@gmail.com',
      phone: '0912345678',
      role: 'Quản trị viên',
      roleStyle: 'bg-primary/10 text-primary',
      status: 'active',
      initialsColor: '',
    },
    {
      name: 'Lê Văn Cường',
      initials: 'LC',
      avatar: null,
      email: 'levanc@gmail.com',
      phone: '0987654321',
      role: 'Khách hàng',
      roleStyle: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      status: 'locked',
      initialsColor: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
    },
    {
      name: 'Phạm Minh Duy',
      initials: null,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEMCHF__Wh5WehWIehemWnj4RWINRG6gTdLCEgYVbeheGyb6kqzdheQ-tczmCyDc7B5EgutdhuKTyYbt82WAgukz4vZkPBiv2H7FAYiPA4Pzco4t1BxHTFspOzXj5qkmDq1sKrV5f94cymgy4NU2haE7A6olfQ-98HMOzhYUjNoqenHl2K0xW8eJ3gkSsECKgtjNKIDwOOUvCBl4tD7RziNa9W5F3jC0SCx-bDvu3svoPNGu5f1mEza32A_YEHZfKLve8N8SjuLA',
      email: 'phamminhd@gmail.com',
      phone: '0933445566',
      role: 'Quản trị viên',
      roleStyle: 'bg-primary/10 text-primary',
      status: 'active',
      initialsColor: '',
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Header title="Quản lý Người dùng" />

        <div className="p-8">
          {/* Page Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Quản lý Người dùng</h2>
              <p className="text-slate-500 mt-1">Quản lý danh sách khách hàng, quản trị viên và phân quyền truy cập hệ thống.</p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">person_add</span>
              Thêm người dùng
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-6 border-b border-slate-200 dark:border-slate-800">
            <a className="pb-3 border-b-2 border-primary text-primary font-bold text-sm tracking-wide" href="#">Người dùng</a>
            <a className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-bold text-sm tracking-wide" href="#">Phân quyền vai trò</a>
          </div>

          {/* Utilities Bar: Search and Filters */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-background-light dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400"
                  placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-background-light dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Bộ lọc
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-background-light dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-lg">file_download</span>
                Xuất CSV
              </button>
            </div>
          </div>

          {/* Data Table Container */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Họ và tên</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Số điện thoại</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vai trò</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((user, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              alt="User avatar"
                              className="w-9 h-9 rounded-full object-cover"
                              src={user.avatar}
                            />
                          ) : (
                            <div className={`w-9 h-9 rounded-full ${user.initialsColor} flex items-center justify-center font-bold text-sm`}>
                              {user.initials}
                            </div>
                          )}
                          <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{user.email}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{user.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 ${user.roleStyle} rounded-full text-xs font-semibold`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.status === 'active' ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Hoạt động
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-medium">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                            Bị khóa
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button className={`p-2 rounded-lg transition-colors ${user.status === 'locked' ? 'text-primary hover:bg-primary/10' : 'text-accent-pink hover:bg-accent-pink/10'}`}>
                            <span className="material-symbols-outlined text-lg">
                              {user.status === 'locked' ? 'lock_open' : 'lock'}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500">
                Hiển thị <span className="font-bold text-slate-900 dark:text-white">1 - 4</span> của{' '}
                <span className="font-bold text-slate-900 dark:text-white">24</span> người dùng
              </p>
              <div className="flex items-center gap-2">
                <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition-colors disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <button className="size-9 flex items-center justify-center rounded-lg bg-primary text-white font-bold transition-all shadow-md shadow-primary/10">1</button>
                <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors font-medium">2</button>
                <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors font-medium">3</button>
                <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition-colors">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserList;
