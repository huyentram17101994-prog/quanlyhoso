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
      return NextResponse.json({ error: 'Chỉ quản trị viên mới có quyền cập nhật máy tính' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { code, name, room, specs, status } = body;

    const { data: existingComp, error: findErr } = await supabase
      .from('computers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (findErr || !existingComp) {
      return NextResponse.json({ error: 'Không tìm thấy máy tính' }, { status: 404 });
    }

    if (code && code !== existingComp.code) {
      const { data: codeCheck } = await supabase
        .from('computers')
        .select('id')
        .eq('code', code.trim())
        .neq('id', id)
        .maybeSingle();

      if (codeCheck) {
        return NextResponse.json({ error: 'Mã máy tính trùng lặp với máy tính khác' }, { status: 400 });
      }
    }

    const updatePayload = {
      code: code ? code.trim() : existingComp.code,
      name: name ? name.trim() : existingComp.name,
      room: room ? room.trim() : existingComp.room,
      specs: specs !== undefined ? specs.trim() : existingComp.specs,
      status: status || existingComp.status,
    };

    const { data: updatedComputer, error: updateErr } = await supabase
      .from('computers')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return NextResponse.json({ message: 'Cập nhật máy tính thành công', computer: updatedComputer });
  } catch (error) {
    console.error('Error updating computer:', error);
    return NextResponse.json({ error: 'Lỗi server khi cập nhật máy tính' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    if (currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Chỉ quản trị viên mới có quyền xóa máy tính' }, { status: 403 });
    }

    const { id } = await params;
    const { error: delErr } = await supabase.from('computers').delete().eq('id', id);
    if (delErr) throw delErr;

    return NextResponse.json({ message: 'Xóa máy tính thành công' });
  } catch (error) {
    console.error('Error deleting computer:', error);
    return NextResponse.json({ error: 'Lỗi server khi xóa máy tính' }, { status: 500 });
  }
}
