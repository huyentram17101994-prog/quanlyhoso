import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { data: computers, error: compErr } = await supabase
      .from('computers')
      .select('*')
      .order('code', { ascending: true });

    if (compErr) throw compErr;

    const totalComputers = (computers || []).length;
    const availableCount = (computers || []).filter((c) => c.status === 'available').length;
    const pendingCount = (computers || []).filter((c) => c.status === 'pending').length;
    const inUseCount = (computers || []).filter((c) => c.status === 'in_use').length;
    const maintenanceCount = (computers || []).filter((c) => c.status === 'maintenance').length;

    const { data: requests } = await supabase
      .from('computer_requests')
      .select('computer_id, start_time, end_time, status')
      .in('status', ['approved', 'returned', 'in_use']);

    let totalUsageHoursAll = 0;
    const computerUsage = (computers || []).map((comp) => {
      const compRequests = (requests || []).filter((r) => r.computer_id === comp.id);
      let hours = 0;

      compRequests.forEach((req) => {
        if (req.start_time && req.end_time) {
          const start = new Date(req.start_time).getTime();
          const end = new Date(req.end_time).getTime();
          if (!isNaN(start) && !isNaN(end) && end > start) {
            const diffHours = (end - start) / (1000 * 60 * 60);
            hours += diffHours;
          }
        }
      });

      hours = Math.round(hours * 10) / 10;
      totalUsageHoursAll += hours;

      return {
        id: comp.id,
        code: comp.code,
        name: comp.name,
        room: comp.room,
        status: comp.status,
        usage_hours: hours,
        total_requests: compRequests.length,
      };
    });

    totalUsageHoursAll = Math.round(totalUsageHoursAll * 10) / 10;

    return NextResponse.json({
      total_users: userCount || 0,
      computers: {
        total: totalComputers,
        available: availableCount,
        pending: pendingCount,
        in_use: inUseCount,
        maintenance: maintenanceCount,
      },
      total_usage_hours: totalUsageHoursAll,
      computer_usage: computerUsage,
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json({ error: 'Lỗi khi tải dữ liệu thống kê' }, { status: 500 });
  }
}
