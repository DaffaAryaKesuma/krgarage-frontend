<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import CustomerVespaFormModal from "@/components/customer/vespas/CustomerVespaFormModal.vue";
import CustomerVespaList from "@/components/customer/vespas/CustomerVespaList.vue";
import { API_URL } from "@/utils/api";

const toast = useToast();

interface Vespa {
  id: number;
  model: string;
  tahun_produksi: number;
  plat_nomor: string;
  tanggal_servis_terakhir?: string;
  jeda_hari_servis?: number;
  tanggal_servis_selanjutnya?: string;
  perlu_servis?: boolean;
  hari_hingga_servis?: number;
}

const vespas = ref<Vespa[]>([]);
const isLoading = ref(true);
const error = ref("");
const isFormVisible = ref(false);
const formMode = ref<"add" | "edit">("add");
const showDeleteConfirm = ref(false);
const vespaToDelete = ref<Vespa | null>(null);
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
const openEditForm = (vespa: Vespa) => {
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
  const token = localStorage.getItem("token");
  try {
    const { data } = await axios.get(`${API_URL}/my-vespas`, {
      headers: { Authorization: `Bearer ${token}` },
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
  const token = localStorage.getItem("token");
  const isEdit = formMode.value === "edit";
  const url = isEdit
    ? `${API_URL}/my-vespas/${formData.id}`
    : `${API_URL}/my-vespas`;
  const method = isEdit ? "put" : "post";

  try {
    await axios({
      method,
      url,
      data: formData,
      headers: { Authorization: `Bearer ${token}` },
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
const handleDelete = (vespa: Vespa) => {
  vespaToDelete.value = vespa;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!vespaToDelete.value) return;

  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${API_URL}/my-vespas/${vespaToDelete.value.id}`, {
      headers: { Authorization: `Bearer ${token}` },
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
    <!-- Header -->
    <div class="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
            >
              <i class="mdi mdi-motorbike text-3xl"></i>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold mb-2">Vespa Saya</h1>
              <p class="text-sm sm:text-base text-red-100">
                Kelola semua Vespa Anda untuk pemesanan servis
              </p>
            </div>
          </div>
          <button
            v-if="!isFormVisible"
            @click="openAddForm"
            class="px-6 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 transition flex items-center gap-2 shadow-lg"
          >
            <i class="mdi mdi-plus-circle text-xl"></i>
            Tambah Vespa
          </button>
        </div>
      </div>
    </div>

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
