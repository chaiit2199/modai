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

/**
 * Chuyển đổi chuỗi ngày giờ ISO (UTC) thành định dạng ngày (DD/MM/YYYY) theo giờ địa phương.
 * @param isoDateString Chuỗi ngày giờ ISO 8601.
 * @returns Chuỗi định dạng ngày (DD/MM/YYYY).
 */
export function formatDateToLocal(isoDateString: string): string {
  const dateObj = new Date(isoDateString);

  // Kiểm tra nếu chuỗi không hợp lệ
  if (isNaN(dateObj.getTime())) {
    return "--/--/----";
  }

  // Chuyển đổi sang UTC+7 (giờ Việt Nam)
  const utcTime = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60 * 1000);
  const vietnamTime = new Date(utcTime + (7 * 60 * 60 * 1000));

  const day = String(vietnamTime.getDate()).padStart(2, '0');
  const month = String(vietnamTime.getMonth() + 1).padStart(2, '0');
  const year = vietnamTime.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Chuyển đổi chuỗi ngày giờ ISO (UTC) thành định dạng ngày và giờ (DD/MM HH:MM) theo giờ địa phương.
 * @param isoDateString Chuỗi ngày giờ ISO 8601.
 * @returns Chuỗi định dạng ngày và giờ (DD/MM HH:MM).
 */
export function formatDateTimeToLocal(isoDateString: string): string {
  const dateObj = new Date(isoDateString);

  // Kiểm tra nếu chuỗi không hợp lệ
  if (isNaN(dateObj.getTime())) {
    return "--/-- --:--";
  }

  // Chuyển đổi sang UTC+7 (giờ Việt Nam)
  const utcTime = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60 * 1000);
  const vietnamTime = new Date(utcTime + (7 * 60 * 60 * 1000));

  const day = String(vietnamTime.getDate()).padStart(2, '0');
  const month = String(vietnamTime.getMonth() + 1).padStart(2, '0');
  const hour = String(vietnamTime.getHours()).padStart(2, '0');
  const minute = String(vietnamTime.getMinutes()).padStart(2, '0');

  return `${day}/${month} ${hour}:${minute}`;
}

/**
 * Lấy ngày theo múi giờ UTC+7 (giờ Việt Nam)
 * API trả về thời gian UTC, cần +7 giờ để chuyển sang giờ Việt Nam
 */
function getDateInVietnamTime(): Date {
  const now = new Date();
  // Lấy giờ UTC hiện tại
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  // Chuyển sang UTC+7 (giờ Việt Nam)
  const vietnamTime = new Date(utcTime + (7 * 60 * 60 * 1000));
  return vietnamTime;
}

/**
 * Lấy ngày hôm qua theo múi giờ UTC+7 (YYYY-MM-DD)
 */
export function getYesterdayDate(): string {
  const vietnamTime = getDateInVietnamTime();
  vietnamTime.setDate(vietnamTime.getDate() - 1);
  const year = vietnamTime.getFullYear();
  const month = String(vietnamTime.getMonth() + 1).padStart(2, '0');
  const day = String(vietnamTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Lấy ngày hôm nay theo múi giờ UTC+7 (YYYY-MM-DD)
 */
export function getTodayDate(): string {
  const vietnamTime = getDateInVietnamTime();
  const year = vietnamTime.getFullYear();
  const month = String(vietnamTime.getMonth() + 1).padStart(2, '0');
  const day = String(vietnamTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Lấy ngày mai theo múi giờ UTC+7 (YYYY-MM-DD)
 */
export function getTomorrowDate(): string {
  const vietnamTime = getDateInVietnamTime();
  vietnamTime.setDate(vietnamTime.getDate() + 1);
  const year = vietnamTime.getFullYear();
  const month = String(vietnamTime.getMonth() + 1).padStart(2, '0');
  const day = String(vietnamTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}