'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, refreshUser, setActiveCategory } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [avatar, setAvatar] = useState('');
  const [fullName, setFullName] = useState('');
  const [mssv, setMssv] = useState('');
  const [className, setClassName] = useState('');
  const [dob, setDob] = useState('17/10/1994');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setActiveCategory('profile');
    if (user) {
      setAvatar(user.avatar || '');
      setFullName(user.full_name || '');
      setMssv(user.mssv || '');
      setClassName(user.class_name || '');
      setDob(user.dob || '17/10/1994');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user, setActiveCategory]);

  // Handle upload image from local computer
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage({ type: '', text: '' });
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Lỗi tải ảnh lên');
      }

      setAvatar(data.url);
      setMessage({ type: 'success', text: 'Tải ảnh từ máy tính/điện thoại lên thành công! Bấm "Lưu thay đổi hồ sơ" để lưu lại.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatar,
          full_name: fullName,
          mssv,
          class_name: className,
          dob,
          email,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Cập nhật thất bại');
      }

      setMessage({ type: 'success', text: data.message });
      await refreshUser();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-sm text-center">
        <p className="text-slate-600 mb-4 font-semibold">Bạn cần đăng nhập để xem thông tin cá nhân.</p>
        <button onClick={() => router.push('/login')} className="btn-green-primary">
          Đến trang đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        style={{ display: 'none' }}
        className="hidden"
      />

      {/* Top Blue Banner with Camera Icon INSIDE the Circular Avatar Frame */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg shadow-blue-200/50 dark:shadow-none flex flex-col md:flex-row items-center gap-6">
        {/* Avatar Circle Container - Minimal Sleek Camera Icon ONLY (No text) */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl cursor-pointer group flex-shrink-0 bg-slate-200"
          title="Nhấp vào đây để tải ảnh đại diện từ máy tính"
        >
          {/* Avatar Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar || '/default-avatar.png'}
            alt={fullName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Icon Máy Ảnh Chụp Hình Thuần Tinh Tế  */}
          <div className="absolute inset-0 bg-black/25 opacity-90 group-hover:opacity-100 flex items-center justify-center text-white transition-all">
            <div className="w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-lg border border-blue-100/60 backdrop-blur-xs transition-transform group-hover:scale-110">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>

          {/* Uploading State Spinner */}
          {uploading && (
            <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center z-10">
              <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="text-center md:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl font-black tracking-tight">{fullName || 'Chưa cập nhật tên'}</h1>
          </div>
          <p className="text-blue-100 text-sm font-medium">{email}</p>
          <p className="text-blue-100 text-sm font-medium">{phone}</p>
          <p className="text-blue-100 text-xs font-semibold pt-0.5">
            Vai trò hệ thống: <span className="font-bold underline">{user.role === 'admin' ? 'Quản trị viên (Admin)' : 'Học viên (User)'}</span>
          </p>
        </div>
      </div>

      {/* Form Update Card */}
      <div className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-md">
        <div className="pb-4 mb-6 border-b border-emerald-100">
          <h2 className="text-xl font-bold text-slate-900">Cập nhật thông tin cá nhân</h2>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold ${message.type === 'success'
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

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Họ và tên */}
            <div className="form-group mb-0">
              <label className="form-label">Họ và tên </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên đầy đủ..."
                required
                className="form-input"
              />
            </div>

            {/* Ngày / tháng / năm sinh */}
            <div className="form-group mb-0">
              <label className="form-label">Năm sinh</label>
              <input
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="17/10/1994"
                className="form-input"
              />
            </div>

            {/* MSSV */}
            <div className="form-group mb-0">
              <label className="form-label">Mã số sinh viên (MSSV)</label>
              <input
                type="text"
                value={mssv}
                onChange={(e) => setMssv(e.target.value)}
                placeholder="Ví dụ: 725000001"
                className="form-input"
              />
            </div>

            {/* Lớp */}
            <div className="form-group mb-0">
              <label className="form-label">Lớp</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Ví dụ: 25CT712"
                className="form-input"
              />
            </div>

            {/* Email */}
            <div className="form-group mb-0">
              <label className="form-label">Địa chỉ Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@student.edu.vn"
                required
                className="form-input"
              />
            </div>

            {/* Số điện thoại */}
            <div className="form-group mb-0">
              <label className="form-label">Số điện thoại liên hệ </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912345678"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-green-primary px-8 py-3 text-base font-bold shadow-lg shadow-emerald-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang lưu vào SQLite...
                </span>
              ) : (
                'Lưu thay đổi hồ sơ'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
