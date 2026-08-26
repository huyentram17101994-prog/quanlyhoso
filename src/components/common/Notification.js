'use client';

import { notification } from 'antd';

// Cấu hình vị trí mặc định hiển thị ở góc trên bên phải (topRight)
notification.config({
  placement: 'topRight',
  duration: 4,
});

/**
 * Common Notification Component / Utility dùng Ant Design notification
 * 
 * Cách sử dụng đơn giản:
 * 1. Gọi theo kiểu truyền 3 tham số:
 *    showNotification('success', 'Tiêu đề', 'Nội dung thông báo');
 *    showNotification('error', 'Lỗi', 'Chi tiết lỗi');
 *    showNotification('info', 'Thông tin', 'Nội dung');
 *    showNotification('warning', 'Cảnh báo', 'Nội dung');
 * 
 * 2. Hoặc gọi dạng shorthand method:
 *    showNotification.success('Tiêu đề', 'Nội dung');
 *    showNotification.error('Tiêu đề', 'Nội dung');
 *    showNotification.warning('Tiêu đề', 'Nội dung');
 *    showNotification.info('Tiêu đề', 'Nội dung');
 * 
 * @param {'success' | 'info' | 'warning' | 'error'} type - Kiểu thông báo
 * @param {string} title - Tiêu đề thông báo
 * @param {string} content - Nội dung thông báo
 */
export function showNotification(type = 'info', title = '', content = '') {
  const validTypes = ['success', 'info', 'warning', 'error'];
  const notifType = validTypes.includes(type) ? type : 'info';

  notification[notifType]({
    message: title || 'Thông báo',
    description: content,
    placement: 'topRight', // Bắt buộc vị trí góc trên bên phải
    style: {
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
  });
}

// Gán các hàm viết tắt
showNotification.success = (title, content) => showNotification('success', title, content);
showNotification.info = (title, content) => showNotification('info', title, content);
showNotification.warning = (title, content) => showNotification('warning', title, content);
showNotification.error = (title, content) => showNotification('error', title, content);

export default showNotification;
