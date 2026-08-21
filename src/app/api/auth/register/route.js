import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { full_name, dob, mssv, class_name, email, phone, password, confirm_password } = await request.json();

    if (!full_name || !email || !phone || !password || !confirm_password) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ các thông tin bắt buộc (Họ tên, Email, SĐT, Mật khẩu)' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Định dạng Email không hợp lệ' },
        { status: 400 }
      );
    }

    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Số điện thoại phải từ 9-11 chữ số' },
        { status: 400 }
      );
    }

    // Password length validation (Requirement: >= 8 characters)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Mật khẩu quy định phải có từ 8 ký tự trở lên' },
        { status: 400 }
      );
    }

    if (password !== confirm_password) {
      return NextResponse.json(
        { error: 'Mật khẩu nhập lại không trùng khớp' },
        { status: 400 }
      );
    }

    // Check unique email
    const existingEmail = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(cleanEmail);
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email này đã được sử dụng' },
        { status: 400 }
      );
    }

    // Check unique phone
    const existingPhone = db.prepare('SELECT id FROM users WHERE phone = ?').get(cleanPhone);
    if (existingPhone) {
      return NextResponse.json(
        { error: 'Số điện thoại này đã được đăng ký' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);
    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

    const insertStmt = db.prepare(`
      INSERT INTO users (email, phone, password, full_name, mssv, class_name, dob, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      cleanEmail,
      cleanPhone,
      hashedPassword,
      full_name.trim(),
      (mssv || '').trim(),
      (class_name || '').trim(),
      (dob || '17/10/1994').trim(),
      defaultAvatar
    );

    const newUserId = result.lastInsertRowid;
    await createSession(newUserId);

    const newUser = db.prepare(`
      SELECT id, email, phone, full_name, mssv, class_name, dob, avatar, created_at
      FROM users WHERE id = ?
    `).get(newUserId);

    return NextResponse.json({
      message: 'Đăng ký tài khoản thành công',
      user: newUser,
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Lỗi máy chủ trong quá trình xử lý đăng ký' },
      { status: 500 }
    );
  }
}
