import { motion } from 'motion/react';
import { Mail, Phone, Facebook, Globe } from 'lucide-react';
import { useState } from 'react';

interface ContactUsProps {
  onPageChange?: (page: string) => void;
}

export function ContactUs({ onPageChange }: ContactUsProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', inquiryType: 'general', message: '' });
    }, 3000);
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-[128px] pb-12 lg:pb-24" style={{ paddingTop: '100px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
            {/* Left Side - Get in Touch Form Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8 lg:p-15 border border-gray-200"
              style={{ marginLeft: '18px' }}
              style={{ marginLeft: '18px' }}
            >
              <h2 className="text-gray-900 mb-3 text-4xl font-bold text-center">Get in Touch</h2>
              <p className="text-gray-600 mb-8 text-lg text-center">You can reach us anytime</p>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-6 text-base"
                >
                  <p>Thank you for your message! We'll get back to you soon.</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" style={{ paddingTop: '27px', paddingBottom: '27px' }}>
                {/* First Name and Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-base placeholder:text-gray-400 shadow-sm hover:border-gray-300"
                    placeholder="First name"
                  />
                  <input
                    type="text"
                    required
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-base placeholder:text-gray-400 shadow-sm hover:border-gray-300"
                    placeholder="Last name"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-base placeholder:text-gray-400 shadow-sm hover:border-gray-300"
                    placeholder="Your email"
                  />
                </div>

                {/* Phone Number with Country Code */}
                <div className="flex gap-3">
                  <label htmlFor="country-code" className="sr-only">Country Code</label>
                  <select id="country-code" title="Country Code" className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base text-gray-700 shadow-sm hover:border-gray-300 cursor-pointer">
                    <option>+94</option>
                  </select>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-base placeholder:text-gray-400 shadow-sm hover:border-gray-300"
                    placeholder="Phone number"
                  />
                </div>

                {/* Inquiry Type Selection Buttons */}
                <div>
                  <label className="block text-gray-800 mb-3 text-base font-medium">Inquiry Type</label>
                  <div className="flex flex-wrap gap-3">
                    {['User Support', 'Feedback', 'Pharmacy Support', 'General'].map((type) => {
                      const value = type.toLowerCase().replace(' ', '-');
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFormData({ ...formData, inquiryType: value })}
                          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${formData.inquiryType === value
                            ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all resize-none text-base placeholder:text-gray-400 shadow-sm hover:border-gray-300"
                  placeholder="How can we help?"
                />

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full bg-black text-white py-4 px-8 rounded-xl hover:bg-slate-800 transition-colors text-lg font-semibold shadow-xl shadow-slate-900/20"
                >
                  Send Message
                </motion.button>

                {/* Terms Footer */}
                <p className="text-center text-sm text-gray-500 pt-2">
                  By contacting us, you agree to our{' '}
                  <button
                    onClick={() => onPageChange?.("terms")}
                    className="text-gray-800 font-medium hover:text-blue-600 transition-colors"
                  >
                    Terms of service
                  </button>
                </p>
              </form>
            </motion.div>

            {/* Right Side - Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-10 pt-8 lg:pt-10"
              style={{ paddingTop: '12px' }}
            >
              {/* Inquiry Type Cards */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-gray-900 mb-3 text-xl font-bold">User Support</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Our support team is available around the clock to address any concerns or queries you may have. We're dedicated to ensuring your experience is seamless.
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-3 text-xl font-bold">Feedback and Suggestions</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    We value your feedback and are continuously working to improve PharmConnect. Your input is crucial in shaping the future of our platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-3 text-xl font-bold">Pharmacy Support</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    For pharmacy-related questions, registration assistance, or partnership inquiries, please contact our dedicated pharmacy support line.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex flex-col gap-5 items-start w-full">
                  <a href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = '/notfound';
                    }}
                    className="flex items-center gap-4 text-gray-600 hover:text-blue-600 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-lg font-medium text-gray-800 group-hover:text-blue-600">info@pharmora.lk</span>
                  </a>
                  <a href="tel:+94112345678" className="flex items-center gap-4 text-gray-600 hover:text-green-600 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-lg font-medium text-gray-800 group-hover:text-green-600">+94 011 234 5678</span>
                  </a>
                  <a href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = '/notfound';
                    }}
                    className="flex items-center gap-4 text-gray-600 hover:text-indigo-600 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <Facebook className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-lg font-medium text-gray-800 group-hover:text-indigo-600">Pharmora Sri Lanka</span>
                  </a>
                  <a href="#" className="flex items-center gap-4 text-gray-600 hover:text-purple-600 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <Globe className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-lg font-medium text-gray-800 group-hover:text-purple-600">www.pharmora.lk</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}