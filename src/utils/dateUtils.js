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

  try {
    if (isLunar) {
        // Parse Lunar Date
        const [year, month, day] = date.split('-').map(Number);
        // Safely create lunar date
        let lunarDate;
        try {
            lunarDate = Lunar.fromYmd(year, month, day);
        } catch (e) {
            console.error("Invalid lunar date", date);
            return { daysRemaining: 0, nextDate: now, displayDate: '日期无效' };
        }
        
        displayDate = `农历 ${lunarDate.getMonthInChinese()}月${lunarDate.getDayInChinese()}`;
        
        // Calculate next occurrence for Lunar
        const currentLunar = Lunar.fromDate(now.toDate());
        let nextLunarYear = currentLunar.getYear();
        
        // Helper to safely get lunar date even if day doesn't exist (e.g. 30th)
        const getSafeLunar = (y, m, d) => {
            try {
                return Lunar.fromYmd(y, m, d);
            } catch (e) {
                // Fallback to last day of month if day is invalid (e.g. 30 in a 29-day month)
                // This is complex, simplified fallback:
                return Lunar.fromYmd(y, m, 1).next(d - 1); // Might push to next month, imperfect but safe from crash
            }
        };

        let nextLunar = getSafeLunar(nextLunarYear, month, day);
        
        if (repeat === 'yearly') {
            let nextSolar = nextLunar.getSolar();
            let nextSolarDate = dayjs(nextSolar.toString());
            
            if (nextSolarDate.isBefore(now, 'day')) {
                nextLunar = getSafeLunar(nextLunarYear + 1, month, day);
            }
            targetDate = dayjs(nextLunar.getSolar().toString());
        } else if (repeat === 'none') {
            // One-time event
             let originalLunar = getSafeLunar(year, month, day);
             targetDate = dayjs(originalLunar.getSolar().toString());
        }
        
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
  } catch (error) {
    console.error("Error in calculateCountdown", error);
    return { daysRemaining: 0, nextDate: now, displayDate: '计算出错' };
  }
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
        { name: '清明节', date: '2000-04-05', isLunar: false, isSolarTerm: true }, // Special flag
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
        
        if (h.isSolarTerm && h.name === '清明节') {
            try {
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
            } catch (e) {
                 calcResult = { daysRemaining: 0, nextDate: dayjs(), displayDate: 'Error' };
            }
        } else {
            calcResult = calculateCountdown(h.date, h.isLunar, 'yearly');
        }

        return {
            id: h.name, 
            title: h.name,
            ...calcResult,
            type: 'holiday',
            isStatic: true 
        };
    }).sort((a, b) => {
        // Sort positive first (future), then negative (past)
        // But for holidays, usually we want to see what's coming next.
        // Logic: if remaining < 0, add big number to push to end? 
        // Or strictly by date.
        // Let's strictly sort by next occurrence.
        return a.daysRemaining - b.daysRemaining;
    }).filter(h => h.displayDate !== 'Error');
};

const getQingmingDate = (year) => {
    // Qingming is roughly Apr 4, 5, or 6
    // Simple lookup or library usage
    // Using Lunar-javascript Solar Term
    try {
        // Find Qingming in the given solar year
        // Solar.fromYmd(year, 4, 5) usually is close
        // Let's iterate days in April to find "Qingming" term
        for (let d = 4; d <= 6; d++) {
            const solar = Solar.fromYmd(year, 4, d);
            if (solar.getJieQi() === '清明') {
                return dayjs(`${year}-04-${d < 10 ? '0' + d : d}`);
            }
        }
        return dayjs(`${year}-04-04`); // Fallback
    } catch (e) {
        return dayjs(`${year}-04-05`);
    }
};