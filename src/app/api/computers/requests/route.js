import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    let query = supabase
      .from('computer_requests')
      .select(`
        *,
        computers(code, name, room, specs),
        users(full_name, email, phone, mssv)
      `)
      .order('created_at', { ascending: false });

    if (currentUser.role !== 'admin') {
      query = query.eq('user_id', currentUser.id);
    }

    const { data: rawRequests, error: err } = await query;
    if (err) throw err;

    const requests = (rawRequests || []).map((r) => ({
      ...r,
      computer_code: r.computers?.code || '',
      computer_name: r.computers?.name || '',
      computer_room: r.computers?.room || '',
      computer_specs: r.computers?.specs || '',
      user_name: r.users?.full_name || '',
      user_email: r.users?.email || '',
      user_phone: r.users?.phone || '',
      user_mssv: r.users?.mssv || '',
    }));

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching computer requests:', error);
    return NextResponse.json({ error: 'Lỗi server khi lấy danh sách đăng ký mượn' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Bạn cần đăng nhập để thực hiện đăng ký mượn máy' }, { status: 401 });
    }

    const body = await request.json();
    const { computer_id, purpose, start_time, end_time } = body;

    if (!computer_id || !purpose || !start_time || !end_time) {
      return NextResponse.json({ error: 'Vui lòng cung cấp đầy đủ thông tin đăng ký (máy tính, mục đích, thời gian)' }, { status: 400 });
    }

    const { data: computer, error: compErr } = await supabase
      .from('computers')
      .select('*')
      .eq('id', computer_id)
      .maybeSingle();

    if (compErr || !computer) {
      return NextResponse.json({ error: 'Máy tính không tồn tại' }, { status: 404 });
    }

    if (computer.status === 'in_use') {
      return NextResponse.json({ error: 'Máy tính này hiện đang có người sử dụng' }, { status: 400 });
    }
    if (computer.status === 'maintenance') {
      return NextResponse.json({ error: 'Máy tính này đang trong trạng thái bảo trì' }, { status: 400 });
    }

    const { data: newRequest, error: insertErr } = await supabase
      .from('computer_requests')
      .insert([
        {
          computer_id,
          user_id: currentUser.id,
          purpose: purpose.trim(),
          start_time,
          end_time,
          status: 'pending',
        },
      ])
      .select(`
        *,
        computers(code, name)
      `)
      .single();

    if (insertErr) throw insertErr;

    if (computer.status === 'available') {
      await supabase.from('computers').update({ status: 'pending' }).eq('id', computer_id);
    }

    const formattedReq = {
      ...newRequest,
      computer_code: newRequest.computers?.code || '',
      computer_name: newRequest.computers?.name || '',
    };

    return NextResponse.json({
      message: 'Đăng ký mượn máy thành công! Vui lòng chờ Quản trị viên duyệt.',
      request: formattedReq,
    });
  } catch (error) {
    console.error('Error creating computer request:', error);
    return NextResponse.json({ error: 'Lỗi server khi đăng ký mượn máy' }, { status: 500 });
  }
}
