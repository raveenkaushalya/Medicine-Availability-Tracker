import { motion } from 'motion/react';
import { useState } from 'react';
import { Save, Bell, Lock, Globe, Palette, Shield } from 'lucide-react';

export function SettingsView() {
  const [settings, setSettings] = useState({
    lowStockAlerts: true,
    inquiryAlerts: true,
    autoResponse: false,
    publicProfile: true,
    showPrices: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Changing password');
    alert('Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 text-xl sm:text-2xl">Settings</h2>
        <p className="text-gray-600 text-sm">Manage your pharmacy portal preferences</p>
      </div>



      {/* Privacy Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200/50 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-50">
            <Globe className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-gray-900 text-base sm:text-lg">Privacy Settings</h3>
            <p className="text-gray-500 text-sm">Control your pharmacy visibility</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: 'publicProfile', label: 'Public Profile', description: 'Allow customers to view your pharmacy' },
            { key: 'showPrices', label: 'Show Prices', description: 'Display medication prices publicly' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm sm:text-base">{item.label}</p>
                <p className="text-gray-500 text-xs sm:text-sm">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={settings[item.key as keyof typeof settings] as boolean}
                  onChange={() => handleToggle(item.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200/50 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-red-50">
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-gray-900 text-base sm:text-lg">Security</h3>
            <p className="text-gray-500 text-sm">Change your password</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 text-sm">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-sm">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-sm">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Confirm new password"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleChangePassword}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Change Password
          </motion.button>
        </div>
      </motion.div>

      {/* Appearance Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200/50 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-lime-50">
            <Palette className="w-5 h-5 text-lime-600" />
          </div>
          <div>
            <h3 className="text-gray-900 text-base sm:text-lg">Appearance</h3>
            <p className="text-gray-500 text-sm">Customize your portal theme</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 text-sm">Theme</label>
            <select className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option>Light Mode</option>
              <option>Dark Mode</option>
              <option>Auto (System)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-sm">Accent Color</label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {['#84cc16', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'].map((color) => (
                <button
                  key={color}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleSaveSettings}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm sm:text-base"
      >
        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Save All Settings</span>
      </motion.button>
    </div>
  );
}