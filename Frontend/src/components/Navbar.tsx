import { motion, AnimatePresence } from "motion/react";
import logoImage from "../assets/images/logo-large.png";
import { Menu, X, Search } from "lucide-react";
import { useState, useEffect } from "react";

interface NavbarProps {
  viewMode: "user" | "owner" | "admin";
  currentPage:
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
  | "partners";
  onViewModeChange: (mode: "user" | "owner" | "admin") => void;
  onPageChange: (
    page:
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
      | "partners",
  ) => void;
}

export function Navbar({
  viewMode,
  currentPage,
  onViewModeChange,
  onPageChange,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // Prevent background scroll when mobile menu is open
    useEffect(() => {
      if (mobileMenuOpen) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
      return () => {
        document.body.classList.remove('overflow-hidden');
      };
    }, [mobileMenuOpen]);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [searchHovered, setSearchHovered] = useState(false);
  const [logoScale, setLogoScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      // Only apply scroll effects on homepage or pharmacy owner page
      if (currentPage !== "home" && viewMode !== "owner") {
        setScrollOpacity(0);
        setLogoScale(1);
        return;
      }

      const scrollThreshold = 200; // Distance to scroll for full opacity
      const logoScrollThreshold = 150; // Distance for logo to shrink
      const scrollY = window.scrollY;

      // Calculate opacity based on scroll position (0 to 1)
      let opacity = scrollY / scrollThreshold;

      // Clamp opacity between 0 and 1
      if (opacity > 1) opacity = 1;
      if (opacity < 0) opacity = 0;

      setScrollOpacity(opacity);

      // Calculate logo scale (shrinks as you scroll)
      let scale = 1 - (scrollY / logoScrollThreshold) * 0.15;
      if (scale < 0.85) scale = 0.85;
      if (scale > 1) scale = 1;
      setLogoScale(scale);
    };

    window.addEventListener("scroll", handleScroll);
    // Run once on mount to set initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage, viewMode]);

  const handlePageChange = (
    page:
      | "home"
      | "about"
      | "privacy"
      | "terms"
      | "help"
      | "contact",
  ) => {
    onPageChange(page);
    if (page === "home") {
      onViewModeChange("user");
    }
    setMobileMenuOpen(false);
  };

  const handleSearchClick = () => {
    // Navigate to home if not already there
    if (currentPage !== "home" || viewMode !== "user") {
      onPageChange("home");
      onViewModeChange("user");
    }

    // Wait a bit for the page to load, then scroll to search bar
    setTimeout(() => {
      const searchElement = document.querySelector('[data-search-bar="true"]');
      if (searchElement) {
        searchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Focus the input if it exists
        const input = searchElement.querySelector('input');
        if (input) {
          input.focus();
        }
      }
    }, 100);
  };

  // Calculate background color and shadow based on scroll opacity
  const navbarStyle = {
    backgroundColor: viewMode === "owner"
      ? 'rgb(247, 247, 245)'
      : currentPage === "home"
        ? (scrollOpacity > 0
          ? `rgba(247, 247, 245, ${Math.min(scrollOpacity * 1.2, 0.95)})`
          : 'transparent')
        : 'rgba(247, 247, 245, 0.98)',
    backdropFilter: viewMode === "owner"
      ? 'none'
      : currentPage === "home"
        ? (scrollOpacity > 0.1 ? 'blur(12px)' : 'none')
        : 'blur(12px)',
    boxShadow: 'none',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease',
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[9999]"
      style={{ ...navbarStyle, position: 'fixed', zIndex: 9999 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 relative">
          {/* Logo and Brand - Slides up when scrolling (only on home page in user mode) */}
          <motion.div
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group overflow-hidden"
            onClick={() => handlePageChange("home")}
            initial={{ opacity: 1, y: 0 }}
            animate={{
              opacity: currentPage === "home" && viewMode === "user"
                ? (scrollOpacity > 0.3 ? 1 : 0)
                : 1,
              y: currentPage === "home" && viewMode === "user"
                ? (scrollOpacity > 0.3 ? 0 : -20)
                : 0,
              pointerEvents: currentPage === "home" && viewMode === "user"
                ? (scrollOpacity > 0.3 ? 'auto' : 'none')
                : 'auto'
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="relative"
              animate={{ scale: currentPage === "home" && viewMode === "user" ? logoScale : 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.img
                src={logoImage}
                alt="PharmConnect Logo"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain mix-blend-multiply"
                animate={{ rotate: 0 }}
                whileHover={{
                  rotate: 180,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            <motion.div
              className="hidden sm:block -ml-1"
            >
              <motion.h1
                className="text-left text-lg sm:text-xl text-slate-900 tracking-tight leading-tight font-bold uppercase"
                style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.05em' }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                Pharmora
              </motion.h1>
              <motion.p
                className="text-gray-500 text-[10px] sm:text-xs tracking-wide leading-tight -mt-0.5"
              >
                Find medication availability
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Desktop Navigation - Centered Links */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 absolute left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => {
                onPageChange("home");
                onViewModeChange("user");
              }}
              className="px-2 py-1.5 rounded-lg transition-all cursor-pointer relative group"
            >
              <motion.span
                animate={{
                  color: currentPage === "home" && viewMode === "user"
                    ? (scrollOpacity < 0.5 ? '#d1d5db' : '#111827')
                    : '#4b5563',
                }}
                transition={{ duration: 0.3 }}
                className={`text-sm text-[16px] ${currentPage === "home" && viewMode === "user" ? "font-bold" : ""
                  }`}
              >
                Home
              </motion.span>
              {currentPage === "home" && viewMode === "user" && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 rounded-full"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    backgroundColor: scrollOpacity < 0.5 ? '#d1d5db' : '#111827'
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>

            <button
              onClick={() => onPageChange("about")}
              className="px-2 py-1.5 rounded-lg transition-all cursor-pointer relative group"
            >
              <motion.span
                animate={{
                  color: currentPage === "about"
                    ? '#111827'
                    : currentPage === "home" && viewMode === "user"
                      ? (scrollOpacity > 0.5 ? '#4b5563' : '#ffffff')
                      : '#4b5563',
                }}
                transition={{ duration: 0.3 }}
                className={`text-sm text-[16px] not-italic ${currentPage === "about" ? "font-bold" : ""
                  }`}
              >
                About Us
              </motion.span>
              {currentPage === "about" && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gray-900 rounded-full"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>

            <button
              onClick={() => onPageChange("help")}
              className="px-2 py-1.5 rounded-lg transition-all cursor-pointer relative group"
            >
              <motion.span
                animate={{
                  color: currentPage === "help"
                    ? '#111827'
                    : currentPage === "home" && viewMode === "user"
                      ? (scrollOpacity > 0.5 ? '#4b5563' : '#ffffff')
                      : '#4b5563',
                }}
                transition={{ duration: 0.3 }}
                className={`text-sm text-[16px] not-italic ${currentPage === "help" ? "font-bold" : ""
                  }`}
              >
                FAQ
              </motion.span>
              {currentPage === "help" && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gray-900 rounded-full"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>

            <button
              onClick={() => onPageChange("contact")}
              className="px-2 py-1.5 rounded-lg transition-all cursor-pointer relative group"
            >
              <motion.span
                animate={{
                  color: currentPage === "contact"
                    ? '#111827'
                    : currentPage === "home" && viewMode === "user"
                      ? (scrollOpacity > 0.5 ? '#4b5563' : '#ffffff')
                      : '#4b5563',
                }}
                transition={{ duration: 0.3 }}
                className={`text-sm text-[16px] not-italic ${currentPage === "contact" ? "font-bold" : ""
                  }`}
              >
                Contact
              </motion.span>
              {currentPage === "contact" && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gray-900 rounded-full"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          </div>

          {/* Desktop Action Button - Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Button */}
            <motion.button
              onClick={handleSearchClick}
              onMouseEnter={() => setSearchHovered(true)}
              onMouseLeave={() => setSearchHovered(false)}
              animate={{
                backgroundColor: currentPage === "home" && viewMode === "user"
                  ? (scrollOpacity > 0.5
                    ? 'rgba(255, 255, 255, 1)'
                    : '#6b7280')
                  : 'rgba(255, 255, 255, 1)',
                borderColor: currentPage === "home" && viewMode === "user"
                  ? (scrollOpacity > 0.5
                    ? 'rgba(229, 231, 235, 1)'
                    : '#6b7280')
                  : 'rgba(229, 231, 235, 1)',
              }}
              transition={{ duration: 0.3 }}
              className="relative h-10 w-[110px] rounded-full hover:bg-opacity-90 transition-colors flex items-center justify-center cursor-pointer group backdrop-blur-sm border"
            >
              <div className="flex items-center gap-2 px-3">
                <motion.div
                  animate={{
                    scale: searchHovered ? 1.15 : 1,
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <motion.div
                    animate={{
                      color: currentPage === "home" && viewMode === "user"
                        ? (scrollOpacity > 0.5 ? '#9ca3af' : '#ffffff')
                        : '#9ca3af',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Search className="w-5 h-5 flex-shrink-0" style={{ color: 'currentColor' }} />
                  </motion.div>
                </motion.div>
                <span className="text-[16px] font-medium whitespace-nowrap inline-flex">
                  {"Search".split("").map((letter, index) => (
                    <motion.span
                      key={`${index}-${searchHovered}`}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        color: currentPage === "home" && viewMode === "user"
                          ? (scrollOpacity > 0.5 ? '#9ca3af' : '#ffffff')
                          : '#9ca3af',
                      }}
                      transition={{
                        duration: 0.15,
                        delay: searchHovered ? index * 0.06 : 0,
                        ease: "easeOut",
                        color: { duration: 0.3 }
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              </div>
            </motion.button>

            {/* Login Button */}
            <motion.button
              onClick={() => onViewModeChange("owner")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer h-10.5 px-4 rounded-xl transition-all text-[16px] border-2 flex items-center justify-center font-medium backdrop-blur-sm bg-black text-white border-black"
            >
              Login
            </motion.button>
          </div>

          {/* Mobile Search and Menu Buttons */}
          <div className="md:hidden flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSearchClick}
              aria-label="Search"
              className="p-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
            >
              <Search className="w-6 h-6 text-black" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              className="p-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-black" />
              ) : (
                <Menu className="w-6 h-6 text-black" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Always available on all pages */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-black/60 backdrop-blur-sm"
            style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', position: 'fixed', zIndex: 9999, background: 'rgba(0,0,0,0.6)', top: 0, left: 0, right: 0, bottom: 0 }}
            style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-[95vw] max-w-sm rounded-2xl shadow-2xl flex flex-col items-center px-4 pt-6 pb-8 relative mt-8"
              style={{ minHeight: 380, marginTop: '2.5rem', paddingBottom: 'env(safe-area-inset-bottom, 2rem)', background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 60%, #0ea5e9 100%)' }}
            >
              {/* Top: Branding and Close Button */}
              <div className="w-full flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 select-none">
                  <img src={logoImage} alt="Pharmora Logo" className="w-8 h-8 object-contain" />
                  <span className="text-lg font-bold text-white tracking-tight uppercase" style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.05em' }}>Pharmora</span>
                </div>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  tabIndex={0}
                >
                  <X className="w-6 h-6 text-cyan-200" />
                </button>
              </div>
              {/* Nav Links */}
              <div className="flex flex-col items-center w-full mt-4 mb-6 overflow-y-auto max-h-[320px] scrollbar-thin scrollbar-thumb-sky-800 scrollbar-track-sky-900">
                <button
                  onClick={() => { handlePageChange("home"); setMobileMenuOpen(false); }}
                  className={`w-full text-center py-3 my-2 rounded-xl font-semibold transition-colors ${currentPage === "home" ? "text-black bg-sky-800/60" : "text-white hover:bg-sky-800/40 hover:text-gray-300 active:text-black"}`}
                  style={{ fontSize: 19, minHeight: 56 }}
                  tabIndex={0}
                  aria-current={currentPage === "home" ? "page" : undefined}
                >
                  Home
                </button>
                <button
                  onClick={() => { handlePageChange("about"); setMobileMenuOpen(false); }}
                  className={`w-full text-center py-3 my-2 rounded-xl font-semibold transition-colors ${currentPage === "about" ? "text-black bg-sky-800/60" : "text-white hover:bg-sky-800/40 hover:text-gray-300 active:text-black"}`}
                  style={{ fontSize: 19, minHeight: 56 }}
                  tabIndex={0}
                  aria-current={currentPage === "about" ? "page" : undefined}
                >
                  About
                </button>
                <button
                  onClick={() => { handlePageChange("help"); setMobileMenuOpen(false); }}
                  className={`w-full text-center py-3 my-2 rounded-xl font-semibold transition-colors ${currentPage === "help" ? "text-black bg-sky-800/60" : "text-white hover:bg-sky-800/40 hover:text-gray-300 active:text-black"}`}
                  style={{ fontSize: 19, minHeight: 56 }}
                  tabIndex={0}
                  aria-current={currentPage === "help" ? "page" : undefined}
                >
                  Services
                </button>
                <button
                  onClick={() => { handlePageChange("contact"); setMobileMenuOpen(false); }}
                  className={`w-full text-center py-3 my-2 rounded-xl font-semibold transition-colors ${currentPage === "contact" ? "text-black bg-sky-800/60" : "text-white hover:bg-sky-800/40 hover:text-gray-300 active:text-black"}`}
                  style={{ fontSize: 19, minHeight: 56 }}
                  tabIndex={0}
                  aria-current={currentPage === "contact" ? "page" : undefined}
                >
                  Contact
                </button>
              </div>
              {/* CTA Button */}
              <button
                onClick={() => { onViewModeChange('owner'); setMobileMenuOpen(false); }}
                className="w-full mt-6 mb-2 py-3 px-2 rounded-full bg-black text-white font-bold text-lg shadow-lg transition-colors border-2 border-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                style={{ minHeight: 48 }}
                tabIndex={0}
              >
                Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}