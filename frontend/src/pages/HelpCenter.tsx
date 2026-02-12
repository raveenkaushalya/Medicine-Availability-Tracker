import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, CreditCard, Shield, User, Building2, Bell, Phone, Mail, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet';


export function HelpCenter() {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('General');

  const allFaqs = [
    {
      category: 'For Users',
      categoryColor: 'from-blue-500 to-blue-600',
      question: 'How do I search for medications?',
      answer: 'Simply enter the medication name in the search bar on the home page. Our system will show you all pharmacies that have the medication in stock, along with pricing and availability information.'
    },
    {
      category: 'For Users',
      categoryColor: 'from-blue-500 to-blue-600',
      question: 'Is the medication pricing accurate?',
      answer: 'Pharmacy owners update their pricing regularly. However, we recommend calling the pharmacy to confirm the price before visiting, as prices may change due to various factors.'
    },
    {
      category: 'For Users',
      categoryColor: 'from-blue-500 to-blue-600',
      question: 'How do I know if a pharmacy has the medication in stock?',
      answer: 'Each pharmacy listing shows real-time stock status. Green indicators mean "In Stock" and the quantity available is displayed. We recommend calling ahead for urgent needs.'
    },
    {
      category: 'For Users',
      categoryColor: 'from-blue-500 to-blue-600',
      question: 'Can I order medications through PharmConnect?',
      answer: 'PharmConnect is currently an information platform. You\'ll need to contact the pharmacy directly via phone or visit in person to purchase medications.'
    },
    {
      category: 'For Pharmacy Owners',
      categoryColor: 'from-green-500 to-emerald-600',
      question: 'How do I register my pharmacy?',
      answer: 'Click on "Pharmacy Owner" in the footer, then select "Register New Pharmacy". You\'ll need your NMRA License Number, Business Registration Number, and other business details. After submission, our admin team will review and approve your application.'
    },
    {
      category: 'For Pharmacy Owners',
      categoryColor: 'from-green-500 to-emerald-600',
      question: 'How long does approval take?',
      answer: 'Most pharmacy registrations are reviewed within 2-3 business days. You\'ll receive an email notification once your pharmacy is approved and live on the platform.'
    },
    {
      category: 'For Pharmacy Owners',
      categoryColor: 'from-green-500 to-emerald-600',
      question: 'How do I update my inventory?',
      answer: 'Once logged in to your pharmacy dashboard, you can add, update, or remove medications from your inventory. We recommend updating your stock levels daily for accuracy.'
    },
    {
      category: 'For Pharmacy Owners',
      categoryColor: 'from-green-500 to-emerald-600',
      question: 'Is there a fee to list my pharmacy?',
      answer: 'PharmConnect is currently free for pharmacy owners. We may introduce premium features in the future, but basic listing will always remain free.'
    },
    {
      category: 'For Pharmacy Owners',
      categoryColor: 'from-green-500 to-emerald-600',
      question: 'Can I manage multiple pharmacy locations?',
      answer: 'Yes! Each location needs a separate registration with its own NMRA license number. You can manage all locations from a single account.'
    },
    {
      category: 'Account & Security',
      categoryColor: 'from-purple-500 to-indigo-600',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page. Enter your registered email address, and we\'ll send you a password reset link. The link expires after 24 hours.'
    },
    {
      category: 'Account & Security',
      categoryColor: 'from-purple-500 to-indigo-600',
      question: 'Is my personal information secure?',
      answer: 'Yes. We use industry-standard encryption (SSL/TLS) to protect your data. We never share your personal information with third parties without your consent. Read our Privacy Policy for more details.'
    },
    {
      category: 'Account & Security',
      categoryColor: 'from-purple-500 to-indigo-600',
      question: 'Can I delete my account?',
      answer: 'Yes. Contact our support team at support@pharmconnect.lk to request account deletion. For pharmacy accounts, please note that this will remove your listings from the platform.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Help Center | Pharmacy Availability Tracker</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-[128px] pb-12 lg:pb-24" style={{ paddingTop: '110px' }}>
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h1 className="text-gray-900 mb-6 text-4xl sm:text-5xl font-bold tracking-tight">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Have questions? We're here to help. Find answers to the most common questions about using PharmConnect.
            </p>
            <p className="text-gray-600 font-medium">
              Can't find what you're looking for?{' '}
              <a href="#contact" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Chat to our friendly team!
              </a>
            </p>
          </motion.div>

          {/* Category Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4 mb-12 flex-wrap"
          >
            {['General', 'For Users', 'For Pharmacies', 'Account & Security'].map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedFaq(null);
                }}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                  ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20 hover:bg-blue-700'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* FAQ Accordion List */}
          <div className="space-y-4 mb-20 max-w-4xl mx-auto">
            {allFaqs
              .filter((faq) => {
                if (selectedCategory === 'General') return true;
                if (selectedCategory === 'For Pharmacies') return faq.category === 'For Pharmacy Owners';
                return faq.category === selectedCategory;
              })
              .map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${selectedFaq === index ? 'border-blue-200 shadow-md ring-1 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <button
                    onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                    className="w-full flex items-center gap-6 p-6 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selectedFaq === index ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {index === 0 && <HelpCircle className="w-6 h-6" />}
                      {index === 1 && <CreditCard className="w-6 h-6" />}
                      {index === 2 && <Shield className="w-6 h-6" />}
                      {index === 3 && <User className="w-6 h-6" />}
                      {index === 4 && <Building2 className="w-6 h-6" />}
                      {index === 5 && <Bell className="w-6 h-6" />}
                      {index > 5 && <HelpCircle className="w-6 h-6" />}
                    </div>

                    {/* Question */}
                    <div className="flex-1">
                      <span className={`text-xs font-semibold uppercase tracking-wider mb-1 block ${faq.category === 'For Users' ? 'text-blue-600' :
                        faq.category === 'For Pharmacy Owners' ? 'text-green-600' :
                          'text-purple-600'
                        }`}>
                        {faq.category}
                      </span>
                      <h3 className={`text-lg sm:text-xl font-semibold transition-colors ${selectedFaq === index ? 'text-blue-900' : 'text-gray-900'}`}>
                        {faq.question}
                      </h3>
                    </div>

                    {/* Chevron */}
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${selectedFaq === index ? 'rotate-180 text-blue-600' : ''
                        }`}
                    />
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {selectedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0 pl-[5.5rem]">
                          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
          </div>

          {/* Spacer before Contact Section */}
          <div className="h-16"></div>

          {/* Contact Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-16 max-w-5xl mx-auto"
            id="contact"
          >
            <div className="text-center mb-12">
              <h2 className="text-gray-900 mb-4 text-3xl font-bold">Still Need Help?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our dedicated support team is ready to assist you. Choose your preferred way to reach out.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.a
                href="mailto:support@pharmora.lk"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 300 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 text-center group hover:bg-blue-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-200 ease-out cursor-pointer block"
              >
                <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-200">
                  <Mail className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-all duration-200" />
                </div>
                <h3 className="text-gray-900 text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-200">Email Support</h3>
                <p className="text-gray-500 mb-6">Best for detailed inquiries</p>
                <span className="text-blue-600 font-semibold group-hover:text-blue-700 text-lg">
                  support@pharmora.lk
                </span>
              </motion.a>

              <motion.a
                href="tel:+94112345678"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, type: "spring", stiffness: 300 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 text-center group hover:bg-green-100 hover:border-green-300 hover:shadow-xl hover:shadow-green-100/50 transition-all duration-200 ease-out cursor-pointer block"
              >
                <div className="bg-green-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-200">
                  <Phone className="w-6 h-6 text-green-600 group-hover:scale-110 transition-all duration-200" />
                </div>
                <h3 className="text-gray-900 text-xl font-bold mb-2 group-hover:text-green-600 transition-colors duration-200">Phone Support</h3>
                <p className="text-gray-500 mb-6">Available 8am - 8pm daily</p>
                <span className="text-green-600 font-semibold group-hover:text-green-700 text-lg">
                  +94 011 234 5678
                </span>
              </motion.a>

              <motion.a
                href="https://wa.me/94789405488"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, type: "spring", stiffness: 300 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 text-center group hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-200 ease-out cursor-pointer block"
              >
                <div className="bg-emerald-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-200">
                  <svg className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-all duration-200" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <h3 className="text-gray-900 text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors duration-200">WhatsApp Chat</h3>
                <p className="text-gray-500 mb-6">Quick answers & updates</p>
                <span className="text-emerald-600 font-semibold group-hover:text-emerald-700 text-lg">
                  +94 77 123 4567
                </span>
              </motion.a>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}