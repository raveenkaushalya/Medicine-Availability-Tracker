import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle } from "lucide-react";
import capsulesImage from "../../assets/images/capsules-falling.png";
import logoLargeImage from "../../assets/images/logo-large.png";
import { apiFetch } from "../../utils/api";

// ─────────────────────────────────────────────
// Forgot Password Modal
// ─────────────────────────────────────────────
interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setEmail("");
      setSent(false);
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch("/api/v1/pharmacies/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="mb-4 text-lg font-bold text-indigo-900">
          Forgot Password
        </h2>

        {sent ? (
          <p className="text-sm text-green-700">
            If an account exists for this email, a reset link has been sent.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-900 py-3 font-semibold text-white transition-all hover:bg-indigo-800 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
interface PharmacyAuthProps {
  onLogin: () => void;
}

const ENTITY_TYPES = [
  "Local Manufacturer",
  "Importer",
  "Local Agent of Foreign MAH",
  "Retail/Wholesale Pharmacy acting as MAH",
  "Multinational Branch Office",
];

const SLIDES = [
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

const EMPTY_FORM = {
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
};

export function PharmacyAuth({ onLogin }: PharmacyAuthProps) {
  const [forgotOpen, setForgotOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState(1);
  const [activeSlide, setActiveSlide] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Registration state
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Modal state
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Auto-advance carousel
  useEffect(() => {
    const id = setInterval(
      () => setActiveSlide((prev) => (prev + 1) % SLIDES.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  const handleInput = (field: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // ── Login ──────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      await apiFetch("/api/v1/pharmacies/login", {
        method: "POST",
        body: JSON.stringify({ username: loginEmail, password: loginPassword }),
      });
      onLogin();
    } catch (err: any) {
      setErrorText(err?.message || "Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Register ───────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }

    setRegisterLoading(true);

    try {
      await apiFetch("/api/v1/pharmacies/register", {
        method: "POST",
        body: JSON.stringify({
          legalEntityName: formData.legalEntityName,
          tradeName: formData.tradeName,
          nmraLicense: formData.nmraLicense,
          businessRegNo: formData.businessRegNumber,
          addressInSriLanka: formData.address,
          telephone: formData.telephone,
          email: formData.email,
          entityType: formData.entityType,
          contactFullName: formData.contactPersonName,
          contactTitle: formData.contactPersonTitle,
          contactPhone: formData.contactPersonPhone,
          contactEmail: formData.contactPersonEmail,
          declarationDate: formData.declarationDate,
          agreedToDeclaration: formData.agreedToTerms,
        }),
      });

      setShowSuccess(true);
      setStep(1);
      setFormData(EMPTY_FORM);
    } catch (err: any) {
      setErrorText(err?.message || "Registration failed. Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  // ── Shared field class ─────────────────────
  const fieldClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-900 placeholder-gray-400 transition-all hover:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none";

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ── Modals ── */}
      <AnimatePresence>
        {/* Success */}
        {showSuccess && (
          <motion.div
            key="success-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 shadow-lg"
                >
                  <CheckCircle className="h-12 w-12 text-white" />
                </motion.div>

                <h2 className="mb-3 text-gray-900">Registration Submitted!</h2>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Your pharmacy registration has been submitted successfully.
                  Our admin team will review your application and notify you via
                  email once it's approved.
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowSuccess(false);
                    setMode("login");
                  }}
                  className="w-full rounded-xl bg-indigo-900 py-3 text-white transition-all hover:bg-indigo-800"
                >
                  Got it
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Error */}
        {errorText && (
          <motion.div
            key="error-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <h3 className="text-xl font-semibold text-red-700">Error</h3>
              <p className="mt-2 text-gray-700">{errorText}</p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setErrorText(null)}
                  className="rounded-xl bg-indigo-900 px-4 py-2 text-white hover:bg-indigo-800 transition-all"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main ── */}
      <div
        className="mx-auto max-w-screen-2xl px-4 pb-12 sm:px-6 lg:px-3 lg:pb-24"
        style={{ paddingTop: "90px" }}
      >
        <AnimatePresence mode="wait">
          {mode === "login" ? (
            /* ── Login Layout ── */
            <motion.section
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative mx-auto w-full max-w-7xl"
            >
              <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-12">
                {/* Carousel (desktop only) */}
                <div className="group hidden w-full cursor-pointer lg:block lg:w-1/2">
                  <div
                    className="relative w-full overflow-hidden shadow-2xl"
                    style={{ borderRadius: "3rem", height: "560px" }}
                  >
                    <img
                      src={capsulesImage}
                      alt="Pharmacy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ borderRadius: "3rem" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                      <div className="rounded-3xl border border-white/20 bg-black/40 p-8 shadow-lg backdrop-blur-md">
                        <div className="overflow-hidden">
                          <motion.div
                            animate={{ x: `-${activeSlide * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="flex"
                          >
                            {SLIDES.map((slide, idx) => (
                              <div key={idx} className="w-full flex-shrink-0">
                                <h5 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
                                  {slide.title}
                                </h5>
                                <span className="mb-4 block text-sm font-semibold uppercase tracking-wide text-lime-300">
                                  {slide.subtitle}
                                </span>
                                <p className="text-base leading-relaxed text-white/90 sm:text-lg">
                                  {slide.description}
                                </p>
                              </div>
                            ))}
                          </motion.div>
                        </div>

                        <div className="mt-6 flex gap-2">
                          {SLIDES.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveSlide(idx)}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                activeSlide === idx
                                  ? "w-8 bg-lime-400"
                                  : "w-2 bg-white/40 hover:bg-white/60"
                              }`}
                              aria-label={`Go to slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Login Form */}
                <div className="mx-auto w-full lg:w-1/2" style={{ maxWidth: "490px" }}>
                  <div
                    className="border border-gray-100 bg-white p-5 shadow-xl sm:p-7"
                    style={{ borderRadius: "2rem" }}
                  >
                    {/* Logo */}
                    <div className="mb-4 flex flex-col items-center">
                      <img
                        src={logoLargeImage}
                        alt="Pharmora Logo"
                        className="mb-1 h-12 w-12 rounded-lg object-contain"
                      />
                      <h3 className="mt-2 text-center text-2xl font-bold text-gray-900">
                        Pharmora Portal
                      </h3>
                      <p className="mt-2 text-center text-sm text-gray-500">
                        Welcome back! Please sign in to continue.
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className={fieldClass}
                          placeholder="pharmacy@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700">
                            Password
                          </label>
                          <button
                            type="button"
                            className="border-0 bg-transparent p-0 text-xs font-medium text-indigo-600 underline transition-colors hover:text-indigo-800"
                            onClick={() => setForgotOpen(true)}
                          >
                            Forgot password?
                          </button>
                        </div>
                        <input
                          type="password"
                          className={fieldClass}
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
                          className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor="rememberMe"
                          className="ml-2 cursor-pointer select-none text-sm text-gray-600"
                        >
                          Remember for 30 days
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full rounded-xl bg-indigo-900 px-6 py-4 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-800 hover:shadow-lg hover:shadow-indigo-900/20 active:scale-[0.98] disabled:opacity-60"
                      >
                        {loginLoading ? "Signing in…" : "Sign In"}
                      </button>

                      <div className="flex items-center gap-4 py-2">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                          OR
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                      </div>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          setMode("register");
                          setStep(1);
                        }}
                        className="w-full rounded-xl border-2 border-indigo-900/20 bg-transparent px-6 py-4 text-center text-sm font-semibold text-indigo-900 transition-all hover:border-indigo-900/30 hover:bg-indigo-50"
                      >
                        Register New Pharmacy
                      </motion.button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.section>
          ) : (
            /* ── Registration Layout ── */
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-4xl rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-xl sm:p-12"
            >
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Back */}
                <div className="mb-6">
                  <motion.button
                    type="button"
                    whileHover={{ x: -4 }}
                    onClick={() => setMode("login")}
                    className="flex items-center gap-2 text-indigo-900 transition-all hover:text-indigo-700"
                  >
                    <span>←</span>
                    <span>Back to Login</span>
                  </motion.button>
                </div>

                {/* Step progress */}
                <div className="mb-8">
                  <div className="relative flex justify-between">
                    <div
                      className="absolute top-4 h-0.5 bg-gray-200"
                      style={{ left: "16px", right: "16px" }}
                    >
                      <motion.div
                        animate={{
                          width:
                            step === 1 ? "0%" : step === 2 ? "50%" : "100%",
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="h-full bg-indigo-900"
                      />
                    </div>

                    {[
                      { num: 1, label: "Business" },
                      { num: 2, label: "Contact" },
                      { num: 3, label: "Declaration" },
                    ].map((s) => (
                      <div
                        key={s.num}
                        className="relative z-10 flex flex-col items-center"
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                            step >= s.num
                              ? "border-indigo-900 bg-indigo-900 text-white"
                              : "border-gray-300 bg-white text-gray-500"
                          }`}
                        >
                          {step > s.num ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span>{s.num}</span>
                          )}
                        </div>
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

                {/* ── Step 1: Business Info ── */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="mb-4 text-center">
                      <h2 className="text-2xl text-gray-900">
                        Business Information
                      </h2>
                      <p className="text-gray-600">
                        Tell us about your pharmacy
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-gray-700">
                        Legal Entity Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={fieldClass}
                        placeholder="Enter legal entity name"
                        value={formData.legalEntityName}
                        onChange={(e) =>
                          handleInput("legalEntityName", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-gray-700">
                        Trade Name (if different)
                      </label>
                      <input
                        type="text"
                        className={fieldClass}
                        placeholder="Enter trade name"
                        value={formData.tradeName}
                        onChange={(e) =>
                          handleInput("tradeName", e.target.value)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-gray-700">
                          NMRA License <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={fieldClass}
                          placeholder="Enter NMRA license number"
                          value={formData.nmraLicense}
                          onChange={(e) =>
                            handleInput("nmraLicense", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-gray-700">
                          Business Reg. No.{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={fieldClass}
                          placeholder="Enter business registration number"
                          value={formData.businessRegNumber}
                          onChange={(e) =>
                            handleInput("businessRegNumber", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-gray-700">
                        Address in Sri Lanka{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={fieldClass}
                        rows={2}
                        placeholder="Enter registered address in Sri Lanka"
                        value={formData.address}
                        onChange={(e) =>
                          handleInput("address", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-gray-700">
                          Telephone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          className={fieldClass}
                          placeholder="Enter telephone number"
                          value={formData.telephone}
                          onChange={(e) =>
                            handleInput("telephone", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          className={fieldClass}
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={(e) =>
                            handleInput("email", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-gray-700">
                        Type of Entity <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        {ENTITY_TYPES.map((type) => (
                          <label
                            key={type}
                            className="flex cursor-pointer items-center rounded-xl border border-gray-200 bg-gray-50 p-3 transition-all hover:border-indigo-500 hover:bg-indigo-50/10"
                          >
                            <input
                              type="radio"
                              name="entityType"
                              value={type}
                              checked={formData.entityType === type}
                              onChange={(e) =>
                                handleInput("entityType", e.target.value)
                              }
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                              required
                            />
                            <span className="ml-3 text-sm text-gray-700">
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 2: Contact Person ── */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="mb-4 text-center">
                      <h2 className="text-2xl text-gray-900">Contact Person</h2>
                      <p className="text-gray-600">
                        Who should we reach out to?
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={fieldClass}
                        placeholder="Enter full name"
                        value={formData.contactPersonName}
                        onChange={(e) =>
                          handleInput("contactPersonName", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-gray-700">
                        Title / Position <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={fieldClass}
                        placeholder="e.g., Pharmacist, Manager"
                        value={formData.contactPersonTitle}
                        onChange={(e) =>
                          handleInput("contactPersonTitle", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-gray-700">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          className={fieldClass}
                          placeholder="Enter phone number"
                          value={formData.contactPersonPhone}
                          onChange={(e) =>
                            handleInput("contactPersonPhone", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          className={fieldClass}
                          placeholder="Enter contact person email"
                          value={formData.contactPersonEmail}
                          onChange={(e) =>
                            handleInput("contactPersonEmail", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Declaration ── */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="mb-4 text-center">
                      <h2 className="text-2xl text-gray-900">Declaration</h2>
                      <p className="text-gray-600">Please review and confirm</p>
                    </div>

                    <div className="rounded-xl border border-indigo-200 bg-white/30 p-6 backdrop-blur-sm">
                      <p className="mb-3 text-sm leading-relaxed text-gray-700">
                        I declare that the information provided is true and
                        accurate. I understand that:
                      </p>
                      <ul className="ml-2 list-inside list-disc space-y-1 text-sm text-gray-700">
                        <li>False information may result in rejection</li>
                        <li>I am authorized to represent the entity</li>
                        <li>I will comply with NMRA regulations</li>
                        <li>I will keep information up to date</li>
                      </ul>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-gray-700">
                        Declaration Date
                      </label>
                      <input
                        type="date"
                        className={fieldClass}
                        value={formData.declarationDate}
                        onChange={(e) =>
                          handleInput("declarationDate", e.target.value)
                        }
                        required
                        placeholder="Select declaration date"
                        title="Declaration Date"
                        aria-label="Declaration Date"
                      />
                    </div>

                    <label className="flex cursor-pointer items-start rounded-xl border-2 border-indigo-200 bg-white/30 p-4 backdrop-blur-sm transition-all hover:border-indigo-400">
                      <input
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={(e) =>
                          handleInput("agreedToTerms", e.target.checked)
                        }
                        className="mt-0.5 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                        required
                      />
                      <span className="ml-3 text-sm leading-relaxed text-gray-700">
                        I agree to the declaration above and confirm all
                        information is accurate.{" "}
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                  </motion.div>
                )}

                {/* Navigation buttons */}
                <div className="flex gap-3 pt-4">
                  {step > 1 && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep((s) => s - 1)}
                      className="flex-1 rounded-xl border-2 border-gray-300 bg-white/30 px-6 py-3 text-gray-700 backdrop-blur-sm transition-all"
                    >
                      Previous
                    </motion.button>
                  )}

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={registerLoading}
                    className="relative flex-1 overflow-hidden rounded-xl bg-indigo-900 py-3 text-white shadow-lg transition-all focus:ring-4 focus:ring-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {registerLoading
                      ? "Submitting…"
                      : step === 3
                        ? "Register"
                        : "Next"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Forgot Password Modal (outside AnimatePresence to avoid unmount issues) */}
      <ForgotPasswordModal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
      />
    </div>
  );
}