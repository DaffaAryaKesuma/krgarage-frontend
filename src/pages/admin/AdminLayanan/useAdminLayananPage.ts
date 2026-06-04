import { reactive, ref } from "vue";
// Axios untuk request layanan ke backend.
import axios from "axios";
// Helper untuk mengubah path gambar backend menjadi URL yang bisa dibuka browser.
import { getImageUrl } from "@/utils/format";
// Toast untuk pesan sukses/gagal.
import { useToast } from "@/utils/useToast";
// Helper error API.
import { handleApiError, logError } from "@/utils/errorHandler";
import { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/auth";
import type { LayananCatalogItem } from "@/types/layanan";

// Bentuk data form layanan di frontend.
interface LayananFormData {
  id: number | null;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  durasi_pengerjaan: number | null;
  gambarFile: File | null;
}

// Id input file di modal, dipakai untuk reset pilihan file.
const FILE_INPUT_ID = "file_input";

// Composable utama halaman kelola layanan.
export function useAdminLayananPage() {
  const toast = useToast();

  // Daftar layanan dari API.
  const layanan = ref<LayananCatalogItem[]>([]);
  // Loading utama halaman.
  const isLoading = ref(true);
  // Buka/tutup modal form.
  const showForm = ref(false);
  // Mode form: tambah atau edit.
  const formMode = ref<"add" | "edit">("add");
  // Preview gambar yang ditampilkan di modal.
  const previewgambar = ref<string | null>(null);
  // Buka/tutup modal konfirmasi hapus.
  const showDeleteConfirm = ref(false);
  // Data layanan yang akan dihapus.
  const layananToDelete = ref<LayananCatalogItem | null>(null);

  // reactive dipakai karena form berupa object dengan banyak field.
  const form = reactive<LayananFormData>({
    id: null,
    nama_layanan: "",
    deskripsi: "",
    harga: 0,
    durasi_pengerjaan: null,
    gambarFile: null,
  });

  // Mengosongkan form dan preview gambar.
  const resetForm = () => {
    form.id = null;
    form.nama_layanan = "";
    form.deskripsi = "";
    form.harga = 0;
    form.durasi_pengerjaan = null;
    form.gambarFile = null;
    previewgambar.value = null;

    // Reset input file manual karena nilai file tidak otomatis ikut reset object form.
    const fileInput = document.getElementById(
      FILE_INPUT_ID,
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // Membuka form dalam mode tambah.
  const openAddForm = () => {
    formMode.value = "add";
    resetForm();
    showForm.value = true;
  };

  // Membuka form dalam mode edit dan mengisi data layanan terpilih.
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

  // Menutup modal dan mengembalikan form ke kondisi kosong.
  const closeForm = () => {
    showForm.value = false;
    resetForm();
  };

  // Menyimpan file gambar yang dipilih dan membuat preview lokal.
  const handleFileSelected = (file: File) => {
    form.gambarFile = file;
    // FileReader mengubah file menjadi data URL agar bisa langsung dipreview.
    const reader = new FileReader();
    reader.onload = (e) => {
      previewgambar.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Mengambil daftar layanan dari endpoint publik layanan.
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

  // Mengirim form tambah/edit layanan ke backend.
  const handleFormSubmit = async () => {
    // FormData dipakai karena payload bisa berisi file gambar.
    const formData = new FormData();
    formData.append("nama_layanan", form.nama_layanan);
    formData.append("deskripsi", form.deskripsi);
    formData.append("harga", form.harga.toString());

    // Durasi hanya dikirim jika nilainya valid.
    if (form.durasi_pengerjaan && form.durasi_pengerjaan > 0) {
      formData.append("durasi_pengerjaan", form.durasi_pengerjaan.toString());
    }

    // Gambar hanya dikirim jika admin memilih file baru.
    if (form.gambarFile) {
      formData.append("gambar", form.gambarFile);
    }

    // Endpoint tambah dan edit berbeda.
    const url =
      formMode.value === "add"
        ? `${API_URL}/admin/layanan`
        : `${API_URL}/admin/layanan/${form.id}`;

    // Laravel menerima upload edit sebagai POST dengan _method PUT.
    if (formMode.value === "edit") {
      formData.append("_method", "PUT");
    }

    try {
      // Header multipart wajib untuk upload file.
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
      // Refresh daftar agar perubahan langsung tampil.
      await fetchLayanan();
    } catch (error: any) {
      logError(error, "handleFormSubmit");
      toast.error(handleApiError(error));
    }
  };

  // Menyimpan layanan terpilih dan membuka modal konfirmasi hapus.
  const handleDelete = (layanan: LayananCatalogItem) => {
    layananToDelete.value = layanan;
    showDeleteConfirm.value = true;
  };

  // Menghapus layanan setelah dikonfirmasi.
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
      // Refresh daftar setelah hapus.
      await fetchLayanan();
    } catch (error: any) {
      logError(error, "confirmDelete");
      toast.error(handleApiError(error));
    } finally {
      showDeleteConfirm.value = false;
      layananToDelete.value = null;
    }
  };

  // State dan aksi yang digunakan file AdminLayanan.vue.
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
