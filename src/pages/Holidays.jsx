import React, { useMemo, useState, useEffect } from 'react';
import { useEventContext } from '../context/EventContext';
import EventCard from '../components/EventCard';
import { getChineseHolidays, getWeekRemainingDays } from '../utils/dateUtils';
import dayjs from 'dayjs';
import { buildBackgroundStyle } from '../utils/backgroundStyle';

const Holidays = () => {
  const { settings } = useEventContext();
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
      setHolidays(getChineseHolidays());
  }, []);

  const stats = useMemo(() => {
      const now = dayjs();
      const endOfYear = now.endOf('year');
      const endOfMonth = now.endOf('month');
      
      const yearRemaining = endOfYear.diff(now, 'day');
      const monthRemaining = endOfMonth.diff(now, 'day');
      const weekRemaining = getWeekRemainingDays();

      return {
          year: yearRemaining,
          month: monthRemaining,
          week: weekRemaining
      };
  }, []);

  const pageStyle = buildBackgroundStyle(settings.holidaysBg, {
    overlayStart: 'rgba(255,255,255,0.8)',
  });

  return (
    <div 
        className="min-h-screen p-4 pb-20"
        style={pageStyle}
    >
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-gray-800">节假日</h1>
        <p className="text-gray-500 text-sm">生活不只是工作，还有诗和远方</p>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm text-center border border-indigo-100 flex flex-col justify-center items-center">
              <div className="text-xs text-indigo-400 mb-1 font-medium uppercase tracking-wider">本年剩余</div>
              <div className="text-2xl font-bold text-indigo-600">{stats.year}<span className="text-xs font-normal text-gray-400 ml-1">天</span></div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm text-center border border-pink-100 flex flex-col justify-center items-center">
              <div className="text-xs text-pink-400 mb-1 font-medium uppercase tracking-wider">本月剩余</div>
              <div className="text-2xl font-bold text-pink-600">{stats.month}<span className="text-xs font-normal text-gray-400 ml-1">天</span></div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm text-center border border-orange-100 flex flex-col justify-center items-center">
              <div className="text-xs text-orange-400 mb-1 font-medium uppercase tracking-wider">本周剩余</div>
              <div className="text-2xl font-bold text-orange-600">{stats.week}<span className="text-xs font-normal text-gray-400 ml-1">天</span></div>
          </div>
      </div>

      <div className="space-y-4">
        {holidays.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Holidays;
