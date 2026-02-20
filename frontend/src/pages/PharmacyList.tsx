  // Helper to format 24h time ("HH:mm") to 12h am/pm
  function format12Hour(time: string | undefined): string {
    if (!time) return '';
    const [h, m] = time.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return time;
    const ampm = h >= 12 ? 'pm' : 'am';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
  }
import medicineIcon from '../assets/images/medicine-icon.png';
import pharmacyCross from '../assets/images/pharmacy-cross.png';
import { MapPin, Phone, Clock, Package, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  longitude: any;
  latitude: any;
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  distance: string;
  inventory: Drug[];
  matchingDrugs?: Drug[];
  openingHours?: {
    weekdays?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
}

interface PharmacyListProps {
  pharmacies: (Pharmacy | null)[];
  searchQuery: string;
}

// Helper function to generate random recent timestamps

import React, { useState, useRef, useEffect } from 'react';

export function PharmacyList({ pharmacies }: PharmacyListProps) {
  // Helper to format relative time (hours, days, weeks)
  function timeAgo(updatedAt?: string) {
    if (!updatedAt) return '-';
    const updated = new Date(updatedAt);
    if (isNaN(updated.getTime())) return '-';
    const now = new Date();
    const diffMs = now.getTime() - updated.getTime();
    const sec = Math.floor(diffMs / 1000);
    if (sec < 60) return 'just now';
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min} min ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} hour${hr > 1 ? 's' : ''} ago`;
    const day = Math.floor(hr / 24);
    if (day < 7) return `${day} day${day > 1 ? 's' : ''} ago`;
    const week = Math.floor(day / 7);
    if (week < 4) return `${week} week${week > 1 ? 's' : ''} ago`;
    const month = Math.floor(day / 30);
    if (month < 12) return `${month} month${month > 1 ? 's' : ''} ago`;
    const year = Math.floor(day / 365);
    return `${year} year${year > 1 ? 's' : ''} ago`;
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

  // Track expanded pharmacies by id
  const [expandedPharmacies, setExpandedPharmacies] = useState<{ [id: number]: boolean }>({});
  // Track the window start index for each expanded pharmacy
  const [windowStart, setWindowStart] = useState<{ [id: number]: number }>({});
  // Track the window size for each expanded pharmacy
  const [windowSize, setWindowSize] = useState<{ [id: number]: number }>({});
  // How many medicines to show in the window at a time
  const WINDOW_SIZE = 9;
  const WINDOW_STEP = 12;

  // Refs for scroll containers per pharmacy
  const scrollRefs = useRef<{ [id: number]: HTMLDivElement | null }>({});

  // Scroll handler for all pharmacies
  useEffect(() => {
    const handler = (pharmacyId: number, sortedDrugs: Drug[]) => () => {
      if (!expandedPharmacies[pharmacyId] || !scrollRefs.current[pharmacyId]) return;
      const el = scrollRefs.current[pharmacyId];
      if (!el) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
        setWindowSize(prev => {
          const current = prev[pharmacyId] ?? WINDOW_SIZE;
          if (current >= sortedDrugs.length) return prev;
          return { ...prev, [pharmacyId]: Math.min(current + WINDOW_STEP, sortedDrugs.length) };
        });
      }
    };

    // Attach listeners for expanded pharmacies
    const listeners: { [id: number]: () => void } = {};
    pharmacies.forEach(pharmacy => {
      if (!pharmacy) return;
      if (expandedPharmacies[pharmacy.id] && scrollRefs.current[pharmacy.id]) {
        const sortedDrugs = [...(pharmacy.matchingDrugs || pharmacy.inventory)].sort((a, b) => {
          if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return bTime - aTime;
        });
        const fn = handler(pharmacy.id, sortedDrugs);
        listeners[pharmacy.id] = fn;
        scrollRefs.current[pharmacy.id]?.addEventListener('scroll', fn);
      }
    });
    return () => {
      Object.entries(listeners).forEach(([id, fn]) => {
        scrollRefs.current[Number(id)]?.removeEventListener('scroll', fn);
      });
    };
  }, [expandedPharmacies, pharmacies, setWindowSize]);

  // Handler for "Show More" button
  const handleShowMore = (pharmacyId: number) => {
    setExpandedPharmacies(prev => ({ ...prev, [pharmacyId]: true }));
    setWindowStart(prev => ({ ...prev, [pharmacyId]: 0 }));
    setWindowSize(prev => ({ ...prev, [pharmacyId]: 9 }));
  };

  return (
    <div className="space-y-8">
      <AnimatePresence mode="popLayout">
        {pharmacies.map((pharmacy, index) => {
          if (!pharmacy) return null;

          // Sort drugs: in-stock first, then by most recently updated
          const sortedDrugs = [...(pharmacy.matchingDrugs || pharmacy.inventory)].sort((a, b) => {
            if (a.inStock !== b.inStock) {
              return a.inStock ? -1 : 1;
            }
            const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return bTime - aTime;
          });

          const isExpanded = expandedPharmacies[pharmacy.id];
          const start = windowStart[pharmacy.id] ?? 0;
          const size = windowSize[pharmacy.id] ?? 6;
          const drugsToDisplay = isExpanded ? sortedDrugs.slice(start, start + size) : sortedDrugs.slice(0, 6);
          const showShowMore = sortedDrugs.length > 6 && !isExpanded;

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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                    {/* Pharmacy Icon/Avatar */}
                    <div className="w-20 h-20 rounded-[24px] flex items-center justify-center flex-shrink-0 shadow-lg p-2 border-2 border-[#0250cf]">
                      <img src={pharmacyCross} alt="Pharmacy" className="w-full h-full object-contain rounded-[16px]" />
                    </div>

                    {/* Pharmacy Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-gray-900 truncate">{pharmacy.name}</h3>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-[#0250cf]" />
                          <span className="text-gray-700">{pharmacy.address}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Phone className="w-3.5 h-3.5 text-[#0250cf]" />
                          <span className="text-gray-700">{pharmacy.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {(() => {
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
                            if (
                              hours &&
                              typeof hours.open === 'string' &&
                              typeof hours.close === 'string' &&
                              hours.open.trim() !== '' &&
                              hours.close.trim() !== ''
                            ) {
                              const [openH, openM] = hours.open.split(":").map(Number);
                              const [closeH, closeM] = hours.close.split(":").map(Number);
                              const nowMins = d.getHours() * 60 + d.getMinutes();
                              const openMins = openH * 60 + openM;
                              const closeMins = closeH * 60 + closeM;
                              if (openMins < closeMins) {
                                isOpen = nowMins >= openMins && nowMins < closeMins;
                              } else if (openMins > closeMins) {
                                isOpen = nowMins >= openMins || nowMins < closeMins;
                              }
                            }
                            return (
                              <span className={`font-semibold px-2 py-0.5 rounded text-sm ${isOpen ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>{isOpen ? 'Open now' : 'Closed'}</span>
                            );
                          })()}
                        </div>
                      </div>
                      {/* Opening hours below address/phone/closed on all screens */}
                      <div className="flex flex-wrap items-center gap-1 mt-2">
                        <Clock className="w-3.5 h-3.5 text-[#0250cf]" />
                        <div className="flex gap-1 ml-2">
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 whitespace-nowrap">
                            Mon-Fri: {pharmacy.openingHours?.weekdays?.open === '' && pharmacy.openingHours?.weekdays?.close === '' ? 'Closed' : (pharmacy.openingHours?.weekdays?.open && pharmacy.openingHours?.weekdays?.close ? `${format12Hour(pharmacy.openingHours.weekdays.open)} - ${format12Hour(pharmacy.openingHours.weekdays.close)}` : 'Not set')}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 whitespace-nowrap">
                            Sat: {pharmacy.openingHours?.saturday?.open === '' && pharmacy.openingHours?.saturday?.close === '' ? 'Closed' : (pharmacy.openingHours?.saturday?.open && pharmacy.openingHours?.saturday?.close ? `${format12Hour(pharmacy.openingHours.saturday.open)} - ${format12Hour(pharmacy.openingHours.saturday.close)}` : 'Not set')}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 whitespace-nowrap">
                            Sun: {pharmacy.openingHours?.sunday?.open === '' && pharmacy.openingHours?.sunday?.close === '' ? 'Closed' : (pharmacy.openingHours?.sunday?.open && pharmacy.openingHours?.sunday?.close ? `${format12Hour(pharmacy.openingHours.sunday.open)} - ${format12Hour(pharmacy.openingHours.sunday.close)}` : 'Not set')}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Get Directions Button & Call Button - always below opening hours for mobile, right for desktop */}
                  <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4">
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
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    ref={isExpanded ? el => { scrollRefs.current[pharmacy.id] = el; } : undefined}
                    style={isExpanded ? { maxHeight: 480, overflowY: 'auto' } : {}}
                  >
                  {drugsToDisplay.map((drug, drugIndex) => {
                    const orderNum = String((isExpanded ? start : 0) + drugIndex + 1).padStart(2, '0');
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
                              <p className="text-xs text-gray-700">{timeAgo(drug.updatedAt)}</p>
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
                {showShowMore && (
                  <div className="flex justify-center mt-4">
                    <button
                      className="flex items-center justify-center w-32 h-12 rounded-lg bg-transparent text-gray-500 hover:bg-green-100 transition-colors shadow-md border border-black/40"
                      onClick={() => handleShowMore(pharmacy.id)}
                      title="Expand to show more medicines"
                    >
                      <span className="text-sm font-medium mr-1">Show More</span>
                      <ChevronDown className="w-7 h-7" />
                    </button>
                  </div>
                )}
                {/* Loading indicator for windowing */}
                {isExpanded && drugsToDisplay.length < sortedDrugs.length && (
                  <div className="h-8 flex items-center justify-center text-xs text-gray-400">
                    Loading more medicines...
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}