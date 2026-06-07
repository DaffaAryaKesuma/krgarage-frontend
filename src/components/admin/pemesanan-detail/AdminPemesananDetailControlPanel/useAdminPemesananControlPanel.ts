import { computed, ref, watch } from "vue";
// Mengirim sinyal refresh ke halaman lain setelah status berubah.
import { notifyKrGarageDataChanged } from "@/composables/useRealtimeRefresh";
// Toast untuk feedback sukses/gagal.
import { useToast } from "@/utils/useToast";
// Helper aturan status pemesanan.
import {
  PEMESANAN_STATUS,
  canAdminAssignAndStart,
  canAdminCancelPemesanan,
  canAdminCompletePemesanan,
  canAdminConfirmPemesanan,
  isStatusBatal,
  isStatusSelesai,
} from "@/utils/statusBadge";
// Helper tampilan dan pengecekan status pembayaran.
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
  isPaidStatus,
} from "@/utils/pembayaranStatus";
// Konfigurasi tombol, modal konfirmasi, dan type panel kontrol.
import {
  AKSI_CONFIG,
  CANCEL_BUTTON_CLASS,
  COMPLETE_BUTTON_CLASS,
  CONFIRM_BUTTON_CLASS,
  MARK_PAID_BUTTON_CLASS,
  type AksiConfirmationConfig,
  type PemesananAksiType,
  type Mekanik,
} from "@/components/admin/pemesanan-detail/AdminPemesananDetailControlPanel/adminPemesananControlPanelHelpers";
// Fungsi API khusus panel kontrol.
import {
  assignMekanikToPemesanan,
  fetchAdminMekaniks,
  patchAdminPemesananStatus,
  patchAdminPembayaranStatus,
} from "@/components/admin/pemesanan-detail/AdminPemesananDetailControlPanel/adminPemesananControlPanelApi";

// Re-export class tombol agar file .vue bisa import dari composable ini.
export {
  CANCEL_BUTTON_CLASS,
  COMPLETE_BUTTON_CLASS,
  CONFIRM_BUTTON_CLASS,
  MARK_PAID_BUTTON_CLASS,
};

// Props yang dibutuhkan composable panel kontrol.
export interface PropertiAdminPemesananControlPanel {
  pemesananId: number;
  currentStatus: string;
  currentPembayaranStatus?: string | null;
  currentMekanikId: number | null;
  currentMekanikName?: string;
}

// Composable utama panel kontrol detail pemesanan admin.
export function useAdminPemesananControlPanel(
  properti: PropertiAdminPemesananControlPanel,
  onRefresh: () => void,
) {
  const toast = useToast();

  // Daftar mekanik untuk dropdown assign.
  const availableMekaniks = ref<Mekanik[]>([]);
  // Loading proses aksi status/pembayaran.
  const isProcessing = ref(false);
  // Mekanik terpilih, default dari mekanik yang sudah ditugaskan.
  const selectedMekanikId = ref<number | null>(properti.currentMekanikId);
  // State modal konfirmasi aksi.
  const showAksiConfirmation = ref(false);
  // Aksi yang sedang menunggu konfirmasi.
  const pendingAksi = ref<PemesananAksiType | null>(null);

  // Sinkronkan selectedMekanikId jika props currentMekanikId berubah setelah refresh.
  watch(
    () => properti.currentMekanikId,
    (idMekanikBerikutnya) => {
      selectedMekanikId.value = idMekanikBerikutnya;
    },
  );

  // Ubah daftar mekanik dari API menjadi option dropdown.
  const mekanikOptionsDaftar = computed(() =>
    availableMekaniks.value.map((mekanik) => ({
      value: mekanik.id,
      label: mekanik.nama,
    })),
  );

  // Computed aturan tombol berdasarkan status sekarang.
  const canConfirm = computed(() =>
    canAdminConfirmPemesanan(properti.currentStatus),
  );
  const canAssignAndStart = computed(() =>
    canAdminAssignAndStart(properti.currentStatus),
  );
  const canComplete = computed(() =>
    canAdminCompletePemesanan(properti.currentStatus),
  );
  const canCancel = computed(() => canAdminCancelPemesanan(properti.currentStatus));
  const isCompleted = computed(() => isStatusSelesai(properti.currentStatus));
  const isCancelled = computed(() => isStatusBatal(properti.currentStatus));
  const isPaid = computed(() => isPaidStatus(properti.currentPembayaranStatus));
  const canMarkAsPaid = computed(
    () => isCompleted.value && !isCancelled.value && !isPaid.value,
  );

  // Label dan class badge pembayaran.
  const pembayaranStatusLabel = computed(() =>
    getPembayaranStatusLabel(properti.currentPembayaranStatus),
  );
  const pembayaranStatusBadgeClass = computed(() =>
    getPembayaranStatusBadgeClass(properti.currentPembayaranStatus),
  );

  // Nama mekanik bisa dari props eksplisit atau dicari dari daftar mekanik.
  const assignedMekanikName = computed(() => {
    const namaEksplisit = properti.currentMekanikName?.trim();
    if (namaEksplisit) {
      return namaEksplisit;
    }

    if (!properti.currentMekanikId) {
      return null;
    }

    const mekanikCocok = availableMekaniks.value.find(
      (mekanik) => mekanik.id === properti.currentMekanikId,
    );

    return mekanikCocok?.nama || null;
  });

  // Konfigurasi modal sesuai aksi yang sedang dipilih.
  const aksiConfirmationConfig = computed<AksiConfirmationConfig | null>(
    () => (pendingAksi.value ? AKSI_CONFIG[pendingAksi.value] : null),
  );

  // Membuka modal konfirmasi untuk aksi tertentu.
  const requestAksiConfirmation = (aksi: PemesananAksiType) => {
    pendingAksi.value = aksi;
    showAksiConfirmation.value = true;
  };

  // Menutup modal dan menghapus pending action.
  const closeAksiConfirmation = () => {
    showAksiConfirmation.value = false;
    pendingAksi.value = null;
  };

  // Mengubah status servis pemesanan.
  async function updateStatus(statusBaru: string, pesanSukses: string, catatan?: string) {
    isProcessing.value = true;
    try {
      await patchAdminPemesananStatus(properti.pemesananId, statusBaru, catatan);
      toast.success(pesanSukses);
      onRefresh();
    } catch (error: any) {
      console.error(`Gagal memperbarui status ke ${statusBaru}:`, error);
      toast.error(error.response?.data?.message || "Gagal memperbarui status");
    } finally {
      isProcessing.value = false;
    }
  }

  // Mengubah status pembayaran pemesanan.
  async function updatePembayaranStatus(
    statusPembayaranBaru: string,
    pesanSukses: string,
  ) {
    isProcessing.value = true;
    try {
      await patchAdminPembayaranStatus(properti.pemesananId, statusPembayaranBaru);
      toast.success(pesanSukses);
      onRefresh();
    } catch (error: any) {
      console.error(
        `Gagal memperbarui status pembayaran ke ${statusPembayaranBaru}:`,
        error,
      );
      toast.error(
        error.response?.data?.message || "Gagal memperbarui status pembayaran",
      );
    } finally {
      isProcessing.value = false;
    }
  }

  // Menjalankan aksi setelah user konfirmasi di modal.
  const confirmAksi = (catatan?: string) => {
    const config = aksiConfirmationConfig.value;
    if (!config || isProcessing.value) {
      closeAksiConfirmation();
      return;
    }

    closeAksiConfirmation();
    if (config.requestType === "pembayaran") {
      void updatePembayaranStatus(config.value, config.successMessage);
      return;
    }

    void updateStatus(config.value, config.successMessage, catatan);
  };

  // Mengambil daftar mekanik untuk dropdown.
  async function fetchMekaniks() {
    try {
      availableMekaniks.value = await fetchAdminMekaniks();
    } catch (error) {
      console.error("Gagal mengambil daftar mekanik:", error);
    }
  }

  // Assign mekanik terpilih lalu ubah status menjadi Dikerjakan.
  async function assignMekanikAndStart() {
    if (!selectedMekanikId.value) {
      toast.error("Silakan pilih mekanik terlebih dahulu");
      return;
    }

    isProcessing.value = true;
    try {
      await assignMekanikToPemesanan(properti.pemesananId, selectedMekanikId.value);
      await patchAdminPemesananStatus(
        properti.pemesananId,
        PEMESANAN_STATUS.DIKERJAKAN,
      );

      toast.success("Mekanik ditugaskan dan servis dimulai!");
      notifyKrGarageDataChanged();
      onRefresh();
    } catch (error: any) {
      console.error("Gagal menugaskan mekanik dan memulai servis:", error);
      toast.error(error.response?.data?.message || "Gagal memulai servis");
    } finally {
      isProcessing.value = false;
    }
  }

  // Handler singkat untuk tombol-tombol di template.
  const handleConfirm = () => requestAksiConfirmation("confirm");
  const handleComplete = () => requestAksiConfirmation("complete");
  const handleCancel = () => requestAksiConfirmation("cancel");
  const handleMarkAsPaid = () => requestAksiConfirmation("markPaid");

  // State dan aksi yang digunakan panel kontrol .vue.
  return {
    mekanikOptionsDaftar,
    isProcessing,
    selectedMekanikId,
    canConfirm,
    canAssignAndStart,
    canComplete,
    canCancel,
    isCompleted,
    isCancelled,
    isPaid,
    canMarkAsPaid,
    pembayaranStatusLabel,
    pembayaranStatusBadgeClass,
    assignedMekanikName,
    showAksiConfirmation,
    aksiConfirmationConfig,
    handleConfirm,
    handleComplete,
    handleCancel,
    handleMarkAsPaid,
    closeAksiConfirmation,
    confirmAksi,
    fetchMekaniks,
    assignMekanikAndStart,
  };
}
