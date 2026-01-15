import { useMemo } from 'react';
import { useEventContext } from '../context/EventContext';
import EventCard from '../components/EventCard';
import { calculateCountdown } from '../utils/dateUtils';
import { Sparkles } from 'lucide-react';
import PageBackground from '../components/PageBackground';

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
    <div
        className="relative flex h-full min-h-full flex-col"
    >
      <PageBackground image={settings.homeBg} />
      <div className="px-4 pt-6 pb-3 flex-shrink-0">
        <header className="mb-4 mt-1">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">记录</h1>
          <p className="text-gray-500 text-sm mt-1 font-light">记录每一个重要时刻</p>
        </header>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-24 flex-shrink">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
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
