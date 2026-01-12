import dayjs from 'dayjs';
import * as LunarJS from 'lunar-javascript';

// Handle different import styles
const Lunar = LunarJS.Lunar || LunarJS.default?.Lunar || LunarJS;
const Solar = LunarJS.Solar || LunarJS.default?.Solar;

/**
 * Calculate the next occurrence of a target date.
 */
export const calculateCountdown = (date, isLunar, repeat = 'none') => {
  const now = dayjs();
  let targetDate;
  let displayDate = '';

  try {
    if (isLunar) {
      const [year, month, day] = String(date).split('-').map(Number);

      try {
        const dummyLunar = Lunar.fromYmd(year, month, day);
        displayDate = `农历 ${dummyLunar.getMonthInChinese()}月${dummyLunar.getDayInChinese()}`;
      } catch {
        displayDate = '农历日期';
      }

      const currentLunar = Lunar.fromDate(now.toDate());
      const checkYear = currentLunar.getYear();

      if (repeat === 'yearly') {
        let found = false;
        for (let y = checkYear; y <= checkYear + 2; y++) {
          try {
            const lunar = Lunar.fromYmd(y, month, day);
            const solar = lunar.getSolar();
            const solarDate = dayjs(solar.toString());

            const solarStart = solarDate.startOf('day');
            const nowStart = now.startOf('day');
            if (solarStart.isAfter(nowStart) || solarStart.isSame(nowStart)) {
              targetDate = solarDate;
              found = true;
              break;
            }
          } catch {
            continue;
          }
        }
        if (!found) targetDate = now;
      } else {
        const lunar = Lunar.fromYmd(year, month, day);
        targetDate = dayjs(lunar.getSolar().toString());
      }
    } else {
      const solarBase = dayjs(date);
      if (!solarBase.isValid()) {
        throw new Error(`Invalid solar date: ${date}`);
      }

      if (repeat === 'yearly') {
        targetDate = solarBase.year(now.year());
        if (targetDate.isBefore(now, 'day')) targetDate = targetDate.add(1, 'year');
        displayDate = targetDate.format('YYYY-MM-DD');
      } else if (repeat === 'monthly') {
        targetDate = solarBase.year(now.year()).month(now.month());
        if (targetDate.isBefore(now, 'day')) targetDate = targetDate.add(1, 'month');
        displayDate = targetDate.format('YYYY-MM-DD');
      } else {
        targetDate = solarBase;
        displayDate = solarBase.format('YYYY-MM-DD');
      }
    }

    if (!targetDate) targetDate = now;
    if (!dayjs.isDayjs(targetDate)) targetDate = dayjs(targetDate);

    const todayStart = dayjs().startOf('day');
    const targetStart = targetDate.startOf('day');
    const daysRemaining = targetStart.diff(todayStart, 'day');

    return { daysRemaining, nextDate: targetDate, displayDate };
  } catch (error) {
    return { daysRemaining: 0, nextDate: now, displayDate: 'Err: ' + error.message };
  }
};

export const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY年MM月DD日');
};

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

  return holidays
    .map((h) => {
      let calcResult;

      if (h.isSolarTerm && h.name === '清明节') {
        try {
          const now = dayjs();
          let year = now.year();
          let qingmingDate = getQingmingDate(year);
          if (qingmingDate.isBefore(now, 'day')) qingmingDate = getQingmingDate(year + 1);

          const daysRemaining = qingmingDate.startOf('day').diff(dayjs().startOf('day'), 'day');
          calcResult = {
            daysRemaining,
            nextDate: qingmingDate,
            displayDate: qingmingDate.format('YYYY-MM-DD'),
          };
        } catch (e) {
          calcResult = { daysRemaining: 0, nextDate: dayjs(), displayDate: 'Err: ' + e.message };
        }
      } else {
        calcResult = calculateCountdown(h.date, h.isLunar, 'yearly');
      }

      return {
        id: h.name,
        title: h.name,
        date: h.date,
        isLunar: h.isLunar,
        repeat: 'yearly',
        ...calcResult,
        type: 'holiday',
        isStatic: true,
      };
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
};

const getQingmingDate = (year) => {
  try {
    for (let d = 4; d <= 6; d++) {
      const solar = Solar.fromYmd(year, 4, d);
      if (solar.getJieQi() === '清明') return dayjs(`${year}-04-${d < 10 ? '0' + d : d}`);
    }
    return dayjs(`${year}-04-05`);
  } catch {
    return dayjs(`${year}-04-05`);
  }
};

export const getWeekRemainingDays = () => {
  const now = dayjs();
  const day = now.day(); // 0=Sun ... 6=Sat
  const isoDay = day === 0 ? 7 : day; // 1=Mon ... 7=Sun
  return 7 - isoDay;
};