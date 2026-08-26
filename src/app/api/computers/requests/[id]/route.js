import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    if (currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Chỉ quản trị viên mới có quyền duyệt hoặc xử lý mượn máy' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, admin_note } = body;

    const { data: reqItem, error: findErr } = await supabase
      .from('computer_requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (findErr || !reqItem) {
      return NextResponse.json({ error: 'Không tìm thấy yêu cầu mượn máy' }, { status: 404 });
    }

    let newStatus = reqItem.status;
    let newCompStatus = null;

    if (action === 'approve') {
      newStatus = 'approved';
      newCompStatus = 'in_use';
    } else if (action === 'reject') {
      newStatus = 'rejected';
      newCompStatus = 'available';
    } else if (action === 'return') {
      newStatus = 'returned';
      newCompStatus = 'available';
    } else {
      return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const { error: updateReqErr } = await supabase
      .from('computer_requests')
      .update({
        status: newStatus,
        admin_note: admin_note || '',
        updated_at: now,
      })
      .eq('id', id);

    if (updateReqErr) throw updateReqErr;

    if (newCompStatus) {
      if (newCompStatus === 'available') {
        const { data: otherPending } = await supabase
          .from('computer_requests')
          .select('id')
          .eq('computer_id', reqItem.computer_id)
          .eq('status', 'pending')
          .neq('id', id)
          .maybeSingle();

        const { data: otherApproved } = await supabase
          .from('computer_requests')
          .select('id')
          .eq('computer_id', reqItem.computer_id)
          .eq('status', 'approved')
          .neq('id', id)
          .maybeSingle();

        if (otherApproved) {
          newCompStatus = 'in_use';
        } else if (otherPending) {
          newCompStatus = 'pending';
        }
      }

      await supabase
        .from('computers')
        .update({ status: newCompStatus })
        .eq('id', reqItem.computer_id);
    }

    const { data: updatedRequest } = await supabase
      .from('computer_requests')
      .select(`
        *,
        computers(code, name),
        users(full_name)
      `)
      .eq('id', id)
      .single();

    const formatted = {
      ...updatedRequest,
      computer_code: updatedRequest?.computers?.code || '',
      computer_name: updatedRequest?.computers?.name || '',
      user_name: updatedRequest?.users?.full_name || '',
    };

    return NextResponse.json({
      message: `Xử lý yêu cầu mượn máy thành công (${action})`,
      request: formatted,
    });
  } catch (error) {
    console.error('Error handling computer request:', error);
    return NextResponse.json({ error: 'Lỗi server khi xử lý yêu cầu' }, { status: 500 });
  }
}
