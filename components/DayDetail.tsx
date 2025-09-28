
import React, { useState } from 'react';
import { Entry, OperationType } from '../types';

interface DayDetailProps {
  selectedDate: Date;
  entries: Entry[];
  onAddEntry: (value: number, type: OperationType) => void;
  onDeleteEntry: (id: string) => void;
}

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const MinusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const DayDetail: React.FC<DayDetailProps> = ({ selectedDate, entries, onAddEntry, onDeleteEntry }) => {
  const [inputValue, setInputValue] = useState('');
  const [operation, setOperation] = useState<OperationType>(OperationType.ADD);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value !== 0) {
      onAddEntry(value, operation);
      setInputValue('');
    }
  };
  
  const dayOfWeek = selectedDate.toLocaleString('default', { weekday: 'long' });
  const day = selectedDate.getDate();
  const month = selectedDate.toLocaleString('default', { month: 'long' });
  const year = selectedDate.getFullYear();

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{dayOfWeek}</p>
        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{`${day} ${month} ${year}`}</p>
      </div>

      <form onSubmit={handleAdd} className="mb-6">
        <label htmlFor="entry-value" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Entry</label>
        <div className="flex space-x-2">
          <input
            id="entry-value"
            type="number"
            step="0.01"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter amount"
            className="flex-grow w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400"
          />
          <div className="flex rounded-md shadow-sm">
             <button type="button" onClick={() => setOperation(OperationType.ADD)} className={`px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-l-md transition-colors ${operation === OperationType.ADD ? 'bg-green-500 text-white border-green-500' : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600'}`}>
                <PlusIcon className="h-5 w-5"/>
            </button>
            <button type="button" onClick={() => setOperation(OperationType.SUBTRACT)} className={`px-3 py-2 border-t border-b border-r border-slate-300 dark:border-slate-600 rounded-r-md transition-colors ${operation === OperationType.SUBTRACT ? 'bg-red-500 text-white border-red-500' : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600'}`}>
                <MinusIcon className="h-5 w-5"/>
            </button>
          </div>
        </div>
         <button type="submit" className="mt-3 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Entry
        </button>
      </form>
      
      <div className="flex-grow overflow-y-auto">
        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100 mb-2 border-b dark:border-slate-700 pb-2">Entries for this day</h3>
        {entries.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 text-center">No entries yet.</p>
        ) : (
          <ul className="space-y-2">
            {entries.map(entry => (
              <li key={entry.id} className="flex items-center justify-between bg-white/50 dark:bg-slate-700/50 p-2.5 rounded-md shadow-sm">
                <div className="flex items-center">
                    {entry.type === OperationType.ADD ? (
                        <PlusIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                    ) : (
                        <MinusIcon className="h-5 w-5 text-red-500 dark:text-red-400 mr-3" />
                    )}
                    <span className={`font-medium ${entry.type === OperationType.ADD ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        {entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <button onClick={() => onDeleteEntry(entry.id)} className="p-1 rounded-full text-slate-400 dark:text-slate-500 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DayDetail;