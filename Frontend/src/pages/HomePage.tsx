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
interface Drug {
  drugName: string;
  dosage: string;
  quantity: number;
  price: number;
  inStock: boolean;
  category: string;
}

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  distance: string;
  type: string;
  isOpen: boolean;
  inventory: Drug[];
}

interface PharmacyWithMatchingDrugs extends Pharmacy {
  matchingDrugs?: Drug[];
}

// Mock data for pharmacies and their drug inventory
const pharmacies = [
  {
    id: 1,
    name: "HealthPlus Pharmacy",
    address: "123 Main Street, Downtown",
    phone: "+1 (555) 123-4567",
    hours: "8:00 AM - 10:00 PM",
    distance: "0.5 miles",
    type: "Retail Pharmacy",
    isOpen: true,
    inventory: [
      {
        drugName: "Aspirin",
        dosage: "500mg",
        quantity: 150,
        price: 8.99,
        inStock: true,
        category: "Pain Relief",
      },
      {
        drugName: "Ibuprofen",
        dosage: "200mg",
        quantity: 200,
        price: 12.99,
        inStock: true,
        category: "Pain Relief",
      },
      {
        drugName: "Amoxicillin",
        dosage: "500mg",
        quantity: 45,
        price: 24.99,
        inStock: true,
        category: "Antibiotic",
      },
      {
        drugName: "Lisinopril",
        dosage: "10mg",
        quantity: 0,
        price: 15.99,
        inStock: false,
        category: "Blood Pressure",
      },
      {
        drugName: "Metformin",
        dosage: "500mg",
        quantity: 80,
        price: 18.99,
        inStock: true,
        category: "Diabetes",
      },
    ],
  },
  {
    id: 2,
    name: "CareWell Pharmacy",
    address: "456 Oak Avenue, Midtown",
    phone: "+1 (555) 234-5678",
    hours: "7:00 AM - 11:00 PM",
    distance: "1.2 miles",
    type: "Hospital Pharmacy",
    isOpen: true,
    inventory: [
      {
        drugName: "Aspirin",
        dosage: "500mg",
        quantity: 0,
        price: 9.49,
        inStock: false,
        category: "Pain Relief",
      },
      {
        drugName: "Ibuprofen",
        dosage: "200mg",
        quantity: 120,
        price: 11.99,
        inStock: true,
        category: "Pain Relief",
      },
      {
        drugName: "Amoxicillin",
        dosage: "500mg",
        quantity: 60,
        price: 22.99,
        inStock: true,
        category: "Antibiotic",
      },
      {
        drugName: "Lisinopril",
        dosage: "10mg",
        quantity: 30,
        price: 14.99,
        inStock: true,
        category: "Blood Pressure",
      },
      {
        drugName: "Metformin",
        dosage: "500mg",
        quantity: 100,
        price: 17.99,
        inStock: true,
        category: "Diabetes",
      },
    ],
  },
  {
    id: 3,
    name: "MediQuick Pharmacy",
    address: "789 Pine Road, Uptown",
    phone: "+1 (555) 345-6789",
    hours: "24 Hours",
    distance: "2.0 miles",
    type: "24-Hour Pharmacy",
    isOpen: true,
    inventory: [
      {
        drugName: "Aspirin",
        dosage: "500mg",
        quantity: 300,
        price: 7.99,
        inStock: true,
        category: "Pain Relief",
      },
      {
        drugName: "Ibuprofen",
        dosage: "200mg",
        quantity: 0,
        price: 13.49,
        inStock: false,
        category: "Pain Relief",
      },
      {
        drugName: "Amoxicillin",
        dosage: "500mg",
        quantity: 25,
        price: 25.99,
        inStock: true,
        category: "Antibiotic",
      },
      {
        drugName: "Lisinopril",
        dosage: "10mg",
        quantity: 50,
        price: 16.49,
        inStock: true,
        category: "Blood Pressure",
      },
      {
        drugName: "Metformin",
        dosage: "500mg",
        quantity: 0,
        price: 19.99,
        inStock: false,
        category: "Diabetes",
      },
    ],
  },
  {
    id: 4,
    name: "Wellness Pharmacy",
    address: "321 Elm Street, West Side",
    phone: "+1 (555) 456-7890",
    hours: "9:00 AM - 9:00 PM",
    distance: "2.5 miles",
    type: "Retail Pharmacy",
    isOpen: false,
    inventory: [
      {
        drugName: "Aspirin",
        dosage: "500mg",
        quantity: 100,
        price: 8.49,
        inStock: true,
        category: "Pain Relief",
      },
      {
        drugName: "Ibuprofen",
        dosage: "200mg",
        quantity: 180,
        price: 12.49,
        inStock: true,
        category: "Pain Relief",
      },
      {
        drugName: "Amoxicillin",
        dosage: "500mg",
        quantity: 35,
        price: 23.99,
        inStock: true,
        category: "Antibiotic",
      },
      {
        drugName: "Lisinopril",
        dosage: "10mg",
        quantity: 70,
        price: 15.49,
        inStock: true,
        category: "Blood Pressure",
      },
      {
        drugName: "Metformin",
        dosage: "500mg",
        quantity: 90,
        price: 18.49,
        inStock: true,
        category: "Diabetes",
      },
    ],
  },
  {
    id: 5,
    name: "RxExpress Pharmacy",
    address: "567 Maple Drive, East End",
    phone: "+1 (555) 567-8901",
    hours: "8:00 AM - 8:00 PM",
    distance: "3.1 miles",
    type: "Express Pharmacy",
    isOpen: true,
    inventory: [
      {
        drugName: "Aspirin",
        dosage: "500mg",
        quantity: 75,
        price: 9.99,
        inStock: true,
        category: "Pain Relief",
      },
      {
        drugName: "Ibuprofen",
        dosage: "200mg",
        quantity: 90,
        price: 13.99,
        inStock: true,
        category: "Pain Relief",
      },
      {
        drugName: "Amoxicillin",
        dosage: "500mg",
        quantity: 0,
        price: 26.99,
        inStock: false,
        category: "Antibiotic",
      },
      {
        drugName: "Lisinopril",
        dosage: "10mg",
        quantity: 40,
        price: 17.99,
        inStock: true,
        category: "Blood Pressure",
      },
      {
        drugName: "Metformin",
        dosage: "500mg",
        quantity: 60,
        price: 20.99,
        inStock: true,
        category: "Diabetes",
      },
    ],
  },
];

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);
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
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "closed">("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortByCategory, setSortByCategory] = useState<string>("none");

  // Filter pharmacies based on drug availability
  const getFilteredResults = (): PharmacyWithMatchingDrugs[] => {
    if (!searchQuery && !selectedDrug) {
      return pharmacies as PharmacyWithMatchingDrugs[];
    }

    const query = selectedDrug || searchQuery;
    return pharmacies
      .map((pharmacy): PharmacyWithMatchingDrugs | null => {
        const matchingDrugs = pharmacy.inventory.filter(
          (drug) =>
            drug.drugName
              .toLowerCase()
              .includes(query.toLowerCase()),
        );

        if (matchingDrugs.length > 0) {
          return {
            ...pharmacy,
            matchingDrugs,
          };
        }
        return null;
      })
      .filter((pharmacy): pharmacy is PharmacyWithMatchingDrugs => pharmacy !== null);
  };

  // Apply sorting and filtering
  const getSortedAndFilteredResults = () => {
    let results = getFilteredResults();

    // Filter by status (open/closed)
    if (filterStatus !== "all") {
      results = results.filter((pharmacy) => {
        if (filterStatus === "open") return pharmacy.isOpen;
        if (filterStatus === "closed") return !pharmacy.isOpen;
        return true;
      });
    }

    // Filter by pharmacy type
    if (filterType !== "all") {
      results = results.filter(
        (pharmacy) => pharmacy.type === filterType,
      );
    }

    // Filter by medicine category (if searching)
    if (
      filterCategory !== "all" &&
      (searchQuery || selectedDrug)
    ) {
      results = results.filter((pharmacy) => {
        if (pharmacy.matchingDrugs) {
          return pharmacy.matchingDrugs.some(
            (drug) => drug.category === filterCategory,
          );
        }
        return false;
      });
    }

    // Sort by distance
    if (sortBy === "distance") {
      results = results.sort((a, b) => {
        const distanceA = parseFloat(a.distance);
        const distanceB = parseFloat(b.distance);
        return distanceA - distanceB;
      });
    }

    // Sort by medicine category availability
    if (sortByCategory !== "none") {
      results = results.sort((a, b) => {
        // Count in-stock items for the selected category
        const countA = a.inventory
          .filter(
            (drug) =>
              drug.category === sortByCategory && drug.inStock,
          )
          .reduce((sum, drug) => sum + drug.quantity, 0);

        const countB = b.inventory
          .filter(
            (drug) =>
              drug.category === sortByCategory && drug.inStock,
          )
          .reduce((sum, drug) => sum + drug.quantity, 0);

        return countB - countA; // Descending order (most stock first)
      });
    }

    return results;
  };

  const filteredResults = getSortedAndFilteredResults();

  // Get unique pharmacy types
  const pharmacyTypes = Array.from(
    new Set(pharmacies.map((p) => p.type)),
  );

  // Get unique medicine categories
  const medicineCategories = Array.from(
    new Set(
      pharmacies.flatMap((p) =>
        p.inventory.map((drug) => drug.category),
      ),
    ),
  );



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

                {/* Sort by Medicine Category */}
                <select
                  aria-label="Sort by medicine category"
                  value={sortByCategory}
                  onChange={(e) =>
                    setSortByCategory(e.target.value)
                  }
                  className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-200 ease-out text-sm font-medium cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10"
                >
                  <option value="none">
                    Medicine Category
                  </option>
                  {medicineCategories.map((category) => (
                    <option key={category} value={category}>
                      Most {category} Stock
                    </option>
                  ))}
                </select>

                {/* Filter by Medicine Category - Only show when searching */}
                {(searchQuery || selectedDrug) && (
                  <select
                    aria-label="Filter by medicine category"
                    value={filterCategory}
                    onChange={(e) =>
                      setFilterCategory(e.target.value)
                    }
                    className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-200 ease-out text-sm font-medium cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10"
                  >
                    <option value="all">All Categories</option>
                    {medicineCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                )}

                {/* Filter by Pharmacy Status */}
                <select
                  aria-label="Filter by pharmacy status"
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value as
                      | "all"
                      | "open"
                      | "closed",
                    )
                  }
                  className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-200 ease-out text-sm font-medium cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10"
                >
                  <option value="all">All Pharmacies</option>
                  <option value="open">Open Now</option>
                  <option value="closed">Closed</option>
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

              <PharmacyList
                pharmacies={filteredResults}
                searchQuery={searchQuery || selectedDrug || ""}
              />
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