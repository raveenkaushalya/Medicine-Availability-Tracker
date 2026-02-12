import { useState, useRef, useEffect } from 'react';

interface Medicine {
  id: number;
  name: string;
  genericName?: string;
  brandName?: string;
  dosage?: string;
  category?: string;
}

interface SearchableSelectProps {
  medicines: Medicine[];
  value: string;
  onChange: (value: string) => void;
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
    return (
      (med.genericName || med.name || '').toLowerCase().includes(term) ||
      (med.brandName || '').toLowerCase().includes(term) ||
      (med.dosage || '').toLowerCase().includes(term) ||
      (med.category || '').toLowerCase().includes(term)
    );
  });

  const selectedMed = medicines.find(med => med.name === value);

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
          ? `${selectedMed.genericName ? selectedMed.genericName : ''}${selectedMed.genericName && selectedMed.brandName ? ' / ' : ''}${selectedMed.brandName ? selectedMed.brandName : ''}${selectedMed.genericName || selectedMed.brandName ? ' - ' : ''}${selectedMed.name}${selectedMed.dosage ? ' - ' + selectedMed.dosage : ''}${selectedMed.category ? ' - ' + selectedMed.category : ''}`
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
                className={`px-3 py-2 cursor-pointer text-xs sm:text-sm hover:bg-blue-100 ${value === med.name ? 'bg-blue-50 font-semibold' : ''}`}
                onClick={() => {
                  onChange(med.name);
                  setOpen(false);
                  setSearch('');
                }}
                role="option"
                aria-selected={value === med.name}
              >
                {med.genericName ? med.genericName : ''}{med.genericName && med.brandName ? ' / ' : ''}{med.brandName ? med.brandName : ''}{med.genericName || med.brandName ? ' - ' : ''}{med.name}{med.dosage ? ' - ' + med.dosage : ''}{med.category ? ' - ' + med.category : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
