"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconChevronDown,
  IconCheck,
  IconSearch,
  IconX,
  IconLoader2,
} from "@tabler/icons-react";

export interface SearchSelectOption {
  kode: string;
  nama: string;
  subtitle?: string;
}

interface SearchSelectProps {
  options: SearchSelectOption[];
  value: string; // selected kode, "" if none selected
  onChange: (kode: string, nama: string) => void;
  id?: string;
  inputClassName?: string;
  placeholder?: string;
  disabledPlaceholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  maxResults?: number;
  synonyms?: Record<string, string[]>;
  acronymIgnoreWords?: string[];
  required?: boolean;
}

const DEFAULT_ACRONYM_IGNORE_WORDS = ["Kabupaten", "Kota"];

function acronymWords(nama: string, ignoreWords: string[]): string[] {
  const prefixRe = new RegExp(`^(${ignoreWords.join("|")})\\s+`, "i");
  return nama.replace(prefixRe, "").split(/\s+/).filter(Boolean);
}

function acronymOf(nama: string, ignoreWords: string[]): string {
  return acronymWords(nama, ignoreWords)
    .map(w => w[0]?.toUpperCase() ?? "")
    .join("");
}

function scoreOption(
  option: SearchSelectOption,
  query: string,
  synonyms: string[] | undefined,
  acronymIgnoreWords: string[]
): number {
  const q = query.trim();
  if (!q) return 1;

  const qLower = q.toLowerCase();
  const qUpper = q.toUpperCase();
  const namaLower = option.nama.toLowerCase();

  if (namaLower === qLower) return 100;

  const acronym = acronymOf(option.nama, acronymIgnoreWords);
  if (acronym === qUpper) return 90;

  if (namaLower.startsWith(qLower)) return 80;

  const qTokens = q.split(/\s+/).filter(Boolean);
  if (qTokens.length > 1) {
    const firstToken = qTokens[0].toUpperCase();
    if (firstToken.length >= 2 && acronym.startsWith(firstToken)) {
      const words = acronymWords(option.nama, acronymIgnoreWords);
      const remainingWords = words.slice(firstToken.length).join(" ").toLowerCase();
      const remainingQuery = qTokens.slice(1).join(" ").toLowerCase();
      if (remainingWords.startsWith(remainingQuery)) return 75;
    }
  }

  if (qUpper.length >= 2 && acronym.startsWith(qUpper)) return 60;

  if (synonyms?.some(s => s.toLowerCase() === qLower)) return 55;
  if (synonyms?.some(s => s.toLowerCase().includes(qLower))) return 50;

  if (namaLower.includes(qLower)) return 40;
  if (option.subtitle?.toLowerCase().includes(qLower)) return 30;

  return 0;
}

export default function SearchSelect({
  options,
  value,
  onChange,
  id,
  inputClassName,
  placeholder = "Cari...",
  disabledPlaceholder,
  disabled = false,
  isLoading = false,
  maxResults = 100,
  synonyms,
  acronymIgnoreWords = DEFAULT_ACRONYM_IGNORE_WORDS,
  required,
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          setIsTyping(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedNama = useMemo(
    () => options.find(o => o.kode === value)?.nama ?? "",
    [options, value]
  );

  const filtered = useMemo(() => {
    const q = isTyping ? searchTerm : "";
    return options
      .map(option => ({
        option,
        score: scoreOption(
          option,
          q,
          synonyms?.[option.nama],
          acronymIgnoreWords
        ),
      }))
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.option.nama.localeCompare(b.option.nama))
      .slice(0, maxResults)
      .map(entry => entry.option);
  }, [options, searchTerm, isTyping, synonyms, maxResults, acronymIgnoreWords]);

  function handleSelect(option: SearchSelectOption) {
    onChange(option.kode, option.nama);
    setIsOpen(false);
    setIsTyping(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("", "");
    setSearchTerm("");
    setIsTyping(false);
    setHighlightedIndex(-1);
    setIsOpen(true);
    inputRef.current?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
        return;
      }
      setHighlightedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(filtered.length - 1);
        return;
      }
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (event.key === "Enter") {
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        event.preventDefault();
        handleSelect(filtered[highlightedIndex]);
      } else if (isOpen && filtered.length === 1) {
        event.preventDefault();
        handleSelect(filtered[0]);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      setIsTyping(false);
      setSearchTerm("");
      setHighlightedIndex(-1);
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

  const effectivePlaceholder = isLoading
    ? "Memuat data..."
    : disabled
    ? disabledPlaceholder ?? placeholder
    : placeholder;

  const displayValue = isTyping ? searchTerm : selectedNama;

  const defaultInputClass = `w-full rounded-xl border bg-white px-4 py-3.5 pr-16 text-base text-ink outline-none transition placeholder:text-muted disabled:bg-paper-alt disabled:text-muted/70 disabled:cursor-not-allowed ${
    isOpen
      ? "border-emerald-700 ring-4 ring-emerald-100"
      : "border-line hover:border-emerald-600/60 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
  }`;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input for HTML form integration */}
      {id && (
        <input
          type="hidden"
          name={id}
          value={value}
          required={required}
          aria-hidden="true"
        />
      )}

      {/* Main Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled || isLoading}
          value={displayValue}
          onChange={e => {
            setSearchTerm(e.target.value);
            setIsTyping(true);
            setHighlightedIndex(0);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            if (!disabled && !isLoading) {
              setIsOpen(true);
            }
          }}
          onClick={() => {
            if (!disabled && !isLoading && !isOpen) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={effectivePlaceholder}
          className={inputClassName || defaultInputClass}
        />

        {/* Action icons right */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <IconLoader2 size={16} className="animate-spin text-emerald-800 mr-1" />
          )}

          {!disabled && !isLoading && (value || searchTerm) && (
            <button
              type="button"
              onClick={handleClear}
              title="Hapus pilihan"
              className="p-1 rounded-md text-muted hover:text-ink hover:bg-stone-100 transition-colors"
            >
              <IconX size={15} />
            </button>
          )}

          {!disabled && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => {
                if (isLoading) return;
                setIsOpen(prev => !prev);
                inputRef.current?.focus();
              }}
              className="p-1 text-muted hover:text-emerald-800 transition-colors"
              aria-label="Buka pilihan"
            >
              <IconChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-emerald-800" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Floating Options Panel */}
      {isOpen && !disabled && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute z-50 left-0 right-0 top-[calc(100%+6px)] max-h-60 sm:max-h-64 overflow-y-auto overscroll-contain rounded-2xl bg-white border border-emerald-900/15 shadow-[0_20px_50px_-15px_rgba(6,26,18,0.25)] p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150"
        >
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted">
              Tidak ditemukan data yang sesuai
            </div>
          ) : (
            filtered.map((option, idx) => {
              const isSelected = option.kode === value;
              const isHighlighted = idx === highlightedIndex;

              return (
                <button
                  key={option.kode}
                  type="button"
                  role="option"
                  data-option-index={idx}
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-between group select-none ${
                    isSelected
                      ? "bg-emerald-900 text-white font-semibold shadow-xs"
                      : isHighlighted
                      ? "bg-emerald-100/70 text-emerald-950"
                      : "text-ink hover:bg-emerald-50/90 hover:text-emerald-950"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="block truncate">{option.nama}</span>
                    {option.subtitle && (
                      <span
                        className={`block text-[11px] truncate mt-0.5 ${
                          isSelected ? "text-emerald-200" : "text-muted"
                        }`}
                      >
                        {option.subtitle}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <IconCheck size={16} className="text-gold-light shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
