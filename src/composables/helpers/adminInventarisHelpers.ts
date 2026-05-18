import type {
  InventarisCategory,
  InventarisSukuCadang,
  InventarisSukuCadangForm,
} from "@/types/inventaris";

export function mapInventarisCategoriesToOptions(
  daftarKategori: InventarisCategory[],
) {
  const kategoriOptions = daftarKategori.map((kategori) => ({
    value: kategori.id,
    label: kategori.nama,
  }));

  return {
    kategoriOptions,
    kategoriFilterOptions: [
      { value: "", label: "Semua Kategori" },
      ...daftarKategori.map((kategori) => ({ value: String(kategori.id), label: kategori.nama })),
    ],
  };
}

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

export function validateInventarisForm(
  form: InventarisSukuCadangForm,
): string | null {
  if (!form.nama_suku_cadang.trim()) {
    return "Nama Suku Cadang tidak boleh kosong";
  }

  if (!form.id_kategori) {
    return "Kategori harus dipilih";
  }

  if (form.jumlah_stok < 0) {
    return "Stok Awal tidak boleh negatif";
  }

  if (form.harga_beli < 0) {
    return "Harga Beli tidak boleh negatif";
  }

  if (form.harga_jual < 0) {
    return "Harga Jual tidak boleh negatif";
  }

  if (
    form.batas_minimal_stok === null ||
    Number.isNaN(form.batas_minimal_stok)
  ) {
    return "Batas Minimal Stok wajib diisi";
  }

  if (form.batas_minimal_stok < 0) {
    return "Batas Minimal Stok tidak boleh negatif";
  }

  return null;
}

export function matchesInventarisFilters(
  sukuCadang: InventarisSukuCadang,
  query: string,
  selectedCategory: string,
  lowStockOnly: boolean,
): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  const matchesSearch =
    !normalizedQuery ||
    sukuCadang.nama_suku_cadang.toLowerCase().includes(normalizedQuery);

  const matchesCategory =
    !selectedCategory || String(sukuCadang.id_kategori) === selectedCategory;

  const matchesLowStock = !lowStockOnly || sukuCadang.stok_menipis;

  return matchesSearch && matchesCategory && matchesLowStock;
}
