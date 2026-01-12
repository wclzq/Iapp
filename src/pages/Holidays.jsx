import React, { useMemo } from 'react';
import { useEventContext } from '../context/EventContext';
import EventCard from '../components/EventCard';
import { getChineseHolidays } from '../utils/dateUtils';
import dayjs from 'dayjs';

const Holidays = () => {
  const { settings } = useEventContext();

  const holidays = useMemo(() => getChineseHolidays(), []);

  const stats = useMemo(() => {
      const now = dayjs();
      const endOfYear = now.endOf('year');
      const endOfMonth = now.endOf('month');
      const endOfWeek = now.endOf('week'); // Sunday by default in dayjs locale dependent, but usually OK

      return {
          year: endOfYear.diff(now, 'day'),
          month: endOfMonth.diff(now, 'day'),
          week: endOfWeek.diff(now, 'day')
      };
  }, []);

  return (
    <div 
        className="min-h-full p-4"
        style={settings.holidaysBg ? {
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${settings.holidaysBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        } : {}}
    >
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-gray-800">节假日</h1>
        <p className="text-gray-500 text-sm">生活不只是工作，还有诗和远方</p>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 shadow-sm text-center border border-indigo-50">
              <div className="text-xs text-gray-400 mb-1">本年剩余</div>
              <div className="text-xl font-bold text-indigo-600">{stats.year}<span className="text-xs font-normal text-gray-400 ml-0.5">天</span></div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm text-center border border-pink-50">
              <div className="text-xs text-gray-400 mb-1">本月剩余</div>
              <div className="text-xl font-bold text-pink-600">{stats.month}<span className="text-xs font-normal text-gray-400 ml-0.5">天</span></div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm text-center border border-orange-50">
              <div className="text-xs text-gray-400 mb-1">本周剩余</div>
              <div className="text-xl font-bold text-orange-600">{stats.week}<span className="text-xs font-normal text-gray-400 ml-0.5">天</span></div>
          </div>
      </div>

      <div>
        {holidays.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Holidays;