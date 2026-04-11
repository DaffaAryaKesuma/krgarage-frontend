<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import CustomerVespaFormModal from "@/components/customer/vespas/CustomerVespaFormModal.vue";
import CustomerVespaList from "@/components/customer/vespas/CustomerVespaList.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { VespaDetail } from "@/types/vespa";

const toast = useToast();

const vespas = ref<VespaDetail[]>([]);
const isLoading = ref(true);
const error = ref("");
const isFormVisible = ref(false);
const formMode = ref<"add" | "edit">("add");
const showDeleteConfirm = ref(false);
const vespaToDelete = ref<VespaDetail | null>(null);
const formInitialData = ref<
  | {
      id?: number | null;
      model: string;
      tahun_produksi: number | null;
      plat_nomor: string;
    }
  | undefined
>(undefined);

// Open add form
const openAddForm = () => {
  formMode.value = "add";
  formInitialData.value = {
    id: null,
    model: "",
    tahun_produksi: null,
    plat_nomor: "",
  };
  error.value = "";
  isFormVisible.value = true;
};

// Open edit form
const openEditForm = (vespa: VespaDetail) => {
  formMode.value = "edit";
  formInitialData.value = {
    id: vespa.id,
    model: vespa.model,
    tahun_produksi: vespa.tahun_produksi,
    plat_nomor: vespa.plat_nomor,
  };
  error.value = "";
  isFormVisible.value = true;
};

// Fetch vespas
const fetchVespas = async () => {
  isLoading.value = true;
  const headers = getAuthHeaders();

  if (!Object.keys(headers).length) {
    isLoading.value = false;
    return;
  }

  try {
    const { data } = await axios.get(`${API_URL}/vespa-saya`, {
      headers,
    });
    vespas.value = data.data || data;
  } catch {
    error.value = "Gagal memuat data Vespa.";
  } finally {
    isLoading.value = false;
  }
};

// Submit form
const handleFormSubmit = async (formData: {
  id?: number | null;
  model: string;
  tahun_produksi: number | null;
  plat_nomor: string;
}) => {
  const headers = getAuthHeaders();
  const isEdit = formMode.value === "edit";
  const url = isEdit
    ? `${API_URL}/vespa-saya/${formData.id}`
    : `${API_URL}/vespa-saya`;
  const method = isEdit ? "put" : "post";

  try {
    await axios({
      method,
      url,
      data: formData,
      headers,
    });
    isFormVisible.value = false;
    await fetchVespas();
    toast.success(
      isEdit ? "Vespa berhasil diupdate!" : "Vespa berhasil ditambahkan!",
    );
  } catch (err: any) {
    error.value =
      err.response?.data?.message ||
      "Gagal menyimpan data. Pastikan Plat Nomor unik.";
  }
};

// Delete vespa
const handleDelete = (vespa: VespaDetail) => {
  vespaToDelete.value = vespa;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!vespaToDelete.value) return;

  const headers = getAuthHeaders();
  try {
    await axios.delete(`${API_URL}/vespa-saya/${vespaToDelete.value.id}`, {
      headers,
    });
    await fetchVespas();
    toast.success("Vespa berhasil dihapus!");
  } catch {
    toast.error("Gagal menghapus Vespa.");
  } finally {
    showDeleteConfirm.value = false;
    vespaToDelete.value = null;
  }
};

onMounted(fetchVespas);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Vespa Saya"
      icon="mdi-motorbike"
      subtitle="Kelola semua Vespa Anda untuk pemesanan servis"
      subtitle-class="text-sm sm:text-base text-red-100"
    >
      <template #actions>
        <button
          v-if="!isFormVisible"
          @click="openAddForm"
          class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-red-600 shadow-lg transition hover:bg-red-50 sm:px-6 sm:py-3 sm:text-base"
        >
          <i class="mdi mdi-plus-circle text-lg sm:text-xl"></i>
          Tambah Vespa
        </button>
      </template>
    </AppPageHeader>

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Form Modal -->
      <CustomerVespaFormModal
        :show="isFormVisible"
        :mode="formMode"
        :initial-data="formInitialData"
        :error="error"
        @submit="handleFormSubmit"
        @close="isFormVisible = false"
      />

      <!-- Vespa List -->
      <CustomerVespaList
        :vespas="vespas"
        :is-loading="isLoading"
        @edit="openEditForm"
        @delete="handleDelete"
        @add-new="openAddForm"
      />

      <!-- Delete Confirmation Modal -->
      <ConfirmationModal
        :show="showDeleteConfirm"
        title="Hapus Vespa?"
        :message="`Apakah Anda yakin ingin menghapus Vespa '${vespaToDelete?.model} (${vespaToDelete?.plat_nomor})'? Aksi ini tidak dapat dibatalkan.`"
        confirm-text="Ya, Hapus"
        cancel-text="Batal"
        variant="danger"
        @confirm="confirmDelete"
        @cancel="showDeleteConfirm = false"
      />
    </div>
  </div>
</template>
