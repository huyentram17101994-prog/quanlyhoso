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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  // Reset all fields when loading/rendering the registration page
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
      setError('Mật khẩu quy định phải có từ 8 ký tự trở lên');
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
    <div className="w-full max-w-2xl my-6">
      <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-3 shadow-lg shadow-emerald-200">
            H
          </div>
          <h2 className="text-3xl font-semibold text-emerald-700 ">Đăng ký tài khoản mới</h2>
          <p className="text-base font-gray-700 text-slate-700 mt-1">
            Điền đầy đủ thông tin cá nhân để tạo tài khoản trong hệ thống SQLite
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm font-medium animate-pulse">
            <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4" autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Họ và tên */}
            <div className="form-group mb-0">
              <label className="form-label text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên đầy đủ..."
                required
                autoComplete="off"
                className="form-input text-xs py-2 px-3"
              />
            </div>

            {/* Ngày / tháng / năm sinh */}
            <div className="form-group mb-0">
              <label className="form-label text-slate-700">Năm sinh <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="Ví dụ: 17/10/1994..."
                autoComplete="off"
                className="form-input text-xs py-2 px-3"
              />
            </div>

            {/* MSSV */}
            <div className="form-group mb-0">
              <label className="form-label text-slate-700">Mã số sinh viên (MSSV) <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={mssv}
                onChange={(e) => setMssv(e.target.value)}
                autoComplete="off"
                className="form-input text-xs py-2 px-3"
              />
            </div>

            {/* Lớp */}
            <div className="form-group mb-0">
              <label className="form-label text-slate-700">Lớp<span className="text-red-500">*</span> </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                autoComplete="off"
                className="form-input text-xs py-2 px-3"
              />
            </div>

            {/* Email */}
            <div className="form-group mb-0">
              <label className="form-label text-slate-700">Địa chỉ Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@student.edu.vn..."
                required
                autoComplete="off"
                className="form-input text-xs py-2 px-3"
              />
            </div>

            {/* Số điện thoại */}
            <div className="form-group mb-0">
              <label className="form-label text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="off"
                className="form-input text-xs py-2 px-3"
              />
            </div>

            {/* Mật khẩu */}
            <div className="form-group mb-0">
              <label className="form-label text-slate-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 8 ký tự..."
                minLength={8}
                required
                autoComplete="new-password"
                className="form-input text-xs py-2 px-3"
              />
            </div>

            {/* Nhập lại mật khẩu */}
            <div className="form-group mb-0">
              <label className="form-label text-slate-700">Nhập lại mật khẩu <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Tối thiểu 8 ký tự..."
                minLength={8}
                required
                autoComplete="new-password"
                className="form-input text-xs py-2 px-3"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-green-primary py-3 text-base font-bold rounded-xl shadow-lg shadow-emerald-200 mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang hoàn tất đăng ký...
              </span>
            ) : (
              'Hoàn tất Đăng ký'
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-extrabold text-emerald-600 hover:text-emerald-700 underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
