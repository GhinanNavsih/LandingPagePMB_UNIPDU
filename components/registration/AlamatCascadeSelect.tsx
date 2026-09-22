"use client";

import { useEffect, useState } from "react";
import SearchSelect, { SearchSelectOption } from "./SearchSelect";
import { IconMapPin, IconBuildingCommunity } from "@tabler/icons-react";

interface KelurahanOption extends SearchSelectOption {
  kecamatanKode: string;
}

interface KecamatanKelurahanData {
  kecamatan: SearchSelectOption[];
  kelurahan: KelurahanOption[];
}

interface AlamatCascadeSelectProps {
  id?: string;
  value?: string;
  onChange: (composedAddress: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  inputClassName?: string;
}

const PROVINSI_SYNONYMS: Record<string, string[]> = {
  "Aceh": ["nad", "nanggroe aceh darussalam"],
  "Sumatera Utara": ["sumut"],
  "Sumatera Barat": ["sumbar"],
  "Sumatera Selatan": ["sumsel"],
  "Kepulauan Riau": ["kepri"],
  "Kepulauan Bangka Belitung": ["babel", "bangka belitung"],
  "Daerah Khusus Ibukota Jakarta": ["dki jakarta", "jakarta", "dki"],
  "Jawa Barat": ["jabar"],
  "Jawa Tengah": ["jateng"],
  "Daerah Istimewa Yogyakarta": ["yogyakarta", "yogya", "jogja", "jogjakarta", "diy"],
  "Jawa Timur": ["jatim"],
  "Kalimantan Barat": ["kalbar"],
  "Kalimantan Tengah": ["kalteng"],
  "Kalimantan Selatan": ["kalsel"],
  "Kalimantan Timur": ["kaltim"],
  "Kalimantan Utara": ["kaltara"],
  "Sulawesi Utara": ["sulut"],
  "Sulawesi Tengah": ["sulteng"],
  "Sulawesi Selatan": ["sulsel"],
  "Sulawesi Tenggara": ["sultra"],
  "Sulawesi Barat": ["sulbar"],
  "Maluku Utara": ["malut"],
  "Nusa Tenggara Barat": ["ntb"],
  "Nusa Tenggara Timur": ["ntt"],
};

export default function AlamatCascadeSelect({
  id = "address",
  value = "",
  onChange,
  onFocus,
  onBlur,
  inputClassName,
}: AlamatCascadeSelectProps) {
  const [provinsiList, setProvinsiList] = useState<SearchSelectOption[]>([]);
  const [kabupatenList, setKabupatenList] = useState<SearchSelectOption[]>([]);
  const [kecKelData, setKecKelData] = useState<KecamatanKelurahanData>({
    kecamatan: [],
    kelurahan: [],
  });

  const [provinsiKode, setProvinsiKode] = useState("");
  const [kabupatenKode, setKabupatenKode] = useState("");
  const [kecamatanKode, setKecamatanKode] = useState("");
  const [kelurahanKode, setKelurahanKode] = useState("");
  const [jalanDetail, setJalanDetail] = useState("");

  const [loadingProvinsi, setLoadingProvinsi] = useState(true);
  const [loadingKabupaten, setLoadingKabupaten] = useState(false);
  const [loadingKecKel, setLoadingKecKel] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    fetch("/data/wilayah/provinsi.json")
      .then(res => res.json())
      .then(data => setProvinsiList(data))
      .catch(err => console.error("Gagal memuat data provinsi:", err))
      .finally(() => setLoadingProvinsi(false));
  }, []);

  // Load regencies when province changes
  useEffect(() => {
    if (!provinsiKode) {
      setKabupatenList([]);
      return;
    }
    setLoadingKabupaten(true);
    fetch(`/data/wilayah/kabupaten/${provinsiKode}.json`)
      .then(res => res.json())
      .then(setKabupatenList)
      .catch(err => console.error("Gagal memuat data kabupaten:", err))
      .finally(() => setLoadingKabupaten(false));
  }, [provinsiKode]);

  // Load sub-districts and villages when regency changes
  useEffect(() => {
    if (!kabupatenKode) {
      setKecKelData({ kecamatan: [], kelurahan: [] });
      return;
    }
    setLoadingKecKel(true);
    fetch(`/data/wilayah/kecamatan-kelurahan/${kabupatenKode}.json`)
      .then(res => res.json())
      .then(setKecKelData)
      .catch(err => console.error("Gagal memuat data kecamatan/kelurahan:", err))
      .finally(() => setLoadingKecKel(false));
  }, [kabupatenKode]);

  const kelurahanOptions = kecKelData.kelurahan.filter(
    k => k.kecamatanKode === kecamatanKode
  );

  const findNama = (list: SearchSelectOption[], kode: string) =>
    list.find(o => o.kode === kode)?.nama ?? "";

  // Compose address string
  useEffect(() => {
    const provinsiNama = findNama(provinsiList, provinsiKode);
    const kabupatenNama = findNama(kabupatenList, kabupatenKode);
    const kecamatanNama = findNama(kecKelData.kecamatan, kecamatanKode);
    const kelurahanNama = findNama(kecKelData.kelurahan, kelurahanKode);

    const parts = [
      jalanDetail.trim(),
      kelurahanNama && `Kel./Ds. ${kelurahanNama}`,
      kecamatanNama && `Kec. ${kecamatanNama}`,
      kabupatenNama,
      provinsiNama,
    ].filter(Boolean);

    const fullAddress = parts.join(", ");
    onChange(fullAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinsiKode, kabupatenKode, kecamatanKode, kelurahanKode, jalanDetail, provinsiList, kabupatenList, kecKelData]);

  const composedPreview = [
    jalanDetail.trim(),
    findNama(kecKelData.kelurahan, kelurahanKode) &&
      `Kel./Ds. ${findNama(kecKelData.kelurahan, kelurahanKode)}`,
    findNama(kecKelData.kecamatan, kecamatanKode) &&
      `Kec. ${findNama(kecKelData.kecamatan, kecamatanKode)}`,
    findNama(kabupatenList, kabupatenKode),
    findNama(provinsiList, provinsiKode),
  ]
    .filter(Boolean)
    .join(", ");

  const defaultInputStyle =
    "w-full rounded-xl border border-line bg-white px-4 py-3.5 pr-10 text-base text-ink outline-none transition placeholder:text-muted focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100 disabled:bg-paper-alt disabled:text-muted/60 disabled:cursor-not-allowed";

  const effectiveInputClass = inputClassName || defaultInputStyle;

  return (
    <div className="space-y-4">
      {/* Hidden input to anchor the field id for focus/validation */}
      <input
        type="hidden"
        id={id}
        name={id}
        value={composedPreview}
        aria-hidden="true"
      />

      {/* Cascading 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* 1. Provinsi */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">
            1. Provinsi <span className="text-red-700">*</span>
          </label>
          <SearchSelect
            options={provinsiList}
            value={provinsiKode}
            onChange={kode => {
              setProvinsiKode(kode);
              setKabupatenKode("");
              setKecamatanKode("");
              setKelurahanKode("");
            }}
            inputClassName={effectiveInputClass}
            placeholder="Ketik nama provinsi (mis. Jatim, Jabar, DKI)..."
            synonyms={PROVINSI_SYNONYMS}
            isLoading={loadingProvinsi}
          />
        </div>

        {/* 2. Kabupaten/Kota */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">
            2. Kabupaten / Kota <span className="text-red-700">*</span>
          </label>
          <SearchSelect
            options={kabupatenList}
            value={kabupatenKode}
            onChange={kode => {
              setKabupatenKode(kode);
              setKecamatanKode("");
              setKelurahanKode("");
            }}
            inputClassName={effectiveInputClass}
            placeholder="Pilih atau cari kabupaten/kota..."
            disabledPlaceholder="Pilih provinsi terlebih dahulu"
            disabled={!provinsiKode}
            isLoading={loadingKabupaten}
          />
        </div>

        {/* 3. Kecamatan */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">
            3. Kecamatan <span className="text-red-700">*</span>
          </label>
          <SearchSelect
            options={kecKelData.kecamatan}
            value={kecamatanKode}
            onChange={kode => {
              setKecamatanKode(kode);
              setKelurahanKode("");
            }}
            inputClassName={effectiveInputClass}
            placeholder="Pilih atau cari kecamatan..."
            disabledPlaceholder="Pilih kabupaten/kota terlebih dahulu"
            disabled={!kabupatenKode}
            isLoading={loadingKecKel}
          />
        </div>

        {/* 4. Kelurahan / Desa */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">
            4. Kelurahan / Desa <span className="text-red-700">*</span>
          </label>
          <SearchSelect
            options={kelurahanOptions}
            value={kelurahanKode}
            onChange={kode => setKelurahanKode(kode)}
            inputClassName={effectiveInputClass}
            placeholder="Pilih atau cari kelurahan/desa..."
            disabledPlaceholder="Pilih kecamatan terlebih dahulu"
            disabled={!kecamatanKode}
          />
        </div>
      </div>

      {/* 5. Detail Jalan / RT / RW */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted">
          Detail Alamat <span className="text-xs font-normal text-muted/80">(Nama jalan, dusun, RT/RW, atau nomor rumah)</span>
        </label>
        <div className="relative">
          <IconBuildingCommunity
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="text"
            value={jalanDetail}
            onChange={e => setJalanDetail(e.target.value)}
            placeholder="Contoh: Jl. Merdeka No. 45, RT 02 / RW 03, Dusun Rejosari"
            className={`${effectiveInputClass} pl-11`}
          />
        </div>
      </div>

      {/* Composed Address Preview Box */}
      {composedPreview && (
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/70 rounded-xl flex items-start gap-2.5">
          <IconMapPin size={18} className="text-emerald-800 shrink-0 mt-0.5" />
          <div className="min-w-0 text-xs text-emerald-950">
            <span className="font-semibold block text-[11px] uppercase tracking-wider text-emerald-900 mb-0.5">
              Alamat Tersusun:
            </span>
            <p className="break-words leading-relaxed font-medium">
              {composedPreview}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
