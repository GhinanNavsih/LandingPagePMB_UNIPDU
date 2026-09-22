"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconChevronDown,
  IconCheck,
  IconSearch,
  IconSchool,
  IconX,
} from "@tabler/icons-react";
import { STUDY_PROGRAMS, type StudyProgramCode } from "@/lib/admissions-catalog";

interface CustomProgramSelectProps {
  id: "primaryProgramCode" | "secondaryProgramCode";
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  exclude?: string;
  required?: boolean;
  placeholder?: string;
}

function getDegreeBadge(label: string) {
  if (label.startsWith("S1")) return { badge: "S1", color: "bg-emerald-100 text-emerald-900 border-emerald-200" };
  if (label.startsWith("D3")) return { badge: "D3", color: "bg-teal-100 text-teal-900 border-teal-200" };
  if (label.startsWith("S2")) return { badge: "S2", color: "bg-amber-100 text-amber-900 border-amber-200" };
  if (label.includes("Profesi")) return { badge: "Profesi", color: "bg-purple-100 text-purple-900 border-purple-200" };
  return { badge: "Prodi", color: "bg-stone-100 text-stone-800 border-stone-200" };
}

export default function CustomProgramSelect({
  id,
  value,
  onChange,
  onBlur,
  onFocus,
  exclude,
  required,
  placeholder = "Pilih program studi",
}: CustomProgramSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Selected program info
  const selectedProgram = useMemo(
    () => STUDY_PROGRAMS.find(p => p.code === value),
    [value]
  );

  // Filter study programs based on search query and exclusion
  const filteredPrograms = useMemo(() => {
    const q = search.toLowerCase().trim();
    return STUDY_PROGRAMS.filter(program => {
      // Don't show excluded program (already picked in the other slot)
      if (exclude && program.code === exclude) return false;
      if (!q) return true;
      return (
        program.label.toLowerCase().includes(q) ||
        program.faculty.toLowerCase().includes(q) ||
        program.code.toLowerCase().includes(q)
      );
    });
  }, [search, exclude]);

  // Group filtered programs by faculty
  const groupedPrograms = useMemo(() => {
    const groups: { faculty: string; programs: typeof STUDY_PROGRAMS[number][] }[] = [];
    for (const program of filteredPrograms) {
      let group = groups.find(g => g.faculty === program.faculty);
      if (!group) {
        group = { faculty: program.faculty, programs: [] };
        groups.push(group);
      }
      group.programs.push(program);
    }
    return groups;
  }, [filteredPrograms]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          setSearch("");
          onBlur?.();
        }
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onBlur]);

  // Handle keyboard events (Escape to close)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearch("");
        buttonRef.current?.focus();
        onBlur?.();
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onBlur]);

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  function handleSelect(code: string) {
    onChange(code);
    setIsOpen(false);
    setSearch("");
    buttonRef.current?.focus();
    onBlur?.();
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input for native form validation or submission */}
      <input
        type="hidden"
        name={id}
        value={value}
        required={required}
        aria-hidden="true"
      />

      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-dropdown`}
        aria-describedby={`${id}-error`}
        onFocus={() => {
          onFocus?.();
        }}
        onClick={() => {
          if (!isOpen) {
            onFocus?.();
          }
          setIsOpen(prev => !prev);
        }}
        className={`w-full appearance-none rounded-xl border bg-white px-4 py-3.5 pr-11 text-left text-base outline-none transition flex items-center justify-between select-none ${
          isOpen
            ? "border-emerald-700 ring-4 ring-emerald-100"
            : "border-line hover:border-emerald-600/60 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
        }`}
      >
        {selectedProgram ? (
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 uppercase tracking-wide ${
                getDegreeBadge(selectedProgram.label).color
              }`}
            >
              {getDegreeBadge(selectedProgram.label).badge}
            </span>
            <span className="truncate font-medium text-ink">
              {selectedProgram.label}
            </span>
          </div>
        ) : (
          <span className="text-muted">{placeholder}</span>
        )}

        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted transition-transform duration-200">
          <IconChevronDown
            size={18}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-emerald-800" : ""}`}
          />
        </div>
      </button>

      {/* Custom Dropdown Floating Panel */}
      {isOpen && (
        <div
          id={`${id}-dropdown`}
          role="listbox"
          aria-label={placeholder}
          className="absolute z-50 left-0 right-0 top-[calc(100%+6px)] bg-white border border-emerald-900/15 rounded-2xl shadow-[0_20px_50px_-15px_rgba(6,26,18,0.25)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Search Header inside Dropdown */}
          <div className="p-3 border-b border-line bg-paper/60 backdrop-blur">
            <div className="relative">
              <IconSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Ketik nama prodi atau fakultas..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-line rounded-xl text-xs text-ink placeholder:text-muted focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted hover:text-ink rounded-md transition-colors"
                >
                  <IconX size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Program List with Grouping */}
          <div className="max-h-64 sm:max-h-72 overflow-y-auto p-2 space-y-3 overscroll-contain">
            {groupedPrograms.length === 0 ? (
              <div className="py-8 text-center px-4">
                <IconSchool size={28} className="text-muted/50 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-ink">Tidak ada program studi yang cocok</p>
                <p className="text-[11px] text-muted mt-0.5">
                  Coba gunakan kata kunci pencarian lain.
                </p>
              </div>
            ) : (
              groupedPrograms.map(group => (
                <div key={group.faculty} className="space-y-1">
                  {/* Faculty Group Header */}
                  <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50/80 rounded-lg flex items-center justify-between">
                    <span className="truncate">{group.faculty}</span>
                    <span className="text-[10px] font-semibold text-emerald-800/80 bg-white/80 px-1.5 py-0.2 rounded">
                      {group.programs.length} prodi
                    </span>
                  </div>

                  {/* Faculty Options */}
                  <div className="space-y-0.5 pl-1">
                    {group.programs.map(program => {
                      const isSelected = program.code === value;
                      const badgeInfo = getDegreeBadge(program.label);

                      return (
                        <button
                          key={program.code}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(program.code)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-between group select-none ${
                            isSelected
                              ? "bg-emerald-900 text-white font-semibold shadow-xs"
                              : "text-ink hover:bg-emerald-50/90 hover:text-emerald-950"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 uppercase tracking-wide transition-colors ${
                                isSelected
                                  ? "bg-emerald-800 text-emerald-100 border-emerald-700"
                                  : badgeInfo.color
                              }`}
                            >
                              {badgeInfo.badge}
                            </span>
                            <span className="truncate">{program.label}</span>
                          </div>

                          {isSelected && (
                            <IconCheck size={16} className="text-gold-light shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Status Hint */}
          <div className="px-3 py-2 border-t border-line/60 bg-paper/40 flex items-center justify-between text-[11px] text-muted">
            <span>UNIPDU Jombang</span>
            <span>{STUDY_PROGRAMS.length} Program Studi</span>
          </div>
        </div>
      )}
    </div>
  );
}
