import { motion } from 'motion/react';
import { Search, Menu } from 'lucide-react';
import { useState, useEffect, useRef, memo } from 'react';

interface HeaderProps {
  pharmacyName: string;
  onMenuToggle: () => void;
}

export const Header = memo(function Header({ pharmacyName, onMenuToggle }: HeaderProps) {
  // Notification logic removed

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700 flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-gray-900 font-bold truncate text-base sm:text-xl md:text-2xl">{pharmacyName}</h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">Welcome back, here's what's happening today</p>
            </div>
          </div>

          {/* Right: Search */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Search */}
            <div className="relative hidden xl:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm w-48"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});