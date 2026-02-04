import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Mail } from 'lucide-react';
import logoImage from '../../assets/images/logo.png';
import { useNavigate } from 'react-router';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validate admin credentials here
    console.log("Logging in as admin...");
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#013a63' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-lg sm:rounded-2xl shadow-2xl p-6 sm:p-8"
      >
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center">
            <motion.img
              src={logoImage}
              alt="Pharmora Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>
          <h1 className="text-gray-800 text-lg sm:text-xl font-semibold mt-3">Pharmora Admin Portal</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-500 text-xs sm:text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="email@domain.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-500 text-xs sm:text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-gray-500 text-xs sm:text-sm font-medium mb-1">Security Code</label>
            <input
              type="text"
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="Enter security code"

            />
          </div>

          {/* Recaptcha Box */}
          <div className="bg-gray-50 border border-gray-200 rounded p-2 sm:p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="recaptcha" className="w-4 h-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
              <label htmlFor="recaptcha" className="text-xs sm:text-sm text-gray-600 cursor-pointer">I'm not a robot</label>
            </div>
            <div className="flex flex-col items-center">
              <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="w-5 h-5 opacity-70" />
              <span className="text-[9px] text-gray-500 mt-0.5">reCAPTCHA</span>
              <div className="text-[8px] text-gray-400 leading-none mt-0 space-x-1">
                <span>Privacy</span><span>-</span><span>Terms</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gray-800 text-white py-2.5 sm:py-3 rounded shadow-lg hover:bg-gray-900 transition-colors font-bold tracking-wide uppercase text-sm"
          >
            LOGIN
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}