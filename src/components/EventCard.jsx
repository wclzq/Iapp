import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateCountdown } from '../utils/dateUtils';
import { Calendar, Heart, Gift, Plane, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const { daysRemaining, displayDate } = useMemo(() => 
    calculateCountdown(event.date, event.isLunar, event.repeat), 
    [event.date, event.isLunar, event.repeat]
  );

  const getIcon = () => {
    switch (event.type) {
      case 'birthday': return <Gift className="w-5 h-5 text-primary" />;
      case 'anniversary': return <Heart className="w-5 h-5 text-red-500" />;
      case 'holiday': return <Plane className="w-5 h-5 text-blue-500" />;
      default: return <Star className="w-5 h-5 text-yellow-500" />;
    }
  };
  
  const getTypeBadge = () => {
      if (event.type === 'birthday') {
          return <span className="bg-primary-50 text-primary px-1.5 py-0.5 rounded text-[10px] ml-1">生日</span>;
      }
      if (event.type === 'holiday') {
          return <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-[10px] ml-1">节假日</span>;
      }
      if (event.type === 'anniversary') {
          return <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px] ml-1">纪念日</span>;
      }
      return null;
  };

  return (
    <div 
      onClick={() => navigate(event.isStatic ? '#' : `/event/${event.id}`)}
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 mb-4 shadow-sm transition-all active:scale-95 cursor-pointer border",
        event.backgroundImage ? "text-white border-transparent" : "bg-white text-gray-800 border-primary-50"
      )}
      style={event.backgroundImage ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${event.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '120px'
      } : {}}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getIcon()}
            <h3 className="font-bold text-lg">{event.title}</h3>
          </div>
          <div className={cn("text-xs opacity-80 flex items-center gap-1", event.backgroundImage ? "text-gray-200" : "text-gray-500")}>
             <Calendar className="w-3 h-3" /> {displayDate} 
             {event.isLunar && <span className="bg-orange-100 text-orange-600 px-1 rounded text-[10px] ml-1">农</span>}
             {!event.backgroundImage && getTypeBadge()}
          </div>
          
          {/* Badge for image background */}
          {event.backgroundImage && (
              <div className="mt-1 flex">
                 {getTypeBadge()}
              </div>
          )}
        </div>
        
        <div className="text-right">
          {daysRemaining === 0 ? (
             <span className="text-2xl font-bold">今天</span>
          ) : (
            <div>
              <span className="text-xs opacity-70 mr-1">{daysRemaining > 0 ? '还有' : '已过'}</span>
              <span className="text-3xl font-bold">{Math.abs(daysRemaining)}</span>
              <span className="text-xs opacity-70 ml-1">天</span>
            </div>
          )}
        </div>
      </div>
      
      {event.topSticky && (
          <div className="absolute top-0 right-0 bg-yellow-400 w-3 h-3 rounded-bl-lg"></div>
      )}
    </div>
  );
};

export default EventCard;