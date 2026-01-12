import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventContext } from '../context/EventContext';
import { calculateCountdown } from '../utils/dateUtils';
import { ChevronLeft, Trash2, Edit2 } from 'lucide-react';
import dayjs from 'dayjs';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, deleteEvent } = useEventContext();
  
  const event = events.find(e => e.id === id);

  // If event not found (deleted or invalid URL), go home
  if (!event) {
      React.useEffect(() => {
          navigate('/');
      }, [navigate]);
      return null;
  }

  const { daysRemaining, displayDate, nextDate } = useMemo(() => 
    calculateCountdown(event.date, event.isLunar, event.repeat), 
    [event]
  );

  const handleDelete = () => {
      if(confirm('确定要删除这个倒数日吗？')) {
          deleteEvent(id);
          navigate('/');
      }
  }

  return (
    <div 
        className="h-screen w-full relative flex flex-col items-center justify-center text-white"
        style={event.backgroundImage ? {
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${event.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        } : {
            backgroundColor: '#4f46e5' // default indigo background
        }}
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-8 flex justify-between items-center z-10 safe-area-top">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
              <ChevronLeft size={24} />
          </button>
          <div className="flex gap-3">
              {/* Edit feature can be added later, reuse AddEditEvent with initial data */}
              {/* <button className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                  <Edit2 size={20} />
              </button> */}
              <button onClick={handleDelete} className="p-2 bg-white/10 rounded-full backdrop-blur-sm text-red-300">
                  <Trash2 size={20} />
              </button>
          </div>
      </div>

      {/* Main Content */}
      <div className="text-center z-10 px-6 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2 tracking-wide text-shadow-sm">{event.title}</h2>
          <div className="text-sm opacity-80 mb-10 font-light flex items-center justify-center gap-2">
              <span>{displayDate}</span>
              {event.isLunar && <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">农</span>}
              {event.repeat !== 'none' && <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">{event.repeat === 'yearly' ? '每年' : '每月'}</span>}
          </div>

          {daysRemaining === 0 ? (
               <div className="text-6xl font-bold mb-4">就是今天</div>
          ) : (
            <div className="mb-8">
                <div className="text-lg opacity-80 mb-2">{daysRemaining > 0 ? '还有' : '已经'}</div>
                <div className="text-8xl font-bold tracking-tighter">{Math.abs(daysRemaining)}</div>
                <div className="text-lg opacity-80 mt-2">天</div>
            </div>
          )}
          
          <div className="mt-12 text-sm opacity-60 font-light">
             目标日: {dayjs(nextDate).format('YYYY年MM月DD日 dddd')}
          </div>
      </div>

    </div>
  );
};

export default EventDetail;