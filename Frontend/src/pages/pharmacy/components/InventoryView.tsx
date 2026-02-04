import { motion, AnimatePresence } from 'motion/react';
import { useState, memo } from 'react';
import { SearchableSelect } from '../../../components/SearchableSelect';
import { Search, Plus, Edit, Trash2, Package, Filter } from 'lucide-react';
import { InventoryItem } from '../PharmacyOwnerDashboard';

interface InventoryViewProps {
  inventory: InventoryItem[];
  medications: any[];
  onAddToInventory: (medicationId: number, quantity: number, price: number) => void;
  onUpdateInventory: (medicationId: number, quantity: number, price: number) => void;
  onRemoveFromInventory: (medicationId: number) => void;
}

export const InventoryView = memo(function InventoryView({
  inventory,
  medications,
  onAddToInventory,
  onUpdateInventory,
  onRemoveFromInventory
}: InventoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  // For select medicine search bar visibility
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<number | null>(null);

  // Form states
  const [selectedMedication, setSelectedMedication] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [genericName, setGenericName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [dosage, setDosage] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [country, setCountry] = useState('');
  const [regNo, setRegNo] = useState('');
  const [status, setStatus] = useState('Active');
  const [stock, setStock] = useState('');



  const categories = ['All', ...new Set(medications.map(m => m.category))];


  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    const medication = medications.find(m => m.id === item.medicationId);
    if (!medication) return false;

    const matchesSearch = medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || medication.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate available and out-of-stock counts
  const availableCount = inventory.filter(item => item.quantity > 0).length;
  const outOfStockCount = inventory.filter(item => item.quantity === 0).length;



  const handleSubmit = () => {
    const medication = medications.find(m => m.name === selectedMedication);
    // Use 'stock' as the quantity field for adding/updating inventory
    if (medication && stock && price) {
      if (editingItem !== null) {
        onUpdateInventory(medication.id, parseInt(stock), parseFloat(price));
        setEditingItem(null);
      } else {
        onAddToInventory(medication.id, parseInt(stock), parseFloat(price));
      }
      resetForm();
      setShowAddModal(false);
    }
  };

  const resetForm = () => {
    setSelectedMedication('');
    setQuantity('');
    setPrice('');
    setGenericName('');
    setBrandName('');
    setDosage('');
    setManufacturer('');
    setCountry('');
    setRegNo('');
    setStatus('Active');
    setStock('');

  };

  const handleEdit = (item: InventoryItem) => {
    const medication = medications.find(m => m.id === item.medicationId);
    if (medication) {
      setSelectedMedication(medication.name);
      setQuantity(item.quantity.toString());
      setPrice(item.price.toString());
      setEditingItem(item.medicationId);
      setShowAddModal(true);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <h2 className="text-gray-900 text-lg sm:text-xl md:text-2xl">Medicine Inventory</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">Manage your medication stock and pricing</p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              resetForm();
              setEditingItem(null);
              setShowAddModal(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-xs sm:text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Add Medicine</span>
          </motion.button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 bg-white rounded-xl shadow border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100">
            <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-900">{availableCount}</div>
            <div className="text-xs text-gray-600">Available Medicines</div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
            <div className="text-xs text-gray-600">Out of Stock</div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Table Header with Filters */}
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h3 className="text-gray-900 text-sm sm:text-base md:text-lg">Current Inventory</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">Latest medication stock and availability</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
              />
            </div>
            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-48">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                title="Filter by category"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Generic Name</th>
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Brand Name</th>
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs text-gray-500 uppercase tracking-wider hidden md:table-cell">Manufacturer</th>
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs text-gray-500 uppercase tracking-wider hidden md:table-cell">Country</th>
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs text-gray-500 uppercase tracking-wider hidden lg:table-cell">Reg. No</th>
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
                    <p className="text-sm sm:text-base">No medications in inventory</p>
                    <p className="text-xs sm:text-sm mt-1">Add medications to get started</p>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const medication = medications.find(m => m.id === item.medicationId);
                  if (!medication) return null;

                  return (
                    <tr key={item.medicationId} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{medication.genericName || medication.name}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">{medication.brandName || medication.name}</div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">{medication.dosage}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden md:table-cell">{medication.manufacturer || 'N/A'}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden md:table-cell">{medication.country || 'N/A'}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden lg:table-cell">{medication.regNo || 'N/A'}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${medication.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {medication.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(item.price)}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`text-xs sm:text-sm font-medium ${item.quantity === 0 ? 'text-red-600' :
                          item.quantity < 10 ? 'text-amber-600' :
                            'text-green-600'
                          }`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-900 hover:text-blue-700 p-1"
                            title="Edit medicine"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => onRemoveFromInventory(item.medicationId)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Remove medicine"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-10 sm:p-16 max-w-4xl w-full shadow-2xl max-h-[100vh] min-h-[600px] overflow-y-auto"
            >

              <h3 className="text-gray-900 mb-4 sm:mb-6 text-base sm:text-lg md:text-xl">
                {editingItem ? 'Edit Medication' : 'Add New Medication'}
              </h3>

              <div className="space-y-3 sm:space-y-4">
                {/* Custom Searchable Dropdown for Medicine Selection */}
                <div>
                  <SearchableSelect
                    medicines={medications}
                    value={selectedMedication}
                    onChange={val => {
                      setSelectedMedication(val);
                      const med = medications.find(m => m.name === val);
                      if (med) {
                        setGenericName(med.genericName || med.name || '');
                        setBrandName(med.brandName || med.name || '');
                        setDosage(med.dosage || '');
                        setManufacturer(med.manufacturer || '');
                        setCountry(med.country || '');
                        setRegNo(med.regNo || '');
                        setStatus(med.status || 'Active');
                      }
                    }}
                    label="Select Medicine"
                  />
                </div>

                {/* Show details of selected medicine (read-only) */}
                {selectedMedication && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 mb-1 text-xs sm:text-sm font-medium">Generic Name</label>
                      <input type="text" value={genericName} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-xs sm:text-sm" title="Generic Name" placeholder="Generic Name" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 text-xs sm:text-sm font-medium">Brand Name</label>
                      <input type="text" value={brandName} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-xs sm:text-sm" title="Brand Name" placeholder="Brand Name" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 text-xs sm:text-sm font-medium">Dosage</label>
                      <input type="text" value={dosage} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-xs sm:text-sm" title="Dosage" placeholder="Dosage" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 text-xs sm:text-sm font-medium">Category</label>
                      <input type="text" value={medications.find(m => m.name === selectedMedication)?.category || ''} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-xs sm:text-sm" title="Category" placeholder="Category" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 text-xs sm:text-sm font-medium">Manufacturer</label>
                      <input type="text" value={manufacturer} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-xs sm:text-sm" title="Manufacturer" placeholder="Manufacturer" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 text-xs sm:text-sm font-medium">Country</label>
                      <input type="text" value={country} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-xs sm:text-sm" title="Country" placeholder="Country" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 text-xs sm:text-sm font-medium">Reg. No</label>
                      <input type="text" value={regNo} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-xs sm:text-sm" title="Reg. No" placeholder="Reg. No" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 text-xs sm:text-sm font-medium">Status</label>
                      <input type="text" value={status} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-xs sm:text-sm" title="Status" placeholder="Status" />
                    </div>
                  </div>
                )}

                {/* Stock and Price (manual entry) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 mb-1 sm:mb-2 text-xs sm:text-sm font-medium">Stock</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="Quantity"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 sm:mb-2 text-xs sm:text-sm font-medium">Price</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., 10.00"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                    setEditingItem(null);
                  }}
                  className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-3 sm:px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-xs sm:text-sm"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});