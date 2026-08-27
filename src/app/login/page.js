'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_or_phone: emailOrPhone,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại');
      }

      await refreshUser();
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100 flex flex-col md:flex-row my-auto transition-all"
      style={{ maxWidth: '920px', width: '100%', margin: 'auto', minHeight: '460px' }}
    >
      
      {/* Left Column: Welcome & Branding Banner */}
      <div 
        className="w-full md:w-5/12 p-7 md:p-8 text-white flex flex-col justify-between relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #0d9488 100%)' }}
      >
        {/* Ambient Glow */}
        <div className="absolute -top-10 -left-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Logo & Brand Header Top */}
          <div className="flex items-center gap-3.5 justify-center sm:justify-start">
            <div className="w-12 h-12 bg-white text-emerald-700 rounded-xl flex items-center justify-center text-2xl font-black shadow-md border border-white flex-shrink-0">
              H
            </div>
            <div>
              <span className="text-base md:text-lg font-extrabold uppercase tracking-wider text-emerald-200 block">Hệ Thống</span>
              <span className="text-base md:text-lg font-black text-white ">Quản Lý Phòng Máy</span>
            </div>
          </div>

          {/* DÒNG CHỮ ĐĂNG NHẬP HỆ THỐNG VÀ MÔ TẢ NẰM NGAY CHÍNH GIỮA TRUNG TÂM KHUNG CARD */}
          <div className="my-auto py-6 flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-900/40 text-emerald-100 text-base font-bold rounded-full border border-emerald-400/30 mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              Chào mừng bạn 👋
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white leading-snug mb-3 text-center">
              Đăng nhập hệ thống
            </h1>
            <p className="text-emerald-100 text-base leading-relaxed font-semibold text-center max-w-[280px]">
              Nền tảng quản lý máy tính & mượn trả phòng lab tiện lợi.
            </p>
          </div>

          {/* Feature Cards Spaced at Bottom */}
          <div className="space-y-3 mt-auto hidden sm:block">
            <div className="flex items-center gap-3 bg-emerald-900/40 border border-emerald-400/30 p-3 rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/20 flex items-center justify-center text-white flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">Quản lý linh hoạt</h4>
                <p className="text-[11px] text-emerald-100 font-medium">Theo dõi máy & phòng lab 24/7</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-emerald-900/40 border border-emerald-400/30 p-3 rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/20 flex items-center justify-center text-white flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">Mượn trả & Đặt lịch</h4>
                <p className="text-[11px] text-emerald-100 font-medium">Đăng ký sử dụng nhanh chóng</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-3 border-t border-white/15 text-[11px] text-emerald-200 font-medium mt-3 text-center sm:text-left">
            © 2026 Lab Computer Management
          </div>
        </div>
      </div>

      {/* Right Column: Login Form Section - NỀN XANH PASTEL (#e6f4ea) */}
      <div 
        className="w-full md:w-7/12 p-7 md:p-8 flex flex-col justify-center"
        style={{ backgroundColor: '#e6f4ea', borderLeft: '1px solid #a7f3d0' }}
      >
        <div className="w-full mx-auto" style={{ maxWidth: '340px' }}>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-emerald-950">Đăng Nhập</h2>
            <p className="text-emerald-800 text-sm mt-1 font-semibold">
              Vui lòng nhập tài khoản để tiếp tục
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-red-700 text-sm font-semibold">
              <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email / Số điện thoại */}
            <div className="form-group mb-0">
              <label className="form-label text-emerald-950 font-extrabold text-sm mb-1.5 block">Email hoặc Số điện thoại</label>
              <div className="relative" style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="Nhập Email hoặc SĐT..."
                  required
                  className="form-input text-sm rounded-xl border-emerald-300 bg-white text-slate-800 font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all outline-none shadow-sm w-full"
                  style={{ paddingLeft: '14px', paddingRight: '14px', paddingTop: '10px', paddingBottom: '10px', width: '100%' }}
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="form-group mb-0">
              <label className="form-label text-emerald-950 font-extrabold text-sm mb-1.5 block">Mật khẩu</label>
              <div className="relative flex items-center" style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input text-sm rounded-xl border-emerald-300 bg-white text-slate-800 font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all outline-none shadow-sm w-full"
                  style={{ paddingLeft: '14px', paddingRight: '44px', paddingTop: '10px', paddingBottom: '10px', width: '100%' }}
                />
                {/* Eye View Toggle Icon Button fixed at far right inside input */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-emerald-700 focus:outline-none transition-colors cursor-pointer"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    background: 'transparent',
                    border: 'none',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 text-slate-500 hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 013.68-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-slate-500 hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-green-primary py-3 text-sm font-extrabold rounded-xl shadow-md shadow-emerald-200 hover:shadow-emerald-300 transition-all flex items-center justify-center cursor-pointer"
              style={{ marginTop: '1.75rem' }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <span>Đăng Nhập</span>
              )}
            </button>
          </form>

          {/* Footer Register Link */}
          <div className="mt-6 pt-4 border-t border-emerald-200 text-center">
            <p className="text-sm text-emerald-900 font-medium">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline transition-all ml-1">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
