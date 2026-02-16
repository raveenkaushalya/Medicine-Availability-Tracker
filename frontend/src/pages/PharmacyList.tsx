import medicineIcon from '../assets/images/medicine-icon.png';
import medicineIconSmall from '../assets/images/medicine-icon-small.png';
import pharmacyCross from '../assets/images/pharmacy-cross.png';
import pillIcon from '../assets/images/pill-icon.png';
import { MapPin, Phone, Clock, Package, DollarSign, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import heroImage from '../assets/images/hero-pills.png';
import pharmacyLogo from '../assets/images/logo.png';

interface Drug {
  drugName: string;
  brandName?: string;
  quantity: number;
  price: number;
  inStock: boolean;
  category: string;
  dosage: string;
  updatedAt?: string;
}

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  distance: string;
  inventory: Drug[];
  matchingDrugs?: Drug[];
}

interface PharmacyListProps {
  pharmacies: (Pharmacy | null)[];
  searchQuery: string;
}

// Helper function to generate random recent timestamps
function getRecentTimestamp() {
  const now = new Date();
  const minutesAgo = Math.floor(Math.random() * 120); // Random time within last 2 hours
  const timestamp = new Date(now.getTime() - minutesAgo * 60000);

  if (minutesAgo < 60) {
    return `${minutesAgo} min ago`;
  } else {
    const hoursAgo = Math.floor(minutesAgo / 60);
    return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  }
}

export function PharmacyList({ pharmacies, searchQuery }: PharmacyListProps) {
  // Helper to get minutes since update
  function getMinutesAgo(updatedAt?: string) {
    if (!updatedAt) return '-';
    const updated = new Date(updatedAt);
    if (isNaN(updated.getTime())) return '-';
    const now = new Date();
    const diffMs = now.getTime() - updated.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const hours = Math.floor(diffMin / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  if (pharmacies.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-6 sm:p-12 shadow-sm border border-gray-200 text-center"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-gray-900 mb-2 text-lg sm:text-xl">No Results Found</h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Try searching for a different medication or check back later.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {pharmacies.map((pharmacy, index) => {
          if (!pharmacy) return null;

          const drugsToDisplay = pharmacy.matchingDrugs || pharmacy.inventory;

          return (
            <motion.div
              key={pharmacy.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                layout: { duration: 0.3 }
              }}
              className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
            >
              {/* Pharmacy Header Card */}
              <div className="p-6 bg-[#F2F9FA] shadow-md border-b border-gray-200">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Pharmacy Icon/Avatar */}
                    <div className="w-20 h-20 rounded-[24px] flex items-center justify-center flex-shrink-0 shadow-lg p-2 border-2 border-[#0250cf]">
                      <img src={pharmacyCross} alt="Pharmacy" className="w-full h-full object-contain rounded-[16px]" />
                    </div>

                    {/* Pharmacy Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-gray-900 truncate">{pharmacy.name}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#0250cf]" />
                          <span className="text-gray-700">{pharmacy.address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#0250cf]" />
                          <span className="text-gray-700">{pharmacy.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 relative group cursor-pointer">
                          <Clock className="w-3.5 h-3.5 text-[#0250cf]" />
                          {(() => {
                            // Determine open/closed status based on current time and today's hours
                            const d = new Date();
                            const day = d.getDay();
                            let hours = null;
                            if (day >= 1 && day <= 5) {
                              hours = pharmacy.openingHours?.weekdays;
                            } else if (day === 6) {
                              hours = pharmacy.openingHours?.saturday;
                            } else if (day === 0) {
                              hours = pharmacy.openingHours?.sunday;
                            }
                            let isOpen = false;
                            if (hours && hours.open && hours.close) {
                              // Parse "HH:mm" to minutes since midnight
                              const [openH, openM] = hours.open.split(":").map(Number);
                              const [closeH, closeM] = hours.close.split(":").map(Number);
                              const nowMins = d.getHours() * 60 + d.getMinutes();
                              const openMins = openH * 60 + openM;
                              const closeMins = closeH * 60 + closeM;
                              if (openMins < closeMins) {
                                isOpen = nowMins >= openMins && nowMins < closeMins;
                              } else if (openMins > closeMins) {
                                // Overnight (e.g. 22:00-06:00)
                                isOpen = nowMins >= openMins || nowMins < closeMins;
                              }
                            }
                            return (
                              <span className={`font-semibold ${isOpen ? 'text-green-700' : 'text-red-700'}`}>{isOpen ? 'Open now' : 'Closed'}</span>
                            );
                          })()}
                          {/* Show Mon-Fri, Sat, Sun hours as 3 horizontal labels */}
                          <div className="flex gap-1 ml-2">
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 whitespace-nowrap">
                              Mon-Fri: {pharmacy.openingHours?.weekdays?.open && pharmacy.openingHours?.weekdays?.close ? `${pharmacy.openingHours.weekdays.open} - ${pharmacy.openingHours.weekdays.close}` : 'Not set'}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 whitespace-nowrap">
                              Sat: {pharmacy.openingHours?.saturday?.open && pharmacy.openingHours?.saturday?.close ? `${pharmacy.openingHours.saturday.open} - ${pharmacy.openingHours.saturday.close}` : 'Not set'}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 whitespace-nowrap">
                              Sun: {pharmacy.openingHours?.sunday?.open && pharmacy.openingHours?.sunday?.close ? `${pharmacy.openingHours.sunday.open} - ${pharmacy.openingHours.sunday.close}` : 'Not set'}
                            </span>
                          </div>
                          {/* Popover for full opening hours (no label) */}
                          <div className="absolute left-0 top-7 z-20 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[220px] text-xs text-gray-900">
                            <div className="font-bold mb-2 text-[#0250cf]">Opening Hours</div>
                            {pharmacy.openingHours && typeof pharmacy.openingHours === 'object' ? (
                              <table className="w-full text-left">
                                <tbody>
                                  <tr><td className="pr-2">Mon-Fri:</td><td>{pharmacy.openingHours.weekdays?.open && pharmacy.openingHours.weekdays?.close ? `${pharmacy.openingHours.weekdays.open} - ${pharmacy.openingHours.weekdays.close}` : 'Not set'}</td></tr>
                                  <tr><td className="pr-2">Saturday:</td><td>{pharmacy.openingHours.saturday?.open && pharmacy.openingHours.saturday?.close ? `${pharmacy.openingHours.saturday.open} - ${pharmacy.openingHours.saturday.close}` : 'Not set'}</td></tr>
                                  <tr><td className="pr-2">Sunday:</td><td>{pharmacy.openingHours.sunday?.open && pharmacy.openingHours.sunday?.close ? `${pharmacy.openingHours.sunday.open} - ${pharmacy.openingHours.sunday.close}` : 'Not set'}</td></tr>
                                </tbody>
                              </table>
                            ) : (
                              <div>Not available</div>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Get Directions Button & Call Button */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${pharmacy.phone}`}
                      className="flex items-center justify-center rounded-full bg-transparent w-10 h-10 border border-[#0250cf]/60 transition-colors"
                      title="Call Pharmacy"
                      style={{ boxShadow: 'none' }}
                    >
                      <Phone className="w-5 h-5" style={{ color: '#0250cf' }} />
                    </a>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (pharmacy.latitude && pharmacy.longitude) {
                          window.open(`https://www.google.com/maps/search/?api=1&query=${pharmacy.latitude},${pharmacy.longitude}`, '_blank');
                        } else {
                          const address = encodeURIComponent(pharmacy.address);
                          window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-[#0250cf] text-white text-sm hover:bg-[#0240b0] transition-colors shadow-md flex-shrink-0 border border-[#0250cf]"
                    >
                      Get Directions
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Medications Grid */}
              <div className="p-6 bg-[#F2F9FA]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {drugsToDisplay.map((drug, drugIndex) => {
                    const timestamp = getRecentTimestamp();
                    const orderNum = String(drugIndex + 1).padStart(2, '0');

                    return (
                      <motion.div
                        key={`${pharmacy.id}-${drug.drugName}-${drugIndex}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: index * 0.1 + drugIndex * 0.05,
                          duration: 0.3
                        }}
                        whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.15)" }}
                        className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        {/* Top Section - Order Number & Status */}
                        <div className="flex items-center justify-between px-4 pt-4 pb-3 bg-[#FFFFFF]">
                          <span className="text-sm text-gray-500">#{orderNum}</span>
                          <span className={`px-3 py-1 rounded-full text-xs ${drug.inStock
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            {drug.inStock ? 'Available' : 'Out of Stock'}
                          </span>
                        </div>

                        {/* Middle Section - Drug Info */}
                        <div className="px-4 pb-4 bg-[#FFFFFF]">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 p-1`}>
                              <img src={medicineIcon} alt="Medication" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4
                                className="text-gray-900 mb-1 break-words whitespace-pre-line leading-snug text-base sm:text-lg font-bold"
                                style={{
                                  fontSize: drug.drugName.length > 25 ? '1rem' : '1.1rem',
                                  minHeight: drug.drugName.length > 25 ? '2.4em' : '1.2em',
                                  maxWidth: '100%',
                                  wordBreak: 'break-word',
                                  whiteSpace: 'pre-line',
                                }}
                              >
                                {drug.drugName}
                              </h4>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">{drug.category}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-600 font-medium">{drug.brandName || '-'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Price & Timestamp */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Price</p>
                              <p className="text-gray-900 flex items-center">
                                <span>{Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(drug.price)}</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 mb-0.5">Updated</p>
                              <p className="text-xs text-gray-700">{getMinutesAgo(drug.updatedAt)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Color Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${drug.inStock
                          ? 'bg-gradient-to-b from-green-500 to-green-600'
                          : 'bg-gradient-to-b from-red-500 to-red-600'
                          }`}></div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}