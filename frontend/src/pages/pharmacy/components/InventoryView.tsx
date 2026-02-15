import { useEffect, useMemo, useState } from "react";
import { SearchableSelect } from '../../../components/SearchableSelect';
import { apiFetch } from "../../../utils/api";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

type SuggestItem = { id: number; name?: string; label?: string };
type InventoryRow = {
  id: number;
  medicineId: number;
  regNo: string;
  genericName: string;
  brandName: string;
  dosage: string;
  manufacturer: string | null;
  country: string | null;
  stock: number;
  price: number;
};

export function InventoryView(props: { medicineDatabase: any[] }) {
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ TABLE search (inventory page)
  const [tableQuery, setTableQuery] = useState("");

  // ✅ MODAL search (add medicine)
  const [modalQuery, setModalQuery] = useState("");
  const [modalSuggestions, setModalSuggestions] = useState<SuggestItem[]>([]);
  const [showModalSug, setShowModalSug] = useState(false);

  // Modal
  const [open, setOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState<any>(null);
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // Load pharmacy inventory table
  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/v1/pharmacies/inventory");
      setRows(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // ✅ MODAL suggestions
  useEffect(() => {
    const query = modalQuery.trim();
    if (query.length < 2) {
      setModalSuggestions([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await apiFetch(
          `/api/medicines/suggest?q=${encodeURIComponent(query)}`,
        );
        setModalSuggestions(res.data || res || []);
      } catch {
        setModalSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [modalQuery]);

  // ✅ Filter rows by tableQuery only
  const filteredRows = useMemo(() => {
    const query = tableQuery.trim().toLowerCase();
    if (!query) return rows;

    const score = (r: InventoryRow) => {
      const g = (r.genericName || "").toLowerCase();
      const b = (r.brandName || "").toLowerCase();
      const reg = (r.regNo || "").toLowerCase();

      if (g.startsWith(query) || b.startsWith(query)) return 3;
      if (g.includes(query) || b.includes(query)) return 2;
      if (reg.includes(query)) return 1;
      return 0;
    };

    // ✅ keep all rows, but move matches to top
    return [...rows].sort((a, b) => score(b) - score(a));
  }, [tableQuery, rows]);

  // Select medicine from suggestion → fetch full details
  const selectMedicine = async (id: number) => {
    const med = await apiFetch(`/api/medicines/${id}`);
    const data = med.data ?? med;

    setSelectedMed(data);

    // ✅ close dropdown immediately
    setShowModalSug(false);
    setModalSuggestions([]);

    // ✅ set input text to selected item
    setModalQuery(
      (data.genericName || data.brandName || "") +
        (data.dosage ? ` - ${data.dosage}` : ""),
    );
  };

  const openAddModal = () => {
    setOpen(true);
    setEditId(null);
    setSelectedMed(null);
    setStock("");
    setPrice("");

    // ✅ clear modal search
    setModalQuery("");
    setModalSuggestions([]);
    setShowModalSug(false);
  };

  const openEditModal = (row: InventoryRow) => {
    setOpen(true);
    setEditId(row.id);

    setSelectedMed({
      id: row.medicineId,
      regNo: row.regNo,
      genericName: row.genericName,
      brandName: row.brandName,
      dosage: row.dosage,
      manufacturer: row.manufacturer,
      country: row.country,
      status: "Active",
    });

    setStock(String(row.stock));
    setPrice(String(row.price));

    // ✅ no modal search needed in edit
    setModalQuery(`${row.genericName} - ${row.dosage}`);
    setModalSuggestions([]);
    setShowModalSug(false);
  };

  const save = async () => {
    if (!selectedMed) return alert("Select a medicine first");
    if (stock === "" || price === "") return alert("Enter stock and price");

    const payload = {
      medicineId: Number(selectedMed.id),
      stock: Number(stock),
      price: Number(price),
    };

    if (editId) {
      await apiFetch(`/api/v1/pharmacies/inventory/${editId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await apiFetch(`/api/v1/pharmacies/inventory`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    setOpen(false);
    await loadInventory();
  };

  const remove = async (id: number) => {
    const ok = window.confirm("Delete this medicine from your inventory?");
    if (!ok) return;

    await apiFetch(`/api/v1/pharmacies/inventory/${id}`, { method: "DELETE" });
    await loadInventory();
  };

  // ✅ FIX KPI LOGIC
  const availableCount = rows.filter((r) => (r.stock ?? 0) > 0).length;
  const outOfStockCount = rows.filter((r) => (r.stock ?? 0) <= 0).length;

  return (
    <div className="space-y-6">
      {/* Title + Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Medicine Inventory
          </h2>
          <p className="text-gray-500 text-sm">
            Manage your medication stock and pricing
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800"
        >
          <Plus className="w-4 h-4" />
          Add Medicine
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">Available Medicines</p>
          <p className="text-2xl font-semibold text-gray-900">
            {availableCount}
          </p>
        </div>
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">Out of Stock</p>
          <p className="text-2xl font-semibold text-gray-900">
            {outOfStockCount}
          </p>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white border rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Current Inventory
          </h3>
          <p className="text-sm text-gray-500">
            Latest medication stock and availability
          </p>

          {/* Search bar with dropdown suggestions */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={tableQuery}
              onChange={(e) => setTableQuery(e.target.value)}
              placeholder="Search medications..."
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">GENERIC NAME</th>
                <th className="text-left px-4 py-3">BRAND NAME</th>
                <th className="text-left px-4 py-3">DOSAGE</th>
                <th className="text-left px-4 py-3">MANUFACTURER</th>
                <th className="text-left px-4 py-3">COUNTRY</th>
                <th className="text-left px-4 py-3">REG. NO</th>
                <th className="text-left px-4 py-3">STOCK</th>
                <th className="text-left px-4 py-3">PRICE</th>
                <th className="text-left px-4 py-3">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No medications in inventory
                  </td>
                </tr>
              ) : (
                filteredRows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-3">{r.genericName}</td>
                    <td className="px-4 py-3 font-semibold">{r.brandName}</td>
                    <td className="px-4 py-3">{r.dosage}</td>
                    <td className="px-4 py-3">{r.manufacturer || "N/A"}</td>
                    <td className="px-4 py-3">{r.country || "N/A"}</td>
                    <td className="px-4 py-3">{r.regNo || "N/A"}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      {r.stock}
                    </td>
                    <td className="px-4 py-3">
                      {Intl.NumberFormat("en-LK", {
                        style: "currency",
                        currency: "LKR",
                      }).format(Number(r.price || 0))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          className="text-blue-700 hover:text-blue-900"
                          title="Edit"
                          onClick={() => openEditModal(r)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                          onClick={() => remove(r.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {editId ? "Edit Medicine" : "Add New Medication"}
            </h3>

            {/* Search medicine (medicine_master) */}
            {!editId && (
              <div className="mb-4">
                <label className="text-sm text-gray-700">Select Medicine</label>
                <SearchableSelect
                  medicines={props.medicineDatabase || []}
                  value={selectedMed?.id || ''}
                  onChange={id => {
                    const med = (props.medicineDatabase || []).find(m => m.id === id);
                    setSelectedMed(med);
                  }}
                  label={undefined}
                />
              </div>
            )}

            {/* Auto filled details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">Generic Name</label>
                <input
                  value={selectedMed?.genericName || ""}
                  readOnly
                  className="w-full mt-2 px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Brand Name</label>
                <input
                  value={selectedMed?.brandName || ""}
                  readOnly
                  className="w-full mt-2 px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Dosage</label>
                <input
                  value={selectedMed?.dosage || ""}
                  readOnly
                  className="w-full mt-2 px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Reg. No</label>
                <input
                  value={selectedMed?.regNo || ""}
                  readOnly
                  className="w-full mt-2 px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
            </div>

            {/* Stock + Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div>
                <label className="text-sm text-gray-700">Stock</label>
                <input
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Quantity"
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Price</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 10.00"
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="px-6 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800"
              >
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
