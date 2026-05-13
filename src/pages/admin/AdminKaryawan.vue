<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getCurrentUser } from "@/utils/auth";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import KaryawanCard from "@/components/admin/karyawan/KaryawanCard.vue";
import KaryawanFormModal from "@/components/admin/karyawan/KaryawanFormModal.vue";

interface Karyawan {
  id: number;
  nama: string;
  email: string;
  no_telepon?: string;
  role: string;
  created_at: string;
}

const karyawanList = ref<Karyawan[]>([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const editData = ref<Karyawan | null>(null);
const showDeleteConfirm = ref(false);
const karyawanToDelete = ref<number | null>(null);

const currentUser = getCurrentUser();
const toast = useToast();

const fetchKaryawan = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get("/api/admin/karyawan");
    karyawanList.value = response.data.data;
  } catch (error) {
    logError(error, "fetchKaryawan");
    toast.error("Gagal memuat data karyawan.");
  } finally {
    isLoading.value = false;
  }
};

const openAddModal = () => {
  isEditMode.value = false;
  editData.value = null;
  isModalOpen.value = true;
};

const openEditModal = (karyawan: Karyawan) => {
  isEditMode.value = true;
  editData.value = karyawan;
  isModalOpen.value = true;
};

const handleFormSubmit = async (formData: any) => {
  try {
    const url = isEditMode.value
      ? `/api/admin/karyawan/${formData.id}`
      : "/api/admin/karyawan";

    const bodyData = { ...formData };
    if (isEditMode.value && !bodyData.password) {
      delete bodyData.password;
    }

    const response = isEditMode.value
      ? await axios.put(url, bodyData)
      : await axios.post(url, bodyData);

    toast.success(response.data.message);
    isModalOpen.value = false;
    fetchKaryawan();
  } catch (error: any) {
    logError(error, "handleFormSubmit");
    toast.error(handleApiError(error));
  }
};

const konfirmasiHapus = (id: number) => {
  karyawanToDelete.value = id;
  showDeleteConfirm.value = true;
};

const hapusKaryawan = async () => {
  if (!karyawanToDelete.value) return;
  try {
    const response = await axios.delete(
      `/api/admin/karyawan/${karyawanToDelete.value}`,
    );
    toast.success(response.data.message);
    fetchKaryawan();
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Gagal menghapus karyawan");
  } finally {
    showDeleteConfirm.value = false;
    karyawanToDelete.value = null;
  }
};

onMounted(fetchKaryawan);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Manajemen Karyawan"
      icon="mdi-account-group"
      subtitle="Kelola akun admin dan mekanik KR Garage"
      subtitle-class="text-sm sm:text-base text-red-100"
    />

    <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <!-- Loading -->
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Tombol Tambah -->
        <button
          @click="openAddModal"
          class="flex flex-col items-center justify-center p-6 text-gray-400 transition-all bg-transparent border-2 border-gray-300 border-dashed rounded-xl hover:border-red-500 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[220px] group"
        >
          <i
            class="mb-2 text-5xl transition-transform mdi mdi-plus-circle-outline group-hover:scale-110"
          ></i>
          <span class="text-sm font-semibold tracking-wide uppercase"
            >Tambah Karyawan</span
          >
        </button>

        <!-- Karyawan Cards -->
        <KaryawanCard
          v-for="karyawan in karyawanList"
          :key="karyawan.id"
          :karyawan="karyawan"
          :current-user-id="currentUser?.id"
          @edit="openEditModal"
          @delete="konfirmasiHapus"
        />
      </div>
    </div>

    <!-- Form Modal -->
    <KaryawanFormModal
      :show="isModalOpen"
      :is-edit-mode="isEditMode"
      :initial-data="editData || undefined"
      @close="isModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Konfirmasi Hapus -->
    <ConfirmationModal
      :show="showDeleteConfirm"
      title="Hapus Akun Karyawan"
      message="Apakah Anda yakin ingin menghapus akun karyawan ini? Tindakan ini tidak dapat dibatalkan dan semua hak aksesnya akan terhapus."
      variant="danger"
      confirmText="Ya, Hapus Akun"
      cancelText="Batal"
      @confirm="hapusKaryawan"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
