'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const { user, setActiveCategory } = useAuth();
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveCategory('change-password');
  }, [setActiveCategory]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Quy định mật khẩu mới phải từ 8 ký tự trở lên' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới và mật khẩu nhập lại không trùng khớp' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Đổi mật khẩu thất bại');
      }

      setMessage({ type: 'success', text: data.message });
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-sm text-center">
        <p className="text-slate-600 mb-4 font-semibold">Bạn cần đăng nhập để thực hiện đổi mật khẩu.</p>
        <button onClick={() => router.push('/login')} className="btn-green-primary">
          Đến trang đăng nhập
        </button>
      </div>
    );
  }

  const isMinLengthValid = newPassword.length >= 8;
  const isMatchValid = newPassword && newPassword === confirmNewPassword;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Title Card */}
      <div className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-md">
        <div className="flex items-center gap-4 pb-6 border-b border-emerald-100">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Thay đổi Mật Khẩu</h1>
            <p className="text-xs font-semibold text-emerald-700 mt-0.5">
              Bảo mật tài khoản với quy định mật khẩu từ 8 ký tự trở lên
            </p>
          </div>
        </div>

        {message.text && (
          <div
            className={`my-6 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold ${message.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-700'
              }`}
          >
            {message.type === 'success' ? (
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-5 pt-4">
          {/* Mật khẩu cũ */}
          <div className="form-group">
            <label className="form-label">1. Nhập mật khẩu cũ <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>

          {/* Mật khẩu mới */}
          <div className="form-group">
            <label className="form-label">
              2. Nhập mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới từ 8 ký tự..."
              minLength={8}
              required
              className="form-input"
            />
          </div>

          {/* Nhập lại mật khẩu mới */}
          <div className="form-group">
            <label className="form-label">
              3. Nhập lại mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Xác nhận lại mật khẩu mới..."
              minLength={8}
              required
              className="form-input"
            />
          </div>

          {/* Live validation helper box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <p className="font-extrabold text-slate-700">Quy định bảo mật mật khẩu:</p>
            <div className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${isMinLengthValid ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                ✓
              </span>
              <span className={isMinLengthValid ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                Mật khẩu có từ 8 ký tự trở lên ({newPassword.length}/8)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${isMatchValid ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                ✓
              </span>
              <span className={isMatchValid ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                Mật khẩu mới và mật khẩu nhập lại trùng khớp
              </span>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-green-primary py-3 font-bold text-base shadow-lg shadow-emerald-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang cập nhật mật khẩu...
                </span>
              ) : (
                'Cập nhật mật khẩu mới'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
