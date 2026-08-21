import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email_or_phone, password } = await request.json();

    if (!email_or_phone || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập Email hoặc Số điện thoại và Mật khẩu' },
        { status: 400 }
      );
    }

    const inputClean = email_or_phone.trim();

    // Query user by email OR phone
    const user = db.prepare(`
      SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR phone = ?
    `).get(inputClean, inputClean);

    if (!user) {
      return NextResponse.json(
        { error: 'Tài khoản không tồn tại trong hệ thống' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    // Create session cookie
    await createSession(user.id);

    const { password: _, ...userData } = user;

    return NextResponse.json({
      message: 'Đăng nhập thành công',
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Lỗi máy chủ trong quá trình xử lý đăng nhập' },
      { status: 500 }
    );
  }
}
