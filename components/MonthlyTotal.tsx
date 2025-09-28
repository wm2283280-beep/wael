
import React from 'react';

interface MonthlyTotalProps {
  total: number;
}

const MonthlyTotal: React.FC<MonthlyTotalProps> = ({ total }) => {
  const totalColor = total >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  
  return (
    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-baseline">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Monthly Total:</h3>
        <p className={`text-2xl font-bold ${totalColor}`}>
          {total.toLocaleString(undefined, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};

export default MonthlyTotal;