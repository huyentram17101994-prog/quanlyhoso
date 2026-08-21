import { NextResponse } from 'next/server';
import db from '@/lib/db';
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

    // Check if new email conflicts with another user
    const emailConflict = db.prepare('SELECT id FROM users WHERE LOWER(email) = ? AND id != ?').get(cleanEmail, currentUser.id);
    if (emailConflict) {
      return NextResponse.json({ error: 'Email này đã được sử dụng bởi tài khoản khác' }, { status: 400 });
    }

    // Check if new phone conflicts with another user
    const phoneConflict = db.prepare('SELECT id FROM users WHERE phone = ? AND id != ?').get(cleanPhone, currentUser.id);
    if (phoneConflict) {
      return NextResponse.json({ error: 'Số điện thoại này đã được sử dụng bởi tài khoản khác' }, { status: 400 });
    }

    const updateStmt = db.prepare(`
      UPDATE users
      SET avatar = ?, full_name = ?, mssv = ?, class_name = ?, dob = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    updateStmt.run(
      avatar || currentUser.avatar,
      full_name.trim(),
      (mssv || '').trim(),
      (class_name || '').trim(),
      (dob || '17/10/1994').trim(),
      cleanEmail,
      cleanPhone,
      currentUser.id
    );

    const updatedUser = db.prepare(`
      SELECT id, email, phone, full_name, mssv, class_name, dob, avatar, created_at, updated_at
      FROM users WHERE id = ?
    `).get(currentUser.id);

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
