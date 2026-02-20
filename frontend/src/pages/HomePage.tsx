import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { PharmacyList } from "./PharmacyList";

import { AIDrugInfo } from "./AIDrugInfo";
import { PharmacyOwnerDashboard } from "./pharmacy/PharmacyOwnerDashboard";
import { PharmacyAuth } from "./pharmacy/PharmacyAuth";
import { AboutUs } from "./AboutUs";
import { PrivacyPolicy } from "./PrivacyPolicy";
import { TermsOfService } from "./TermsOfService";
import { HelpCenter } from "./HelpCenter";
import { ContactUs } from "./ContactUs";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import {
  Pill,
  Stethoscope,
  Heart,
  Shield,
  Clock,
  MapPin,
} from "lucide-react";
import { motion } from "motion/react";
import pillsBackground from "../assets/images/pills-background.png";

// Type definitions





import { useEffect } from "react";
import { apiFetch } from "../utils/api";

// API response type for public pharmacy listing
interface PublicPharmacyAPIResponse {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  type: string;
  isOpen: boolean;
  inventory: Array<{
    medicineId: number;
    drugName: string;
    brandName?: string;
    dosage: string;
    quantity: number;
    price: number;
    category: string;
    inStock: boolean;
    updatedAt?: string;
  }>;
  distance?: string;
  latitude?: number;
  longitude?: number;
  matchingDrugs?: Array<{
    medicineId: number;
    drugName: string;
    brandName?: string;
    dosage: string;
    quantity: number;
    price: number;
    category: string;
    inStock: boolean;
    updatedAt?: string;
  }>;
}

// Fetch pharmacies from backend
function usePharmaciesData() {
  const [pharmacies, setPharmacies] = useState<PublicPharmacyAPIResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setLoading(true);
    apiFetch("/api/public/pharmacies-with-inventory")
      .then((res) => {
        setPharmacies(res.data || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e?.message || "Failed to load pharmacies");
        setLoading(false);
      });
  }, []);
  return { pharmacies, loading, error };
}

export function HomePage() {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);
  const [pharmacyPage, setPharmacyPage] = useState(1);
  const [medicineScrollCount, setMedicineScrollCount] = useState(8);
  const [viewMode, setViewMode] = useState<"user" | "owner" | "admin">("user");
  const [currentPage, setCurrentPage] = useState<
    | "home"
    | "about"
    | "privacy"
    | "terms"
    | "help"
    | "contact"
    | "blog"
    | "jobs"
    | "press"
    | "accessibility"
    | "accessibility"
  >("home");
  const [isPharmacyLoggedIn, setIsPharmacyLoggedIn] = useState(false);

  // Sorting states
  const [sortBy, setSortBy] = useState<"distance" | "none">("none");
  const [filterType, setFilterType] = useState<string>("all");

  // Fetch pharmacies from backend
  const { pharmacies } = usePharmaciesData();

  // Filter pharmacies based on drug availability
  const getFilteredResults = (): PublicPharmacyAPIResponse[] => {
    if (!searchQuery && !selectedDrug) {
      return pharmacies;
    }
    const query = (selectedDrug || searchQuery).toLowerCase();
    return pharmacies
      .map((pharmacy) => {
        const matchingDrugs = pharmacy.inventory.filter((drug: any) =>
          drug.drugName.toLowerCase().includes(query)
        );
        if (matchingDrugs.length > 0) {
          return { ...pharmacy, matchingDrugs };
        }
        return null;
      })
      .filter((pharmacy): pharmacy is Exclude<typeof pharmacy, null> => pharmacy !== null);
  };

  // Apply sorting and filtering
  const getSortedAndFilteredResults = () => {
    let results = getFilteredResults();



    // Filter by pharmacy type
    if (filterType !== "all") {
      results = results.filter((pharmacy) => pharmacy.type === filterType);
    }



    return results;
  };

  // Helper: calculate distance between two lat/lng points (Haversine formula)
  function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Sort pharmacies: open first, then closed, then by latest medicine update time, or by distance if userLocation and sortBy === 'distance'
  let sortedByOpenAndLatest = getSortedAndFilteredResults().slice();
  if (sortBy === 'distance' && userLocation) {
    sortedByOpenAndLatest.sort((a, b) => {
      // If lat/lng missing, push to end
      if (!a.latitude || !a.longitude) return 1;
      if (!b.latitude || !b.longitude) return -1;
      const distA = getDistance(userLocation.lat, userLocation.lng, a.latitude as number, a.longitude as number);
      const distB = getDistance(userLocation.lat, userLocation.lng, b.latitude as number, b.longitude as number);
      return distA - distB;
    });
  } else {
    sortedByOpenAndLatest.sort((a: PublicPharmacyAPIResponse, b: PublicPharmacyAPIResponse) => {
      if (a.isOpen && !b.isOpen) return -1;
      if (!a.isOpen && b.isOpen) return 1;
      const getLatest = (pharmacy: PublicPharmacyAPIResponse) => {
        const drugs = pharmacy.matchingDrugs || pharmacy.inventory;
        return Math.max(...drugs.map((drug: any) => new Date(drug.updatedAt || 0).getTime()));
      };
      return getLatest(b) - getLatest(a);
    });
  }
  // Map backend response to PharmacyList type (add distance, ensure inStock is boolean, map updated_at, parse openingHours)
  const mappedResults = sortedByOpenAndLatest.map((pharmacy: PublicPharmacyAPIResponse) => {
    let openingHours = undefined;
    if (pharmacy.hours) {
      try {
        const obj = typeof pharmacy.hours === 'string' ? JSON.parse(pharmacy.hours) : pharmacy.hours;
        openingHours = {
          weekdays: obj.weekdays || { open: '', close: '' },
          saturday: obj.saturday || { open: '', close: '' },
          sunday: obj.sunday || { open: '', close: '' },
        };
      } catch {
        openingHours = undefined;
      }
    }
    return {
      ...pharmacy,
      distance: pharmacy.distance || '-',
      inventory: pharmacy.inventory.map(drug => ({
        ...drug,
        inStock: Boolean(drug.inStock),
      })),
      ...(pharmacy.matchingDrugs
        ? {
            matchingDrugs: pharmacy.matchingDrugs.map((drug: any) => ({
              ...drug,
              inStock: Boolean(drug.inStock),
            })),
          }
        : {}),
      openingHours,
      longitude: pharmacy.longitude ?? 0, // Ensure longitude is always present
      latitude: pharmacy.latitude ?? 0,   // Ensure latitude is always present
    };
  });

  // Get unique pharmacy types
  const pharmacyTypes = Array.from(new Set(pharmacies.map((p) => p.type)));

  // Pagination for pharmacies (default view)
  const pharmaciesPerPage = 8;
  const paginatedPharmacies = mappedResults.slice((pharmacyPage - 1) * pharmaciesPerPage, pharmacyPage * pharmaciesPerPage);

  // Infinite scroll for medicine search
  const isMedicineSearch = !!(searchQuery || selectedDrug);
  const medicineResults = isMedicineSearch ? mappedResults.slice(0, medicineScrollCount) : [];

  // Infinite scroll handler
  const handleMedicineScroll = () => {
    if (!isMedicineSearch) return;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.body.offsetHeight;
    if (scrollY + windowHeight >= docHeight - 200) {
      setMedicineScrollCount((prev) => Math.min(prev + 8, mappedResults.length));
    }
  };

  useEffect(() => {
    if (isMedicineSearch) {
      window.addEventListener("scroll", handleMedicineScroll);
      return () => window.removeEventListener("scroll", handleMedicineScroll);
    }
  }, [isMedicineSearch, medicineScrollCount, mappedResults.length]);

  // Reset scroll count when new search
  useEffect(() => {
    setMedicineScrollCount(8);
  }, [searchQuery, selectedDrug]);

  // Reset page when new filter
  useEffect(() => {
    setPharmacyPage(1);
  }, [filterType, sortBy]);

  // Handle location permission and fetch
  useEffect(() => {
    if (sortBy === 'distance' && !userLocation) {
      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setLocationError(null);
          },
          () => {
            setLocationError('Location permission denied or unavailable. Please allow location access to sort by nearest pharmacy.');
          }
        );
      } else {
        setLocationError('Geolocation is not supported by your browser.');
      }
    }
  }, [sortBy, userLocation]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar - hide for pharmacy owner when logged in and admin view */}
      {viewMode !== "admin" &&
        !(viewMode === "owner" && isPharmacyLoggedIn) && (
          <Navbar
            viewMode={viewMode}
            currentPage={currentPage}
            onViewModeChange={(mode) => {
              setViewMode(mode);
              setCurrentPage("home");
              if (mode === "owner") {
                setIsPharmacyLoggedIn(false);
              }
            }}
            onPageChange={(page) => setCurrentPage(page as any)}
          />
        )}

      {/* Main Content */}
      {currentPage === "about" ? (
        <AboutUs />
      ) : currentPage === "privacy" ? (
        <PrivacyPolicy />
      ) : currentPage === "terms" ? (
        <TermsOfService />
      ) : currentPage === "help" ? (
        <HelpCenter />
      ) : currentPage === "contact" ? (
        <ContactUs onPageChange={(page) => setCurrentPage(page as any)} />
      ) : viewMode === "user" ? (
        <>
          {/* Hero Section - Redesigned */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden min-h-screen flex items-center"
            style={{
              backgroundImage: `url(${pillsBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/80 to-teal-900/75"></div>

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Floating Medical Icons */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-20 left-[10%] opacity-5"
              >
                <Stethoscope className="w-32 h-32 text-white" />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-32 right-[15%] opacity-5"
              >
                <Pill className="w-24 h-24 text-white" />
              </motion.div>

              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 left-[5%] opacity-5"
              >
                <Heart className="w-20 h-20 text-white" />
              </motion.div>
            </div>

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Content */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Welcome Badge */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 backdrop-blur-sm rounded-full border border-teal-400/30"
                  >
                    <Shield className="w-4 h-4 text-teal-300" />
                    <span className="text-teal-100 text-sm font-medium">
                      WELCOME TO PHARMORA
                    </span>
                  </motion.div>

                  {/* Main Heading */}
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight"
                  >
                    DISCOVER MEDICINES
                    <br />
                    <span className="text-teal-400">
                      INSTANTLY
                    </span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-gray-200 text-lg leading-relaxed max-w-xl"
                  >
                    Find medication availability in real-time
                    across Sri Lanka's leading pharmacies.
                  </motion.p>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow:
                          "0 10px 30px rgba(20, 184, 166, 0.4)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const searchElement =
                          document.querySelector(
                            '[data-search-bar="true"]',
                          );
                        if (searchElement) {
                          searchElement.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                          const input =
                            searchElement.querySelector(
                              "input",
                            );
                          if (input) input.focus();
                        }
                      }}
                      className="px-8 py-4 bg-teal-500 text-white rounded-lg font-medium shadow-lg flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors"
                    >
                      <Pill className="w-5 h-5" />
                      Find Medication
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const pharmacySection =
                          document.querySelector("main");
                        if (pharmacySection) {
                          pharmacySection.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                      className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium border-2 border-white/30 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <Clock className="w-5 h-5" />
                      Browse Pharmacies
                    </motion.button>
                  </motion.div>

                  {/* Trust Indicators */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="flex items-center gap-8 pt-4"
                  >
                    <div className="text-center">
                      <div className="text-3xl text-white">
                        100+
                      </div>
                      <div className="text-sm text-gray-300">
                        Pharmacies
                      </div>
                    </div>
                    <div className="w-px h-12 bg-gray-500"></div>
                    <div className="text-center">
                      <div className="text-3xl text-white">
                        24/7
                      </div>
                      <div className="text-sm text-gray-300">
                        Available
                      </div>
                    </div>
                    <div className="w-px h-12 bg-gray-500"></div>
                    <div className="text-center">
                      <div className="text-3xl text-white">
                        100%
                      </div>
                      <div className="text-sm text-gray-300">
                        Verified
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative hidden lg:block"
                >
                  <div className="relative">
                    {/* Decorative Background Circle */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400/30 to-teal-600/30 rounded-full opacity-30 blur-3xl transform scale-110 mx-[-39px] my-[0px]"></div>

                    {/* Floating Card - Emergency */}
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute top-8 left-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-4 border border-white/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-300">
                            Emergency
                          </div>
                          <div className="font-bold text-white">
                            24/7 Support
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Floating Card - Multiple Locations */}
                    <motion.div
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 4.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute top-8 right-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-4 border border-white/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-300">
                            Nationwide
                          </div>
                          <div className="font-bold text-white">
                            Multiple Locations
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Floating Card - Easy Access */}
                    <motion.div
                      animate={{
                        y: [0, 12, 0],
                      }}
                      transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-4 border border-white/20"
                    >
                      <div className="flex items-center gap-3 px-[7px] py-[0px]">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <Clock className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-300">
                            Anytime
                          </div>
                          <div className="font-bold text-white">
                            Easy Access
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Floating Card - Verified */}
                    <motion.div
                      animate={{
                        y: [0, 10, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-4 border border-white/20"
                    >
                      <div className="flex items-center gap-3 px-[3px] py-[0px]">
                        <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
                          <Shield className="w-6 h-6 text-teal-400" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-300">
                            Quality
                          </div>
                          <div className="font-bold text-white">
                            Certified Partners
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Search Section */}
            <motion.div
              className="mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => {
                  setSearchQuery("");
                  setSelectedDrug(null);
                }}
              />
            </motion.div>

            {/* AI Drug Information - Show when searching */}
            {(searchQuery || selectedDrug) && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <AIDrugInfo
                  drugName={searchQuery || selectedDrug || ""}
                />
              </motion.div>
            )}

            {/* Pharmacy List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {/* Sorting and Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 mb-6">
                {/* Sort by Distance */}
                <select
                  aria-label="Sort by location"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "distance" | "none",
                    )
                  }
                  className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-200 ease-out text-sm font-medium cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10"
                >
                  <option value="none">Sort by Location</option>
                  <option value="distance">
                    Nearest First
                  </option>
                </select>




                {/* Filter by Pharmacy Type */}
                <select
                  aria-label="Filter by pharmacy type"
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value)
                  }
                  className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-200 ease-out text-sm font-medium cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10"
                >
                  <option value="all">All Types</option>
                  {pharmacyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {locationError && sortBy === 'distance' && (
                <div className="bg-red-100 text-red-700 rounded p-3 mb-4 text-center">
                  {locationError}
                </div>
              )}
              <PharmacyList
                pharmacies={isMedicineSearch ? medicineResults : paginatedPharmacies}
                searchQuery={searchQuery || selectedDrug || ""}
              />
              {/* Pagination controls for pharmacy list (not medicine search) */}
              {!isMedicineSearch && (
                <div className="flex justify-center mt-8">
                  <button
                    className="px-4 py-2 mx-2 rounded-lg text-black shadow-md border disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                    style ={{ backgroundColor: pharmacyPage === 1 ? '#DADBDD' : '#25383C', borderColor: pharmacyPage === 1 ? '#DADBDD' : '#25383C' }}
                    disabled={pharmacyPage === 1}
                    onClick={() => setPharmacyPage(pharmacyPage - 1)}
                  >Previous</button>
                  <span className="px-4 py-2 mx-2 text-gray-700">Page {pharmacyPage}</span>
                  <button
                    className="px-4 py-2 mx-2 rounded-lg bg-transparent text-black shadow-md border border-black/30 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                    disabled={pharmacyPage * pharmaciesPerPage >= mappedResults.length}
                    onClick={() => setPharmacyPage(pharmacyPage + 1)}
                  >Next</button>
                </div>
              )}
            </motion.div>
          </main>
        </>
      ) : viewMode === "owner" ? (
        <>
          {!isPharmacyLoggedIn ? (
            <PharmacyAuth
              onLogin={() => setIsPharmacyLoggedIn(true)}
            />
          ) : (
            <PharmacyOwnerDashboard />
          )}
        </>
      ) : null}

      {/* Footer - Shown on all pages except Admin view and Pharmacy Owner Dashboard */}
      {viewMode !== "admin" &&
        !(viewMode === "owner" && isPharmacyLoggedIn) && (
          <Footer
            viewMode={viewMode}
            onViewModeChange={(mode) => {
              setViewMode(mode);
              setCurrentPage("home");
              if (mode === "owner") setIsPharmacyLoggedIn(false);
              if (mode === "owner") setIsPharmacyLoggedIn(false);
            }}
            onPageChange={(page) => setCurrentPage(page as any)}
          />
        )}
    </div>
  );
}