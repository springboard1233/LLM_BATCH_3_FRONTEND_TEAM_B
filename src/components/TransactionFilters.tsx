import { Filter, X } from 'lucide-react';
import useResponsive from '../hooks/useResponsive';

interface TransactionFiltersProps {
  filters: {
    status: string;
    channel: string;
    startDate: string;
    endDate: string;
    minAmount: string;
    maxAmount: string;
    minRisk: string;
    maxRisk: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export const TransactionFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
}: TransactionFiltersProps) => {
  const { isMobile } = useResponsive();
  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <h3 className={`font-semibold text-white ${isMobile ? 'text-base' : 'text-lg'}`}>Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg hover:bg-slate-700"
            aria-label="Clear all filters"
          >
            <X className="w-4 h-4" />
            <span className={isMobile ? 'sr-only' : ''}>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-3 min-h-[44px] bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="Fraud">Fraud</option>
            <option value="Legitimate">Legitimate</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Channel
          </label>
          <select
            value={filters.channel}
            onChange={(e) => onFilterChange('channel', e.target.value)}
            className="w-full px-3 py-3 min-h-[44px] bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="Mobile">Mobile</option>
            <option value="ATM">ATM</option>
            <option value="POS">POS</option>
            <option value="Web">Web</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            className="w-full px-3 py-3 min-h-[44px] bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
            className="w-full px-3 py-3 min-h-[44px] bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Min Amount (₹)
          </label>
          <input
            type="number"
            value={filters.minAmount}
            onChange={(e) => onFilterChange('minAmount', e.target.value)}
            placeholder="0"
            className="w-full px-3 py-3 min-h-[44px] bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Max Amount (₹)
          </label>
          <input
            type="number"
            value={filters.maxAmount}
            onChange={(e) => onFilterChange('maxAmount', e.target.value)}
            placeholder="999999"
            className="w-full px-3 py-3 min-h-[44px] bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Min Risk Score
          </label>
          <input
            type="number"
            value={filters.minRisk}
            onChange={(e) => onFilterChange('minRisk', e.target.value)}
            placeholder="0"
            min="0"
            max="100"
            className="w-full px-3 py-3 min-h-[44px] bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Max Risk Score
          </label>
          <input
            type="number"
            value={filters.maxRisk}
            onChange={(e) => onFilterChange('maxRisk', e.target.value)}
            placeholder="100"
            min="0"
            max="100"
            className="w-full px-3 py-3 min-h-[44px] bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
