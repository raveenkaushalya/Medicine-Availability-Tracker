import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div
      className="relative"
      data-search-bar="true"
    >
      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search for medications..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white border border-gray-300 rounded-[50px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-gray-900 placeholder:text-gray-400 transition-all duration-300 text-sm sm:text-base"
      />
      {value && (
        <button
          onClick={onClear}
          type="button"
          className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center transition-opacity"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        </button>
      )}
    </div>
  );
}