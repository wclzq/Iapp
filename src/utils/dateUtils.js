import dayjs from 'dayjs';
import { Lunar, Solar } from 'lunar-javascript';

// Configure dayjs to treat Monday as start of week if needed, but manual calc is safer without plugins
// dayjs.locale('zh-cn'); // Requires importing locale

/**
 * Calculate the next occurrence of a target date.
 */
export const calculateCountdown = (date, isLunar, repeat = 'none') => {
  const now = dayjs();
  let targetDate;
  let displayDate = '';

  try {
    if (isLunar) {
        // Parse Lunar Date
        const [year, month, day] = date.split('-').map(Number);
        
        // Display string logic
        try {
             // Create a dummy lunar date just for getting the Chinese string
             let dummyLunar = Lunar.fromYmd(year, month, day); 
             displayDate = `农历 ${dummyLunar.getMonthInChinese()}月${dummyLunar.getDayInChinese()}`;
        } catch (e) {
             displayDate = '农历日期';
        }

        // Logic to find next occurrence
        const currentLunar = Lunar.fromDate(now.toDate());
        let checkYear = currentLunar.getYear(); // Start checking from current lunar year
        
        if (repeat === 'yearly') {
            // Check current lunar year, next, and maybe next-next to be safe
            let found = false;
            for (let y = checkYear; y <= checkYear + 2; y++) {
                try {
                    let l = Lunar.fromYmd(y, month, day);
                    let s = l.getSolar();
                    let sDate = dayjs(s.toString());
                    
                    // If sDate is today or future
                    if (sDate.isSame(now, 'day') || sDate.isAfter(now, 'day')) {
                        targetDate = sDate;
                        found = true;
                        break;
                    }
                } catch (e) {
                    // This lunar date might not exist in year y (e.g. leap month or short month)
                    // If strictly finding specific day (e.g. 30th) and it's missing, maybe check 29th?
                    // For holidays, usually 1st, 5th, 15th exist.
                    continue;
                }
            }
            if (!found) {
                // Should not happen for standard holidays
                targetDate = now; 
            }
        } else {
             // One time
             let l = Lunar.fromYmd(year, month, day);
             targetDate = dayjs(l.getSolar().toString());
        }

    } else {
        // Solar Date
        let solarDate = dayjs(date);
        displayDate = solarDate.format('YYYY-MM-DD');
        
        if (repeat === 'yearly') {
            targetDate = solarDate.year(now.year());
            // If passed, go to next year
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

    if (!targetDate) targetDate = now;

    const todayStart = dayjs().startOf('day');
    const targetStart = targetDate.startOf('day');
    const daysRemaining = targetStart.diff(todayStart, 'day');

    return {
        daysRemaining,
        nextDate: targetDate,
        displayDate
    };
  } catch (error) {
    console.error("Countdown Error", error);
    return { daysRemaining: 0, nextDate: now, displayDate: '计算错误' };
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
        { name: '清明节', date: '2000-04-05', isLunar: false, isSolarTerm: true }, 
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
    }).sort((a, b) => a.daysRemaining - b.daysRemaining);
};

const getQingmingDate = (year) => {
    try {
        for (let d = 4; d <= 6; d++) {
            const solar = Solar.fromYmd(year, 4, d);
            if (solar.getJieQi() === '清明') {
                return dayjs(`${year}-04-${d < 10 ? '0' + d : d}`);
            }
        }
        return dayjs(`${year}-04-05`); 
    } catch (e) {
        return dayjs(`${year}-04-05`);
    }
};

export const getWeekRemainingDays = () => {
    const now = dayjs();
    // 0(Sun) to 6(Sat)
    let day = now.day();
    // Convert to Mon(1) - Sun(7) system
    // Sun(0) -> 7
    // Mon(1) -> 1
    let isoDay = day === 0 ? 7 : day;
    
    // Remaining days = 7 - current day (if today is Sunday 7, remaining is 0)
    // Actually usually "remaining days in week" implies how many days left to enjoy/work?
    // Usually standard: Days left until Sunday end.
    // If Mon(1), 6 days left (Tue,Wed,Thu,Fri,Sat,Sun).
    // If Sun(7), 0 days left.
    return 7 - isoDay;
};