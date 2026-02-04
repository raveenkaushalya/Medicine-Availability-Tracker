import { motion } from 'motion/react';
import logoImage from '../../../assets/images/logo.png';
import { memo, useCallback } from 'react';
import {
  LayoutDashboard,
  User,
  Package,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';
import { ImageWithFallback } from '../../../components/common/ImageWithFallback';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  pharmacyName: string;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'inventory', label: 'Medicine Inventory', icon: Package },
  { id: 'profile', label: 'Edit Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar = memo(function Sidebar({ activeView, onViewChange, pharmacyName, isOpen, onToggle }: SidebarProps) {
  const handleMenuItemClick = useCallback((itemId: string) => {
    onViewChange(itemId);
    if (window.innerWidth < 1024) {
      onToggle();
    }
  }, [onViewChange, onToggle]);

  const handleLogout = useCallback(() => {
    if (window.confirm('Are you sure you want to logout?')) {
      window.location.reload();
    }
  }, []);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -320,
        }}
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-800 shadow-xl z-40 flex flex-col transition-transform duration-300 lg:translate-x-0`}
      >
        {/* Logo/Brand - Navy Blue Header */}
        <div className="h-20 bg-slate-800 flex flex-col items-center justify-center mx-[0px] my-[25px]">
          <div className="flex flex-col items-center gap-2">
            <div className="w-13 h-13 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1">
              <ImageWithFallback
                src={logoImage}
                alt="Pharmora Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <span
              className="text-white text-lg sm:text-xl tracking-tight leading-tight font-bold uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.05em' }}
            >
              Pharmora
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${isActive
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-lime-400' : 'text-gray-400 group-hover:text-white'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile at Bottom */}
        <div className="p-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-slate-800">
                <span>{pharmacyName.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{pharmacyName}</p>
                <p className="text-gray-400 text-xs">Pharmacy Owner</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
});