import React, { useMemo } from 'react';
import { useEventContext } from '../context/EventContext';
import EventCard from '../components/EventCard';
import { calculateCountdown } from '../utils/dateUtils';
import { buildBackgroundStyle } from '../utils/backgroundStyle';

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

  const pageStyle = buildBackgroundStyle(settings.homeBg, {
    overlayStart: 'rgba(255,255,255,0.45)',
  });

  return (
    <div 
        className="flex h-full min-h-full flex-col"
        style={pageStyle}
    >
      <div className="px-4 pt-6 pb-3">
        <header className="mb-4 mt-1">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">记录</h1>
          <p className="text-gray-500 text-sm mt-1 font-light">记录每一个重要时刻</p>
        </header>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✨</div>
              <p className="text-gray-400 font-medium">还没有添加倒数日</p>
              <p className="text-sm text-gray-300 mt-2">点击下方 + 号开始记录</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
