'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import ComputerList from './ComputerList';
import ComputerApproval from './ComputerApproval';

export default function Computer() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [computers, setComputers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [compRes, reqRes] = await Promise.all([
        fetch('/api/computers'),
        fetch('/api/computers/requests'),
      ]);

      if (!compRes.ok) {
        throw new Error('Không thể tải danh sách máy tính');
      }

      const compData = await compRes.json();
      setComputers(compData.computers || []);

      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(reqData.requests || []);
      }
    } catch (err) {
      console.error('Fetch computers error:', err);
      setError(err.message || 'Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Statistics calculation
  const totalComputers = computers.length;
  const availableCount = computers.filter((c) => c.status === 'available').length;
  const inUseCount = computers.filter((c) => c.status === 'in_use').length;
  const pendingCount = computers.filter((c) => c.status === 'pending').length;
  const maintenanceCount = computers.filter((c) => c.status === 'maintenance').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-emerald-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold text-emerald-800">Đang tải danh sách máy tính...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Component 1: Danh sách máy trong phòng & Đăng ký mượn máy (Hiển thị cho toàn bộ user) */}
          <ComputerList computers={computers} onRefresh={fetchData} />

          {/* Component 2: Duyệt mượn máy vào phòng (Chỉ hiển thị cho Admin) */}
          {isAdmin && (
            <ComputerApproval requests={requests} onRefresh={fetchData} />
          )}
        </>
      )}
    </div>
  );
}
