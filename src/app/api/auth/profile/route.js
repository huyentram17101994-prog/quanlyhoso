import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Bạn chưa đăng nhập' }, { status: 401 });
    }

    const { avatar, full_name, mssv, class_name, dob, email, phone } = await request.json();

    if (!email || !phone || !full_name) {
      return NextResponse.json(
        { error: 'Họ tên, Email và Số điện thoại là bắt buộc' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    const { data: emailConflict } = await supabase
      .from('users')
      .select('id')
      .ilike('email', cleanEmail)
      .neq('id', currentUser.id)
      .maybeSingle();

    if (emailConflict) {
      return NextResponse.json({ error: 'Email này đã được sử dụng bởi tài khoản khác' }, { status: 400 });
    }

    const { data: phoneConflict } = await supabase
      .from('users')
      .select('id')
      .eq('phone', cleanPhone)
      .neq('id', currentUser.id)
      .maybeSingle();

    if (phoneConflict) {
      return NextResponse.json({ error: 'Số điện thoại này đã được sử dụng bởi tài khoản khác' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const { data: updatedUser, error: updateErr } = await supabase
      .from('users')
      .update({
        avatar: avatar || currentUser.avatar,
        full_name: full_name.trim(),
        mssv: (mssv || '').trim(),
        class_name: (class_name || '').trim(),
        dob: (dob || '17/10/1994').trim(),
        email: cleanEmail,
        phone: cleanPhone,
        updated_at: now,
      })
      .eq('id', currentUser.id)
      .select('id, email, phone, full_name, mssv, class_name, dob, avatar, role, created_at, updated_at')
      .single();

    if (updateErr) throw updateErr;

    return NextResponse.json({
      message: 'Cập nhật thông tin cá nhân thành công!',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật thông tin cá nhân' },
      { status: 500 }
    );
  }
}
