'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [mssv, setMssv] = useState('');
  const [className, setClassName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    setFullName('');
    setDob('');
    setMssv('');
    setClassName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('nhập mật khẩu tối thiểu 8 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không trùng khớp');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          dob: dob || '17/10/1994',
          mssv,
          class_name: className,
          email,
          phone,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Đăng ký thất bại');
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
      style={{ maxWidth: '880px', width: '100%', margin: 'auto', minHeight: '520px' }}
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
              <span className="text-base md:text-sm font-extrabold uppercase tracking-wider text-emerald-200 block">Hệ Thống</span>
              <span className="text-base md:text-lg font-black text-white leading-tight block">Quản Lý Phòng Máy</span>
            </div>
          </div>

          {/* DÒNG CHỮ NẰM CHÍNH GIỮA TRUNG TÂM KHUNG CARD BÊN TRÁI */}
          <div className="my-auto py-6 flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-900/40 text-emerald-100 text-base font-bold rounded-full border border-emerald-400/30 mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              Tạo tài khoản mới 🚀
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white leading-snug mb-2.5 text-center">
              Đăng ký thành viên
            </h1>
            <p className="text-emerald-100 text-sm md:text-base leading-relaxed font-semibold text-center max-w-[280px]">
              Tham gia hệ thống để quản lý máy tính & đặt lịch thực hành tiện lợi.
            </p>
          </div>

          {/* Feature Cards Spaced at Bottom */}
          <div className="space-y-3 mt-auto hidden sm:block">
            <div className="flex items-center gap-3 bg-emerald-900/40 border border-emerald-400/30 p-3 rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/20 flex items-center justify-center text-white flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">Tài khoản chính thức</h4>
                <p className="text-[11px] text-emerald-100 font-medium">Đăng ký nhanh chóng & bảo mật 24/7</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-3 border-t border-white/15 text-[11px] text-emerald-200 font-medium mt-3 text-center sm:text-left">
            © 2026 Lab Computer Management
          </div>
        </div>
      </div>

      {/* Right Column: Register Form Section - NỀN XANH PASTEL (#e6f4ea) */}
      <div 
        className="w-full md:w-7/12 p-6 md:p-7 flex flex-col justify-center"
        style={{ backgroundColor: '#e6f4ea', borderLeft: '1px solid #a7f3d0' }}
      >
        <div className="w-full mx-auto" style={{ maxWidth: '440px' }}>
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-black text-emerald-950">Đăng Ký Tài Khoản</h2>
            <p className="text-emerald-800 text-xs mt-1 font-semibold">
              Vui lòng nhập thông tin cá nhân bên dưới
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-red-700 text-xs font-semibold">
              <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Họ và tên */}
              <div className="form-group mb-0">
                <label className="form-label text-emerald-950 font-extrabold text-[11px] mb-1 block">Họ và tên <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  
                  required
                  autoComplete="off"
                  className="form-input text-xs rounded-xl border-emerald-300 bg-white text-slate-800 font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all outline-none shadow-sm w-full py-2 px-3"
                />
              </div>

              {/* Năm sinh */}
              <div className="form-group mb-0">
                <label className="form-label text-emerald-950 font-extrabold text-[11px] mb-1 block">Năm sinh <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                 
                  autoComplete="off"
                  className="form-input text-xs rounded-xl border-emerald-300 bg-white text-slate-800 font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all outline-none shadow-sm w-full py-2 px-3"
                />
              </div>

              {/* MSSV */}
              <div className="form-group mb-0">
                <label className="form-label text-emerald-950 font-extrabold text-[11px] mb-1 block">Mã số sinh viên (MSSV) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={mssv}
                  onChange={(e) => setMssv(e.target.value)}
                 
                  autoComplete="off"
                  className="form-input text-xs rounded-xl border-emerald-300 bg-white text-slate-800 font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all outline-none shadow-sm w-full py-2 px-3"
                />
              </div>

              {/* Lớp */}
              <div className="form-group mb-0">
                <label className="form-label text-emerald-950 font-extrabold text-[11px] mb-1 block">Lớp <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  
                  autoComplete="off"
                  className="form-input text-xs rounded-xl border-emerald-300 bg-white text-slate-800 font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all outline-none shadow-sm w-full py-2 px-3"
                />
              </div>

              {/* Email */}
              <div className="form-group mb-0">
                <label className="form-label text-emerald-950 font-extrabold text-[11px] mb-1 block">Địa chỉ Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  
                  required
                  autoComplete="off"
                  className="form-input text-xs rounded-xl border-emerald-300 bg-white text-slate-800 font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all outline-none shadow-sm w-full py-2 px-3"
                />
              </div>

              {/* Số điện thoại */}
              <div className="form-group mb-0">
                <label className="form-label text-emerald-950 font-extrabold text-[11px] mb-1 block">Số điện thoại <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                 
                  required
                  autoComplete="off"
                  className="form-input text-xs rounded-xl border-emerald-300 bg-white text-slate-800 font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all outline-none shadow-sm w-full py-2 px-3"
                />
              </div>

              {/* Mật khẩu */}
              <div className="form-group mb-0">
                <label className="form-label text-emerald-950 font-extrabold text-[11px] mb-1 block">Mật khẩu <span className="text-red-500">*</span></label>
                <div className="relative flex items-center" style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="form-input text-xs rounded-xl border-emerald-300 bg-white text-slate-800 font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all outline-none shadow-sm w-full py-2 pl-3 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-emerald-700 focus:outline-none transition-colors cursor-pointer"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                      background: 'transparent',
                      border: 'none',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4 text-slate-500 hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 013.68-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-slate-500 hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Nhập lại mật khẩu */}
              <div className="form-group mb-0">
                <label className="form-label text-emerald-950 font-extrabold text-[11px] mb-1 block">Nhập lại mật khẩu <span className="text-red-500">*</span></label>
                <div className="relative flex items-center" style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="form-input text-xs rounded-xl border-emerald-300 bg-white text-slate-800 font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all outline-none shadow-sm w-full py-2 pl-3 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-500 hover:text-emerald-700 focus:outline-none transition-colors cursor-pointer"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                      background: 'transparent',
                      border: 'none',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4 text-slate-500 hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 013.68-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-slate-500 hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-green-primary py-2.5 text-xs font-extrabold rounded-xl shadow-md shadow-emerald-200 hover:shadow-emerald-300 transition-all flex items-center justify-center cursor-pointer"
              style={{ marginTop: '1.25rem' }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <span>Đăng ký</span>
              )}
            </button>
          </form>

          {/* Footer Login Link */}
          <div className="mt-4 pt-3 border-t border-emerald-200 text-center">
            <p className="text-xs text-emerald-900 font-medium">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline transition-all ml-1">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
