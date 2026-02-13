import { useState, useMemo, useCallback, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { motion, AnimatePresence } from 'motion/react';
import { ChatbotPopup } from '../../components/ChatbotPopup';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
// import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { InquiriesView } from './components/InquiriesView';
import { SettingsView } from './components/SettingsView';
import { ProfileView } from './components/ProfileView';

// Master medication database
export const medicationDatabase = [
  { id: 1, name: "Aspirin", dosage: "500mg", category: "Pain Relief" },
  { id: 2, name: "Ibuprofen", dosage: "200mg", category: "Pain Relief" },
  { id: 3, name: "Amoxicillin", dosage: "500mg", category: "Antibiotic" },
  { id: 4, name: "Lisinopril", dosage: "10mg", category: "Blood Pressure" },
  { id: 5, name: "Metformin", dosage: "500mg", category: "Diabetes" },
  { id: 6, name: "Atorvastatin", dosage: "20mg", category: "Cholesterol" },
  { id: 7, name: "Omeprazole", dosage: "20mg", category: "Acid Reflux" },
  { id: 8, name: "Levothyroxine", dosage: "50mcg", category: "Thyroid" },
  { id: 9, name: "Amlodipine", dosage: "5mg", category: "Blood Pressure" },
  { id: 10, name: "Metoprolol", dosage: "50mg", category: "Blood Pressure" },
  { id: 11, name: "Albuterol", dosage: "90mcg", category: "Asthma" },
  { id: 12, name: "Gabapentin", dosage: "300mg", category: "Nerve Pain" },
  { id: 13, name: "Hydrochlorothiazide", dosage: "25mg", category: "Diuretic" },
  { id: 14, name: "Sertraline", dosage: "50mg", category: "Antidepressant" },
  { id: 15, name: "Simvastatin", dosage: "40mg", category: "Cholesterol" },
  { id: 16, name: "Losartan", dosage: "50mg", category: "Blood Pressure" },
  { id: 17, name: "Azithromycin", dosage: "250mg", category: "Antibiotic" },
  { id: 18, name: "Prednisone", dosage: "10mg", category: "Steroid" },
  { id: 19, name: "Furosemide", dosage: "40mg", category: "Diuretic" },
  { id: 20, name: "Pantoprazole", dosage: "40mg", category: "Acid Reflux" },
];

export interface InventoryItem {
  medicationId: number;
  quantity: number;
  price: number;
}

export function PharmacyOwnerDashboard() {
  const [pharmacy, setPharmacy] = useState<any>(null);
const pharmacyName = pharmacy?.tradeName || pharmacy?.legalEntityName || "Pharmacy";

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activeView, setActiveView] = useState('inventory');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
  const loadMe = async () => {
    try {
      const res = await apiFetch("/api/v1/pharmacies/me");
      setPharmacy(res.data); // because ApiResponse { success, message, data }
    } catch (e) {
      // optional: redirect to login if not logged in
      console.error(e);
    }
  };
  loadMe();
}, []);

  // Memoize handlers for better performance
  const handleAddToInventory = useCallback((medicationId: number, quantity: number, price: number) => {
    setInventory(prev => {
      const existingIndex = prev.findIndex(item => item.medicationId === medicationId);

      if (existingIndex >= 0) {
        const newInventory = [...prev];
        newInventory[existingIndex] = { medicationId, quantity, price };
        return newInventory;
      } else {
        return [...prev, { medicationId, quantity, price }];
      }
    });
  }, []);

  const handleRemoveFromInventory = useCallback((medicationId: number) => {
    setInventory(prev => prev.filter(item => item.medicationId !== medicationId));
  }, []);

  const handleUpdateInventory = useCallback((medicationId: number, quantity: number, price: number) => {
    setInventory(prev =>
      prev.map(item =>
        item.medicationId === medicationId ? { medicationId, quantity, price } : item
      )
    );
  }, []);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Memoize the rendered view for performance
  const renderedView = useMemo(() => {
    switch (activeView) {
      case 'inventory':
        return (
          <InventoryView
            inventory={inventory}
            medications={medicationDatabase}
            onAddToInventory={handleAddToInventory}
            onUpdateInventory={handleUpdateInventory}
            onRemoveFromInventory={handleRemoveFromInventory}
          />
        );
      case 'settings':
        return <SettingsView />;
      case 'profile':
      case 'profileview':
        return (
  <ProfileView
    pharmacy={pharmacy}
    onRefresh={async () => {
      const res = await apiFetch("/api/v1/pharmacies/me");
      setPharmacy(res.data);
    }}
  />
);

      default:
        return (
          <InventoryView
            inventory={inventory}
            medications={medicationDatabase}
            onAddToInventory={handleAddToInventory}
            onUpdateInventory={handleUpdateInventory}
            onRemoveFromInventory={handleRemoveFromInventory}
          />
        );
    }
  }, [activeView, inventory, handleAddToInventory, handleUpdateInventory, handleRemoveFromInventory]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row relative">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        pharmacyName={pharmacyName}
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full lg:w-auto">
        {/* Header */}
        <Header
          pharmacyName={pharmacyName}
          onMenuToggle={handleSidebarToggle}
        />

        {/* Content Area */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          <AnimatePresence>
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderedView}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Chatbot Button and Popup */}
      <div className="fixed z-50 bottom-8 right-8 flex items-center gap-3">
        <span className="bg-white text-blue-900 font-semibold px-4 py-2 rounded-full shadow border border-blue-100 select-none">Inquiries</span>
        <button
          className="w-16 h-16 rounded-full bg-blue-900 shadow-lg flex items-center justify-center hover:bg-blue-800 transition-colors focus:outline-none"
          style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.15)' }}
          onClick={() => setShowChatbot(true)}
          aria-label="Open chatbot"
        >
          {/* Messaging (chat bubble) icon */}
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z" />
          </svg>
        </button>
      </div>
      {showChatbot && (
        <ChatbotPopup onClose={() => setShowChatbot(false)} />
      )}
    </div>
  );
}