import { computed, onMounted, ref } from "vue";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
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

export function useAdminInventarisPage() {
  const toast = useToast();

  const sukucadang = ref<InventarisSukuCadang[]>([]);
  const categories = ref<InventarisCategory[]>([]);
  const loading = ref(false);
  const categoryLoading = ref(false);
  const searchQuery = ref("");
  const selectedKategori = ref("");
  const showLowStock = ref(false);

  const showModal = ref(false);
  const showRestockModal = ref(false);
  const showDeleteConfirm = ref(false);
  const selectedSukuCadang = ref<InventarisSukuCadang | null>(null);
  const itemToDelete = ref<number | null>(null);
  const restockQuantity = ref(0);
  const categoryName = ref("");

  const form = ref(createEmptyInventarisForm());

  const categoryOptions = computed(() =>
    mapInventarisCategoriesToOptions(categories.value),
  );

  const kategoriOptions = computed(() => categoryOptions.value.kategoriOptions);
  const kategoriFilterOptions = computed(
    () => categoryOptions.value.kategoriFilterOptions,
  );

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

  const lowStockCount = computed(
    () => sukucadang.value.filter((item) => item.stok_menipis).length,
  );

  const goodStockCount = computed(
    () => sukucadang.value.filter((item) => !item.stok_menipis).length,
  );

  const statistik = computed(() => ({
    total: sukucadang.value.length,
    lowStock: lowStockCount.value,
    goodStock: goodStockCount.value,
  }));

  const refreshCategoryOptions = async () => {
    try {
      categories.value = await fetchAdminInventarisCategories();
    } catch (error: any) {
      logError(error, "refreshCategoryOptions");
      toast.error(handleApiError(error));
    }
  };

  const resetForm = () => {
    form.value = createEmptyInventarisForm();
  };

  const openCreateModal = () => {
    selectedSukuCadang.value = null;
    resetForm();
    showModal.value = true;
  };

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

  const closeModal = () => {
    showModal.value = false;
    resetForm();
    categoryName.value = "";
  };

  const openRestockModal = (itemSukuCadang: InventarisSukuCadang) => {
    selectedSukuCadang.value = itemSukuCadang;
    restockQuantity.value = 0;
    showRestockModal.value = true;
  };

  const closeRestockModal = () => {
    showRestockModal.value = false;
    restockQuantity.value = 0;
  };

  const showDeleteConfirmModal = (id: number) => {
    itemToDelete.value = id;
    showDeleteConfirm.value = true;
  };

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

  const saveCategory = async () => {
    const trimmedName = categoryName.value.trim();

    if (!trimmedName) {
      toast.error("Nama kategori tidak boleh kosong");
      return;
    }

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
      // Set id_kategori to the newly created category id
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

  const saveSukuCadang = async () => {
    const validationMessage = validateInventarisForm(form.value);
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    loading.value = true;
    try {
      if (selectedSukuCadang.value) {
        await updateAdminInventarisSukuCadang(
          selectedSukuCadang.value.id,
          form.value,
        );
        toast.success("Suku Cadang berhasil diupdate!");
      } else {
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

  const restock = async () => {
    if (restockQuantity.value <= 0) {
      toast.error("Jumlah tambahan harus lebih dari 0");
      return;
    }

    if (!selectedSukuCadang.value) {
      toast.error("Pilih suku cadang terlebih dahulu");
      return;
    }

    loading.value = true;
    try {
      await restockAdminInventarisSukuCadang(
        selectedSukuCadang.value.id,
        restockQuantity.value,
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

  onMounted(() => {
    refreshCategoryOptions();
    fetchSukuCadang();
  });

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
