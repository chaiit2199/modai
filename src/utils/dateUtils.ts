/**
 * Chuyển đổi chuỗi ngày giờ ISO (UTC) thành định dạng giờ:phút (HH:MM) theo giờ địa phương.
 * @param isoDateString Chuỗi ngày giờ ISO 8601.
 * @returns Chuỗi định dạng giờ:phút (HH:MM).
 */
export function formatTimeToLocal(isoDateString: string): string {
  // 1. Tạo đối tượng Date từ chuỗi
  const dateObj = new Date(isoDateString);

  // Kiểm tra nếu chuỗi không hợp lệ
  if (isNaN(dateObj.getTime())) {
    return "--:--"; // Giá trị mặc định khi lỗi
  }

  // 2. Định dạng Thời gian (HH:MM)
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Dùng định dạng 24h
    // ❌ Xóa bỏ: timeZone: 'auto', // Đây là nguyên nhân gây lỗi
  };
  
  // toLocaleTimeString sẽ tự động chuyển đổi sang múi giờ địa phương (current time)
  // và định dạng
  const formattedTime = dateObj.toLocaleTimeString('en-GB', timeOptions);

  return formattedTime;
}