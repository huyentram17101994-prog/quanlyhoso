import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Bạn chưa đăng nhập' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Vui lòng chọn file hình ảnh hợp lệ' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Chỉ chấp nhận file hình ảnh (PNG, JPG, JPEG, WEBP, GIF, SVG)' },
        { status: 400 }
      );
    }

    const MAX_SIZE = 4 * 1024 * 1024; // Max 4MB for Base64 Data URL
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Kích thước file ảnh không được vượt quá 4MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/png';
    const base64DataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

    return NextResponse.json({
      message: 'Tải ảnh lên thành công',
      url: base64DataUrl,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Lỗi trong quá trình xử lý hình ảnh' },
      { status: 500 }
    );
  }
}
