import { reactive, ref } from "vue";
import axios from "axios";
import { getImageUrl } from "@/utils/format";
import { useToast } from "@/utils/useToast";
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { LayananCatalogItem } from "@/types/layanan";

interface LayananFormData {
  id: number | null;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan: number | null;
  gambarFile: File | null;
}

const FILE_INPUT_ID = "file_input";

export function useAdminLayananPage() {
  const toast = useToast();

  const layanan = ref<LayananCatalogItem[]>([]);
  const isLoading = ref(true);
  const showForm = ref(false);
  const formMode = ref<"add" | "edit">("add");
  const previewgambar = ref<string | null>(null);
  const showDeleteConfirm = ref(false);
  const layananToDelete = ref<LayananCatalogItem | null>(null);

  const form = reactive<LayananFormData>({
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

  const openEditForm = (layanan: LayananCatalogItem) => {
    formMode.value = "edit";
    form.id = layanan.id;
    form.nama_layanan = layanan.nama_layanan;
    form.deskripsi = layanan.deskripsi;
    form.harga = layanan.harga;
    form.durasi_pengerjaan = layanan.durasi_pengerjaan || null;
    form.gambarFile = null;
    previewgambar.value = getImageUrl(layanan.gambar);
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

  const fetchLayanan = async () => {
    isLoading.value = true;
    try {
      const { data } = await axios.get(`${API_URL}/layanan`);
      layanan.value = data;
    } catch (error: any) {
      logError(error, "fetchLayanan");
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
      await fetchLayanan();
    } catch (error: any) {
      logError(error, "handleFormSubmit");
      toast.error(handleApiError(error));
    }
  };

  const handleDelete = (layanan: LayananCatalogItem) => {
    layananToDelete.value = layanan;
    showDeleteConfirm.value = true;
  };

  const confirmDelete = async () => {
    if (!layananToDelete.value) return;

    try {
      await axios.delete(
        `${API_URL}/admin/layanan/${layananToDelete.value.id}`,
        {
          headers: getAuthHeaders(),
        },
      );
      toast.success("Layanan berhasil dihapus!");
      await fetchLayanan();
    } catch (error: any) {
      logError(error, "confirmDelete");
      toast.error(handleApiError(error));
    } finally {
      showDeleteConfirm.value = false;
      layananToDelete.value = null;
    }
  };

  return {
    layanan,
    isLoading,
    showForm,
    formMode,
    previewgambar,
    showDeleteConfirm,
    layananToDelete,
    form,
    openAddForm,
    openEditForm,
    closeForm,
    handleFileSelected,
    fetchLayanan,
    handleFormSubmit,
    handleDelete,
    confirmDelete,
  };
}
