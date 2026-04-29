import type {
  InventoryCategory,
  InventorySparepart,
  InventorySparepartForm,
} from "@/types/inventory";

export function mapInventoryCategoriesToOptions(
  categories: InventoryCategory[],
) {
  const source = categories.map((category) => category.nama);

  const kategoriOptions = source.map((kat) => ({
    value: kat,
    label: kat,
  }));

  return {
    kategoriOptions,
    kategoriFilterOptions: [
      { value: "", label: "Semua Kategori" },
      ...kategoriOptions,
    ],
  };
}

export function createEmptyInventoryForm(): InventorySparepartForm {
  return {
    nama_suku_cadang: "",
    kategori: "",
    jumlah_stok: 0,
    harga_beli: 0,
    harga_jual: 0,
    batas_minimal_stok: null,
    deskripsi: "",
  };
}

export function validateInventoryForm(
  form: InventorySparepartForm,
): string | null {
  if (!form.nama_suku_cadang.trim()) {
    return "Nama Suku Cadang tidak boleh kosong";
  }

  if (!form.kategori) {
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

export function matchesInventoryFilters(
  sparepart: InventorySparepart,
  query: string,
  selectedCategory: string,
  lowStockOnly: boolean,
): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  const matchesSearch =
    !normalizedQuery ||
    sparepart.nama_suku_cadang.toLowerCase().includes(normalizedQuery);

  const matchesCategory =
    !selectedCategory || sparepart.kategori === selectedCategory;

  const matchesLowStock = !lowStockOnly || sparepart.stok_menipis;

  return matchesSearch && matchesCategory && matchesLowStock;
}
