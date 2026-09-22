export const ACTIVE_ADMISSION_CYCLE = {
  id: "2026-2027",
  label: "2026/2027",
} as const;

export const ADMISSION_PATHWAYS = [
  { code: "pmdk", label: "Jalur PMDK", description: "Seleksi melalui nilai rapor atau prestasi." },
  { code: "reguler", label: "Jalur Reguler", description: "Seleksi umum melalui Tes Potensi Akademik." },
  { code: "rpl", label: "Jalur RPL / Ekstensi", description: "Untuk pelamar dengan pengalaman kerja atau pendidikan sebelumnya." },
] as const;

export const STUDY_PROGRAMS = [
  { code: "fai-pai-s1", facultyCode: "fai", faculty: "Fakultas Agama Islam", label: "S1 Pendidikan Agama Islam" },
  { code: "fai-hukum-keluarga-s1", facultyCode: "fai", faculty: "Fakultas Agama Islam", label: "S1 Hukum Keluarga" },
  { code: "fai-pgmi-s1", facultyCode: "fai", faculty: "Fakultas Agama Islam", label: "S1 Pendidikan Guru Madrasah Ibtidaiyah (PGMI)" },
  { code: "fik-keperawatan-s1", facultyCode: "fik", faculty: "Fakultas Ilmu Kesehatan", label: "S1 Ilmu Keperawatan" },
  { code: "fik-kebidanan-s1", facultyCode: "fik", faculty: "Fakultas Ilmu Kesehatan", label: "S1 Kebidanan" },
  { code: "fik-kebidanan-d3", facultyCode: "fik", faculty: "Fakultas Ilmu Kesehatan", label: "D3 Kebidanan" },
  { code: "fik-profesi-ners", facultyCode: "fik", faculty: "Fakultas Ilmu Kesehatan", label: "Pendidikan Profesi Ners" },
  { code: "fik-profesi-bidan", facultyCode: "fik", faculty: "Fakultas Ilmu Kesehatan", label: "Pendidikan Profesi Bidan" },
  { code: "fbbp-administrasi-bisnis-s1", facultyCode: "fbbp", faculty: "Fakultas Bisnis, Bahasa & Pendidikan", label: "S1 Administrasi Bisnis" },
  { code: "fbbp-bahasa-inggris-bisnis-s1", facultyCode: "fbbp", faculty: "Fakultas Bisnis, Bahasa & Pendidikan", label: "S1 Bahasa Inggris Bisnis" },
  { code: "fbbp-pendidikan-bahasa-inggris-s1", facultyCode: "fbbp", faculty: "Fakultas Bisnis, Bahasa & Pendidikan", label: "S1 Pendidikan Bahasa Inggris" },
  { code: "fbbp-pendidikan-matematika-s1", facultyCode: "fbbp", faculty: "Fakultas Bisnis, Bahasa & Pendidikan", label: "S1 Pendidikan Matematika" },
  { code: "fst-sistem-informasi-s1", facultyCode: "fst", faculty: "Fakultas Sains & Teknologi", label: "S1 Sistem Informasi" },
  { code: "fst-matematika-bisnis-s1", facultyCode: "fst", faculty: "Fakultas Sains & Teknologi", label: "S1 Matematika Bisnis" },
  { code: "pasca-mpi-s2", facultyCode: "pasca", faculty: "Program Pascasarjana", label: "S2 Manajemen Pendidikan Islam" },
  { code: "pasca-kesehatan-masyarakat-s2", facultyCode: "pasca", faculty: "Program Pascasarjana", label: "S2 Kesehatan Masyarakat" },
] as const;

export const DISCOVERY_SOURCES = [
  { code: "instagram", label: "Instagram" },
  { code: "parent", label: "Orang Tua" },
  { code: "tiktok", label: "TikTok" },
  { code: "x-twitter", label: "X / Twitter" },
  { code: "school-teacher", label: "Guru Sekolah" },
  { code: "friend-family", label: "Teman / Saudara" },
  { code: "unipdu-alumni", label: "Alumni UNIPDU" },
  { code: "expo", label: "Expo" },
  { code: "unipdu-website", label: "Website UNIPDU" },
  { code: "brochure", label: "Brosur" },
  { code: "facebook", label: "Facebook" },
] as const;

export const GENDER_OPTIONS = [
  { code: "female", label: "Perempuan" },
  { code: "male", label: "Laki-laki" },
] as const;

export type AdmissionPathwayCode = (typeof ADMISSION_PATHWAYS)[number]["code"];
export type StudyProgramCode = (typeof STUDY_PROGRAMS)[number]["code"];
export type DiscoverySourceCode = (typeof DISCOVERY_SOURCES)[number]["code"];
export type GenderCode = (typeof GENDER_OPTIONS)[number]["code"];

export function catalogItem<T extends { code: string }>(items: readonly T[], code: string) {
  return items.find(item => item.code === code);
}
