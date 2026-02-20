import emailjs from '@emailjs/browser';
// EmailJS config (replace with your actual IDs)
const EMAILJS_SERVICE_ID = 'pharmacy_pass';
const EMAILJS_TEMPLATE_ID = 'template_approval';
const EMAILJS_PUBLIC_KEY = 'EfzgOcTmuS3MpXyXT';

function sendApprovalEmail(toEmail: string, toName: string, setupLink: string) {
  emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      to_email: toEmail,
      to_name: toName,
      setup_link: setupLink,
    },
    EMAILJS_PUBLIC_KEY
  ).then(
    (result) => {
      console.log('Email sent:', result.text);
    },
    (error) => {
      console.error('Email error:', error.text);
    }
  );
}
import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Building2,
  Pill,
  MessageSquare,
  Settings,
  Search,
  Menu,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  User,
  ChevronRight,
  LogOut,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import logoImage from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080";

// session-cookie fetch helper
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  const text = await res.text(); // read raw first

  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    // show useful error
    const msg =
      data?.message ||
      data?.error ||
      (text && text.trim()) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  // handle empty success response
  return (data ?? ({} as any)) as T;
}

// Type definitions
export interface PendingPharmacy {
  name: string;
  id: number;
  legalEntityName: string;
  tradeName: string;
  nmraLicense: string;
  businessRegNumber: string;
  address: string;
  telephone: string;
  email: string;
  entityType: string;
  contactPersonName: string;
  contactPersonTitle: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
  agreedToTerms: boolean;
  declarationDate: string;
}
type CatalogStatus = "ACTIVE" | "ARCHIVED";

type AdminMedicineRow = {
  id: number;
  genericName: string;
  brandName: string;
  manufacturer: string | null;
  country: string | null;
  regNo: string;
  status: CatalogStatus;
};

type SpringPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

type SuggestItem = {
  id: number;
  name: string;
};

// Mock Data
// FIX: keys match the dataKey props used in BarChart ("active" / "inactive")
const CHART_DATA_ACTIVITY = [
  { name: "Mon", active: 400, inactive: 240 },
  { name: "Tue", active: 300, inactive: 139 },
  { name: "Wed", active: 200, inactive: 980 },
  { name: "Thu", active: 278, inactive: 390 },
  { name: "Fri", active: 189, inactive: 480 },
  { name: "Sun", active: 239, inactive: 380 },
  { name: "Sat", active: 349, inactive: 430 },
];

const CHART_DATA_MEDICINES = [
  { name: "In Stock", value: 400, color: "#4f46e5" },
  { name: "Low Stock", value: 300, color: "#f59e0b" },
  { name: "Out of Stock", value: 300, color: "#ef4444" },
];


const MOCK_INQUIRIES = [
  {
    id: 1,
    subject: "License Renewal",
    sender: "City Pharmacy",
    role: "Pharmacist",
    status: "New",
    date: "2024-02-01",
    message: "How do I renew my NMRA license?",
  },
  {
    id: 2,
    subject: "Stock Update Issue",
    sender: "HealthPlus",
    role: "Manager",
    status: "Resolved",
    date: "2024-01-30",
    message: "I cannot update my stock levels.",
  },
  {
    id: 3,
    subject: "New Registration",
    sender: "New Age Pharma",
    role: "Owner",
    status: "New",
    date: "2024-02-02",
    message: "Submitting documents for registration.",
  },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  // ✅ Protect dashboard: must be logged in
  useEffect(() => {
    (async () => {
      try {
        await apiFetch("/api/v1/auth/me");
      } catch {
        navigate("/admin");
      }
    })();
  }, [navigate]);

  // PDF Export Handler
  // State for Pending Pharmacies (moved from HomePage)
  const [pendingPharmacies, setPendingPharmacies] = useState<PendingPharmacy[]>(
    [],
  );
  const [, setPharmacyLoading] = useState(false);
  const [, setPharmacyError] = useState<string | null>(null);
  // Pharmacies State
  const [pharmacyFilter, setPharmacyFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const loadPendingPharmacies = async () => {
    setPharmacyError(null);
    setPharmacyLoading(true);

    try {
      const statusParam =
        pharmacyFilter === "all" ? "ALL" : pharmacyFilter.toUpperCase();

      const res = await apiFetch<any>(
        `/api/v1/admin/pharmacies?status=${statusParam}&page=0&size=50`,
      );

      const page = res.data; // ✅ important (ApiResponse wrapper)

      const rows = page?.content || [];
      const mapped: PendingPharmacy[] = rows.map((p: any) => ({
        id: p.id,
        // FIX: populate `name` field from legalEntityName or tradeName
        name: p.tradeName || p.legalEntityName || "",
        legalEntityName: p.legalEntityName || "",
        tradeName: p.tradeName || "",
        nmraLicense: p.nmraLicense || "",
        businessRegNumber: p.businessRegNo || "",
        address: p.addressInSriLanka || "",
        telephone: p.telephone || "",
        email: p.email || "",
        entityType: p.entityType || "",

        contactPersonName: p.contactFullName || "",
        contactPersonTitle: p.contactTitle || "",
        contactPersonPhone: p.contactPhone || "",
        contactPersonEmail: p.contactEmail || "",

        submittedDate: p.createdAt || "",

        status:
          p.status?.toLowerCase() === "approved"
            ? "approved"
            : p.status?.toLowerCase() === "rejected"
              ? "rejected"
              : "pending",

        agreedToTerms: true,
        declarationDate: "",
      }));

      setPendingPharmacies(mapped);
    } catch (e: any) {
      setPharmacyError(e?.message || "Failed to load pharmacies");
    } finally {
      setPharmacyLoading(false);
    }
  };

  useEffect(() => {
    loadPendingPharmacies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pharmacyFilter]);

  const onApprove = async (id: number) => {
    try {
      const res = await apiFetch<any>(
        `/api/v1/admin/pharmacies/${id}/approve`,
        {
          method: "PATCH",
        },
      );

      const setupLink = res?.data?.setupLink;
      // Find the approved pharmacy's info (email, name)
      const approvedPharmacy = pendingPharmacies.find((p) => p.id === id);
      if (setupLink && approvedPharmacy) {
        // FIX: use legalEntityName as fallback since name may be empty
        sendApprovalEmail(
          approvedPharmacy.email || approvedPharmacy.contactPersonEmail || '',
          approvedPharmacy.name || approvedPharmacy.legalEntityName || 'Pharmacy',
          setupLink
        );
        window.prompt(
          "Copy this setup link and send to the pharmacy:",
          setupLink,
        );
      } else {
        alert("Approved! (No setup link returned)");
      }

      await loadPendingPharmacies();
    } catch (e: any) {
      setPharmacyError(e?.message || "Approve failed");
    }
  };

  const onReject = async (id: number) => {
    const reason = prompt("Reject reason?") || "Not specified";
    try {
      await apiFetch(`/api/v1/admin/pharmacies/${id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason }),
      });
      await loadPendingPharmacies();
    } catch (e: any) {
      setPharmacyError(e?.message || "Reject failed");
    }
  };

  const [activeSection, setActiveSection] = useState<
    "dashboard" | "pharmacies" | "medicines" | "inquiries" | "settings"
  >("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (activeSection === "medicines") {
      loadMedicines({ page: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  // Inquiries State
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  // Stats
  const [totalMedicines, setTotalMedicines] = useState<number>(0);
  const [totalActivePharmacies, setTotalActivePharmacies] = useState<number>(0);

  // Fetch total medicines and total active pharmacies
  useEffect(() => {
    const fetchTotalMedicines = async () => {
      try {
        const res = await apiFetch<number>('/api/v1/admin/medicines/count');
        setTotalMedicines(typeof res === 'number' ? res : 0);
      } catch {
        setTotalMedicines(0);
      }
    };

    const fetchTotalActivePharmacies = async () => {
      try {
        const res = await apiFetch<number>('/api/v1/admin/pharmacies/count?status=APPROVED');
        setTotalActivePharmacies(typeof res === 'number' ? res : 0);
      } catch {
        setTotalActivePharmacies(0);
      }
    };

    fetchTotalMedicines();
    fetchTotalActivePharmacies();
  }, []);

  const stats = {
    totalPharmacies: totalActivePharmacies,
    pendingReviews: pendingPharmacies.filter((p) => p.status === "pending").length,
    totalMedicines,
    activeUsers: 8540,
  };

  const filteredPharmacies = pendingPharmacies.filter((p) =>
    pharmacyFilter === "all" ? true : p.status === pharmacyFilter,
  );

  // --- Render Helpers ---

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            label: "Total Medicines",
            value: stats.totalMedicines,
            icon: Pill,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            label: "Active Pharmacies",
            value: stats.totalPharmacies,
            icon: Building2,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
          },
          {
            label: "Pending Reviews",
            value: stats.pendingReviews,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-100",
          },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div>
              <p className="text-base text-gray-500 font-semibold mb-2">
                {kpi.label}
              </p>
              <h3 className="text-3xl font-extrabold text-gray-900">
                {kpi.value.toLocaleString()}
              </h3>
            </div>
            <div className={`p-4 rounded-xl ${kpi.bg}`}>
              <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Pharmacy Activity Status
            </h3>
            <select
              className="text-sm border-gray-200 rounded-lg text-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
              aria-label="Select activity period"
              title="Select activity period"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="w-full" style={{ height: "320px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA_ACTIVITY}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <RechartsTooltip
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px" }}
                />
                {/* FIX: dataKey must match the lowercase keys in CHART_DATA_ACTIVITY */}
                <Bar
                  dataKey="active"
                  name="Active"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
                <Bar
                  dataKey="inactive"
                  name="Dormant"
                  fill="#e5e7eb"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Medicines Availability Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Medicine Stock Status
          </h3>
          <div className="w-full relative" style={{ height: "256px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CHART_DATA_MEDICINES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CHART_DATA_MEDICINES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
              <span className="text-3xl font-bold text-gray-900">100%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Links / Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Pending Registrations
            </h3>
            <button
              onClick={() => {
                setActiveSection("pharmacies");
                setPharmacyFilter("pending");
              }}
              className="text-indigo-600 text-sm hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {pendingPharmacies
              .filter((p) => p.status === "pending")
              .slice(0, 3)
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {p.legalEntityName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(p.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            {pendingPharmacies.filter((p) => p.status === "pending").length ===
              0 && (
              <p className="text-gray-500 text-sm italic">
                No pending registrations.
              </p>
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Inquiries</h3>
            <button
              onClick={() => setActiveSection("inquiries")}
              className="text-indigo-600 text-sm hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {MOCK_INQUIRIES.map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {inquiry.subject}
                    </p>
                    <p className="text-xs text-gray-500">
                      {inquiry.sender} • {inquiry.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPharmacies = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setPharmacyFilter(f as any)}
              className={`px-4 py-2 text-sm rounded-md transition-all ${
                pharmacyFilter === f
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search pharmacies..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-4 py-4 whitespace-nowrap">
                  Legal Entity Name
                </th>
                <th className="px-4 py-4 whitespace-nowrap">Trade Name</th>
                <th className="px-4 py-4 whitespace-nowrap">NMRA License</th>
                <th className="px-4 py-4 whitespace-nowrap">
                  Business Reg No.
                </th>
                <th className="px-4 py-4 whitespace-nowrap">Address</th>
                <th className="px-4 py-4 whitespace-nowrap">Telephone</th>
                <th className="px-4 py-4 whitespace-nowrap">Email</th>
                <th className="px-4 py-4 whitespace-nowrap">Entity Type</th>
                <th className="px-4 py-4 whitespace-nowrap">Contact Person</th>
                <th className="px-4 py-4 whitespace-nowrap">Contact Title</th>
                <th className="px-4 py-4 whitespace-nowrap">Contact Phone</th>
                <th className="px-4 py-4 whitespace-nowrap">Contact Email</th>
                <th className="px-4 py-4 whitespace-nowrap">Submitted Date</th>
                <th className="px-4 py-4 whitespace-nowrap">Status</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPharmacies.length === 0 ? (
                <tr>
                  <td
                    colSpan={15}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No pharmacies found matching the filter.
                  </td>
                </tr>
              ) : (
                filteredPharmacies.map((pharmacy) => (
                  <tr
                    key={pharmacy.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {pharmacy.legalEntityName}
                    </td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                      {pharmacy.tradeName || "-"}
                    </td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                      {pharmacy.nmraLicense}
                    </td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                      {pharmacy.businessRegNumber}
                    </td>
                    <td
                      className="px-4 py-4 text-gray-500 max-w-xs truncate"
                      title={pharmacy.address}
                    >
                      {pharmacy.address}
                    </td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                      {pharmacy.telephone}
                    </td>
                    <td
                      className="px-4 py-4 text-gray-500 max-w-xs truncate"
                      title={pharmacy.email}
                    >
                      {pharmacy.email}
                    </td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                      {pharmacy.entityType}
                    </td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                      {pharmacy.contactPersonName}
                    </td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                      {pharmacy.contactPersonTitle}
                    </td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                      {pharmacy.contactPersonPhone}
                    </td>
                    <td
                      className="px-4 py-4 text-gray-500 max-w-xs truncate"
                      title={pharmacy.contactPersonEmail}
                    >
                      {pharmacy.contactPersonEmail}
                    </td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(pharmacy.submittedDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          pharmacy.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : pharmacy.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pharmacy.status.charAt(0).toUpperCase() +
                          pharmacy.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {pharmacy.status === "pending" && (
                          <>
                            <button
                              onClick={() => onApprove(pharmacy.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => onReject(pharmacy.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit pharmacy"
                          onClick={() => alert('Edit pharmacy feature coming soon!')}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
          <p>
            Showing {filteredPharmacies.length} of {pendingPharmacies.length}{" "}
            pharmacies
          </p>
        </div>
      </div>
    </div>
  );

  // Medicine modal state
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] =
    useState<AdminMedicineRow | null>(null);
  const [medicines, setMedicines] = useState<AdminMedicineRow[]>([]);
  const [, setMedLoading] = useState(false);
  const [, setMedError] = useState<string | null>(null);

  const [medPage, setMedPage] = useState(0);
  const [medSize] = useState(10);
  const [medTotal, setMedTotal] = useState(0);
  const [medTotalPages, setMedTotalPages] = useState(0);

  const [medQ, setMedQ] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | CatalogStatus>("");
  const [filterManufacturer] = useState<string>("");
  const [] = useState<string>("");

  // Form state for modal
  const [medicineForm, setMedicineForm] = useState({
    genericName: "",
    brandName: "",
    manufacturer: "",
    country: "",
    regNo: "",
    status: "ACTIVE" as CatalogStatus,
  });

  // Open modal for add/edit
  const openMedicineModal = (med: AdminMedicineRow | null = null) => {
    setEditingMedicine(med);
    if (med) {
      setMedicineForm({
        genericName: med.genericName,
        brandName: med.brandName,
        manufacturer: med.manufacturer || "",
        country: med.country || "",
        regNo: med.regNo,
        status: med.status,
      });
    } else {
      setMedicineForm({
        genericName: "",
        brandName: "",
        manufacturer: "",
        country: "",
        regNo: "",
        status: "ACTIVE",
      });
    }
    setIsMedicineModalOpen(true);
  };

  // Close modal
  const closeMedicineModal = () => {
    setIsMedicineModalOpen(false);
    setEditingMedicine(null);
  };

  // FIX: typed event parameter
  const handleMedicineFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMedicineForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save medicine (add or edit)
  const handleMedicineSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const editId = editingMedicine?.id ?? null;
    const isEdit = editId !== null;

    try {
      if (isEdit) {
        await apiFetch(`/api/v1/admin/medicines/${editId}`, {
          method: "PUT",
          body: JSON.stringify({
            regNo: medicineForm.regNo,
            genericName: medicineForm.genericName,
            brandName: medicineForm.brandName,
            manufacturer: medicineForm.manufacturer,
            country: medicineForm.country,
            status: medicineForm.status,
          }),
        });
      } else {
        await apiFetch(`/api/v1/admin/medicines`, {
          method: "POST",
          body: JSON.stringify({
            regNo: medicineForm.regNo,
            genericName: medicineForm.genericName,
            brandName: medicineForm.brandName,
            manufacturer: medicineForm.manufacturer,
            country: medicineForm.country,
            status: medicineForm.status,
          }),
        });
      }

      closeMedicineModal();
      await loadMedicines({ page: isEdit ? medPage : 0, q: medQ });
    } catch (err: any) {
      // FIX: typed catch variable
      alert(err?.message || "Save failed");
    }
  };

  // Delete medicine
  const handleMedicineDelete = async (id: number) => {
    const ok = window.confirm("Are you sure you want to delete this medicine?");
    if (!ok) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/admin/medicines/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Delete failed (${res.status})`);
      }

      await loadMedicines({ page: medPage, q: medQ });
      // FIX: call directly instead of optional chaining on a local function
      showMedNotice("success", "Medicine deleted ✅");
    } catch (err: any) {
      showMedNotice("error", err.message || "Delete failed ❌");
      console.error(err);
    }
  };

  const [medNotice, setMedNotice] = useState<null | {
    type: "success" | "error";
    text: string;
  }>(null);

  function showMedNotice(type: "success" | "error", text: string) {
    setMedNotice({ type, text });
    setTimeout(() => setMedNotice(null), 3000);
  }

  // --- Medicine search (autocomplete) ---
  const [medicineQuery, setMedicineQuery] = useState("");
  const [medicineSuggestions, setMedicineSuggestions] = useState<SuggestItem[]>(
    [],
  );
  const [showMedicineSuggestions, setShowMedicineSuggestions] = useState(false);
  const [, setMedicineSuggestLoading] = useState(false);

  useEffect(() => {
    const q = medicineQuery.trim();

    if (q.length < 2) {
      setMedicineSuggestions([]);
      setMedicineSuggestLoading(false);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setMedicineSuggestLoading(true);
        const res = await apiFetch<SuggestItem[]>(
          `/api/v1/admin/medicines/suggest?q=${encodeURIComponent(q)}`,
        );
        setMedicineSuggestions(Array.isArray(res) ? res : []);
      } catch {
        setMedicineSuggestions([]);
      } finally {
        setMedicineSuggestLoading(false);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [medicineQuery]);

  const renderMedicineDatabase = () => (
    <div className="space-y-6">
      {/* Notice banner */}
      {medNotice && (
        <div
          className={`px-4 py-3 rounded-lg text-sm font-medium ${
            medNotice.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {medNotice.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="flex flex-1 gap-2 flex-wrap items-center min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={medicineQuery}
              onChange={(e) => {
                setMedicineQuery(e.target.value);
                setShowMedicineSuggestions(true);
              }}
              onFocus={() => setShowMedicineSuggestions(true)}
              onBlur={() =>
                setTimeout(() => setShowMedicineSuggestions(false), 150)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setMedQ(medicineQuery);
                  loadMedicines({ page: 0, q: medicineQuery });
                  setShowMedicineSuggestions(false);
                }
              }}
              placeholder="Search medicines..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64"
            />

            {showMedicineSuggestions && medicineQuery.length >= 2 && (
              <div className="absolute top-full mt-2 w-64 bg-white border rounded-xl shadow-lg z-[9999]">
                {medicineSuggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-gray-50"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={async () => {
                      setMedicineQuery(s.name);
                      setShowMedicineSuggestions(false);

                      const full = await apiFetch<AdminMedicineRow>(
                        `/api/v1/admin/medicines/${s.id}`,
                      );
                      openMedicineModal(full);
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <Filter className="w-4 h-4 text-gray-400" />
            {/* FIX: apply new status immediately by passing it directly to loadMedicines */}
            <select
              value={filterStatus === "ARCHIVED" ? "INACTIVE" : filterStatus}
              onChange={(e) => {
                const val = e.target.value;
                const newStatus: "" | CatalogStatus =
                  val === "ACTIVE" ? "ACTIVE" : val === "INACTIVE" ? "ARCHIVED" : "";
                setFilterStatus(newStatus);
                // pass newStatus directly to avoid stale closure
                setMedPage(0);
                loadMedicinesWithStatus(0, medQ, newStatus);
              }}
              className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Filter by status"
              aria-label="Filter by status"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>
        <div className="flex items-center sm:items-end justify-end min-w-[140px]">
          <button
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150"
            style={{ minWidth: 140, height: 40 }}
            onClick={() => openMedicineModal()}
          >
            <Plus className="w-4 h-4" />
            <span className="font-semibold">Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Modal for Add/Edit Medicine */}
      <AnimatePresence>
        {isMedicineModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3"
            onClick={closeMedicineModal}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingMedicine ? "Edit Medicine" : "Add Medicine"}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-700"
                  onClick={closeMedicineModal}
                  title="Close"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleMedicineSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Generic Name
                    </label>
                    <input
                      name="genericName"
                      value={medicineForm.genericName}
                      onChange={handleMedicineFormChange}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      placeholder="Enter generic name"
                      title="Generic Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Name
                    </label>
                    <input
                      name="brandName"
                      value={medicineForm.brandName}
                      onChange={handleMedicineFormChange}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      placeholder="Enter brand name"
                      title="Brand Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manufacturer
                    </label>
                    <input
                      name="manufacturer"
                      value={medicineForm.manufacturer}
                      onChange={handleMedicineFormChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      placeholder="Enter manufacturer"
                      title="Manufacturer"
                      aria-label="Manufacturer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      name="country"
                      value={medicineForm.country}
                      onChange={handleMedicineFormChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      placeholder="Enter your country"
                      title="Country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reg. No
                    </label>
                    <input
                      name="regNo"
                      value={medicineForm.regNo}
                      onChange={handleMedicineFormChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      placeholder="Enter registration number"
                      title="Registration Number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={medicineForm.status}
                      onChange={handleMedicineFormChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      title="Status"
                      aria-label="Status"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="ARCHIVED">INACTIVE</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={closeMedicineModal}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                  >
                    {editingMedicine ? "Save Changes" : "Add Medicine"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table id="medicines-table" className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Generic Name</th>
                <th className="px-6 py-4">Brand Name</th>
                <th className="px-6 py-4">Manufacturer</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Reg. No</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {medicines.map((med) => (
                <tr key={med.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{med.genericName}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {med.brandName}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {med.manufacturer || "Generic Pharma"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {med.country || "USA"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {med.regNo || "RX-12345"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className={`px-3 py-1 rounded-full text-xs font-semibold focus:outline-none transition-all duration-150 shadow-sm ${
                        med.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                          : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
                      }`}
                      title={med.status === "ACTIVE" ? "Set as INACTIVE" : "Set as ACTIVE"}
                      onClick={async () => {
                        const newStatus: CatalogStatus = med.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE";
                        await apiFetch(`/api/v1/admin/medicines/${med.id}`, {
                          method: "PUT",
                          body: JSON.stringify({ ...med, status: newStatus }),
                        });
                        await loadMedicines({ page: medPage, q: medQ });
                      }}
                    >
                      {med.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        className="text-blue-900 hover:text-blue-700 p-1"
                        title="Edit medicine"
                        onClick={() => openMedicineModal(med)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z"
                          />
                        </svg>
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete medicine"
                        onClick={() => handleMedicineDelete(med.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
          <p>
            Showing {medTotal === 0 ? 0 : medPage * medSize + 1}-
            {Math.min((medPage + 1) * medSize, medTotal)} of {medTotal} items
          </p>

          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
              disabled={medPage <= 0}
              onClick={() => loadMedicines({ page: medPage - 1 })}
            >
              Previous
            </button>

            <button
              className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
              disabled={medPage >= medTotalPages - 1}
              onClick={() => loadMedicines({ page: medPage + 1 })}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  async function loadMedicines(params?: { page?: number; q?: string }) {
    const page = params?.page ?? medPage;
    const q = params?.q ?? medQ;
    await loadMedicinesWithStatus(page, q, filterStatus);
  }

  // FIX: separate function that accepts status directly to avoid stale closure
  async function loadMedicinesWithStatus(
    page: number,
    q: string,
    status: "" | CatalogStatus
  ) {
    setMedLoading(true);
    setMedError(null);

    try {
      const url =
        `/api/v1/admin/medicines?page=${page}&size=${medSize}` +
        (q ? `&q=${encodeURIComponent(q)}` : "") +
        (status ? `&status=${status}` : "") +
        (filterManufacturer
          ? `&manufacturer=${encodeURIComponent(filterManufacturer)}`
          : "");

      const res = await apiFetch<SpringPage<AdminMedicineRow>>(url);

      setMedicines(res.content);
      setMedPage(res.number);
      setMedTotal(res.totalElements);
      setMedTotalPages(res.totalPages);
    } catch (e: any) {
      setMedError(e?.message || "Failed to load medicines");
    } finally {
      setMedLoading(false);
    }
  }

  const renderInquiries = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[600px] flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-2">Inquiries</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {MOCK_INQUIRIES.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => setSelectedInquiry(inquiry)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedInquiry?.id === inquiry.id ? "bg-indigo-50 border-indigo-100" : ""}`}
              >
                <div className="flex justify-between mb-1">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      inquiry.status === "New"
                        ? "bg-blue-100 text-blue-700"
                        : inquiry.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {inquiry.status}
                  </span>
                  <span className="text-xs text-gray-400">{inquiry.date}</span>
                </div>
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {inquiry.subject}
                </h4>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {inquiry.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[600px] flex flex-col">
          {selectedInquiry ? (
            <>
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedInquiry.subject}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      From:{" "}
                      <span className="font-medium text-gray-900">
                        {selectedInquiry.sender}
                      </span>{" "}
                      ({selectedInquiry.role})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50">
                      Assign
                    </button>
                    <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                <div className="flex gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="bg-white p-4 rounded-lg rounded-tl-none shadow-sm border border-gray-100 max-w-lg">
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {selectedInquiry.message}
                    </p>
                    <span className="text-xs text-gray-400 mt-2 block">
                      {selectedInquiry.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-4">
                  <textarea
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    rows={3}
                    placeholder="Type your reply here..."
                  ></textarea>
                  <button className="self-end px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
              <p>Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          General Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Timezone</p>
              <p className="text-sm text-gray-500">
                Set the system timezone for logs
              </p>
            </div>
            <select className="border-gray-200 rounded-lg text-sm" aria-label="Timezone">
              <option>(GMT+05:30) Colombo, Sri Lanka</option>
              <option>(GMT+00:00) UTC</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">
                Receive daily digest of activities
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer" htmlFor="email-notifications-checkbox">
              <input
                id="email-notifications-checkbox"
                type="checkbox"
                className="sr-only peer"
                defaultChecked
                aria-label="Enable email notifications"
                title="Enable email notifications"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-red-600">
          Blacklist Management
        </h3>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter Email, Phone or Reg No..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm"
          />
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">
            Block
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-500">
          No blacklisted entities found.
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="border-r border-gray-200 flex-shrink-0 relative z-20 flex flex-col"
        style={{
          background: "linear-gradient(180deg, #04364A 0%, #145374 100%)",
        }}
      >
        {/* Sidebar Header */}
        <>
          {isSidebarOpen ? (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-b-2xl shadow-sm"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div className="flex-shrink-0 bg-white rounded-xl shadow-md p-1 border border-gray-100">
                <img
                  src={logoImage}
                  alt="Pharmora Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight uppercase drop-shadow-md"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: "0.06em",
                  textShadow: "0 1px 8px #04364A",
                }}
              >
                <b>Pharmora</b>
              </motion.h1>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="ml-auto p-1 rounded-full bg-[#145374] shadow hover:bg-[#04364A] transition-colors border border-gray-200"
                title="Collapse sidebar"
              >
                <Menu className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-4 gap-2 w-full"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1 rounded-full bg-[#145374] shadow hover:bg-[#04364A] transition-colors border border-gray-200 flex items-center justify-center"
                title="Expand sidebar"
              >
                <Menu className="w-4 h-4 text-white" />
              </button>
              <div className="flex items-center justify-center w-full">
                <div className="bg-white rounded-xl shadow-md p-2 border border-gray-100 flex items-center justify-center mx-auto">
                  <img
                    src={logoImage}
                    alt="Pharmora Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </>

        <nav className="flex-1 px-4 space-y-2 py-4">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "pharmacies", label: "Pharmacies", icon: Building2 },
            { id: "medicines", label: "Medicine Database", icon: Pill },
            { id: "inquiries", label: "Inquiries", icon: MessageSquare },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold
                ${
                  activeSection === item.id
                    ? "bg-[#145374] text-white shadow-md"
                    : "bg-[#04364A] text-white hover:bg-[#145374] hover:text-white"
                }
              `}
              style={{
                background: activeSection === item.id ? "#145374" : "#04364A",
                color: "#fff",
                border: "none",
                boxShadow:
                  activeSection === item.id
                    ? "0 2px 8px rgba(20,83,116,0.12)"
                    : "none",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0 text-white" />
              {isSidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 bg-red-500 text-white hover:bg-red-600 rounded-xl ${!isSidebarOpen && "justify-center"}`}
            style={{ fontWeight: 700 }}
            onClick={async () => {
              try {
                await apiFetch("/api/v1/auth/logout", { method: "POST" });
              } catch {
                // ignore errors
              }
              navigate("/admin");
            }}
          >
            <LogOut className="w-5 h-5 text-white" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800 capitalize">
            {activeSection.replace("-", " ")}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                AD
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Admin User</p>
                <p className="text-gray-500 text-xs">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-screen-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === "dashboard" && renderDashboard()}
                {activeSection === "pharmacies" && renderPharmacies()}
                {activeSection === "medicines" && renderMedicineDatabase()}
                {activeSection === "inquiries" && renderInquiries()}
                {activeSection === "settings" && renderSettings()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}