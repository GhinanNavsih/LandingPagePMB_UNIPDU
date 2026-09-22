"use client";

import { useEffect, useState } from "react";
import SearchSelect, { SearchSelectOption } from "./SearchSelect";

interface KabupatenSearchSelectProps {
  id?: string;
  value: string; // stored as nama, e.g. "Kabupaten Jombang"
  onChange: (nama: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  inputClassName?: string;
  placeholder?: string;
  required?: boolean;
}

export default function KabupatenSearchSelect({
  id,
  value,
  onChange,
  onFocus,
  onBlur,
  inputClassName,
  placeholder = "Cari kabupaten/kota tempat lahir...",
  required,
}: KabupatenSearchSelectProps) {
  const [options, setOptions] = useState<SearchSelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/data/wilayah/kabupaten-all.json")
      .then(res => res.json())
      .then((data: { kode: string; nama: string; provinsiNama: string }[]) => {
        setOptions(
          data.map(o => ({
            kode: o.kode,
            nama: o.nama,
            subtitle: o.provinsiNama,
          }))
        );
      })
      .catch(err => console.error("Gagal memuat data kabupaten/kota:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const selectedKode = options.find(o => o.nama === value)?.kode ?? "";

  return (
    <SearchSelect
      id={id}
      options={options}
      value={selectedKode}
      onChange={(_, nama) => {
        onChange(nama);
        onBlur?.();
      }}
      isLoading={isLoading}
      inputClassName={inputClassName}
      placeholder={placeholder}
      required={required}
    />
  );
}
