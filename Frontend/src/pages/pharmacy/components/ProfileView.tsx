import { motion } from 'motion/react';
import { useState } from 'react';
import { User, MapPin, Phone, Mail, Clock, Edit2, Save, Building, Globe } from 'lucide-react';

export function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    pharmacyName: 'Central Pharmacy',
    ownerName: 'Dr. John Smith',
    contactPersonName: 'Jane Doe',
    contactPersonTitle: 'Manager',
    contactPersonPhone: '+1 (555) 987-6543',
    email: 'contact@centralpharmacy.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Downtown',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    licenseNumber: 'PHM-2024-12345',
    established: '2010',
    businessRegNumber: 'BRN-2024-98765',
    website: 'www.centralpharmacy.com',
    description: 'We are a trusted community pharmacy serving the downtown area for over a decade. Our mission is to provide quality healthcare products and exceptional customer service.',
    operatingHours: {
      weekdays: '8:00 AM - 8:00 PM',
      saturday: '9:00 AM - 6:00 PM',
      sunday: '10:00 AM - 4:00 PM',
    },
  });

  const handleSave = () => {
    console.log('Saving profile:', profile);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-gray-900 text-xl sm:text-2xl">Pharmacy Profile</h2>
          <p className="text-gray-600 text-sm">View and manage your pharmacy information</p>
        </div>
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm sm:w-auto w-full"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </motion.button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-8 text-white shadow-sm"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-4xl text-blue-950">
            {profile.pharmacyName.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-white mb-2">{profile.pharmacyName}</h2>
            <p className="text-lime-400 text-sm">{profile.ownerName}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4" />
                <span>License: {profile.licenseNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>Est. {profile.established}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 border border-gray-200/50 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-50">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-gray-900">Contact Information</h3>
            <p className="text-gray-500 text-sm">How customers can reach you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contact Person Name */}
                    <div>
                      <label className="block text-gray-700 mb-2 text-sm">Contact Person Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.contactPersonName}
                          onChange={(e) => setProfile({ ...profile, contactPersonName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
                          <User className="w-4 h-4 text-gray-400" />
                          {profile.contactPersonName}
                        </div>
                      )}
                    </div>

                    {/* Contact Person Title */}
                    <div>
                      <label className="block text-gray-700 mb-2 text-sm">Contact Person Title</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.contactPersonTitle}
                          onChange={(e) => setProfile({ ...profile, contactPersonTitle: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
                          <User className="w-4 h-4 text-gray-400" />
                          {profile.contactPersonTitle}
                        </div>
                      )}
                    </div>

                    {/* Contact Person Phone */}
                    <div>
                      <label className="block text-gray-700 mb-2 text-sm">Contact Person Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profile.contactPersonPhone}
                          onChange={(e) => setProfile({ ...profile, contactPersonPhone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {profile.contactPersonPhone}
                        </div>
                      )}
                    </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">Pharmacy Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            ) : (
              <div className="flex items-center gap-2 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                {profile.phone}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 text-sm">Pharmacy Email Address</label>
            <div className="flex items-center gap-2 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              {profile.email}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">Website</label>
            <div className="flex items-center gap-2 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
              <Globe className="w-4 h-4 text-gray-400" />
              {profile.website}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">License Number</label>
            <div className="flex items-center gap-2 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
              <Building className="w-4 h-4 text-gray-400" />
              {profile.licenseNumber}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-sm">Business Registration Number</label>
            <div className="flex items-center gap-2 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
              <Building className="w-4 h-4 text-gray-400" />
              {profile.businessRegNumber}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Location */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 border border-gray-200/50 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-lime-50">
            <MapPin className="w-5 h-5 text-lime-600" />
          </div>
          <div>
            <h3 className="text-gray-900">Location</h3>
            <p className="text-gray-500 text-sm">Your pharmacy address</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Street Address</label>
            <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{profile.address}</div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">City</label>
            <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{profile.city}</div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">State</label>
            <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{profile.state}</div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">ZIP Code</label>
            <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{profile.zipCode}</div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Country</label>
            <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{profile.country}</div>
          </div>
        </div>
      </motion.div>

      {/* Operating Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 border border-gray-200/50 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-50">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-gray-900">Operating Hours</h3>
            <p className="text-gray-500 text-sm">When your pharmacy is open</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: 'weekdays', label: 'Monday - Friday' },
            { key: 'saturday', label: 'Saturday' },
            { key: 'sunday', label: 'Sunday' },
          ].map((day) => (
            <div key={day.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">{day.label}</span>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.operatingHours[day.key as keyof typeof profile.operatingHours]}
                  onChange={(e) => setProfile({
                    ...profile,
                    operatingHours: { ...profile.operatingHours, [day.key]: e.target.value }
                  })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-white bg-white/20 placeholder:text-white/60"
                  style={{ backgroundColor: 'white', color: '#222' }}
                />
              ) : (
                <span className="text-gray-900">{profile.operatingHours[day.key as keyof typeof profile.operatingHours]}</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 border border-gray-200/50 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-green-50">
            <User className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-gray-900">About Your Pharmacy</h3>
            <p className="text-gray-500 text-sm">Tell customers about your pharmacy</p>
          </div>
        </div>

        {isEditing ? (
          <textarea
            value={profile.description}
            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-900"
          />
        ) : (
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{profile.description}</p>
        )}
      </motion.div>
    </div>
  );
}