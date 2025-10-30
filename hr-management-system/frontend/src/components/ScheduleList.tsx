import React from 'react';
import { FiMoreHorizontal, FiCalendar, FiClock } from 'react-icons/fi';

type Schedule = {
  id: string;
  title: string;
  type: string;
  startTime: string;
  description?: string;
  employee?: {
    firstName: string;
    lastName: string;
  };
};

type Props = {
  schedules: Schedule[];
};

const ScheduleList = ({ schedules }: Props) => {
  const isPriority = (type: string) => type === 'REVIEW' || type === 'INTERVIEW';

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTypeStyle = (type: string) => {
    const styles: Record<string, string> = {
      REVIEW: 'bg-orange-100 text-orange-700',
      INTERVIEW: 'bg-purple-100 text-purple-700',
      MEETING: 'bg-blue-100 text-blue-700',
      OTHER: 'bg-gray-100 text-gray-700',
    };
    return styles[type] || styles.OTHER;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Upcoming Schedule</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <FiCalendar size={18} />
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
        <span>Today, {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
      </div>
      
      <div className="space-y-4">
        {/* Section Priority */}
        {schedules.filter(s => isPriority(s.type)).length > 0 && (
          <>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</p>
            {schedules.filter(s => isPriority(s.type)).map(item => (
              <ScheduleItem key={item.id} item={item} priority={true} formatTime={formatTime} getTypeStyle={getTypeStyle} />
            ))}
          </>
        )}

        {/* Section Other */}
        {schedules.filter(s => !isPriority(s.type)).length > 0 && (
          <>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">Other</p>
            {schedules.filter(s => !isPriority(s.type)).map(item => (
              <ScheduleItem key={item.id} item={item} priority={false} formatTime={formatTime} getTypeStyle={getTypeStyle} />
            ))}
          </>
        )}
      </div>

      <div className="text-center mt-6">
        <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
          Create a New Schedule
        </button>
      </div>
    </div>
  );
};

const ScheduleItem = ({ 
  item, 
  priority, 
  formatTime, 
  getTypeStyle 
}: { 
  item: Schedule; 
  priority: boolean;
  formatTime: (date: string) => string;
  getTypeStyle: (type: string) => string;
}) => (
  <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h4>
        {item.description && (
          <p className="text-xs text-gray-600 line-clamp-1">{item.description}</p>
        )}
      </div>
      <button className="text-gray-400 hover:text-gray-600 transition-colors ml-2">
        <FiMoreHorizontal size={16} />
      </button>
    </div>
    
    <div className="flex items-center justify-between mt-3">
      <div className="flex items-center space-x-2 text-xs text-gray-600">
        <FiClock size={14} />
        <span>{formatTime(item.startTime)}</span>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeStyle(item.type)}`}>
        {item.type.charAt(0) + item.type.slice(1).toLowerCase()}
      </span>
    </div>

    {item.employee && (
      <div className="mt-2 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          With {item.employee.firstName} {item.employee.lastName}
        </p>
      </div>
    )}
  </div>
);

export default ScheduleList;
