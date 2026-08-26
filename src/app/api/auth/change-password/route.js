import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, verifyPassword, hashPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Bạn chưa đăng nhập' }, { status: 401 });
    }

    const { old_password, new_password, confirm_new_password } = await request.json();

    if (!old_password || !new_password || !confirm_new_password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu' },
        { status: 400 }
      );
    }

    const { data: user, error: findErr } = await supabase
      .from('users')
      .select('password')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (findErr || !user) {
      return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 });
    }

    const isOldPasswordCorrect = verifyPassword(old_password, user.password);
    if (!isOldPasswordCorrect) {
      return NextResponse.json(
        { error: 'Mật khẩu cũ không đúng' },
        { status: 400 }
      );
    }

    if (new_password.length < 8) {
      return NextResponse.json(
        { error: 'Mật khẩu mới phải từ 8 ký tự trở lên' },
        { status: 400 }
      );
    }

    if (new_password !== confirm_new_password) {
      return NextResponse.json(
        { error: 'Mật khẩu mới và mật khẩu nhập lại không trùng khớp' },
        { status: 400 }
      );
    }

    if (old_password === new_password) {
      return NextResponse.json(
        { error: 'Mật khẩu mới phải khác với mật khẩu cũ' },
        { status: 400 }
      );
    }

    const newHashedPassword = hashPassword(new_password);
    const now = new Date().toISOString();

    const { error: updateErr } = await supabase
      .from('users')
      .update({ password: newHashedPassword, updated_at: now })
      .eq('id', currentUser.id);

    if (updateErr) throw updateErr;

    return NextResponse.json({
      message: 'Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi đổi mật khẩu' },
      { status: 500 }
    );
  }
}
