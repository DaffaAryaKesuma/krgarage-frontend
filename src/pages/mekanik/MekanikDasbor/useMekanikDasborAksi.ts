// Mengambil ref untuk state modal/aksi dan tipe Ref untuk menerima data dari composable lain.
import { ref, type Ref } from "vue";
// Mengambil router untuk redirect jika token tidak tersedia.
import { useRouter } from "vue-router";
// Mengambil axios untuk memanggil API backend.
import axios from "axios";
// Mengambil helper error.
import { handleApiError, logError } from "@/utils/errorHandler";
// Mengambil toast untuk pesan sukses/error.
import { useToast } from "@/utils/useToast";
// Mengambil alamat API backend.
import { API_URL } from "@/utils/api";
// Mengambil header token login.
import { getAuthHeaders } from "@/utils/auth";
// Mengambil helper untuk menentukan status berikutnya bagi mekanik.
import { getMekanikNextStatus } from "@/utils/statusBadge";
// Mengambil tipe data pemesanan mekanik.
import type { MekanikPemesanan } from "@/types/pemesanan";
// Mengambil tipe data ringkasan suku cadang.
import type { SukuCadangRingkasan } from "@/types/inventaris";

// Bentuk data untuk modal konfirmasi.
interface ConfirmModalData {
  title: string;
  message: string;
  variant: "danger" | "warning" | "info";
  onConfirm: () => void;
}

// Opsi yang diterima composable aksi mekanik.
interface MekanikDasborAksiOptions {
  // Daftar pekerjaan aktif, dipakai untuk mencari pemesanan berdasarkan ID.
  activePemesanan: Ref<MekanikPemesanan[]>;
  // Fungsi untuk mengambil ulang data setelah aksi berhasil.
  fetchData: () => Promise<void>;
}

// Fungsi utama untuk mengatur aksi mekanik.
export function useMekanikDasborAksi(
  options: MekanikDasborAksiOptions,
) {
  // Router untuk redirect jika token tidak tersedia.
  const router = useRouter();
  // Toast untuk pesan sukses/error.
  const toast = useToast();

  // Status tampil modal tambah suku cadang.
  const showAddSukuCadangModal = ref(false);
  // ID pemesanan yang sedang diproses tambah suku cadang.
  const selectedPemesananId = ref<number | null>(null);
  // Daftar suku cadang yang bisa dipilih.
  const sukuCadangList = ref<SukuCadangRingkasan[]>([]);
  // Status loading daftar suku cadang.
  const isLoadingSukuCadang = ref(false);
  // Status submit tambah suku cadang.
  const isAddingSukuCadang = ref(false);
  // Status tampil modal selesaikan pekerjaan.
  const showCompleteJobModal = ref(false);
  // Status submit selesaikan pekerjaan.
  const isCompletingJob = ref(false);
  // Target pekerjaan yang akan diselesaikan.
  const completeJobTarget = ref<{ id: number; kodePemesanan: string } | null>(
    null,
  );

  // Status tampil modal konfirmasi umum.
  const showConfirmModal = ref(false);
  // Data isi modal konfirmasi.
  const confirmModalData = ref<ConfirmModalData>({
    title: "",
    message: "",
    variant: "info",
    onConfirm: () => {},
  });

  // Mengambil header token dan redirect jika token kosong.
  const getValidAuthHeaders = () => {
    const headers = getAuthHeaders();
    if (!Object.keys(headers).length) {
      router.push("/");
      return null;
    }
    return headers;
  };

  // Menampilkan modal konfirmasi dengan data dinamis.
  const showConfirm = (
    title: string,
    message: string,
    variant: "danger" | "warning" | "info",
    onConfirm: () => void,
  ) => {
    confirmModalData.value = { title, message, variant, onConfirm };
    showConfirmModal.value = true;
  };

  // Menjalankan aksi saat user menekan tombol konfirmasi.
  const handleConfirm = () => {
    confirmModalData.value.onConfirm();
    showConfirmModal.value = false;
  };

  // Menutup modal konfirmasi tanpa menjalankan aksi.
  const handleCancel = () => {
    showConfirmModal.value = false;
  };

  // Menutup modal selesaikan pekerjaan dan menghapus target.
  const closeCompleteJobModal = () => {
    showCompleteJobModal.value = false;
    completeJobTarget.value = null;
  };

  // Submit catatan mekanik dan ubah status pekerjaan menjadi Selesai.
  const submitCompleteJob = async (catatanMekanik: string) => {
    // Jika tidak ada target pekerjaan, hentikan proses.
    if (!completeJobTarget.value) {
      return;
    }

    try {
      // Tandai sedang menyelesaikan pekerjaan.
      isCompletingJob.value = true;

      // Ambil header token.
      const headers = getValidAuthHeaders();
      if (!headers) {
        return;
      }

      // Kirim request update status ke backend.
      const response = await axios.put(
        `${API_URL}/mekanik/pemesanan/${completeJobTarget.value.id}/status`,
        {
          status: "Selesai",
          catatan_mekanik: catatanMekanik,
        },
        { headers },
      );

      // Jika sukses, tampilkan toast, tutup modal, dan refresh data.
      if (response.data.success) {
        toast.success("Pekerjaan berhasil diselesaikan");
        closeCompleteJobModal();
        await options.fetchData();
      }
    } catch (error: any) {
      // Catat dan tampilkan error.
      logError(error, "submitCompleteJob");
      toast.error(handleApiError(error));
    } finally {
      // Matikan status submit selesai pekerjaan.
      isCompletingJob.value = false;
    }
  };

  // Handler saat mekanik menekan tombol update status.
  const handleUpdateStatus = async (idPemesanan: number) => {
    // Cari pemesanan aktif berdasarkan ID.
    const pemesanan = options.activePemesanan.value.find(
      (pesanan) => pesanan.id === idPemesanan,
    );
    // Jika tidak ditemukan, hentikan proses.
    if (!pemesanan) return;

    // Tentukan status berikutnya berdasarkan status saat ini.
    const newStatus = getMekanikNextStatus(pemesanan.status);
    let confirmMessage = "";
    let variant: "danger" | "warning" | "info" = "info";

    // Jika status berikutnya Dikerjakan, tampilkan konfirmasi mulai pekerjaan.
    if (newStatus === "Dikerjakan") {
      confirmMessage = "Apakah Anda yakin ingin memulai pekerjaan ini?";
      variant = "info";
    // Jika status berikutnya Selesai, buka modal catatan mekanik.
    } else if (newStatus === "Selesai") {
      completeJobTarget.value = {
        id: pemesanan.id,
        kodePemesanan: pemesanan.kode_pemesanan,
      };
      showCompleteJobModal.value = true;
      return;
    } else {
      // Jika status tidak valid, tampilkan error.
      toast.error("Status tidak dapat diubah");
      return;
    }

    // Tampilkan modal konfirmasi untuk perubahan status.
    showConfirm(
      "Konfirmasi Perubahan Status",
      confirmMessage,
      variant,
      async () => {
        try {
          // Ambil header token.
          const headers = getValidAuthHeaders();
          if (!headers) {
            return;
          }

          // Kirim update status ke backend.
          const response = await axios.put(
            `${API_URL}/mekanik/pemesanan/${idPemesanan}/status`,
            { status: newStatus },
            { headers },
          );

          // Jika sukses, tampilkan toast dan refresh data.
          if (response.data.success) {
            toast.success("Status berhasil diperbarui");
            await options.fetchData();
          }
        } catch (error: any) {
          // Catat dan tampilkan error.
          logError(error, "handleUpdateStatus");
          toast.error(handleApiError(error));
        }
      },
    );
  };

  // Handler membuka modal tambah suku cadang.
  const handleAddSukuCadang = async (idPemesanan: number) => {
    // Simpan ID pemesanan target.
    selectedPemesananId.value = idPemesanan;
    // Tampilkan modal tambah suku cadang.
    showAddSukuCadangModal.value = true;
    // Fetch daftar suku cadang saat modal dibuka.
    isLoadingSukuCadang.value = true;
    try {
      // Ambil header token.
      const headers = getValidAuthHeaders();
      if (!headers) return;
      // Ambil daftar suku cadang yang tersedia untuk mekanik.
      const res = await axios.get(`${API_URL}/mekanik/suku-cadang`, { headers });
      const data = res.data.data || res.data;
      // Simpan data suku cadang jika response berbentuk array.
      sukuCadangList.value = Array.isArray(data) ? data : [];
    } catch (error: any) {
      // Catat dan tampilkan error.
      logError(error, "fetchSukuCadang");
      toast.error(handleApiError(error));
    } finally {
      // Matikan loading suku cadang.
      isLoadingSukuCadang.value = false;
    }
  };

  // Submit beberapa item suku cadang ke pemesanan.
  const submitSukuCadangItems = async (
    items: { sukucadangId: number; quantity: number }[],
  ) => {
    // Jika tidak ada target atau tidak ada item, hentikan proses.
    if (!selectedPemesananId.value || !items.length) return;
    // Tandai sedang submit.
    isAddingSukuCadang.value = true;
    try {
      // Ambil header token.
      const headers = getValidAuthHeaders();
      if (!headers) return;
      // Kirim semua item suku cadang secara paralel.
      await Promise.all(
        items.map((item) =>
          axios.post(
            `${API_URL}/mekanik/pemesanan/${selectedPemesananId.value}/tambah-suku-cadang`,
            { id_suku_cadang: item.sukucadangId, jumlah: item.quantity },
            { headers },
          ),
        ),
      );
      // Tampilkan pesan sukses.
      toast.success(`${items.length} suku cadang berhasil ditambahkan!`);
      // Tutup modal.
      closeSukuCadangModal();
      // Refresh data pekerjaan.
      await options.fetchData();
    } catch (error: any) {
      // Catat dan tampilkan error.
      logError(error, "submitSukuCadangItems");
      toast.error(handleApiError(error));
    } finally {
      // Matikan status submit.
      isAddingSukuCadang.value = false;
    }
  };

  // Handler hapus suku cadang dari pemesanan.
  const handleDeleteSukuCadang = async (idPemesanan: number, idItem: number) => {
    // Tampilkan konfirmasi sebelum menghapus item.
    showConfirm(
      "Hapus SukuCadang",
      "Apakah Anda yakin ingin menghapus sukucadang ini?",
      "danger",
      async () => {
        try {
          // Ambil header token.
          const headers = getValidAuthHeaders();
          if (!headers) {
            return;
          }

          // Kirim request hapus item ke backend.
          await axios.delete(
            `${API_URL}/mekanik/pemesanan/${idPemesanan}/item/${idItem}`,
            { headers },
          );
          // Tampilkan pesan sukses dan refresh data.
          toast.success("SukuCadang berhasil dihapus");
          await options.fetchData();
        } catch (error: any) {
          // Catat dan tampilkan pesan error.
          logError(error, "handleDeleteSukuCadang");
          toast.error("Gagal menghapus sukucadang");
        }
      },
    );
  };

  // Menutup modal tambah suku cadang dan membersihkan state terkait.
  const closeSukuCadangModal = () => {
    showAddSukuCadangModal.value = false;
    selectedPemesananId.value = null;
    sukuCadangList.value = [];
  };

  // Callback saat suku cadang berhasil ditambahkan dari alur lain.
  const onSukuCadangAdded = async () => {
    closeSukuCadangModal();
    await options.fetchData();
  };

  // Kembalikan state dan fungsi ke file .vue.
  return {
    showAddSukuCadangModal,
    selectedPemesananId,
    sukuCadangList,
    isLoadingSukuCadang,
    isAddingSukuCadang,
    showCompleteJobModal,
    isCompletingJob,
    completeJobTarget,
    showConfirmModal,
    confirmModalData,
    handleUpdateStatus,
    closeCompleteJobModal,
    submitCompleteJob,
    handleAddSukuCadang,
    submitSukuCadangItems,
    handleDeleteSukuCadang,
    handleConfirm,
    handleCancel,
    closeSukuCadangModal,
    onSukuCadangAdded,
  };
}
