import capsulesImage from "../../assets/images/capsules-falling.png";
import logoLargeImage from "../../assets/images/logo-large.png";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, CheckCircle } from "lucide-react";
import { PendingPharmacy } from "../admin/AdminDashboard";
import { ImageWithFallback } from "../../components/common/ImageWithFallback";
import { apiFetch } from "../../utils/api";

interface PharmacyAuthProps {
  onLogin: () => void;
  onRegister?: (
    pharmacy: Omit<PendingPharmacy, "id" | "submittedDate" | "status">,
  ) => void;
}

export function PharmacyAuth({ onLogin, onRegister }: PharmacyAuthProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorDialogText, setErrorDialogText] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Registration form state
  const [formData, setFormData] = useState({
    // Business Information
    legalEntityName: "",
    tradeName: "",
    nmraLicense: "",
    businessRegNumber: "",
    address: "",
    telephone: "",
    email: "",
    entityType: "",

    // Personal Details
    contactPersonName: "",
    contactPersonTitle: "",
    contactPersonPhone: "",
    contactPersonEmail: "",

    // Declaration
    agreedToTerms: false,
    declarationDate: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Step navigation
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Final submit (Step 3)
    setRegisterError(null);
    setRegisterLoading(true);

    try {
      // ✅ Map frontend fields -> backend PharmacyRegisterRequest fields
      const payload = {
        legalEntityName: formData.legalEntityName,
        tradeName: formData.tradeName,
        nmraLicense: formData.nmraLicense,

        // backend expects: businessRegNo
        businessRegNo: formData.businessRegNumber,

        // backend expects: addressInSriLanka
        addressInSriLanka: formData.address,

        telephone: formData.telephone,
        email: formData.email,
        entityType: formData.entityType,

        // backend expects: contactFullName/contactTitle/contactPhone/contactEmail
        contactFullName: formData.contactPersonName,
        contactTitle: formData.contactPersonTitle,
        contactPhone: formData.contactPersonPhone,
        contactEmail: formData.contactPersonEmail,

        // backend expects LocalDate + boolean
        declarationDate: formData.declarationDate,
        agreedToDeclaration: formData.agreedToTerms,
      };

      // ✅ Call backend (Vite proxy handles /api -> http://localhost:8080)
      await apiFetch("/api/v1/pharmacies/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Success UI
      setShowSuccessMessage(true);
      setStep(1);

      // Reset form
      setFormData({
        legalEntityName: "",
        tradeName: "",
        nmraLicense: "",
        businessRegNumber: "",
        address: "",
        telephone: "",
        email: "",
        entityType: "",
        contactPersonName: "",
        contactPersonTitle: "",
        contactPersonPhone: "",
        contactPersonEmail: "",
        agreedToTerms: false,
        declarationDate: new Date().toISOString().split("T")[0],
      });
    } catch (err: any) {
      const msg = err?.message || "Registration failed";
      setErrorDialogText(msg);
      setShowErrorMessage(true);
    } finally {
      setRegisterLoading(false);
    }
  };

  const entityTypes = [
    "Local Manufacturer",
    "Importer",
    "Local Agent of Foreign MAH",
    "Retail/Wholesale Pharmacy acting as MAH",
    "Multinational Branch Office",
  ];

  const slides = [
    {
      title: "About Pharmora",
      subtitle: "Pharmacy Network Platform",
      description:
        "Connecting pharmacies across the country to ensure drug availability and better healthcare access. Join our network of trusted pharmaceutical partners.",
    },
    {
      title: "Real-Time Inventory",
      subtitle: "Medicine Tracking System",
      description:
        "Track medicine availability in real-time across all connected pharmacies. Help patients find the medications they need, when they need them.",
    },
    {
      title: "Grow Your Business",
      subtitle: "Expand Your Reach",
      description:
        "Connect with more patients and healthcare providers. Increase your pharmacy's visibility and become part of Sri Lanka's largest pharmacy network.",
    },
  ];

  // Auto-switch slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Success Message Modal */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSuccessMessage(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="bg-gradient-to-br from-lime-400 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-gray-900 mb-3">Registration Submitted!</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Your pharmacy registration has been submitted successfully.
                  Our admin team will review your application and notify you via
                  email once it's approved.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowSuccessMessage(false);
                    setMode("login");
                  }}
                  className="w-full bg-indigo-900 text-white py-3 rounded-xl hover:bg-indigo-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Got it
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {showErrorMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h3 className="text-xl font-semibold text-red-700">
                Registration Failed
              </h3>
              <p className="mt-2 text-gray-700">{errorDialogText}</p>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowErrorMessage(false)}
                  className="px-4 py-2 rounded-xl bg-indigo-900 text-white"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-3 pb-12 lg:pb-24"
        style={{ paddingTop: "90px" }}
      >
        <AnimatePresence mode="wait">
          {mode === "login" ? (
            // Login Layout
            <motion.section
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative w-full max-w-7xl mx-auto"
            >
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center">
                {/* Left Side - Image with Carousel (hidden on mobile) */}
                <div className="w-full lg:w-1/2 cursor-pointer group hidden lg:block">
                  <div
                    className="relative w-full overflow-hidden shadow-2xl"
                    style={{ borderRadius: "3rem", height: "560px" }}
                  >
                    <img
                      src={capsulesImage}
                      alt="Pharmacy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ borderRadius: "3rem" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                      <div className="backdrop-blur-md bg-black/40 rounded-3xl border border-white/20 p-8 shadow-lg">
                        <div className="overflow-hidden">
                          <motion.div
                            animate={{ x: `-${activeSlide * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="flex"
                          >
                            {slides.map((slide, idx) => (
                              <div key={idx} className="flex-shrink-0 w-full">
                                <h5 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                  {slide.title}
                                </h5>
                                <span className="block text-sm font-semibold text-lime-300 mb-4 tracking-wide uppercase">
                                  {slide.subtitle}
                                </span>
                                <p className="text-white/90 leading-relaxed text-base sm:text-lg">
                                  {slide.description}
                                </p>
                              </div>
                            ))}
                          </motion.div>
                        </div>
                        <div className="mt-6 flex gap-2">
                          {slides.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSlide(idx);
                              }}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                activeSlide === idx
                                  ? "bg-lime-400 w-8"
                                  : "bg-white/40 w-2 hover:bg-white/60"
                              }`}
                              aria-label={`Go to slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Login Form */}
                <div
                  className="w-full lg:w-1/2 mx-auto"
                  style={{ maxWidth: "490px" }}
                >
                  <div
                    className="bg-white shadow-xl p-5 sm:p-7 border border-gray-100"
                    style={{ borderRadius: "2rem" }}
                  >
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1">
                        <img
                          src={logoLargeImage}
                          alt="Pharmora Logo"
                          className="w-12 h-12 object-contain rounded-lg"
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 text-center mt-2">
                        Pharmora Portal
                      </h3>
                      <p className="text-gray-500 mt-2 text-center text-sm">
                        Welcome back! Please sign in to continue.
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          className="w-full py-4 px-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none rounded-xl transition-all bg-gray-50/50 hover:bg-white"
                          type="email"
                          placeholder="pharmacy@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <div className="flex mb-2 items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700">
                            Password
                          </label>
                          <a
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = "/not-implemented";
                            }}
                          >
                            Forgot password?
                          </a>
                        </div>
                        <input
                          className="w-full py-4 px-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none rounded-xl transition-all bg-gray-50/50 hover:bg-white"
                          type="password"
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                        <label
                          htmlFor="rememberMe"
                          className="ml-2 text-sm text-gray-600 cursor-pointer select-none"
                        >
                          Remember for 30 days
                        </label>
                      </div>

                      <button
                        className="w-full py-4 px-6 text-center text-sm font-semibold bg-indigo-900 text-white rounded-xl transition-all duration-300 hover:bg-indigo-800 hover:shadow-lg hover:shadow-indigo-900/20 active:scale-[0.98]"
                        type="submit"
                      >
                        Sign In
                      </button>

                      <div className="flex items-center gap-4 py-2">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                          OR
                        </span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          setMode("register");
                          setStep(1);
                        }}
                        className="w-full py-4 px-6 text-center text-sm font-semibold border-2 border-indigo-900/20 text-indigo-900 rounded-xl hover:bg-indigo-50 hover:border-indigo-900/30 transition-all bg-transparent"
                      >
                        Register New Pharmacy
                      </motion.button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.section>
          ) : (
            // Registration Form (Keep existing design)
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl p-8 sm:p-12 border border-gray-100"
            >
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Back to Login Link */}
                <div className="mb-6">
                  <motion.button
                    type="button"
                    whileHover={{ x: -4 }}
                    onClick={() => setMode("login")}
                    className="flex items-center gap-2 text-indigo-900 hover:text-indigo-700 transition-all"
                  >
                    <span>←</span>
                    <span>Back to Login</span>
                  </motion.button>
                </div>

                {/* Enhanced Progress Indicator */}
                <div className="mb-8">
                  <div className="flex justify-between relative">
                    {/* Progress Line - Connected through circles */}
                    <div
                      className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0"
                      style={{ left: "16px", right: "16px" }}
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          width:
                            step === 1 ? "0%" : step === 2 ? "50%" : "100%",
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="h-full bg-indigo-900"
                      />
                    </div>

                    {/* Step Indicators */}
                    {[
                      { num: 1, label: "Business" },
                      { num: 2, label: "Contact" },
                      { num: 3, label: "Declaration" },
                    ].map((s) => (
                      <div
                        key={s.num}
                        className="flex flex-col items-center relative z-10"
                      >
                        <motion.div
                          initial={false}
                          animate={{
                            scale: step >= s.num ? 1 : 1,
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                            step >= s.num
                              ? "bg-indigo-900 border-indigo-900 text-white"
                              : "bg-white border-gray-300 text-gray-500"
                          }`}
                        >
                          {step > s.num ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span
                              className={
                                step >= s.num ? "text-white" : "text-gray-500"
                              }
                            >
                              {s.num}
                            </span>
                          )}
                        </motion.div>
                        <span
                          className={`mt-2 text-sm ${
                            step >= s.num ? "text-indigo-900" : "text-gray-500"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 1: Business Information */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h2 className="text-2xl text-gray-900">
                        Business Information
                      </h2>
                      <p className="text-gray-600">
                        Tell us about your pharmacy
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Legal Entity Name{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.legalEntityName}
                        onChange={(e) =>
                          handleInputChange("legalEntityName", e.target.value)
                        }
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block w-full p-4 transition-all hover:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Trade Name (if different)
                      </label>
                      <input
                        type="text"
                        value={formData.tradeName}
                        onChange={(e) =>
                          handleInputChange("tradeName", e.target.value)
                        }
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block w-full p-4 transition-all hover:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm mb-2">
                          NMRA License <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.nmraLicense}
                          onChange={(e) =>
                            handleInputChange("nmraLicense", e.target.value)
                          }
                          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block w-full p-4 transition-all hover:bg-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm mb-2">
                          Business Reg. No.{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.businessRegNumber}
                          onChange={(e) =>
                            handleInputChange(
                              "businessRegNumber",
                              e.target.value,
                            )
                          }
                          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block w-full p-4 transition-all hover:bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Address in Sri Lanka{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block w-full p-4 transition-all hover:bg-white"
                        rows={2}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm mb-2">
                          Telephone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.telephone}
                          onChange={(e) =>
                            handleInputChange("telephone", e.target.value)
                          }
                          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block w-full p-4 transition-all hover:bg-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block w-full p-4 transition-all hover:bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Type of Entity <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        {entityTypes.map((type) => (
                          <label
                            key={type}
                            className="flex items-center p-3 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/10 cursor-pointer transition-all bg-gray-50"
                          >
                            <input
                              type="radio"
                              name="entityType"
                              value={type}
                              checked={formData.entityType === type}
                              onChange={(e) =>
                                handleInputChange("entityType", e.target.value)
                              }
                              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                              required
                            />
                            <span className="ml-3 text-gray-700 text-sm">
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Personal Details */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h2 className="text-2xl text-gray-900">Contact Person</h2>
                      <p className="text-gray-600">
                        Who should we reach out to?
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.contactPersonName}
                        onChange={(e) =>
                          handleInputChange("contactPersonName", e.target.value)
                        }
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block w-full p-4 transition-all hover:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Title / Position <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.contactPersonTitle}
                        onChange={(e) =>
                          handleInputChange(
                            "contactPersonTitle",
                            e.target.value,
                          )
                        }
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block w-full p-4 transition-all hover:bg-white"
                        placeholder="e.g., Pharmacist, Manager"
                        aria-label="Title / Position"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm mb-2">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.contactPersonPhone}
                          onChange={(e) =>
                            handleInputChange(
                              "contactPersonPhone",
                              e.target.value,
                            )
                          }
                          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block w-full p-4 transition-all hover:bg-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.contactPersonEmail}
                          onChange={(e) =>
                            handleInputChange(
                              "contactPersonEmail",
                              e.target.value,
                            )
                          }
                          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block w-full p-4 transition-all hover:bg-white"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Declaration */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h2 className="text-2xl text-gray-900">Declaration</h2>
                      <p className="text-gray-600">Please review and confirm</p>
                    </div>

                    <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl border border-indigo-200">
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                        I declare that the information provided is true and
                        accurate. I understand that:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-2">
                        <li>False information may result in rejection</li>
                        <li>I am authorized to represent the entity</li>
                        <li>I will comply with NMRA regulations</li>
                        <li>I will keep information up to date</li>
                      </ul>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Declaration Date
                      </label>
                      <input
                        type="date"
                        value={formData.declarationDate}
                        onChange={(e) =>
                          handleInputChange("declarationDate", e.target.value)
                        }
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block w-full p-4 transition-all hover:bg-white"
                        required
                      />
                    </div>

                    <label className="flex items-start p-4 border-2 border-indigo-200 bg-white/30 backdrop-blur-sm rounded-xl cursor-pointer hover:border-indigo-400 transition-all">
                      <input
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={(e) =>
                          handleInputChange("agreedToTerms", e.target.checked)
                        }
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 mt-0.5 rounded"
                        required
                      />
                      <span className="ml-3 text-gray-700 text-sm leading-relaxed">
                        I agree to the declaration above and confirm all
                        information is accurate.{" "}
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                  </motion.div>
                )}
                {registerError && (
                  <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
                    {registerError}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                  {step > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 transition-all bg-white/30 backdrop-blur-sm"
                    >
                      Previous
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={registerLoading}
                    className="flex-1 bg-indigo-900 text-white py-3 rounded-xl transition-all shadow-lg relative group overflow-hidden focus:ring-4 focus:ring-lime-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="relative">
                      {registerLoading
                        ? "Submitting..."
                        : step === 3
                          ? "Register"
                          : "Next"}
                    </span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
