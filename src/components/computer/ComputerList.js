'use client';

import { useState } from 'react';
import { Modal } from 'antd';
import { useAuth } from '@/context/AuthContext';
import showNotification from '@/components/common/Notification';
export default function ComputerList({ computers, onRefresh }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [roomFilter, setRoomFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [borrowingComp, setBorrowingComp] = useState(null); // computer object for borrow modal
  const [borrowForm, setBorrowForm] = useState({
    purpose: 'Lập trình Web & Thực hành SQLite',
    startTime: new Date().toISOString().slice(0, 10),
    endTime: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  });
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [borrowError, setBorrowError] = useState('');
  const [borrowSuccess, setBorrowSuccess] = useState('');

  // Admin add/edit modal state
  const [editComp, setEditComp] = useState(null); // null for add, object for edit
  const [showCompModal, setShowCompModal] = useState(false);
  const [compForm, setCompForm] = useState({
    code: '',
    name: '',
    room: 'Phòng máy 01',
    status: 'available',
  });
  const [compModalLoading, setCompModalLoading] = useState(false);
  const [compModalError, setCompModalError] = useState('');

  // Delete computer confirmation
  const [deletingId, setDeletingId] = useState(null);

  // Extract unique rooms
  const rooms = ['ALL', ...Array.from(new Set(computers.map((c) => c.room).filter(Boolean)))];

  // Filter computers
  const filteredComputers = computers.filter((comp) => {
    const matchesRoom = roomFilter === 'ALL' || comp.room === roomFilter;
    const matchesStatus = statusFilter === 'ALL' || comp.status === statusFilter;
    return matchesRoom && matchesStatus;
  });

  // Handle open borrow modal
  const handleOpenBorrowModal = (comp) => {
    setBorrowingComp(comp);
    setBorrowError('');
    setBorrowSuccess('');
    setBorrowForm({
      purpose: 'Lập trình Web & Thực hành SQLite',
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
    });
  };

  // Submit borrow request
  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    if (!borrowingComp) return;
    setBorrowLoading(true);
    setBorrowError('');
    setBorrowSuccess('');

    try {
      const res = await fetch('/api/computers/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          computer_id: borrowingComp.id,
          purpose: borrowForm.purpose,
          start_time: borrowForm.startTime,
          end_time: borrowForm.endTime,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đăng ký thất bại');
      }

      setBorrowSuccess(data.message || 'Đăng ký thành công!');
      showNotification('success', 'Đăng ký mượn máy thành công', `Đã gửi đơn mượn máy ${borrowingComp.code} (${borrowingComp.name}). Vui lòng chờ admin duyệt!`);
      setTimeout(() => {
        setBorrowingComp(null);
        if (onRefresh) onRefresh();
      }, 1500);
    } catch (err) {
      setBorrowError(err.message);
      showNotification('error', 'Đăng ký thất bại', err.message);
    } finally {
      setBorrowLoading(false);
    }
  };

  // Handle open add modal
  const handleOpenAddModal = () => {
    setEditComp(null);
    const nextNum = String(computers.length + 1).padStart(2, '0');
    setCompForm({
      code: `M${nextNum}`,
      name: `Máy M${nextNum}`,
      room: 'Phòng máy 01',
      status: 'available',
    });
    setCompModalError('');
    setShowCompModal(true);
  };

  // Handle open edit modal
  const handleOpenEditModal = (comp) => {
    setEditComp(comp);
    setCompForm({
      code: comp.code,
      name: comp.name,
      room: comp.room,
      status: comp.status,
    });
    setCompModalError('');
    setShowCompModal(true);
  };

  // Submit add or edit computer
  const handleCompSubmit = async (e) => {
    e.preventDefault();
    setCompModalLoading(true);
    setCompModalError('');

    try {
      const isEdit = !!editComp;
      const url = isEdit ? `/api/computers/${editComp.id}` : '/api/computers';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...compForm,
          specs: '',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lưu máy tính thất bại');
      }

      showNotification('success', 'Thao tác thành công', isEdit ? 'Đã cập nhật máy tính!' : 'Đã thêm máy tính mới!');
      setShowCompModal(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      setCompModalError(err.message);
      showNotification('error', 'Lỗi lưu máy tính', err.message);
    } finally {
      setCompModalLoading(false);
    }
  };

  // Delete computer
  const handleDeleteComp = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa máy tính này khỏi danh sách?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/computers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('success', 'Xóa thành công', 'Đã xóa máy tính khỏi danh sách!');
        if (onRefresh) onRefresh();
      } else {
        const data = await res.json();
        showNotification('error', 'Xóa thất bại', data.error || 'Không thể xóa máy tính');
      }
    } catch (err) {
      showNotification('error', 'Lỗi kết nối', 'Không thể kết nối máy chủ');
    } finally {
      setDeletingId(null);
    }
  };

  // Get row styling per status
  const getStatusRowStyle = (status) => {
    switch (status) {
      case 'available':
        return 'status-row-available';
      case 'pending':
        return 'status-row-pending';
      case 'in_use':
        return 'status-row-in_use';
      case 'maintenance':
        return 'status-row-maintenance';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  // Get code badge styling per status
  const getCodeBadgeStyle = (status) => {
    return 'bg-white text-slate-900 border-slate-300 shadow-xs';
  };

  // Status Badge Helper with distinct vibrant colors
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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 mb-8">
      {/* Component Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Danh sách máy tính trong phòng</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Theo dõi trạng thái máy tính phòng lab trường và đăng ký mượn máy
              </p>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={handleOpenAddModal}
              className="btn-green-primary text-xs px-3.5 py-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Thêm máy tính
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar: Room and Status strictly on 1 single line (2 columns 50%-50%) */}
      <div className="grid grid-cols-2 gap-3 mt-4 mb-8">
        {/* Room Filter */}
        <div>
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="form-input text-xs py-2 bg-white"
          >
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room === 'ALL' ? 'Tất cả các phòng' : room}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input text-xs py-2 bg-white"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="available">🟢 Sẵn sàng</option>
            <option value="pending">🟡 Đang chờ duyệt</option>
            <option value="in_use">🔵 Đang sử dụng</option>
            <option value="maintenance">🔴 Bảo trì</option>
          </select>
        </div>
      </div>

      {/* Computers List Layout */}
      {filteredComputers.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-emerald-100 rounded-2xl bg-emerald-50/20">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-600 font-semibold text-sm">Không tìm thấy máy tính phù hợp</p>
          <p className="text-slate-400 text-xs mt-1">Thử điều chỉnh bộ lọc phòng máy hoặc trạng thái</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mt-2">
          {filteredComputers.map((comp) => (
            <div
              key={comp.id}
              className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${getStatusRowStyle(comp.status)}`}
            >
              {/* Khối bên trái: Hàng 1 và Hàng 2 */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                {/* Hàng 1 (Hàng trên): Tên máy tính & Badge Trạng thái nằm gần tên máy */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-slate-800 text-sm">{comp.name}</h3>
                  {renderStatusBadge(comp.status)}
                </div>

                {/* Hàng 2 (Hàng dưới): Bên trái hiển thị Tên phòng máy */}
                <div className="text-xs font-medium text-slate-500">
                  {comp.room}
                </div>
              </div>

              {/* Khối bên phải: Các nút Đăng ký mượn, Sửa, Xóa nằm ở góc phải card, căn giữa thẳng hàng với Hàng 1 và Hàng 2 */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* User Borrow Button */}
                <button
                  onClick={() => handleOpenBorrowModal(comp)}
                  disabled={comp.status === 'in_use' || comp.status === 'maintenance'}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    comp.status === 'available'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : comp.status === 'pending'
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {comp.status === 'available' ? 'Đăng ký mượn' : comp.status === 'pending' ? 'Đăng ký thêm' : 'Không thể mượn'}
                </button>

                {/* Admin Actions: Edit & Delete */}
                {isAdmin && (
                  <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                    <button
                      onClick={() => handleOpenEditModal(comp)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-100/80 rounded-lg transition-colors"
                      title="Sửa máy tính"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteComp(comp.id)}
                      disabled={deletingId === comp.id}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100/80 rounded-lg transition-colors"
                      title="Xóa máy tính"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Borrow Request Antd Modal Popup */}
      <Modal
        open={!!borrowingComp}
        onCancel={() => setBorrowingComp(null)}
        footer={null}
        centered
        destroyOnClose
        title={
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-md font-extrabold">
              {borrowingComp?.code || 'Máy tính'}
            </span>
            <span>Đăng ký mượn máy tính</span>
          </div>
        }
      >
        {borrowError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {borrowError}
          </div>
        )}

        {borrowSuccess && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
            {borrowSuccess}
          </div>
        )}

        {borrowingComp && (
          <form onSubmit={handleBorrowSubmit} className="mt-4 flex flex-col gap-3">
            <div>
              <label className="form-label text-xs">Máy tính đăng ký</label>
              <input
                type="text"
                readOnly
                value={`${borrowingComp.code} - ${borrowingComp.name} (${borrowingComp.room})`}
                className="form-input text-xs bg-slate-50 text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="form-label text-xs">Mục đích mượn máy *</label>
              <textarea
                rows="2"
                required
                value={borrowForm.purpose}
                onChange={(e) => setBorrowForm({ ...borrowForm, purpose: e.target.value })}
                placeholder="Ví dụ: Thực hành bài tập môn Hệ quản trị CSDL SQLite..."
                className="form-input text-xs resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label text-xs">Ngày mượn *</label>
                <input
                  type="date"
                  required
                  value={borrowForm.startTime}
                  onChange={(e) => setBorrowForm({ ...borrowForm, startTime: e.target.value })}
                  className="form-input text-xs"
                />
              </div>
              <div>
                <label className="form-label text-xs">Ngày trả *</label>
                <input
                  type="date"
                  required
                  value={borrowForm.endTime}
                  onChange={(e) => setBorrowForm({ ...borrowForm, endTime: e.target.value })}
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setBorrowingComp(null)}
                className="btn-green-outline text-xs px-4 py-2"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={borrowLoading}
                className="btn-green-primary text-xs px-5 py-2"
              >
                {borrowLoading ? 'Đang gửi đăng ký...' : 'Gửi yêu cầu mượn'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Admin Add/Edit Computer Antd Modal Popup */}
      <Modal
        open={showCompModal}
        onCancel={() => setShowCompModal(false)}
        footer={null}
        centered
        destroyOnClose
        title={
          <div className="text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
            {editComp ? 'Sửa thông tin máy tính' : 'Thêm máy tính mới vào phòng'}
          </div>
        }
      >
        {compModalError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {compModalError}
          </div>
        )}

        <form onSubmit={handleCompSubmit} className="mt-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label text-xs">Số hiệu máy *</label>
              <input
                type="text"
                required
                placeholder="VD: M07"
                value={compForm.code}
                onChange={(e) => {
                  const val = e.target.value;
                  setCompForm({
                    ...compForm,
                    code: val,
                    name: val ? `Máy ${val}` : compForm.name,
                  });
                }}
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="form-label text-xs">Phòng máy *</label>
              <input
                type="text"
                required
                placeholder="VD: Phòng máy 01"
                value={compForm.room}
                onChange={(e) => setCompForm({ ...compForm, room: e.target.value })}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="form-label text-xs">Tên máy tính *</label>
            <input
              type="text"
              required
              placeholder="VD: Máy M07"
              value={compForm.name}
              onChange={(e) => setCompForm({ ...compForm, name: e.target.value })}
              className="form-input text-xs"
            />
          </div>

          <div>
            <label className="form-label text-xs">Trạng thái khởi tạo</label>
            <select
              value={compForm.status}
              onChange={(e) => setCompForm({ ...compForm, status: e.target.value })}
              className="form-input text-xs bg-white"
            >
              <option value="available">🟢 Sẵn sàng (Available)</option>
              <option value="pending">🟡 Đang chờ duyệt (Pending)</option>
              <option value="in_use">🔵 Đang sử dụng (In use)</option>
              <option value="maintenance">🔴 Bảo trì (Maintenance)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowCompModal(false)}
              className="btn-green-outline text-xs px-4 py-2"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={compModalLoading}
              className="btn-green-primary text-xs px-5 py-2"
            >
              {compModalLoading ? 'Đang lưu...' : editComp ? 'Cập nhật' : 'Thêm máy'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
