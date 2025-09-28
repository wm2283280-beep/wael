
import React from 'react';
import { Entries } from '../types';

interface CalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (day: Date) => void;
  entries: Entries;
}

const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const Calendar: React.FC<CalendarProps> = ({ currentDate, selectedDate, onDateSelect, entries }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderDays = () => {
    const days = [];
    const today = new Date();

    // Blank days for the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`blank-${i}`} className="border-r border-b border-slate-200 dark:border-slate-700"></div>);
    }

    // Month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = formatDateKey(date);
      
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const hasEntries = entries[dateKey] && entries[dateKey].length > 0;

      let cellClasses = "relative p-2 border-r border-b border-slate-200 dark:border-slate-700 text-sm cursor-pointer transition-colors duration-200 ";
      let dayNumberClasses = "flex items-center justify-center h-8 w-8 rounded-full transition-colors duration-200 ";

      if (isSelected) {
        cellClasses += "bg-indigo-100 dark:bg-indigo-900/50 ";
        dayNumberClasses += "bg-indigo-600 text-white font-bold ";
      } else if (isToday) {
        dayNumberClasses += "bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold ";
        cellClasses += "hover:bg-slate-100 dark:hover:bg-slate-700/50 ";
      } else {
        dayNumberClasses += "text-slate-700 dark:text-slate-300 ";
        cellClasses += "hover:bg-slate-100 dark:hover:bg-slate-700/50 ";
      }

      days.push(
        <div key={day} className={cellClasses} onClick={() => onDateSelect(date)}>
          <div className={dayNumberClasses}>
            {day}
          </div>
          {hasEntries && (
            <div className="absolute bottom-1 right-1 h-2 w-2 bg-green-500 rounded-full"></div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div>
      <div className="grid grid-cols-7 text-center font-semibold text-slate-600 dark:text-slate-400 text-xs">
        {daysOfWeek.map(day => (
          <div key={day} className="py-2 border-b-2 border-slate-200 dark:border-slate-700">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7" style={{ minHeight: '360px' }}>
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;