import dayjs from 'dayjs';
import { Lunar, Solar, HolidayUtil } from 'lunar-javascript';

/**
 * Calculate the next occurrence of a target date.
 * @param {string} date - The target date (YYYY-MM-DD)
 * @param {boolean} isLunar - Whether the target date is Lunar
 * @param {string} repeat - 'none', 'yearly', 'monthly'
 * @returns {object} { daysRemaining, nextDate, targetDateFormatted }
 */
export const calculateCountdown = (date, isLunar, repeat = 'none') => {
  const now = dayjs();
  let targetDate;
  let displayDate = '';

  if (isLunar) {
    // Parse Lunar Date
    const [year, month, day] = date.split('-').map(Number);
    let lunarDate = Lunar.fromYmd(year, month, day);
    displayDate = `农历 ${lunarDate.getMonthInChinese()}月${lunarDate.getDayInChinese()}`;
    
    // Calculate next occurrence for Lunar
    const currentLunar = Lunar.fromDate(now.toDate());
    let nextLunarYear = currentLunar.getYear();
    
    // Create a temporary lunar date for this year
    let nextLunar = Lunar.fromYmd(nextLunarYear, month, day);
    
    // If repeat is yearly and date has passed in this lunar year
    if (repeat === 'yearly') {
        let nextSolar = nextLunar.getSolar();
        let nextSolarDate = dayjs(nextSolar.toString());
        
        if (nextSolarDate.isBefore(now, 'day')) {
            nextLunar = Lunar.fromYmd(nextLunarYear + 1, month, day);
        }
        targetDate = dayjs(nextLunar.getSolar().toString());
    } else if (repeat === 'none') {
        // One-time event: Convert original lunar date to solar
        // Note: The input date is the exact date, not reoccurring
         let originalLunar = Lunar.fromYmd(year, month, day);
         targetDate = dayjs(originalLunar.getSolar().toString());
    }
    
    // Todo: Handle monthly repeat for lunar if needed (complex due to leap months)
    
  } else {
    // Solar Date
    let solarDate = dayjs(date);
    displayDate = solarDate.format('YYYY-MM-DD');
    
    if (repeat === 'yearly') {
        targetDate = solarDate.year(now.year());
        if (targetDate.isBefore(now, 'day')) {
            targetDate = targetDate.add(1, 'year');
        }
    } else if (repeat === 'monthly') {
        targetDate = solarDate.year(now.year()).month(now.month());
        if (targetDate.isBefore(now, 'day')) {
            targetDate = targetDate.add(1, 'month');
        }
    } else {
        targetDate = solarDate;
    }
  }

  // Calculate difference
  const todayStart = dayjs().startOf('day');
  const targetStart = targetDate.startOf('day');
  const daysRemaining = targetStart.diff(todayStart, 'day');

  return {
    daysRemaining,
    nextDate: targetDate,
    displayDate
  };
};

export const formatDate = (dateString) => {
    return dayjs(dateString).format('YYYY年MM月DD日');
}

export const getChineseHolidays = () => {
    const holidays = [
        { name: '元旦', date: '2000-01-01', isLunar: false },
        { name: '春节', date: '2000-01-01', isLunar: true },
        { name: '元宵节', date: '2000-01-15', isLunar: true },
        { name: '妇女节', date: '2000-03-08', isLunar: false },
        { name: '清明节', date: '2000-04-04', isLunar: false }, // Approximate, fix below
        { name: '劳动节', date: '2000-05-01', isLunar: false },
        { name: '青年节', date: '2000-05-04', isLunar: false },
        { name: '儿童节', date: '2000-06-01', isLunar: false },
        { name: '端午节', date: '2000-05-05', isLunar: true },
        { name: '七夕节', date: '2000-07-07', isLunar: true },
        { name: '中元节', date: '2000-07-15', isLunar: true },
        { name: '中秋节', date: '2000-08-15', isLunar: true },
        { name: '重阳节', date: '2000-09-09', isLunar: true },
        { name: '国庆节', date: '2000-10-01', isLunar: false },
        { name: '平安夜', date: '2000-12-24', isLunar: false },
        { name: '圣诞节', date: '2000-12-25', isLunar: false },
    ];

    return holidays.map(h => {
        let calcResult;
        
        // Special handling for Qingming (Solar term)
        if (h.name === '清明节') {
            const now = dayjs();
            let year = now.year();
            let qingmingDate = getQingmingDate(year);
            if (qingmingDate.isBefore(now, 'day')) {
                qingmingDate = getQingmingDate(year + 1);
            }
            const todayStart = dayjs().startOf('day');
            const targetStart = qingmingDate.startOf('day');
            const daysRemaining = targetStart.diff(todayStart, 'day');
            
            calcResult = {
                daysRemaining,
                nextDate: qingmingDate,
                displayDate: qingmingDate.format('YYYY-MM-DD')
            };
        } else {
            calcResult = calculateCountdown(h.date, h.isLunar, 'yearly');
        }

        return {
            id: h.name, // Use name as ID for static holidays
            title: h.name,
            ...calcResult,
            type: 'holiday',
            isStatic: true 
        };
    }).sort((a, b) => a.daysRemaining - b.daysRemaining);
};

// Simplified Qingming calculation
const getQingmingDate = (year) => {
    // Using Lunar-javascript to get solar term date accurately
    // "Pure Brightness" is Qingming
    // Iterate to find the date
    // Or just use approximate + check (usually Apr 4 or 5)
    // Better: create Solar date and check solar term
    // Let's use simpler approximation or leverage library if possible.
    // Library has `JieQi` (Solar Terms).
    
    // Create a lunar date for April and find Qingming
    // Actually, simply:
    const list = Lunar.fromYmd(year, 4, 1).getJieQiTable();
    // list is Map<string, Solar>
    const qingmingSolar = list.get('清明');
    if (qingmingSolar) {
        return dayjs(qingmingSolar.toString());
    }
    return dayjs(`${year}-04-05`); // Fallback
};