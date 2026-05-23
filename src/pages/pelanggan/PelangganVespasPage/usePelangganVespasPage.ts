import { ref, onMounted } from "vue";
import axios from "axios";
import { useToast } from "@/utils/useToast";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { VespaDetail } from "@/types/vespa";

export type VespaFormData = {
  id?: number | null;
  model: string;
  tahun_produksi: number | null;
  plat_nomor: string;
};

export function usePelangganVespasPage() {
  const toast = useToast();

  const vespas = ref<VespaDetail[]>([]);
  const isLoading = ref(true);
  const error = ref("");
  const isFormVisible = ref(false);
  const formMode = ref<"add" | "edit">("add");
  const showDeleteConfirm = ref(false);
  const vespaToDelete = ref<VespaDetail | null>(null);
  const formInitialData = ref<VespaFormData | undefined>(undefined);

  const fetchVespas = async () => {
    isLoading.value = true;
    const headers = getAuthHeaders();

    if (!Object.keys(headers).length) {
      isLoading.value = false;
      return;
    }

    try {
      const { data } = await axios.get(`${API_URL}/vespa-saya`, { headers });
      vespas.value = data.data || data;
    } catch {
      error.value = "Gagal memuat data Vespa.";
    } finally {
      isLoading.value = false;
    }
  };

  const openAddForm = () => {
    formMode.value = "add";
    formInitialData.value = { id: null, model: "", tahun_produksi: null, plat_nomor: "" };
    error.value = "";
    isFormVisible.value = true;
  };

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

  const handleFormSubmit = async (formData: VespaFormData) => {
    const headers = getAuthHeaders();
    const isEdit = formMode.value === "edit";
    const url = isEdit
      ? `${API_URL}/vespa-saya/${formData.id}`
      : `${API_URL}/vespa-saya`;
    const method = isEdit ? "put" : "post";

    try {
      await axios({ method, url, data: formData, headers });
      isFormVisible.value = false;
      await fetchVespas();
      toast.success(isEdit ? "Vespa berhasil diupdate!" : "Vespa berhasil ditambahkan!");
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        "Gagal menyimpan data. Pastikan Plat Nomor unik.";
    }
  };

  const handleDelete = (vespa: VespaDetail) => {
    vespaToDelete.value = vespa;
    showDeleteConfirm.value = true;
  };

  const confirmDelete = async () => {
    if (!vespaToDelete.value) return;

    const headers = getAuthHeaders();
    try {
      await axios.delete(`${API_URL}/vespa-saya/${vespaToDelete.value.id}`, { headers });
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

  return {
    vespas,
    isLoading,
    error,
    isFormVisible,
    formMode,
    showDeleteConfirm,
    vespaToDelete,
    formInitialData,
    openAddForm,
    openEditForm,
    handleFormSubmit,
    handleDelete,
    confirmDelete,
  };
}
