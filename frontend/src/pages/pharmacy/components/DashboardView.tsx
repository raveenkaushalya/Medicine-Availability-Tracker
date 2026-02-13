import { motion } from "motion/react";
import { memo, useEffect, useMemo, useState } from "react";
import { KPIWidgets } from "./KPIWidgets";
import { InventoryItem } from "../PharmacyOwnerDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardViewProps {
  inventory: InventoryItem[];
  medications: any[];
}

type ActivityRow = {
  id: number;
  action: string; // ADDED | UPDATED | DELETED
  message: string;
  medicineId: number | null;
  medicineName: string | null;
  createdAt: string; // ISO
};

const API = "http://localhost:8080";

function actionDot(action: string) {
  switch ((action || "").toUpperCase()) {
    case "ADDED":
      return "bg-green-500";
    case "UPDATED":
      return "bg-blue-500";
    case "DELETED":
      return "bg-red-500";
    default:
      return "bg-purple-500";
  }
}

function timeAgo(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.max(0, now.getTime() - d.getTime());

  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

// Safe helpers for inventory rendering
function getName(item: any) {
  return (
    item?.medicineName ||
    item?.name ||
    item?.genericName ||
    item?.brandName ||
    item?.medicine?.genericName ||
    item?.medicine?.brandName ||
    "Unknown Medicine"
  );
}
function getCategory(item: any) {
  return item?.category || item?.medicineCategory || item?.medicine?.category || "—";
}
function getStock(item: any) {
  const v = item?.stock ?? item?.quantity ?? item?.qty ?? item?.availableQty;
  return Number.isFinite(Number(v)) ? Number(v) : 0;
}
function getPrice(item: any) {
  const v = item?.price ?? item?.unitPrice ?? item?.sellingPrice;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export const DashboardView = memo(function DashboardView(props: DashboardViewProps) {
  const { inventory } = props;

  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [activityErr, setActivityErr] = useState<string | null>(null);

  // ✅ fetch real activity
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setActivityErr(null);
        const res = await fetch(`${API}/api/v1/pharmacies/activity`, {
          credentials: "include",
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Failed to load activity");
        if (!cancelled) setActivity((json.data || []).slice(0, 4));
      } catch (e: any) {
        if (!cancelled) setActivityErr(e.message);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const topMedicines = useMemo(() => {
    const rows = (inventory || []).map((it: any) => ({
      name: getName(it),
      category: getCategory(it),
      stock: getStock(it),
      price: getPrice(it),
    }));
    rows.sort((a, b) => b.stock - a.stock);
    return rows.slice(0, 5);
  }, [inventory]);

  const chartData = useMemo(() => {
    return (inventory || [])
      .map((it: any) => ({ name: getName(it), stock: getStock(it) }))
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 8);
  }, [inventory]);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* KPI Widgets */}
      <KPIWidgets />

      {/* Stock Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 text-base sm:text-lg">Inventory Stock Overview</h3>
          <span className="text-xs sm:text-sm text-gray-500">
            {inventory?.length || 0} items
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {(!inventory || inventory.length === 0) && (
          <p className="text-sm text-gray-500 mt-3">
            No inventory yet. Add medicines to see stock analytics.
          </p>
        )}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Top Medicines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 h-full flex flex-col"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-gray-900 text-base sm:text-lg">Top Medicines</h3>
            <button className="text-blue-900 hover:text-blue-700 text-xs sm:text-sm">
              View All
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4 flex-1">
            {topMedicines.length === 0 ? (
              <p className="text-sm text-gray-500">No medicines in inventory yet.</p>
            ) : (
              topMedicines.map((m, index) => (
                <div key={`${m.name}-${index}`} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-900 text-xs sm:text-sm">{index + 1}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-xs sm:text-sm truncate">{m.name}</p>
                    <p className="text-gray-500 text-xs">{m.category}</p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-gray-900 text-xs sm:text-sm">
                      {Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(m.price)}
                    </p>
                    <p className="text-gray-500 text-xs">Stock: {m.stock}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* ✅ Recent Activity (NOW REAL) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 h-full flex flex-col"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-gray-900 text-base sm:text-lg">Recent Activity</h3>
            <button
              className="text-blue-900 hover:text-blue-700 text-xs sm:text-sm"
              onClick={() => window.location.reload()}
              type="button"
            >
              Refresh
            </button>
          </div>

          {activityErr && (
            <p className="text-xs text-red-600 mb-2">{activityErr}</p>
          )}

          <div className="space-y-3 sm:space-y-4 flex-1">
            {activity.length === 0 ? (
              <p className="text-sm text-gray-500">No recent activity yet.</p>
            ) : (
              activity.map((a) => (
                <div key={a.id} className="flex items-start gap-2 sm:gap-3">
                  <div className={`w-2 h-2 ${actionDot(a.action)} rounded-full mt-2 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900">
                      {a.action}: {a.medicineName || "Inventory"}
                    </p>
                    <p className="text-xs text-gray-500 break-words">
                      {a.message} • {timeAgo(a.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
});
