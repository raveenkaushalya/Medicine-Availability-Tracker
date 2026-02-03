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
  quantity: number;
  price: number;
  inStock: boolean;
  category: string;
  dosage: string;
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
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#0250cf]" />
                          <span className="text-gray-700">{pharmacy.hours}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Get Directions Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const address = encodeURIComponent(pharmacy.address);
                      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#0250cf] text-white text-sm hover:bg-[#0240b0] transition-colors shadow-md flex-shrink-0 border border-[#0250cf]"
                  >
                    Get Directions
                  </motion.button>
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
                              <h4 className="text-gray-900 mb-1 truncate">{drug.drugName}</h4>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">{drug.category}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-600 font-medium">{drug.dosage}</span>
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
                              <p className="text-xs text-gray-700">{timestamp}</p>
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