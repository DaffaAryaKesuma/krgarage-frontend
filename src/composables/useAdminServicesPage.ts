import { reactive, ref } from "vue";
import axios from "axios";
import { getImageUrl } from "@/utils/format";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { ServiceCatalogItem } from "@/types/service";

interface ServiceFormData {
  id: number | null;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan: number | null;
  gambarFile: File | null;
}

const FILE_INPUT_ID = "file_input";

export function useAdminServicesPage() {
  const toast = useToast();

  const services = ref<ServiceCatalogItem[]>([]);
  const isLoading = ref(true);
  const showForm = ref(false);
  const formMode = ref<"add" | "edit">("add");
  const previewgambar = ref<string | null>(null);
  const showDeleteConfirm = ref(false);
  const serviceToDelete = ref<ServiceCatalogItem | null>(null);

  const form = reactive<ServiceFormData>({
    id: null,
    nama_layanan: "",
    deskripsi: "",
    harga: 0,
    durasi_pengerjaan: null,
    gambarFile: null,
  });

  const resetForm = () => {
    form.id = null;
    form.nama_layanan = "";
    form.deskripsi = "";
    form.harga = 0;
    form.durasi_pengerjaan = null;
    form.gambarFile = null;
    previewgambar.value = null;

    const fileInput = document.getElementById(
      FILE_INPUT_ID,
    ) as HTMLInputElement;
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
      await axios.delete(
        `${API_URL}/admin/layanan/${serviceToDelete.value.id}`,
        {
          headers: getAuthHeaders(),
        },
      );
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

  return {
    services,
    isLoading,
    showForm,
    formMode,
    previewgambar,
    showDeleteConfirm,
    serviceToDelete,
    form,
    openAddForm,
    openEditForm,
    closeForm,
    handleFileSelected,
    fetchServices,
    handleFormSubmit,
    handleDelete,
    confirmDelete,
  };
}
