<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import AdminInventoryStatsCards from "@/components/admin/inventory/AdminInventoryStatsCards.vue";
import AdminInventoryFilters from "@/components/admin/inventory/AdminInventoryFilters.vue";
import AdminInventoryTable from "@/components/admin/inventory/AdminInventoryTable.vue";
import AdminInventoryFormModal from "@/components/admin/inventory/AdminInventoryFormModal.vue";
import AdminInventoryRestockModal from "@/components/admin/inventory/AdminInventoryRestockModal.vue";

const toast = useToast();

// Interfaces
interface Sparepart {
  id: number;
  nama_suku_cadang: string;
  kategori: string;
  jumlah_stok: number;
  harga_beli: number;
  harga_jual: number;
  batas_minimal_stok: number;
  deskripsi: string;
  stok_menipis: boolean;
}

interface FormData {
  nama_suku_cadang: string;
  kategori: string;
  jumlah_stok: number;
  harga_beli: number;
  harga_jual: number;
  batas_minimal_stok: number;
  deskripsi: string;
}

// Constants
const kategoriS = [
  "Oli",
  "Busi",
  "Kampas Rem",
  "Kampas Kopling",
  "Kopling",
  "Kabel",
  "Filter",
  "Bearing",
  "Karburator",
  "Aki",
  "Lampu",
  "Ban",
  "Lainnya",
];

const kategoriOptions = kategoriS.map((kat) => ({ value: kat, label: kat }));

const kategori_OPTIONS = [
  { value: "", label: "Semua Kategori" },
  ...kategoriOptions,
];

// State
const spareparts = ref<Sparepart[]>([]);
const loading = ref(false);
const searchQuery = ref("");
const selectedkategori = ref("");
const showLowStock = ref(false);

// Modal State
const showModal = ref(false);
const showRestockModal = ref(false);
const showDeleteConfirm = ref(false);
const selectedSparepart = ref<Sparepart | null>(null);
const itemToDelete = ref<number | null>(null);
const restockQuantity = ref(0);

// Form State
const form = ref<FormData>({
  nama_suku_cadang: "",
  kategori: "",
  jumlah_stok: 0,
  harga_beli: 0,
  harga_jual: 0,
  batas_minimal_stok: 5,
  deskripsi: "",
});

// Computed Properties
const filteredSpareparts = computed(() => {
  return spareparts.value.filter((sp) => {
    const matchesSearch =
      !searchQuery.value ||
      sp.nama_suku_cadang
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());
    const matcheskategori =
      !selectedkategori.value || sp.kategori === selectedkategori.value;
    const matchesLowStock = !showLowStock.value || sp.stok_menipis;

    return matchesSearch && matcheskategori && matchesLowStock;
  });
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

// Functions
const resetForm = () => {
  form.value = {
    nama_suku_cadang: "",
    kategori: "",
    jumlah_stok: 0,
    harga_beli: 0,
    harga_jual: 0,
    batas_minimal_stok: 5,
    deskripsi: "",
  };
};

const openCreateModal = () => {
  selectedSparepart.value = null;
  resetForm();
  showModal.value = true;
};

const openEditModal = (sparepart: Sparepart) => {
  selectedSparepart.value = sparepart;
  form.value = {
    nama_suku_cadang: sparepart.nama_suku_cadang,
    kategori: sparepart.kategori || "",
    jumlah_stok: sparepart.jumlah_stok,
    harga_beli: sparepart.harga_beli,
    harga_jual: sparepart.harga_jual,
    batas_minimal_stok: sparepart.batas_minimal_stok,
    deskripsi: sparepart.deskripsi,
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const openRestockModal = (sparepart: Sparepart) => {
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

// API Functions
const fetchSpareparts = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get(`${API_URL}/admin/inventory`, {
      headers: getAuthHeaders(),
    });
    spareparts.value = data.data;
  } catch (error: any) {
    logError(error, "fetchSpareparts");
    toast.error(handleApiError(error));
  } finally {
    loading.value = false;
  }
};

const saveSparepart = async () => {
  // Validasi form
  if (!form.value.nama_suku_cadang.trim()) {
    toast.error("Nama Suku Cadang tidak boleh kosong");
    return;
  }
  if (!form.value.kategori) {
    toast.error("Kategori harus dipilih");
    return;
  }
  if (form.value.jumlah_stok < 0) {
    toast.error("Stok Awal tidak boleh negatif");
    return;
  }
  if (form.value.harga_beli < 0) {
    toast.error("Harga Beli tidak boleh negatif");
    return;
  }
  if (form.value.harga_jual < 0) {
    toast.error("Harga Jual tidak boleh negatif");
    return;
  }
  if (form.value.batas_minimal_stok < 0) {
    toast.error("Batas Minimal Stok tidak boleh negatif");
    return;
  }

  loading.value = true;
  try {
    if (selectedSparepart.value) {
      // Update
      await axios.put(
        `${API_URL}/admin/inventory/${selectedSparepart.value.id}`,
        form.value,
        { headers: getAuthHeaders() },
      );
      toast.success("Suku Cadang berhasil diupdate!");
    } else {
      // Create
      await axios.post(`${API_URL}/admin/inventory`, form.value, {
        headers: getAuthHeaders(),
      });
      toast.success("Suku Cadang berhasil ditambahkan!");
    }
    closeModal();
    fetchSpareparts();
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

  loading.value = true;
  try {
    await axios.post(
      `${API_URL}/admin/inventory/${selectedSparepart.value?.id}/restock`,
      { jumlah: restockQuantity.value },
      { headers: getAuthHeaders() },
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
    await axios.delete(`${API_URL}/admin/inventory/${itemToDelete.value}`, {
      headers: getAuthHeaders(),
    });
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

// Lifecycle
onMounted(() => fetchSpareparts());
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex items-center gap-3 sm:gap-4">
          <div
            class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
          >
            <i class="mdi mdi-package-variant text-2xl sm:text-4xl"></i>
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold mb-1">
              Inventori Suku Cadang
            </h1>
            <p class="text-sm sm:text-base text-blue-100">
              Kelola stok suku cadang bengkel
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <AdminInventoryStatsCards :stats="stats" />

      <AdminInventoryFilters
        v-model:search-query="searchQuery"
        v-model:selected-kategori="selectedkategori"
        v-model:show-low-stock="showLowStock"
        :kategori-options="kategori_OPTIONS"
        @add-new="openCreateModal"
      />

      <LoadingSpinner v-if="loading" message="Memuat data..." />

      <AdminInventoryTable
        v-else
        :spareparts="filteredSpareparts"
        @restock="openRestockModal"
        @edit="openEditModal"
        @delete="showDeleteConfirmModal"
      />
    </div>

    <AdminInventoryFormModal
      :show="showModal"
      v-model:form="form"
      :selected-sparepart="selectedSparepart"
      :loading="loading"
      :kategori-options="kategoriOptions"
      @close="closeModal"
      @submit="saveSparepart"
    />

    <AdminInventoryRestockModal
      :show="showRestockModal"
      :selected-sparepart="selectedSparepart"
      v-model:restock-quantity="restockQuantity"
      :loading="loading"
      @close="closeRestockModal"
      @submit="restock"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :show="showDeleteConfirm"
      title="Hapus Suku Cadang"
      message="Apakah Anda yakin ingin menghapus suku cadang ini? Data tidak dapat dikembalikan."
      confirm-text="Hapus"
      cancel-text="Batal"
      variant="danger"
      @confirm="deleteSparepart"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
