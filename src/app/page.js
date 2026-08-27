'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, loading: authLoading, setActiveCategory } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    setActiveCategory('dashboard');
    fetchStats(true);

    // Polling realtime every 3 seconds
    const interval = setInterval(() => {
      fetchStats(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [user, authLoading, setActiveCategory, router]);

  const fetchStats = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold leading-none badge-status-available">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            Sẵn sàng
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold leading-none badge-status-pending">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            Đang chờ duyệt
          </span>
        );
      case 'in_use':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold leading-none badge-status-in_use">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            Đang sử dụng
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold leading-none badge-status-maintenance">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            Bảo trì
          </span>
        );
      default:
        return null;
    }
  };

  // Find max usage hours for progress bar calculation
  const maxUsageHours = stats?.computer_usage
    ? Math.max(...stats.computer_usage.map((c) => c.usage_hours), 1)
    : 1;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div 
        className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-500 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-emerald-200/60 relative overflow-hidden"
        style={{ marginBottom: '35px' }}
      >
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-white/20 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/30">
              ⚡ Hệ Thống Quản Lý Phòng Máy
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Xin chào, {user ? user.full_name || 'Học viên' : 'Bạn chưa đăng nhập'}! 👋
            </h1>
            <p className="text-emerald-100 text-sm max-w-xl font-medium">
              Chào mừng bạn đến với trang tổng quan hệ thống.
            </p>
          </div>
        </div>
      </div>

      {/* Overview Statistics Cards (Balanced 35px vertical separation) */}
      <div 
        className="grid grid-cols-4 gap-5 md:gap-6"
        style={{ marginBottom: '35px' }}
      >
        {/* Stat 1: Số lượng người dùng - Emerald Pastel */}
        <div className="card-stat-emerald p-4 md:p-6 rounded-2xl hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] md:text-sm font-extrabold uppercase tracking-wider truncate">Người Dùng</span>
            <div className="w-7 h-7 md:w-9 md:h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm shadow-emerald-200">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 md:mt-5">
            <div className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">
              {loading ? '...' : stats?.total_users || 0}
            </div>
            <div className="text-[10px] md:text-xs font-semibold mt-1 opacity-80 truncate">
              Tài khoản trong hệ thống
            </div>
          </div>
        </div>

        {/* Stat 2: Tổng số máy tính - Blue Pastel */}
        <div className="card-stat-blue p-4 md:p-6 rounded-2xl hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] md:text-sm font-extrabold uppercase tracking-wider truncate">Tổng Số Máy</span>
            <div className="w-7 h-7 md:w-9 md:h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm shadow-blue-200">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 md:mt-5">
            <div className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">
              {loading ? '...' : stats?.computers?.total || 0}
            </div>
            <div className="text-[10px] md:text-xs font-semibold mt-1 opacity-80 truncate">
              Máy tính phòng lab
            </div>
          </div>
        </div>

        {/* Stat 3: Tổng máy đang sử dụng - Indigo Pastel */}
        <div className="card-stat-indigo p-4 md:p-6 rounded-2xl hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] md:text-sm font-extrabold uppercase tracking-wider truncate">Đang Sử Dụng</span>
            <div className="w-7 h-7 md:w-9 md:h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm shadow-indigo-200">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 md:mt-5">
            <div className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">
              {loading ? '...' : stats?.computers?.in_use || 0}
            </div>
            <div className="text-[10px] md:text-xs font-semibold mt-1 opacity-80 truncate">
              Máy tính đang mượn
            </div>
          </div>
        </div>

        {/* Stat 4: Tổng thời gian đã sử dụng - Amber Pastel */}
        <div className="card-stat-amber p-4 md:p-6 rounded-2xl hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] md:text-sm font-extrabold uppercase tracking-wider truncate">Thời Gian Dùng</span>
            <div className="w-7 h-7 md:w-9 md:h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm shadow-amber-200">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 md:mt-5">
            <div className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">
              {loading ? '...' : `${stats?.total_usage_hours || 0}h`}
            </div>
            <div className="text-[10px] md:text-xs font-semibold mt-1 opacity-80 truncate">
              Tổng giờ mượn sử dụng
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê chi tiết máy tính theo trạng thái & Thời gian sử dụng (2 cột bằng nhau 50-50, hugging content height) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-2 items-start">
        {/* Phân bố trạng thái máy tính (Individual Pastel Progress Bars) */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-md space-y-5">
          {/* Header */}
          <div className="border-b border-slate-100 pb-3.5">
            <h2 className="font-extrabold text-base text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Thống kê trạng thái máy
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Chi tiết thanh trạng thái mượn máy phòng lab</p>
          </div>

          {/* Individual Status Bars */}
          {(() => {
            const total = stats?.computers?.total || 1;
            const avail = stats?.computers?.available || 0;
            const pending = stats?.computers?.pending || 0;
            const inUse = stats?.computers?.in_use || 0;
            const maint = stats?.computers?.maintenance || 0;

            const calcWidth = (cnt) => (cnt === 0 ? '0%' : `${Math.round(15 + (cnt / total) * 85)}%`);

            return (
              <div className="space-y-4.5">
                {/* Status 1: Sẵn sàng */}
                <div className="p-4 bg-emerald-50/90 rounded-xl space-y-3 hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">🟢 Sẵn sàng (Available)</span>
                    </div>
                    <span className="font-black text-sm text-emerald-800">{avail} máy</span>
                  </div>
                  {/* Pastel Emerald Horizontal Progress Bar Track */}
                  <div className="w-full bg-emerald-200/60 border border-emerald-300/80 rounded-full h-3.5 overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="bar-running-emerald h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                      style={{ width: calcWidth(avail) }}
                    ></div>
                  </div>
                </div>

                {/* Status 2: Đang chờ duyệt */}
                <div className="p-4 bg-amber-50/90 rounded-xl space-y-3 hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                      <span className="text-xs font-black text-amber-950 uppercase tracking-wider">🟡 Đang chờ duyệt (Pending)</span>
                    </div>
                    <span className="font-black text-sm text-amber-800">{pending} máy</span>
                  </div>
                  {/* Pastel Amber Horizontal Progress Bar Track */}
                  <div className="w-full bg-amber-200/60 border border-amber-300/80 rounded-full h-3.5 overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="bar-running-amber h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                      style={{ width: calcWidth(pending) }}
                    ></div>
                  </div>
                </div>

                {/* Status 3: Đang sử dụng */}
                <div className="p-4 bg-blue-50/90 rounded-xl space-y-3 hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                      <span className="text-xs font-black text-blue-950 uppercase tracking-wider">🔵 Đang sử dụng (In use)</span>
                    </div>
                    <span className="font-black text-sm text-blue-800">{inUse} máy</span>
                  </div>
                  {/* Pastel Blue Horizontal Progress Bar Track */}
                  <div className="w-full bg-blue-200/60 border border-blue-300/80 rounded-full h-3.5 overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="bar-running-blue h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                      style={{ width: calcWidth(inUse) }}
                    ></div>
                  </div>
                </div>

                {/* Status 4: Bảo trì */}
                <div className="p-4 bg-rose-50/90 rounded-xl space-y-3 hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span className="text-xs font-black text-rose-950 uppercase tracking-wider">🔴 Bảo trì (Maintenance)</span>
                    </div>
                    <span className="font-black text-sm text-rose-800">{maint} máy</span>
                  </div>
                  {/* Pastel Rose Horizontal Progress Bar Track */}
                  <div className="w-full bg-rose-200/60 border border-rose-300/80 rounded-full h-3.5 overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="bar-running-rose h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                      style={{ width: calcWidth(maint) }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Thống kê thời gian sử dụng từng máy tính (Chỉ hiện máy có thời gian sử dụng > 0) */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-md space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Thống kê thời gian sử dụng của từng máy
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Tổng số giờ được ghi nhận từ các lượt mượn máy</p>
          </div>

          {(() => {
            const activeUsageComputers = (stats?.computer_usage || []).filter((comp) => comp.usage_hours > 0);
            const maxHours = Math.max(...activeUsageComputers.map((c) => c.usage_hours), 1);

            if (loading) {
              return <div className="py-8 text-center text-xs text-slate-400 font-medium">Đang tải dữ liệu thống kê...</div>;
            }

            if (activeUsageComputers.length === 0) {
              return (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <div className="text-3xl">⏳</div>
                  <div className="text-xs font-bold text-slate-600">Chưa có thời gian sử dụng máy</div>
                  <div className="text-[11px] text-slate-400">Thời gian sử dụng sẽ được ghi nhận khi hoàn tất lượt mượn máy</div>
                </div>
              );
            }

            return (
              <div className="space-y-4.5">
                {activeUsageComputers.map((comp) => {
                  const percent = Math.min(Math.round((comp.usage_hours / maxHours) * 100), 100);
                  return (
                    <div key={comp.id} className="p-4 bg-emerald-50/90 rounded-xl space-y-3 hover:shadow-xs transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="font-black text-slate-800 text-sm">{comp.name}</span>
                          <span className="text-xs text-slate-500 font-medium">({comp.room})</span>
                          {renderStatusBadge(comp.status)}
                        </div>
                        <div className="text-right">
                          <span className="font-black text-emerald-800 text-sm">{comp.usage_hours} giờ</span>
                        </div>
                      </div>

                      {/* Pastel Emerald Horizontal Progress Bar Track */}
                      <div className="w-full bg-emerald-200/60 border border-emerald-300/80 rounded-full h-3.5 overflow-hidden p-0.5 shadow-inner">
                        <div
                          className="bar-running-emerald h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                          style={{ width: `${Math.max(percent, 8)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
