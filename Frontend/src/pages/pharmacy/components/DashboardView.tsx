import { motion } from 'motion/react';
import { memo } from 'react';
import { KPIWidgets } from './KPIWidgets';
import { InventoryItem } from '../PharmacyOwnerDashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardViewProps {
  inventory: InventoryItem[];
  medications: any[];
}

export const DashboardView = memo(function DashboardView(_: DashboardViewProps) {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* KPI Widgets */}
      <KPIWidgets />

      {/* Main Content: Top Medicines and Recent Activity side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Top Medicines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 h-full flex flex-col"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-gray-900 text-base sm:text-lg">Top Medicines</h3>
            <button className="text-blue-900 hover:text-blue-700 text-xs sm:text-sm">View All</button>
          </div>
          <div className="space-y-3 sm:space-y-4 flex-1">
            {[
              { name: 'Aspirin 500mg', category: 'Pain Relief', price: Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(12.99), change: '+12%' },
              { name: 'Amoxicillin', category: 'Antibiotic', price: Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(24.99), change: '+8%' },
              { name: 'Lisinopril', category: 'Blood Pressure', price: Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(18.99), change: '+15%' },
              { name: 'Metformin', category: 'Diabetes', price: Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(15.99), change: '+6%' },
            ].map((product, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-900 text-xs sm:text-sm">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-xs sm:text-sm truncate">{product.name}</p>
                  <p className="text-gray-500 text-xs">{product.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-gray-900 text-xs sm:text-sm">{product.price}</p>
                  <p className="text-green-600 text-xs">{product.change}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 h-full flex flex-col"
        >
          <h3 className="text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Recent Activity</h3>
          <div className="space-y-3 sm:space-y-4 flex-1">
            {[
              { text: 'New user registered', detail: 'sarah.johnson@email.com • 2 minutes ago', color: 'bg-green-500' },
              { text: 'Order completed', detail: 'Order #15847 - $299.99 • 5 minutes ago', color: 'bg-blue-500' },
              { text: 'Product updated', detail: 'Aspirin 500mg - Stock: 25 • 8 minutes ago', color: 'bg-purple-500' },
              { text: 'Payment received', detail: '$1,245.00 from client • 12 minutes ago', color: 'bg-orange-500' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-2 sm:gap-3">
                <div className={`w-2 h-2 ${activity.color} rounded-full mt-2 flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500 break-words">{activity.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
});