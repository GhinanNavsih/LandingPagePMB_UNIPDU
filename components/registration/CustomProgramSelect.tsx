"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconChevronDown,
  IconCheck,
  IconSearch,
  IconSchool,
  IconX,
} from "@tabler/icons-react";
import { STUDY_PROGRAMS } from "@/lib/admissions-catalog";

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
  placeholder = "Ketik atau pilih program studi...",
}: CustomProgramSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Currently selected program details
  const selectedProgram = useMemo(
    () => STUDY_PROGRAMS.find(p => p.code === value),
    [value]
  );

  // Filter study programs based on search query and exclusion
  const filteredPrograms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return STUDY_PROGRAMS.filter(program => {
      if (exclude && program.code === exclude) return false;
      if (!q) return true;
      return (
        program.label.toLowerCase().includes(q) ||
        program.faculty.toLowerCase().includes(q) ||
        program.code.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, exclude]);

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

  // Display value in input field
  const inputValue = isTyping
    ? searchQuery
    : selectedProgram
    ? selectedProgram.label
    : "";

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          setIsTyping(false);
          setSearchQuery("");
          setHighlightedIndex(-1);
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

  function handleSelect(code: string) {
    onChange(code);
    setIsOpen(false);
    setIsTyping(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
    inputRef.current?.blur();
    onBlur?.();
  }

  function handleClear(event: React.MouseEvent) {
    event.stopPropagation();
    onChange("");
    setSearchQuery("");
    setIsTyping(false);
    setHighlightedIndex(-1);
    setIsOpen(true);
    inputRef.current?.focus();
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const text = event.target.value;
    setSearchQuery(text);
    setIsTyping(true);
    setHighlightedIndex(0);
    if (!isOpen) {
      setIsOpen(true);
    }
  }

  function handleInputFocus() {
    onFocus?.();
    setIsOpen(true);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
        return;
      }
      setHighlightedIndex(prev =>
        prev < filteredPrograms.length - 1 ? prev + 1 : 0
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(filteredPrograms.length - 1);
        return;
      }
      setHighlightedIndex(prev =>
        prev > 0 ? prev - 1 : filteredPrograms.length - 1
      );
    } else if (event.key === "Enter") {
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredPrograms.length) {
        event.preventDefault();
        handleSelect(filteredPrograms[highlightedIndex].code);
      } else if (isOpen && filteredPrograms.length === 1) {
        event.preventDefault();
        handleSelect(filteredPrograms[0].code);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      setIsTyping(false);
      setSearchQuery("");
      setHighlightedIndex(-1);
      onBlur?.();
    }
  }

  // Scroll active item into view during arrow key navigation
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.querySelector(
        `[data-option-index="${highlightedIndex}"]`
      );
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  let flatIndexCounter = 0;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input for native HTML form submission */}
      <input
        type="hidden"
        name={id}
        value={value}
        required={required}
        aria-hidden="true"
      />

      {/* Main Search & Select Input */}
      <div className="relative">
        <IconSearch
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />

        <input
          ref={inputRef}
          type="text"
          id={id}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={`${id}-dropdown`}
          aria-describedby={`${id}-error`}
          autoComplete="off"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          onClick={() => {
            if (!isOpen) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white pl-11 pr-20 py-3.5 text-base text-ink outline-none transition placeholder:text-muted ${
            isOpen
              ? "border-emerald-700 ring-4 ring-emerald-100"
              : "border-line hover:border-emerald-600/60 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
          }`}
        />

        {/* Right action buttons: Clear [X] and Chevron Down */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {(value || searchQuery) && (
            <button
              type="button"
              onClick={handleClear}
              title="Hapus pilihan"
              className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-stone-100 transition-colors"
            >
              <IconX size={15} />
            </button>
          )}

          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              setIsOpen(prev => !prev);
              inputRef.current?.focus();
            }}
            className="p-1.5 rounded-lg text-muted hover:text-emerald-800 transition-colors"
            aria-label="Buka pilihan program studi"
          >
            <IconChevronDown
              size={18}
              className={`transition-transform duration-200 ${
                isOpen ? "rotate-180 text-emerald-800" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Custom Dropdown Floating Panel */}
      {isOpen && (
        <div
          id={`${id}-dropdown`}
          role="listbox"
          aria-label={placeholder}
          className="absolute z-50 left-0 right-0 top-[calc(100%+6px)] bg-white border border-emerald-900/15 rounded-2xl shadow-[0_20px_50px_-15px_rgba(6,26,18,0.25)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Program List with Grouping */}
          <div
            ref={listRef}
            className="max-h-64 sm:max-h-72 overflow-y-auto p-2 space-y-3 overscroll-contain"
          >
            {groupedPrograms.length === 0 ? (
              <div className="py-8 text-center px-4">
                <IconSchool size={28} className="text-muted/50 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-ink">
                  Tidak ada program studi yang cocok
                </p>
                <p className="text-[11px] text-muted mt-0.5">
                  Coba ketik kata kunci nama prodi atau fakultas lain.
                </p>
              </div>
            ) : (
              groupedPrograms.map(group => (
                <div key={group.faculty} className="space-y-1">
                  {/* Faculty Group Header */}
                  <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50/80 rounded-lg flex items-center justify-between select-none">
                    <span className="truncate">{group.faculty}</span>
                    <span className="text-[10px] font-semibold text-emerald-800/80 bg-white/80 px-1.5 py-0.2 rounded">
                      {group.programs.length} prodi
                    </span>
                  </div>

                  {/* Faculty Options */}
                  <div className="space-y-0.5 pl-1">
                    {group.programs.map(program => {
                      const isSelected = program.code === value;
                      const currentIndex = flatIndexCounter++;
                      const isHighlighted = currentIndex === highlightedIndex;
                      const badgeInfo = getDegreeBadge(program.label);

                      return (
                        <button
                          key={program.code}
                          type="button"
                          role="option"
                          data-option-index={currentIndex}
                          aria-selected={isSelected}
                          onMouseDown={e => e.preventDefault()}
                          onMouseEnter={() => setHighlightedIndex(currentIndex)}
                          onClick={() => handleSelect(program.code)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-base transition-all flex items-center justify-between group select-none ${
                            isSelected
                              ? "bg-emerald-900 text-white font-semibold shadow-xs"
                              : isHighlighted
                              ? "bg-emerald-100/70 text-emerald-950"
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
          <div className="px-3 py-2 border-t border-line/60 bg-paper/40 flex items-center justify-between text-[11px] text-muted select-none">
            <span>UNIPDU Jombang</span>
            <span>
              {filteredPrograms.length} dari {STUDY_PROGRAMS.length} Program Studi
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
