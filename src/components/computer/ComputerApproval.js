'use client';

import { useState } from 'react';
import { Modal } from 'antd';
import { useAuth } from '@/context/AuthContext';
import showNotification from '@/components/common/Notification';

export default function ComputerApproval({ requests = [], onRefresh }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'active', 'history'
  const [processingId, setProcessingId] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [noteModalReq, setNoteModalReq] = useState(null); // request object when entering note
  const [actionType, setActionType] = useState(null); // 'approve', 'reject', 'return'

  if (!isAdmin) {
    return null; // Only visible to admin
  }

  // Filter requests based on tab
  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const activeRequests = requests.filter((r) => r.status === 'approved');
  const historyRequests = requests.filter((r) => r.status === 'rejected' || r.status === 'returned');

  // Handle action (approve / reject / return)
  const handleExecuteAction = async () => {
    if (!noteModalReq || !actionType) return;
    setProcessingId(noteModalReq.id);

    try {
      const res = await fetch(`/api/computers/requests/${noteModalReq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          admin_note: adminNoteInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Thao tác thất bại');
      }

      const actionTitle = actionType === 'approve' ? 'Phê duyệt thành công' : actionType === 'reject' ? 'Từ chối thành công' : 'Hoàn tất mượn máy';
      const actionNotifType = actionType === 'approve' ? 'success' : actionType === 'reject' ? 'warning' : 'info';
      showNotification(actionNotifType, actionTitle, `Đã xử lý yêu cầu mượn máy ${noteModalReq.computer_code} của học viên ${noteModalReq.user_name}`);

      setNoteModalReq(null);
      setAdminNoteInput('');
      setActionType(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      showNotification('error', 'Thao tác thất bại', err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setProcessingId(null);
    }
  };

  const openActionModal = (req, action) => {
    setNoteModalReq(req);
    setActionType(action);
    setAdminNoteInput('');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">Duyệt mượn máy vào phòng</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-black px-2 py-0.5 rounded-md border border-emerald-300">
                Admin Panel
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Phê duyệt hoặc từ chối đơn mượn máy và quản lý thu hồi máy phòng lab
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pending'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Chờ duyệt ({pendingRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Đang mượn ({activeRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-white text-slate-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Lịch sử ({historyRequests.length})
          </button>
        </div>
      </div>

      {/* Tab Content: Pending Approval */}
      {activeTab === 'pending' && (
        <div>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100">
              <svg className="w-10 h-10 text-slate-300 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-slate-600 text-xs font-semibold">Hiện không có yêu cầu nào đang chờ duyệt</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/60">
                    <th className="py-3 px-3">Máy tính</th>
                    <th className="py-3 px-3">Người đăng ký</th>
                    <th className="py-3 px-3">Mục đích</th>
                    <th className="py-3 px-3">Thời gian</th>
                    <th className="py-3 px-3 text-right">Thao tác Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800 block">{req.computer_code}</span>
                        <span className="text-[11px] text-slate-500">{req.computer_name} ({req.computer_room})</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800 block">{req.user_name}</span>
                        <span className="text-[11px] text-emerald-700">{req.user_phone || req.user_email}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate" title={req.purpose}>
                        {req.purpose}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        <div><span className="font-medium text-slate-700">Mượn:</span> {req.start_time ? req.start_time.split('T')[0] : ''}</div>
                        <div><span className="font-medium text-slate-700">Trả:</span> {req.end_time ? req.end_time.split('T')[0] : ''}</div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openActionModal(req, 'approve')}
                            disabled={processingId === req.id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            Duyệt
                          </button>
                          <button
                            onClick={() => openActionModal(req, 'reject')}
                            disabled={processingId === req.id}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Từ chối
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Active Borrowing */}
      {activeTab === 'active' && (
        <div>
          {activeRequests.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-slate-600 text-xs font-semibold">Hiện không có máy tính nào đang được mượn</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeRequests.map((req) => (
                <div key={req.id} className="bg-white border border-emerald-100 hover:border-emerald-200 shadow-sm rounded-2xl p-4 flex flex-col justify-between transition-all">
                  <div>
                    {/* Header: Computer Name */}
                    <div className="mb-3 pb-2.5 border-b border-slate-100">
                      <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {req.computer_name}
                        {req.computer_room && (
                          <span className="text-xs font-normal text-slate-500">({req.computer_room})</span>
                        )}
                      </h4>
                    </div>

                    {/* Details list */}
                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <div className="flex items-start gap-1.5">
                        <span className="font-semibold text-slate-700 min-w-[90px]">Người mượn:</span>
                        <span className="text-slate-800 font-medium">{req.user_name} <span className="text-slate-500 font-normal">({req.user_phone || req.user_email})</span></span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="font-semibold text-slate-700 min-w-[90px]">Mục đích:</span>
                        <span className="text-slate-800">{req.purpose}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="font-semibold text-slate-700 min-w-[90px]">Thời gian:</span>
                        <span className="text-slate-800">
                          {req.start_time ? req.start_time.split('T')[0] : ''} <span className="text-slate-400">→</span> {req.end_time ? req.end_time.split('T')[0] : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => openActionModal(req, 'return')}
                      disabled={processingId === req.id}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H4m0 0l4-4m-4 4l4 4" />
                      </svg>
                      Hoàn tất & Thu hồi máy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: History */}
      {activeTab === 'history' && (
        <div>
          {historyRequests.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-slate-500 text-xs">Chưa có lịch sử mượn trả</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/60">
                    <th className="py-3 px-3">Máy tính</th>
                    <th className="py-3 px-3">Người mượn</th>
                    <th className="py-3 px-3">Mục đích</th>
                    <th className="py-3 px-3">Trạng thái cuối</th>
                    <th className="py-3 px-3">Ghi chú Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {req.computer_code} - {req.computer_name}
                      </td>
                      <td className="py-3 px-3 text-slate-700">{req.user_name}</td>
                      <td className="py-3 px-3 text-slate-600">{req.purpose}</td>
                      <td className="py-3 px-3">
                        {req.status === 'returned' ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            Đã trả máy
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                            Đã từ chối
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px] italic">
                        {req.admin_note || 'Không có ghi chú'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Ant Design Confirmation Popup Modal for Admin Actions */}
      <Modal
        open={!!noteModalReq}
        onCancel={() => setNoteModalReq(null)}
        footer={null}
        centered
        destroyOnHidden
        title={
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-bold text-slate-800 text-base">
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-black ${
              actionType === 'approve'
                ? 'bg-emerald-100 text-emerald-800'
                : actionType === 'reject'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {actionType === 'approve' ? 'Phê duyệt' : actionType === 'reject' ? 'Từ chối' : 'Thu hồi máy'}
            </span>
            <span>
              {actionType === 'approve' && 'Xác nhận phê duyệt mượn máy tính'}
              {actionType === 'reject' && 'Xác nhận từ chối mượn máy tính'}
              {actionType === 'return' && 'Xác nhận thu hồi & Hoàn tất mượn máy'}
            </span>
          </div>
        }
      >
        {noteModalReq && (
          <div className="pt-3">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl mb-4 text-xs text-slate-700 space-y-1">
              <div><span className="font-semibold text-slate-500">Máy tính:</span> <span className="font-bold text-slate-900">{noteModalReq.computer_code} - {noteModalReq.computer_name} ({noteModalReq.computer_room})</span></div>
              <div><span className="font-semibold text-slate-500">Người mượn:</span> <span className="font-bold text-slate-900">{noteModalReq.user_name} ({noteModalReq.user_phone || noteModalReq.user_email})</span></div>
              <div><span className="font-semibold text-slate-500">Mục đích:</span> <span className="text-slate-800 font-medium">{noteModalReq.purpose}</span></div>
            </div>

            <div className="mb-4">
              <label className="form-label text-xs">Ghi chú của Admin (tùy chọn):</label>
              <textarea
                rows="3"
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="Ví dụ: Đã kiểm tra phòng máy, phê duyệt cấp quyền sử dụng..."
                className="form-input text-xs resize-none"
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setNoteModalReq(null)}
                className="btn-green-outline text-xs px-4 py-2"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                disabled={processingId === noteModalReq.id}
                className={`text-xs font-bold px-5 py-2 rounded-xl text-white shadow-xs transition-colors ${
                  actionType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : actionType === 'reject'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {processingId === noteModalReq.id ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
