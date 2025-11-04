// Định nghĩa một Interface đơn giản cho Status Object (Nếu cần)
interface MatchStatus {
  long: string;
  short: string;
  elapsed: number;
  extra?: number; 
}
 
export function getMatchDisplay(statusObj: MatchStatus) {
  const shortCode = statusObj.short;
  let displayStatus: string;
  let isLive: boolean = true; 

  switch (shortCode) {
    case '1H':
      displayStatus = `${statusObj.elapsed}'`;
      break;
    case 'HT':
      displayStatus = 'Nghỉ H1';
      break;
    case '2H':
      displayStatus = `${statusObj.elapsed}'`;
      break;
    case 'ET':
      displayStatus = 'Hiệp phụ';
      break;
    case 'P':
      displayStatus = 'Đá luân lưu';
      break;
      
    // ⭐️ Trường hợp mặc định: Hiển thị elapsed
    default:
      // Chuyển giá trị elapsed (number) thành chuỗi, ví dụ: 0, 90, etc.
      displayStatus = String(statusObj.elapsed); 
      isLive = false; // Nếu không phải các trường hợp trên, coi như không live
      break;
  }

  return { displayStatus, isLive };
}