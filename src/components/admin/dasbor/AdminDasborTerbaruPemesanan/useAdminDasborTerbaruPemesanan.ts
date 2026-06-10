import { computed, ref, type Ref } from "vue";
// Status pembayaran untuk aksi tandai lunas.
import { PEMBAYARAN_STATUS } from "@/utils/pembayaranStatus";
// Konfigurasi modal aksi status dari panel kontrol detail.
import {
  AKSI_CONFIG,
  type AksiConfirmationConfig,
  type PemesananAksiType,
} from "@/components/admin/pemesanan-detail/AdminPemesananDetailControlPanel/adminPemesananControlPanelHelpers";
import type { Pemesanan } from "@/types/pemesanan";

// Aksi status di dasbor tidak termasuk markPaid karena markPaid memakai modal pembayaran sendiri.
type DasborAksiType = Exclude<PemesananAksiType, "markPaid">;

// Menyimpan pemesanan dan aksi status yang sedang menunggu konfirmasi.
interface PendingStatusAksi {
  pemesanan: Pemesanan;
  aksi: DasborAksiType;
}

// Konfigurasi modal status yang dibutuhkan komponen dasbor.
type StatusAksiConfig = Pick<
  AksiConfirmationConfig,
  "title" | "message" | "confirmText" | "variant"
> & {
  statusBaru: string;
};

// Opsi/callback yang dikirim komponen utama ke composable.
interface UseAdminDasborTerbaruPemesananOptions {
  pemesanan: Ref<Pemesanan[]>;
  selectedMekaniks: Ref<Record<number, number>>;
  onStatusChange: (pemesanan: Pemesanan, statusBaru: string, catatan?: string) => void;
  onPembayaranStatusChange: (pemesanan: Pemesanan, statusBaru: string) => void;
  onAssignAndStart: (pemesanan: Pemesanan) => void;
  onSelectedMekaniksChange: (value: Record<number, number>) => void;
}

// Composable logic tabel pemesanan terbaru di dasbor admin.
export function useAdminDasborTerbaruPemesanan({
  pemesanan,
  selectedMekaniks,
  onStatusChange,
  onPembayaranStatusChange,
  onAssignAndStart,
  onSelectedMekaniksChange,
}: UseAdminDasborTerbaruPemesananOptions) {
  // State modal konfirmasi status servis.
  const showStatusConfirmModal = ref(false);
  const pendingStatusAksi = ref<PendingStatusAksi | null>(null);
  // State modal konfirmasi pembayaran lunas.
  const showPembayaranConfirmModal = ref(false);
  const pendingPembayaranAksi = ref<Pemesanan | null>(null);
  // State modal konfirmasi assign mekanik dan mulai servis.
  const showAssignStartConfirmModal = ref(false);
  const pendingAssignStartAksi = ref<Pemesanan | null>(null);

  // true jika ada pemesanan yang perlu ditampilkan.
  const hasPemesanan = computed(() => pemesanan.value.length > 0);

  // Konfigurasi modal aktif berdasarkan aksi yang dipilih.
  const activeStatusConfig = computed<StatusAksiConfig | null>(() => {
    if (!pendingStatusAksi.value) {
      return null;
    }

    const config = AKSI_CONFIG[pendingStatusAksi.value.aksi];

    if (config.requestType !== "status") {
      return null;
    }

    return {
      title: config.title,
      message: config.message,
      confirmText: config.confirmText,
      variant: config.variant,
      statusBaru: config.value,
    };
  });

  // Membuka modal konfirmasi status untuk pemesanan tertentu.
  const requestStatusConfirmation = (
    pemesanan: Pemesanan,
    aksi: DasborAksiType,
  ) => {
    pendingStatusAksi.value = { pemesanan, aksi };
    showStatusConfirmModal.value = true;
  };

  // Menutup modal status dan reset pending action.
  const closeStatusConfirmModal = () => {
    showStatusConfirmModal.value = false;
    pendingStatusAksi.value = null;
  };

  // Setelah modal dikonfirmasi, panggil callback parent untuk mengubah status.
  const applyStatusChange = (catatan?: string) => {
    const aksi = pendingStatusAksi.value;
    const config = activeStatusConfig.value;

    if (!aksi || !config) {
      closeStatusConfirmModal();
      return;
    }

    closeStatusConfirmModal();
    onStatusChange(aksi.pemesanan, config.statusBaru, catatan);
  };

  // Handler tombol konfirmasi.
  const handleConfirm = (pemesanan: Pemesanan) => {
    requestStatusConfirmation(pemesanan, "confirm");
  };

  // Handler tombol selesai.
  const handleComplete = (pemesanan: Pemesanan) => {
    requestStatusConfirmation(pemesanan, "complete");
  };

  // Handler tombol batal.
  const handleCancel = (pemesanan: Pemesanan) => {
    requestStatusConfirmation(pemesanan, "cancel");
  };

  // Handler tombol tandai lunas.
  const handleMarkPaid = (pemesanan: Pemesanan) => {
    // Tampilkan konfirmasi sebelum tandai lunas.
    pendingPembayaranAksi.value = pemesanan;
    showPembayaranConfirmModal.value = true;
  };

  // Mengirim perubahan pembayaran ke parent.
  const applyPembayaranChange = () => {
    if (!pendingPembayaranAksi.value) {
      closePembayaranConfirmModal();
      return;
    }
    const targetPemesanan = pendingPembayaranAksi.value;
    closePembayaranConfirmModal();
    onPembayaranStatusChange(targetPemesanan, PEMBAYARAN_STATUS.PAID);
  };

  // Menutup modal pembayaran.
  const closePembayaranConfirmModal = () => {
    showPembayaranConfirmModal.value = false;
    pendingPembayaranAksi.value = null;
  };

  // Membuka modal konfirmasi sebelum assign mekanik dan mulai servis.
  const requestAssignStartConfirmation = (pemesanan: Pemesanan) => {
    pendingAssignStartAksi.value = pemesanan;
    showAssignStartConfirmModal.value = true;
  };

  // Menjalankan assign/start setelah admin mengonfirmasi modal.
  const applyAssignStart = () => {
    if (!pendingAssignStartAksi.value) {
      closeAssignStartConfirmModal();
      return;
    }

    const targetPemesanan = pendingAssignStartAksi.value;
    closeAssignStartConfirmModal();
    onAssignAndStart(targetPemesanan);
  };

  // Menutup modal assign/start.
  const closeAssignStartConfirmModal = () => {
    showAssignStartConfirmModal.value = false;
    pendingAssignStartAksi.value = null;
  };

  // Menyimpan pilihan mekanik per id pemesanan.
  const handleMekanikChange = (
    idPemesanan: number,
    value: string | number | null,
  ) => {
    if (typeof value !== "number") {
      return;
    }

    // Buat object baru agar v-model parent terpicu reaktif.
    const updatedSelection = {
      ...selectedMekaniks.value,
      [idPemesanan]: value,
    };

    onSelectedMekaniksChange(updatedSelection);
  };

  // State dan handler yang dipakai komponen utama.
  return {
    hasPemesanan,
    showStatusConfirmModal,
    activeStatusConfig,
    showPembayaranConfirmModal,
    showAssignStartConfirmModal,
    handleConfirm,
    handleComplete,
    handleCancel,
    handleMarkPaid,
    handleMekanikChange,
    requestAssignStartConfirmation,
    closeStatusConfirmModal,
    applyStatusChange,
    applyPembayaranChange,
    closePembayaranConfirmModal,
    applyAssignStart,
    closeAssignStartConfirmModal,
  };
}

