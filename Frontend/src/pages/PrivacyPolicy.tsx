import { motion } from 'motion/react';
import { Shield, Lock, Eye, Database, UserCheck, Bell } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: December 5, 2025</p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6"
        >
          <p className="text-gray-600 leading-relaxed">
            At PharmConnect, we take your privacy seriously. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use our platform.
            Please read this privacy policy carefully. If you do not agree with the terms of
            this privacy policy, please do not access the site.
          </p>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {[
            {
              icon: Database,
              title: 'Information We Collect',
              content: [
                'Personal Information: Name, email address, phone number, and location data when you register or use our services.',
                'Pharmacy Information: For pharmacy owners, we collect business registration details, NMRA license numbers, and inventory data.',
                'Usage Data: Information about how you interact with our platform, including search queries and browsing patterns.',
                'Device Information: IP address, browser type, operating system, and device identifiers.'
              ]
            },
            {
              icon: Eye,
              title: 'How We Use Your Information',
              content: [
                'To provide and maintain our services, including medication search and availability information.',
                'To process pharmacy registrations and verify credentials.',
                'To send you important updates, notifications, and promotional materials (with your consent).',
                'To improve our platform through analytics and user feedback.',
                'To detect, prevent, and address technical issues and fraudulent activity.',
                'To comply with legal obligations and protect our rights.'
              ]
            },
            {
              icon: Lock,
              title: 'Data Security',
              content: [
                'We implement industry-standard security measures to protect your personal information.',
                'All sensitive data is encrypted during transmission using SSL/TLS protocols.',
                'Access to personal information is restricted to authorized personnel only.',
                'We regularly review and update our security practices to ensure data protection.',
                'However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.'
              ]
            },
            {
              icon: UserCheck,
              title: 'Information Sharing',
              content: [
                'We do not sell, trade, or rent your personal information to third parties.',
                'Pharmacy Information: Your search queries may be shared with pharmacies to provide accurate availability information.',
                'Service Providers: We may share data with trusted third-party service providers who assist in operating our platform.',
                'Legal Requirements: We may disclose information when required by law or to protect our rights and safety.',
                'Business Transfers: In the event of a merger or acquisition, your information may be transferred to the new entity.'
              ]
            },
            {
              icon: Bell,
              title: 'Your Rights',
              content: [
                'Access: You have the right to request access to the personal information we hold about you.',
                'Correction: You can request correction of inaccurate or incomplete information.',
                'Deletion: You may request deletion of your personal information, subject to legal obligations.',
                'Opt-Out: You can opt out of marketing communications at any time.',
                'Data Portability: You have the right to request a copy of your data in a portable format.',
                'To exercise these rights, please contact us at privacy@pharmconnect.lk'
              ]
            }
          ].map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-indigo-100 p-3 rounded-lg flex-shrink-0">
                  <section.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-gray-900">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li key={i} className="text-gray-600 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-indigo-600">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Additional Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mt-6"
        >
          <h2 className="text-gray-900 mb-4">Cookies and Tracking</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We use cookies and similar tracking technologies to track activity on our platform
            and store certain information. You can instruct your browser to refuse all cookies
            or to indicate when a cookie is being sent.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mt-6"
        >
          <h2 className="text-gray-900 mb-4">Children's Privacy</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Our service is not intended for children under the age of 13. We do not knowingly
            collect personal information from children under 13. If you become aware that a
            child has provided us with personal information, please contact us.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mt-6"
        >
          <h2 className="text-gray-900 mb-4">Changes to This Privacy Policy</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any
            changes by posting the new Privacy Policy on this page and updating the "Last updated"
            date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 mt-8 text-center text-white"
        >
          <h2 className="text-white mb-3">Questions About Privacy?</h2>
          <p className="text-indigo-100 mb-4">
            If you have questions or concerns about our privacy practices, please contact us.
          </p>
          <div className="text-indigo-100">
            <p>Email: privacy@pharmconnect.lk</p>
            <p>Phone: +94 011 234 5678</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}