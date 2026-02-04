import { motion } from 'motion/react';
import { DollarSign, TrendingDown, Wallet, Percent } from 'lucide-react';

export function KPIWidgets() {
  const widgets = [
    {
      title: 'Available Medicines',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: DollarSign,
      iconBg: 'bg-blue-900 bg-opacity-10',
      iconColor: 'text-blue-900',
      subtext: 'vs last month',
    },
    {
      title: 'Out of Stock',
      value: '24',
      change: '-8%',
      changeType: 'positive',
      icon: TrendingDown,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      subtext: 'vs last month',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {widgets.map((widget, index) => {
        const Icon = widget.icon;
        const hideIcon = widget.title === 'Available Medicines' || widget.title === 'Out of Stock';
        return (
          <motion.div
            key={widget.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{widget.title}</p>
                <p className="text-gray-900 mt-2">{widget.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm flex items-center ${
                    widget.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {widget.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">{widget.subtext}</span>
                </div>
              </div>
              {!hideIcon && (
                <div className={`w-12 h-12 ${widget.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${widget.iconColor}`} />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
