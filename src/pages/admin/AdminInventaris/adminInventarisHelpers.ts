// File helper ini berisi logic kecil yang tidak langsung berhubungan dengan API.
import type {
  InventarisCategory,
  InventarisSukuCadang,
  InventarisSukuCadangForm,
} from "@/types/inventaris";

// Mengubah daftar kategori dari backend menjadi bentuk option untuk select.
export function mapInventarisCategoriesToOptions(
  daftarKategori: InventarisCategory[],
) {
  // Option ini dipakai pada form tambah/edit.
  const kategoriOptions = daftarKategori.map((kategori) => ({
    value: kategori.id,
    label: kategori.nama,
  }));

  return {
    kategoriOptions,
    // Option filter punya tambahan "Semua Kategori".
    kategoriFilterOptions: [
      { value: "", label: "Semua Kategori" },
      ...daftarKategori.map((kategori) => ({ value: String(kategori.id), label: kategori.nama })),
    ],
  };
}

// Nilai awal form ketika admin membuka modal tambah suku cadang.
export function createEmptyInventarisForm(): InventarisSukuCadangForm {
  return {
    nama_suku_cadang: "",
    id_kategori: null,
    jumlah_stok: 0,
    harga_beli: 0,
    harga_jual: 0,
    batas_minimal_stok: null,
    deskripsi: "",
  };
}

// Mengecek input form sebelum data dikirim ke backend.
export function validateInventarisForm(
  form: InventarisSukuCadangForm,
): string | null {
  // Nama wajib diisi.
  if (!form.nama_suku_cadang.trim()) {
    return "Nama Suku Cadang tidak boleh kosong";
  }

  // Kategori wajib dipilih.
  if (!form.id_kategori) {
    return "Kategori harus dipilih";
  }

  // Stok tidak boleh minus.
  if (form.jumlah_stok < 0) {
    return "Stok Awal tidak boleh negatif";
  }

  // Harga beli tidak boleh minus.
  if (form.harga_beli < 0) {
    return "Harga Beli tidak boleh negatif";
  }

  // Harga jual tidak boleh minus.
  if (form.harga_jual < 0) {
    return "Harga Jual tidak boleh negatif";
  }

  // Batas minimal stok harus berupa angka yang valid.
  if (
    form.batas_minimal_stok === null ||
    Number.isNaN(form.batas_minimal_stok)
  ) {
    return "Batas Minimal Stok wajib diisi";
  }

  // Batas minimal stok juga tidak boleh minus.
  if (form.batas_minimal_stok < 0) {
    return "Batas Minimal Stok tidak boleh negatif";
  }

  // null berarti tidak ada masalah validasi.
  return null;
}

// Mengecek apakah satu item suku cadang cocok dengan filter yang aktif.
export function matchesInventarisFilters(
  sukuCadang: InventarisSukuCadang,
  query: string,
  selectedCategory: string,
  lowStockOnly: boolean,
): boolean {
  // Query dibuat lowercase supaya pencarian tidak sensitif huruf besar/kecil.
  const normalizedQuery = query.trim().toLowerCase();

  // Cocok jika query kosong atau nama suku cadang mengandung query.
  const matchesSearch =
    !normalizedQuery ||
    sukuCadang.nama_suku_cadang.toLowerCase().includes(normalizedQuery);

  // Cocok jika tidak memilih kategori atau id kategori sama.
  const matchesCategory =
    !selectedCategory || String(sukuCadang.id_kategori) === selectedCategory;

  // Cocok jika filter stok menipis mati atau item memang stok menipis.
  const matchesLowStock = !lowStockOnly || sukuCadang.stok_menipis;

  // Item hanya tampil kalau semua kondisi filter terpenuhi.
  return matchesSearch && matchesCategory && matchesLowStock;
}
