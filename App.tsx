
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Entry, Entries, OperationType } from './types';
import Calendar from './components/Calendar';
import DayDetail from './components/DayDetail';
import Header from './components/Header';
import MonthlyTotal from './components/MonthlyTotal';

// Helper to format date as YYYY-MM-DD
const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<Entries>({});
  const [theme, setTheme] = useState<Theme>(() => {
     if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      if (storedTheme) return storedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem('calendarLedgerEntries');
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error("Failed to load entries from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('calendarLedgerEntries', JSON.stringify(entries));
    } catch (error) {
      console.error("Failed to save entries to localStorage", error);
    }
  }, [entries]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleDateSelect = useCallback((day: Date) => {
    setSelectedDate(day);
  }, []);

  const handleAddEntry = useCallback((value: number, type: OperationType) => {
    const dateKey = formatDateKey(selectedDate);
    const newEntry: Entry = {
      id: new Date().toISOString(),
      value,
      type,
    };
    setEntries(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEntry],
    }));
  }, [selectedDate]);

  const handleDeleteEntry = useCallback((id: string) => {
    const dateKey = formatDateKey(selectedDate);
    setEntries(prev => {
      const updatedEntries = (prev[dateKey] || []).filter(entry => entry.id !== id);
      const newEntriesForDate = { ...prev };
      if (updatedEntries.length > 0) {
        newEntriesForDate[dateKey] = updatedEntries;
      } else {
        delete newEntriesForDate[dateKey];
      }
      return newEntriesForDate;
    });
  }, [selectedDate]);

  const monthlyTotal = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return Object.keys(entries).reduce((total, dateKey) => {
      const entryDate = new Date(dateKey);
      if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
        return entries[dateKey].reduce((dayTotal, entry) => {
          if (entry.type === OperationType.ADD) {
            return dayTotal + entry.value;
          }
          return dayTotal - entry.value;
        }, total);
      }
      return total;
    }, 0);
  }, [entries, currentDate]);

  const selectedDayEntries = entries[formatDateKey(selectedDate)] || [];

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <Header 
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          theme={theme}
          onThemeChange={handleThemeChange}
        />
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-3/5 lg:w-2/3 p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
            <Calendar 
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              entries={entries}
            />
          </div>
          <div className="w-full md:w-2/5 lg:w-1/3 p-6 bg-slate-50 dark:bg-slate-900/50 flex flex-col">
            <div className="flex-grow">
              <DayDetail
                selectedDate={selectedDate}
                entries={selectedDayEntries}
                onAddEntry={handleAddEntry}
                onDeleteEntry={handleDeleteEntry}
              />
            </div>
            <MonthlyTotal total={monthlyTotal} />
          </div>
        </div>
      </div>
       <footer className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
          <p>Built by a world-class senior frontend React engineer.</p>
        </footer>
    </div>
  );
};

export default App;