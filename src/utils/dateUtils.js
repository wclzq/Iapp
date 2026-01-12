import dayjs from 'dayjs';
import { Lunar, Solar } from 'lunar-javascript';

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
  const diff = targetDate.diff(now, 'day');
  // If diff is negative (meaning today is the day or passed strictly but we handled passed above for repeating), handle "today"
  // dayjs.diff returns integer, truncated. 
  // We want ceiling or exact days. 
  // Let's reset time to 00:00:00 for accurate day diff
  
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