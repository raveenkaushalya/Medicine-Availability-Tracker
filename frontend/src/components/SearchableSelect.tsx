import { useState, useRef, useEffect } from 'react';

interface Medicine {
  id: number;
  genericName?: string;
  brandName?: string;
  manufacturer?: string;
  country?: string;
  regNo?: string;
  status?: string;
  dosage?: string;
}

interface SearchableSelectProps {
  medicines: Medicine[];
  value: string | number;
  onChange: (value: string | number) => void;
  label?: string;
}

export function SearchableSelect({ medicines, value, onChange, label }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = medicines.filter(med => {
    const term = search.toLowerCase();
    return (med.genericName || '').toLowerCase().includes(term);
  });

  const selectedMed = medicines.find(med => med.id === value);

  return (
    <div className="relative" ref={containerRef}>
      {label && <label className="block text-gray-700 mb-1 text-xs sm:text-sm font-medium">{label}</label>}
      <button
        type="button"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedMed
          ? `${selectedMed.genericName || ''}${selectedMed.genericName && selectedMed.brandName ? ' / ' : ''}${selectedMed.brandName || ''}${selectedMed.genericName || selectedMed.brandName ? ' - ' : ''}${selectedMed.dosage || ''}${selectedMed.manufacturer ? ' - ' + selectedMed.manufacturer : ''}${selectedMed.country ? ' - ' + selectedMed.country : ''}${selectedMed.regNo ? ' - ' + selectedMed.regNo : ''}`
          : 'Select a medicine...'}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <input
            type="text"
            className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none text-xs sm:text-sm"
            placeholder="Search medicine..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          <ul className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" role="listbox">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-gray-400 text-xs">No medicines found</li>
            )}
            {filtered.map(med => (
              <li
                key={med.id}
                className={`px-3 py-2 cursor-pointer text-xs sm:text-sm hover:bg-blue-100 ${value === med.id ? 'bg-blue-50 font-semibold' : ''}`}
                onClick={() => {
                  onChange(med.id);
                  setOpen(false);
                  setSearch('');
                }}
                role="option"
                aria-selected={value === med.id}
              >
                {med.genericName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
