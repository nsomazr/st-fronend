import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';
import { COUNTRIES } from '../../utils/countries';
import { controlClass } from './formStyles';

const DROPDOWN_MAX_HEIGHT = 280;

function useDropdownPosition(open, triggerRef) {
  const [pos, setPos] = useState(null);

  const update = useCallback(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openAbove = spaceBelow < DROPDOWN_MAX_HEIGHT + 16 && spaceAbove > spaceBelow;

    setPos({
      left: rect.left,
      width: rect.width,
      openAbove,
      ...(openAbove
        ? { bottom: window.innerHeight - rect.top + 8 }
        : { top: rect.bottom + 8 }),
    });
  }, [open, triggerRef]);

  useEffect(() => {
    update();
    if (!open) return;
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, update]);

  return pos;
}

export default function CountryPicker({ value, onChange, error, placeholder = 'Select your country' }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const pos = useDropdownPosition(open, triggerRef);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const selected = COUNTRIES.find((c) => c.name === value);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && close();
    const onClick = (e) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !panelRef.current?.contains(e.target)
      ) {
        close();
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, close]);

  const dropdown = open && pos && createPortal(
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        left: pos.left,
        width: pos.width,
        ...(pos.openAbove ? { bottom: pos.bottom } : { top: pos.top }),
        maxHeight: DROPDOWN_MAX_HEIGHT,
      }}
      className="z-[9999] flex flex-col bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      <div className="p-3 border-b border-gray-100 flex items-center gap-2 shrink-0">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search countries..."
          className="flex-1 text-sm outline-none"
          autoFocus
        />
        {query && (
          <button type="button" onClick={() => setQuery('')}>
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
      <ul className="overflow-y-auto p-2 flex-1 min-h-0">
        {filtered.map((country) => (
          <li key={country.code}>
            <button
              type="button"
              onClick={() => {
                onChange(country.name);
                close();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                value === country.name
                  ? 'bg-brand-gold/20 text-brand-navy font-semibold'
                  : 'hover:bg-brand-light text-gray-700'
              }`}
            >
              <span className="text-base leading-none">{country.flag}</span>
              {country.name}
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-4">No countries found</p>
        )}
      </ul>
    </div>,
    document.body,
  );

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={`${controlClass(error)} flex items-center justify-between text-left ${
          open ? 'border-brand-gold ring-2 ring-brand-gold/30' : ''
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
          {selected ? (
            <>
              <span className="text-base leading-none shrink-0">{selected.flag}</span>
              <span className="text-brand-navy font-medium truncate">{selected.name}</span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {dropdown}
    </div>
  );
}
