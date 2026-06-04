import { computed, onMounted, ref } from "vue";
// Toast menampilkan pesan sukses/gagal.
import { useToast } from "@/utils/useToast";
// Helper agar error API dicatat dan ditampilkan dengan pesan rapi.
import { handleApiError, logError } from "@/utils/errorHandler";
// Mengubah nilai uang dari string/number menjadi number yang aman dihitung.
import { toMoneyNumber } from "@/utils/money";
import type { InventarisCategory, InventarisSukuCadang } from "@/types/inventaris";
import {
  createEmptyInventarisForm,
  mapInventarisCategoriesToOptions,
  matchesInventarisFilters,
  validateInventarisForm,
} from "./adminInventarisHelpers";
import {
  createAdminInventarisCategory,
  createAdminInventarisSukuCadang,
  deleteAdminInventarisSukuCadang,
  fetchAdminInventarisCategories,
  fetchAdminInventarisSukuCadang,
  restockAdminInventarisSukuCadang,
  updateAdminInventarisSukuCadang,
} from "./adminInventarisApi";

// Composable utama halaman inventaris admin.
export function useAdminInventarisPage() {
  const toast = useToast();

  // Data master suku cadang dari API.
  const sukucadang = ref<InventarisSukuCadang[]>([]);
  // Data kategori dari API.
  const categories = ref<InventarisCategory[]>([]);
  // Loading utama untuk request suku cadang/restock/simpan.
  const loading = ref(false);
  // Loading khusus saat membuat kategori baru.
  const categoryLoading = ref(false);
  // Kata kunci pencarian di filter.
  const searchQuery = ref("");
  // Kategori yang sedang dipilih di filter.
  const selectedKategori = ref("");
  // Jika true, tabel hanya menampilkan stok menipis.
  const showLowStock = ref(false);

  // State buka/tutup modal tambah-edit.
  const showModal = ref(false);
  // State buka/tutup modal restock.
  const showRestockModal = ref(false);
  // State buka/tutup konfirmasi hapus.
  const showDeleteConfirm = ref(false);
  // Suku cadang yang sedang diedit/restock.
  const selectedSukuCadang = ref<InventarisSukuCadang | null>(null);
  // Id item yang akan dihapus setelah user konfirmasi.
  const itemToDelete = ref<number | null>(null);
  // Jumlah stok tambahan di modal restock.
  const restockQuantity = ref(0);
  // Harga beli satuan ketika restock.
  const restockUnitPrice = ref(0);
  // Jika true, harga beli master ikut diperbarui.
  const restockUpdateMasterPrice = ref(false);
  // Catatan opsional untuk riwayat restock.
  const restockNote = ref("");
  // Nama kategori baru saat admin membuat kategori dari modal form.
  const categoryName = ref("");

  // Form utama tambah/edit suku cadang.
  const form = ref(createEmptyInventarisForm());

  // Mengubah kategori dari API menjadi opsi select.
  const categoryOptions = computed(() =>
    mapInventarisCategoriesToOptions(categories.value),
  );

  // Opsi kategori untuk form tambah/edit.
  const kategoriOptions = computed(() => categoryOptions.value.kategoriOptions);
  // Opsi kategori untuk filter, biasanya punya tambahan "Semua".
  const kategoriFilterOptions = computed(
    () => categoryOptions.value.kategoriFilterOptions,
  );

  // Data tabel yang sudah melewati filter pencarian/kategori/stok menipis.
  const filteredSukuCadang = computed(() => {
    return sukucadang.value.filter((item) =>
      matchesInventarisFilters(
        item,
        searchQuery.value,
        selectedKategori.value,
        showLowStock.value,
      ),
    );
  });

  // Menghitung jumlah item yang stoknya menipis.
  const lowStockCount = computed(
    () => sukucadang.value.filter((item) => item.stok_menipis).length,
  );

  // Menghitung jumlah item yang stoknya masih aman.
  const goodStockCount = computed(
    () => sukucadang.value.filter((item) => !item.stok_menipis).length,
  );

  // Statistik ringkas yang dikirim ke komponen kartu.
  const statistik = computed(() => ({
    total: sukucadang.value.length,
    lowStock: lowStockCount.value,
    goodStock: goodStockCount.value,
  }));

  // Mengambil ulang kategori dari backend.
  const refreshCategoryOptions = async () => {
    try {
      categories.value = await fetchAdminInventarisCategories();
    } catch (error: any) {
      logError(error, "refreshCategoryOptions");
      toast.error(handleApiError(error));
    }
  };

  // Mengembalikan form ke nilai kosong.
  const resetForm = () => {
    form.value = createEmptyInventarisForm();
  };

  // Membuka modal untuk tambah suku cadang baru.
  const openCreateModal = () => {
    selectedSukuCadang.value = null;
    resetForm();
    showModal.value = true;
  };

  // Membuka modal edit dan mengisi form dengan data item terpilih.
  const openEditModal = (itemSukuCadang: InventarisSukuCadang) => {
    selectedSukuCadang.value = itemSukuCadang;
    form.value = {
      nama_suku_cadang: itemSukuCadang.nama_suku_cadang,
      id_kategori: itemSukuCadang.id_kategori,
      jumlah_stok: itemSukuCadang.jumlah_stok,
      harga_beli: Math.trunc(toMoneyNumber(itemSukuCadang.harga_beli)),
      harga_jual: Math.trunc(toMoneyNumber(itemSukuCadang.harga_jual)),
      batas_minimal_stok: itemSukuCadang.batas_minimal_stok,
      deskripsi: itemSukuCadang.deskripsi,
    };
    showModal.value = true;
  };

  // Menutup modal tambah/edit dan membersihkan input.
  const closeModal = () => {
    showModal.value = false;
    resetForm();
    categoryName.value = "";
  };

  // Membuka modal restock dengan harga beli awal dari item terpilih.
  const openRestockModal = (itemSukuCadang: InventarisSukuCadang) => {
    selectedSukuCadang.value = itemSukuCadang;
    restockQuantity.value = 0;
    restockUnitPrice.value = Math.trunc(toMoneyNumber(itemSukuCadang.harga_beli));
    restockUpdateMasterPrice.value = false;
    restockNote.value = "";
    showRestockModal.value = true;
  };

  // Menutup modal restock dan mengosongkan inputnya.
  const closeRestockModal = () => {
    showRestockModal.value = false;
    restockQuantity.value = 0;
    restockUnitPrice.value = 0;
    restockUpdateMasterPrice.value = false;
    restockNote.value = "";
  };

  // Menyimpan id item yang akan dihapus lalu menampilkan modal konfirmasi.
  const showDeleteConfirmModal = (id: number) => {
    itemToDelete.value = id;
    showDeleteConfirm.value = true;
  };

  // Mengambil daftar suku cadang dari API.
  const fetchSukuCadang = async () => {
    loading.value = true;
    try {
      sukucadang.value = await fetchAdminInventarisSukuCadang();
    } catch (error: any) {
      logError(error, "fetchSukuCadang");
      toast.error(handleApiError(error));
    } finally {
      loading.value = false;
    }
  };

  // Membuat kategori baru dari input modal.
  const saveCategory = async () => {
    const trimmedName = categoryName.value.trim();

    // Validasi supaya nama kategori tidak kosong.
    if (!trimmedName) {
      toast.error("Nama kategori tidak boleh kosong");
      return;
    }

    // Cek duplikat di frontend sebelum request ke backend.
    const isDuplicate = categories.value.some(
      (category) => category.nama.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (isDuplicate) {
      toast.error("Kategori sudah ada");
      return;
    }

    categoryLoading.value = true;
    try {
      const res = await createAdminInventarisCategory(trimmedName);
      toast.success("Kategori berhasil ditambahkan!");
      // Otomatis pilih kategori yang baru dibuat pada form.
      form.value.id_kategori = res.data?.data?.id ?? null;
      categoryName.value = "";
      await refreshCategoryOptions();
    } catch (error: any) {
      logError(error, "saveCategory");
      toast.error(handleApiError(error));
    } finally {
      categoryLoading.value = false;
    }
  };

  // Menyimpan suku cadang, bisa create baru atau update data lama.
  const saveSukuCadang = async () => {
    // Validasi form dipusatkan di helper agar file ini tidak terlalu penuh.
    const validationMessage = validateInventarisForm(form.value);
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    loading.value = true;
    try {
      // Jika ada selectedSukuCadang berarti mode edit.
      if (selectedSukuCadang.value) {
        await updateAdminInventarisSukuCadang(
          selectedSukuCadang.value.id,
          form.value,
        );
        toast.success("Suku Cadang berhasil diupdate!");
      } else {
        // Jika tidak ada selectedSukuCadang berarti mode tambah baru.
        await createAdminInventarisSukuCadang(form.value);
        toast.success("Suku Cadang berhasil ditambahkan!");
      }
      closeModal();
      await fetchSukuCadang();
    } catch (error: any) {
      logError(error, "saveSukuCadang");
      toast.error(handleApiError(error));
    } finally {
      loading.value = false;
    }
  };

  // Menambah stok suku cadang dan membuat riwayat restock di backend.
  const restock = async () => {
    // Validasi jumlah restock.
    if (restockQuantity.value <= 0) {
      toast.error("Jumlah tambahan harus lebih dari 0");
      return;
    }

    // Pastikan ada item yang sedang dipilih.
    if (!selectedSukuCadang.value) {
      toast.error("Pilih suku cadang terlebih dahulu");
      return;
    }

    // Harga beli satuan tidak boleh minus.
    if (restockUnitPrice.value < 0) {
      toast.error("Harga beli per unit tidak boleh negatif");
      return;
    }

    loading.value = true;
    try {
      // Payload ini akan menambah stok sekaligus mencatat pengeluaran restock.
      await restockAdminInventarisSukuCadang(
        selectedSukuCadang.value.id,
        {
          jumlah: restockQuantity.value,
          harga_beli_satuan: restockUnitPrice.value,
          update_harga_beli: restockUpdateMasterPrice.value,
          catatan: restockNote.value.trim() || undefined,
        },
      );
      toast.success("Stok berhasil ditambahkan!");
      closeRestockModal();
      await fetchSukuCadang();
    } catch (error: any) {
      logError(error, "restock");
      toast.error(handleApiError(error));
    } finally {
      loading.value = false;
    }
  };

  // Menghapus suku cadang setelah user menekan konfirmasi.
  const deleteSukuCadang = async () => {
    if (!itemToDelete.value) return;

    showDeleteConfirm.value = false;
    loading.value = true;

    try {
      await deleteAdminInventarisSukuCadang(itemToDelete.value);
      toast.success("Suku Cadang berhasil dihapus!");
      itemToDelete.value = null;
      await fetchSukuCadang();
    } catch (error: any) {
      logError(error, "deleteSukuCadang");
      toast.error(handleApiError(error));
    } finally {
      loading.value = false;
    }
  };

  // Saat halaman dibuka, kategori dan daftar suku cadang langsung diambil.
  onMounted(() => {
    refreshCategoryOptions();
    fetchSukuCadang();
  });

  // Data dan aksi yang direturn dipakai oleh file AdminInventaris.vue.
  return {
    kategoriOptions,
    kategoriFilterOptions,
    sukucadang,
    loading,
    categoryLoading,
    searchQuery,
    selectedKategori,
    showLowStock,
    showModal,
    showRestockModal,
    showDeleteConfirm,
    selectedSukuCadang,
    itemToDelete,
    restockQuantity,
    restockUnitPrice,
    restockUpdateMasterPrice,
    restockNote,
    categoryName,
    form,
    filteredSukuCadang,
    statistik,
    openCreateModal,
    openEditModal,
    closeModal,
    openRestockModal,
    closeRestockModal,
    showDeleteConfirmModal,
    fetchSukuCadang,
    saveCategory,
    saveSukuCadang,
    restock,
    deleteSukuCadang,
  };
}
