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
  let isLive: boolean = false;
  let isFinished: boolean = false;

  switch (shortCode) {
    case 'NS':
      displayStatus = 'Chưa đấu';
      break;
    case '1H':
      displayStatus = `${statusObj.elapsed}'`;
      isLive = true;
      break;
    case 'HT':
      displayStatus = 'H1';
      isLive = true;
      break;
    case '2H':
      displayStatus = `${statusObj.elapsed}'`;
      isLive = true;
      break;
    case 'ET':
      displayStatus = 'Hiệp phụ';
      isLive = true;
      break;
    case 'P':
      displayStatus = 'Đá luân lưu';
      isLive = true;
      break;
    case 'FT':
      displayStatus = 'Kết thúc';
      isFinished = true;
      break;
    case 'AET':
      displayStatus = 'Kết thúc (Hiệp phụ)';
      isFinished = true;
      break;
    case 'PEN':
    case 'FT_PEN':
      displayStatus = 'Kết thúc (Luân lưu)';
      isFinished = true;
      break;
    case 'LIVE':
      displayStatus = 'Đang diễn ra';
      isLive = true;
      break;
    case 'CANC':
      displayStatus = 'Hủy';
      break;
    case 'SUSP':
      displayStatus = 'Tạm hoãn';
      break;
    case 'INT':
      displayStatus = 'Gián đoạn';
      break;
    case 'ABAN':
      displayStatus = 'Bỏ dở';
      break;
    case 'POST':
      displayStatus = 'Hoãn';
      break;
    default:
      // Nếu elapsed = 90 và không phải live, coi như đã kết thúc
      if (statusObj.elapsed >= 90 && shortCode !== 'NS') {
        displayStatus = 'Kết thúc';
        isFinished = true;
      } else {
        displayStatus = String(statusObj.elapsed || 0);
      }
      break;
  }

  return { displayStatus, isLive, isFinished };
}