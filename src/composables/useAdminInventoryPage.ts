import { computed, onMounted, ref } from "vue";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import { toMoneyNumber } from "@/utils/money";
import type { InventoryCategory, InventorySparepart } from "@/types/inventory";
import {
  createEmptyInventoryForm,
  mapInventoryCategoriesToOptions,
  matchesInventoryFilters,
  validateInventoryForm,
} from "@/composables/helpers/adminInventoryHelpers";
import {
  createAdminInventoryCategory,
  createAdminInventorySparepart,
  deleteAdminInventorySparepart,
  fetchAdminInventoryCategories,
  fetchAdminInventorySpareparts,
  restockAdminInventorySparepart,
  updateAdminInventorySparepart,
} from "@/composables/helpers/adminInventoryApi";

export function useAdminInventoryPage() {
  const toast = useToast();

  const spareparts = ref<InventorySparepart[]>([]);
  const categories = ref<InventoryCategory[]>([]);
  const loading = ref(false);
  const categoryLoading = ref(false);
  const searchQuery = ref("");
  const selectedKategori = ref("");
  const showLowStock = ref(false);

  const showModal = ref(false);
  const showRestockModal = ref(false);
  const showDeleteConfirm = ref(false);
  const selectedSparepart = ref<InventorySparepart | null>(null);
  const itemToDelete = ref<number | null>(null);
  const restockQuantity = ref(0);
  const categoryName = ref("");

  const form = ref(createEmptyInventoryForm());

  const categoryOptions = computed(() =>
    mapInventoryCategoriesToOptions(categories.value),
  );

  const kategoriOptions = computed(() => categoryOptions.value.kategoriOptions);
  const kategoriFilterOptions = computed(
    () => categoryOptions.value.kategoriFilterOptions,
  );

  const filteredSpareparts = computed(() => {
    return spareparts.value.filter((sp) =>
      matchesInventoryFilters(
        sp,
        searchQuery.value,
        selectedKategori.value,
        showLowStock.value,
      ),
    );
  });

  const lowStockCount = computed(
    () => spareparts.value.filter((sp) => sp.stok_menipis).length,
  );

  const goodStockCount = computed(
    () => spareparts.value.filter((sp) => !sp.stok_menipis).length,
  );

  const stats = computed(() => ({
    total: spareparts.value.length,
    lowStock: lowStockCount.value,
    goodStock: goodStockCount.value,
  }));

  const refreshCategoryOptions = async () => {
    try {
      categories.value = await fetchAdminInventoryCategories();
    } catch (error: any) {
      logError(error, "refreshCategoryOptions");
      toast.error(handleApiError(error));
    }
  };

  const resetForm = () => {
    form.value = createEmptyInventoryForm();
  };

  const openCreateModal = () => {
    selectedSparepart.value = null;
    resetForm();
    showModal.value = true;
  };

  const openEditModal = (sparepart: InventorySparepart) => {
    selectedSparepart.value = sparepart;
    form.value = {
      nama_suku_cadang: sparepart.nama_suku_cadang,
      kategori: sparepart.kategori || "",
      jumlah_stok: sparepart.jumlah_stok,
      harga_beli: Math.trunc(toMoneyNumber(sparepart.harga_beli)),
      harga_jual: Math.trunc(toMoneyNumber(sparepart.harga_jual)),
      batas_minimal_stok: sparepart.batas_minimal_stok,
      deskripsi: sparepart.deskripsi,
    };
    showModal.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
    resetForm();
    categoryName.value = "";
  };

  const openRestockModal = (sparepart: InventorySparepart) => {
    selectedSparepart.value = sparepart;
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

  const fetchSpareparts = async () => {
    loading.value = true;
    try {
      spareparts.value = await fetchAdminInventorySpareparts();
    } catch (error: any) {
      logError(error, "fetchSpareparts");
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
      await createAdminInventoryCategory(trimmedName);
      toast.success("Kategori berhasil ditambahkan!");
      form.value.kategori = trimmedName;
      categoryName.value = "";
      await refreshCategoryOptions();
    } catch (error: any) {
      logError(error, "saveCategory");
      toast.error(handleApiError(error));
    } finally {
      categoryLoading.value = false;
    }
  };

  const saveSparepart = async () => {
    const validationMessage = validateInventoryForm(form.value);
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    loading.value = true;
    try {
      if (selectedSparepart.value) {
        await updateAdminInventorySparepart(
          selectedSparepart.value.id,
          form.value,
        );
        toast.success("Suku Cadang berhasil diupdate!");
      } else {
        await createAdminInventorySparepart(form.value);
        toast.success("Suku Cadang berhasil ditambahkan!");
      }
      closeModal();
      await fetchSpareparts();
    } catch (error: any) {
      logError(error, "saveSparepart");
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

    if (!selectedSparepart.value) {
      toast.error("Pilih suku cadang terlebih dahulu");
      return;
    }

    loading.value = true;
    try {
      await restockAdminInventorySparepart(
        selectedSparepart.value.id,
        restockQuantity.value,
      );
      toast.success("Stok berhasil ditambahkan!");
      closeRestockModal();
      await fetchSpareparts();
    } catch (error: any) {
      logError(error, "restock");
      toast.error(handleApiError(error));
    } finally {
      loading.value = false;
    }
  };

  const deleteSparepart = async () => {
    if (!itemToDelete.value) return;

    showDeleteConfirm.value = false;
    loading.value = true;

    try {
      await deleteAdminInventorySparepart(itemToDelete.value);
      toast.success("Suku Cadang berhasil dihapus!");
      itemToDelete.value = null;
      await fetchSpareparts();
    } catch (error: any) {
      logError(error, "deleteSparepart");
      toast.error(handleApiError(error));
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    refreshCategoryOptions();
    fetchSpareparts();
  });

  return {
    kategoriOptions,
    kategoriFilterOptions,
    spareparts,
    loading,
    categoryLoading,
    searchQuery,
    selectedKategori,
    showLowStock,
    showModal,
    showRestockModal,
    showDeleteConfirm,
    selectedSparepart,
    itemToDelete,
    restockQuantity,
    categoryName,
    form,
    filteredSpareparts,
    stats,
    openCreateModal,
    openEditModal,
    closeModal,
    openRestockModal,
    closeRestockModal,
    showDeleteConfirmModal,
    fetchSpareparts,
    saveCategory,
    saveSparepart,
    restock,
    deleteSparepart,
  };
}
