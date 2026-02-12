import { motion } from 'motion/react';
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale, UserX } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-[128px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-gray-900 mb-3">Terms of Service</h1>
          <p className="text-gray-600">Last updated: December 5, 2025</p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6"
        >
          <p className="text-gray-600 leading-relaxed mb-4">
            Welcome to Pharmora. These Terms of Service ("Terms") govern your access to and
            use of our platform. By accessing or using Pharmora, you agree to be bound by
            these Terms.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Important:</strong> Please read these terms carefully before using our
              services. If you do not agree to these terms, you may not access or use Pharmora.
            </p>
          </div>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {[
            {
              icon: CheckCircle,
              title: 'Acceptance of Terms',
              content: [
                'By creating an account or using Pharmora, you confirm that you are at least 18 years old and have the legal capacity to enter into these Terms.',
                'You agree to comply with all applicable local, state, national, and international laws and regulations.',
                'We reserve the right to modify these Terms at any time. Continued use of the platform constitutes acceptance of modified Terms.'
              ]
            },
            {
              icon: UserX,
              title: 'User Accounts',
              content: [
                'You are responsible for maintaining the confidentiality of your account credentials.',
                'You agree to provide accurate, current, and complete information during registration.',
                'You must notify us immediately of any unauthorized use of your account.',
                'We reserve the right to suspend or terminate accounts that violate these Terms.',
                'One person or entity may not maintain multiple accounts without our permission.'
              ]
            },
            {
              icon: AlertTriangle,
              title: 'Prohibited Activities',
              content: [
                'You may not use Pharmora for any illegal or unauthorized purpose.',
                'You may not attempt to gain unauthorized access to our systems or networks.',
                'You may not transmit viruses, malware, or any harmful code through our platform.',
                'You may not scrape, harvest, or collect user information without permission.',
                'You may not impersonate another person or entity.',
                'You may not post false, misleading, or fraudulent medication information.',
                'You may not interfere with or disrupt the integrity of our services.'
              ]
            },
            {
              icon: Scale,
              title: 'Pharmacy Owner Responsibilities',
              content: [
                'Pharmacy owners must provide accurate and up-to-date medication inventory information.',
                'All pharmacies must maintain valid NMRA licenses and business registrations.',
                'Pricing information must be accurate and reflect current retail prices.',
                'Pharmacy owners must respond to inquiries in a timely and professional manner.',
                'Any changes to business information must be updated within 7 business days.',
                'Pharmacies found providing false information will be removed from the platform.'
              ]
            },
            {
              icon: FileText,
              title: 'Intellectual Property',
              content: [
                'All content on Pharmora, including text, graphics, logos, and software, is owned by or licensed to Pharmora.',
                'You may not copy, modify, distribute, or create derivative works from our content without permission.',
                'The Pharmora name and logo are trademarks and may not be used without authorization.',
                'User-generated content remains the property of the user, but you grant us a license to use it on our platform.'
              ]
            },
            {
              icon: XCircle,
              title: 'Disclaimer of Warranties',
              content: [
                'Pharmora is provided "as is" and "as available" without warranties of any kind.',
                'We do not guarantee the accuracy, completeness, or timeliness of medication information.',
                'We are not responsible for the quality, safety, or legality of medications sold by pharmacies.',
                'Users should verify all medication information with healthcare professionals.',
                'We do not guarantee uninterrupted or error-free service.',
                'Pharmora is an information platform and does not prescribe, dispense, or recommend medications.'
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
          transition={{ delay: 0.9 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mt-6"
        >
          <h2 className="text-gray-900 mb-4">Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            To the maximum extent permitted by law, Pharmora shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages, or any loss of
            profits or revenues, whether incurred directly or indirectly, or any loss of data,
            use, goodwill, or other intangible losses resulting from:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-indigo-600">
              Your use or inability to use our services
            </li>
            <li className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-indigo-600">
              Unauthorized access to or alteration of your data
            </li>
            <li className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-indigo-600">
              Statements or conduct of any third party on the platform
            </li>
            <li className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-indigo-600">
              Any medication purchased or not purchased based on information from our platform
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mt-6"
        >
          <h2 className="text-gray-900 mb-4">Indemnification</h2>
          <p className="text-gray-600 leading-relaxed">
            You agree to indemnify, defend, and hold harmless Pharmora and its officers,
            directors, employees, and agents from any claims, losses, damages, liabilities,
            and expenses (including legal fees) arising from your use of the platform or
            violation of these Terms.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mt-6"
        >
          <h2 className="text-gray-900 mb-4">Governing Law</h2>
          <p className="text-gray-600 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of
            Sri Lanka. Any disputes arising from these Terms shall be subject to the exclusive
            jurisdiction of the courts of Colombo, Sri Lanka.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mt-6"
        >
          <h2 className="text-gray-900 mb-4">Termination</h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to suspend or terminate your access to Pharmora at any
            time, with or without notice, for any reason, including violation of these Terms.
            Upon termination, all rights granted to you will immediately cease.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-[#EDFAF0] rounded-xl p-8 mt-8 text-center"
        >
          <h2 className="text-emerald-900 mb-3 font-semibold text-xl">Questions About Our Terms?</h2>
          <p className="text-emerald-800 mb-4">
            If you have questions or concerns about these Terms of Service, please contact us.
          </p>
          <div className="text-emerald-700 font-medium">
            <p>Email: legal@pharmora.lk</p>
            <p>Phone: +94 011 234 5678</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}