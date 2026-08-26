import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const { data: computers, error: compErr } = await supabase
      .from('computers')
      .select('*')
      .order('id', { ascending: true });

    if (compErr) throw compErr;

    const { data: activeReqs, error: reqErr } = await supabase
      .from('computer_requests')
      .select('id, computer_id, status, purpose, user_id, users(full_name)')
      .in('status', ['pending', 'approved'])
      .order('id', { ascending: false });

    const enrichedComputers = (computers || []).map((c) => {
      const activeReq = (activeReqs || []).find((r) => r.computer_id === c.id);
      return {
        ...c,
        current_request_id: activeReq ? activeReq.id : null,
        current_request_status: activeReq ? activeReq.status : null,
        current_user_name: activeReq && activeReq.users ? activeReq.users.full_name : null,
        current_purpose: activeReq ? activeReq.purpose : null,
      };
    });

    return NextResponse.json({ computers: enrichedComputers });
  } catch (error) {
    console.error('Error fetching computers:', error);
    return NextResponse.json({ error: 'Lỗi server khi lấy danh sách máy tính' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    if (currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Chỉ quản trị viên mới có quyền thêm máy tính' }, { status: 403 });
    }

    const body = await request.json();
    const { code, name, room, specs, status } = body;

    if (!code || !name) {
      return NextResponse.json({ error: 'Vui lòng điền mã máy và tên máy' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('computers')
      .select('id')
      .eq('code', code.trim())
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Mã máy tính này đã tồn tại' }, { status: 400 });
    }

    const { data: newComputer, error: insertErr } = await supabase
      .from('computers')
      .insert([
        {
          code: code.trim(),
          name: name.trim(),
          room: room ? room.trim() : 'Phòng máy 01',
          specs: specs ? specs.trim() : '',
          status: status || 'available',
        },
      ])
      .select()
      .single();

    if (insertErr) throw insertErr;

    return NextResponse.json({ message: 'Thêm máy tính thành công', computer: newComputer });
  } catch (error) {
    console.error('Error creating computer:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server khi thêm máy tính' }, { status: 500 });
  }
}
