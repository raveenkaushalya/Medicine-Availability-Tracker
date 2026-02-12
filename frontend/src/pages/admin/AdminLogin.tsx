import { useState } from 'react';
import { motion } from 'motion/react';
import logoImage from '../../assets/images/logo.png';
import { useNavigate } from 'react-router';
import { apiFetch } from "../../utils/api"; // ✅ ADD

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityKey, setSecurityKey] = useState(''); // ✅ ADD
  const [error, setError] = useState<string | null>(null); // ✅ ADD
  const [loading, setLoading] = useState(false); // ✅ ADD

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // ✅ call backend login
      await apiFetch("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({
        email: email,           // ✅ use the input email
        password: password,
        securityKey: securityKey,
      }),

      });

      // ✅ success
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
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

        {/* ✅ show error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

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
            <label className="block text-gray-500 text-xs sm:text-sm font-medium mb-1">Security Key</label>
            <input
              type="text"
              value={securityKey}
              onChange={(e) => setSecurityKey(e.target.value)}
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="Enter admin security key"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2.5 sm:py-3 rounded shadow-lg hover:bg-gray-900 transition-colors font-bold tracking-wide uppercase text-sm disabled:opacity-60"
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
