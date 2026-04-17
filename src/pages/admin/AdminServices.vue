<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { getImageUrl } from "../../utils/format";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import AppPageHeader from "@/components/ui/AppPageHeader.vue";
import AdminServiceCard from "@/components/admin/services/AdminServiceCard.vue";
import AdminServiceFormModal from "@/components/admin/services/AdminServiceFormModal.vue";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { ServiceCatalogItem } from "@/types/service";

const toast = useToast();

// Interfaces
interface FormData {
  id: number | null;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan: number | null;
  gambarFile: File | null;
}

// State
const services = ref<ServiceCatalogItem[]>([]);
const isLoading = ref(true);
const showForm = ref(false);
const formMode = ref<"add" | "edit">("add");
const previewgambar = ref<string | null>(null);
const showDeleteConfirm = ref(false);
const serviceToDelete = ref<ServiceCatalogItem | null>(null);

const form = reactive<FormData>({
  id: null,
  nama_layanan: "",
  deskripsi: "",
  harga: 0,
  durasi_pengerjaan: null,
  gambarFile: null,
});

// Constants
const FILE_INPUT_ID = "file_input";

// Helper Functions
const resetForm = () => {
  form.id = null;
  form.nama_layanan = "";
  form.deskripsi = "";
  form.harga = 0;
  form.durasi_pengerjaan = null;
  form.gambarFile = null;
  previewgambar.value = null;

  const fileInput = document.getElementById(FILE_INPUT_ID) as HTMLInputElement;
  if (fileInput) fileInput.value = "";
};

const openAddForm = () => {
  formMode.value = "add";
  resetForm();
  showForm.value = true;
};

const openEditForm = (service: ServiceCatalogItem) => {
  formMode.value = "edit";
  form.id = service.id;
  form.nama_layanan = service.nama_layanan;
  form.deskripsi = service.deskripsi;
  form.harga = service.harga;
  form.durasi_pengerjaan = service.durasi_pengerjaan || null;
  form.gambarFile = null;
  previewgambar.value = getImageUrl(service.gambar);
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  resetForm();
};

const handleFileSelected = (file: File) => {
  form.gambarFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewgambar.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

// API Functions
const fetchServices = async () => {
  isLoading.value = true;
  try {
    const { data } = await axios.get(`${API_URL}/layanan`);
    services.value = data;
  } catch (error: any) {
    logError(error, "fetchServices");
    toast.error(handleApiError(error));
  } finally {
    isLoading.value = false;
  }
};

const handleFormSubmit = async () => {
  const formData = new FormData();
  formData.append("nama_layanan", form.nama_layanan);
  formData.append("deskripsi", form.deskripsi);
  formData.append("harga", form.harga.toString());

  if (form.durasi_pengerjaan && form.durasi_pengerjaan > 0) {
    formData.append("durasi_pengerjaan", form.durasi_pengerjaan.toString());
  }

  if (form.gambarFile) {
    formData.append("gambar", form.gambarFile);
  }

  const url =
    formMode.value === "add"
      ? `${API_URL}/admin/layanan`
      : `${API_URL}/admin/layanan/${form.id}`;

  if (formMode.value === "edit") {
    formData.append("_method", "PUT");
  }

  try {
    await axios.post(url, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success(
      formMode.value === "add"
        ? "Layanan berhasil ditambahkan!"
        : "Layanan berhasil diperbarui!",
    );
    closeForm();
    await fetchServices();
  } catch (error: any) {
    logError(error, "handleFormSubmit");
    toast.error(handleApiError(error));
  }
};

const handleDelete = (service: ServiceCatalogItem) => {
  serviceToDelete.value = service;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!serviceToDelete.value) return;

  try {
    await axios.delete(`${API_URL}/admin/layanan/${serviceToDelete.value.id}`, {
      headers: getAuthHeaders(),
    });
    toast.success("Layanan berhasil dihapus!");
    await fetchServices();
  } catch (error: any) {
    logError(error, "confirmDelete");
    toast.error(handleApiError(error));
  } finally {
    showDeleteConfirm.value = false;
    serviceToDelete.value = null;
  }
};

// Lifecycle
onMounted(fetchServices);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppPageHeader
      title="Kelola Layanan"
      icon="mdi-wrench"
      subtitle="Atur semua layanan yang tersedia"
      subtitle-class="text-sm sm:text-base text-blue-100"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <!-- Loading State -->
      <LoadingSpinner v-if="isLoading" message="Memuat data..." />

      <!-- Empty State -->
      <EmptyState
        v-else-if="services.length === 0"
        icon="mdi mdi-wrench"
        title="Belum Ada Layanan"
        message="Belum ada layanan yang tersedia. Tambahkan layanan pertama untuk customer!"
        actionText="Tambah Layanan"
        @action="openAddForm"
      />

      <!-- Content -->
      <template v-else>
        <!-- Add Service Button -->
        <button
          @click="openAddForm"
          class="w-full group flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-red-50 hover:border-red-400 transition duration-300 cursor-pointer mb-6"
        >
          <i
            class="mdi mdi-plus-circle text-3xl text-gray-400 group-hover:text-red-600"
          ></i>
          <span
            class="text-base font-semibold text-gray-500 group-hover:text-red-600 transition-colors"
          >
            Tambah Layanan Baru
          </span>
        </button>

        <!-- Service Cards Grid -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AdminServiceCard
            v-for="service in services"
            :key="service.id"
            :service="service"
            @edit="openEditForm"
            @delete="handleDelete"
          />
        </div>
      </template>
    </div>

    <AdminServiceFormModal
      :show="showForm"
      :mode="formMode"
      :form="form"
      @update:form="Object.assign(form, $event)"
      :preview-image="previewgambar"
      @close="closeForm"
      @submit="handleFormSubmit"
      @file-change="handleFileSelected"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :show="showDeleteConfirm"
      title="Hapus Layanan"
      :message="`Apakah Anda yakin ingin menghapus layanan &quot;${serviceToDelete?.nama_layanan}&quot;?`"
      confirm-text="Hapus"
      cancel-text="Batal"
      variant="danger"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
