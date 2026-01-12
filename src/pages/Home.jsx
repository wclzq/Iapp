import React, { useMemo } from 'react';
import { useEventContext } from '../context/EventContext';
import EventCard from '../components/EventCard';
import { calculateCountdown } from '../utils/dateUtils';

const Home = () => {
  const { events, settings } = useEventContext();

  const sortedEvents = useMemo(() => {
    // Calculate days remaining for sorting
    const eventsWithDiff = events.map(event => {
       const { daysRemaining } = calculateCountdown(event.date, event.isLunar, event.repeat);
       return { ...event, daysRemaining };
    });

    // Sort: Sticky first, then by days remaining (ascending, so nearest dates first)
    return eventsWithDiff.sort((a, b) => {
        if (a.topSticky !== b.topSticky) return b.topSticky ? 1 : -1;
        
        // Treat 0 (today) as smallest positive number for importance, but strictly numerically...
        // Usually people want to see what is coming up next.
        // If daysRemaining < 0 (passed), maybe put them at the bottom?
        
        const aVal = a.daysRemaining >= 0 ? a.daysRemaining : 99999 + Math.abs(a.daysRemaining);
        const bVal = b.daysRemaining >= 0 ? b.daysRemaining : 99999 + Math.abs(b.daysRemaining);
        
        return aVal - bVal;
    });
  }, [events]);

  return (
    <div className="p-4">
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-gray-800">记录</h1>
        <p className="text-gray-500 text-sm">记录每一个重要时刻</p>
      </header>

      {sortedEvents.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
            <p>还没有添加倒数日</p>
            <p className="text-sm mt-2">点击下方 + 号开始记录</p>
        </div>
      ) : (
        <div>
          {sortedEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;