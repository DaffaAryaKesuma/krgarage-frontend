import { computed, ref, type Ref } from "vue";
import { PEMBAYARAN_STATUS } from "@/utils/pembayaranStatus";
import {
  AKSI_CONFIG,
  type AksiConfirmationConfig,
  type PemesananAksiType,
} from "@/components/admin/pemesanan-detail/AdminPemesananDetailControlPanel/adminPemesananControlPanelHelpers";
import type { Pemesanan } from "@/types/pemesanan";

type DasborAksiType = Exclude<PemesananAksiType, "markPaid">;

interface PendingStatusAksi {
  pemesanan: Pemesanan;
  aksi: DasborAksiType;
}

type StatusAksiConfig = Pick<
  AksiConfirmationConfig,
  "title" | "message" | "confirmText" | "variant"
> & {
  statusBaru: string;
};

interface UseAdminDasborTerbaruPemesananOptions {
  pemesanan: Ref<Pemesanan[]>;
  selectedMekaniks: Ref<Record<number, number>>;
  onStatusChange: (pemesanan: Pemesanan, statusBaru: string, catatan?: string) => void;
  onPembayaranStatusChange: (pemesanan: Pemesanan, statusBaru: string) => void;
  onSelectedMekaniksChange: (value: Record<number, number>) => void;
}

export function useAdminDasborTerbaruPemesanan({
  pemesanan,
  selectedMekaniks,
  onStatusChange,
  onPembayaranStatusChange,
  onSelectedMekaniksChange,
}: UseAdminDasborTerbaruPemesananOptions) {
  const showStatusConfirmModal = ref(false);
  const pendingStatusAksi = ref<PendingStatusAksi | null>(null);
  const showPembayaranConfirmModal = ref(false);
  const pendingPembayaranAksi = ref<Pemesanan | null>(null);

  const hasPemesanan = computed(() => pemesanan.value.length > 0);

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

  const requestStatusConfirmation = (
    pemesanan: Pemesanan,
    aksi: DasborAksiType,
  ) => {
    pendingStatusAksi.value = { pemesanan, aksi };
    showStatusConfirmModal.value = true;
  };

  const closeStatusConfirmModal = () => {
    showStatusConfirmModal.value = false;
    pendingStatusAksi.value = null;
  };

  const applyStatusChange = (catatan?: string) => {
    const aksi = pendingStatusAksi.value;
    const config = activeStatusConfig.value;

    if (!aksi || !config) {
      closeStatusConfirmModal();
      return;
    }

    onStatusChange(aksi.pemesanan, config.statusBaru, catatan);
    closeStatusConfirmModal();
  };

  const handleConfirm = (pemesanan: Pemesanan) => {
    requestStatusConfirmation(pemesanan, "confirm");
  };

  const handleComplete = (pemesanan: Pemesanan) => {
    requestStatusConfirmation(pemesanan, "complete");
  };

  const handleCancel = (pemesanan: Pemesanan) => {
    requestStatusConfirmation(pemesanan, "cancel");
  };

  const handleMarkPaid = (pemesanan: Pemesanan) => {
    // Tampilkan konfirmasi sebelum tandai lunas
    pendingPembayaranAksi.value = pemesanan;
    showPembayaranConfirmModal.value = true;
  };

  const applyPembayaranChange = () => {
    if (!pendingPembayaranAksi.value) {
      closePembayaranConfirmModal();
      return;
    }
    onPembayaranStatusChange(pendingPembayaranAksi.value, PEMBAYARAN_STATUS.PAID);
    closePembayaranConfirmModal();
  };

  const closePembayaranConfirmModal = () => {
    showPembayaranConfirmModal.value = false;
    pendingPembayaranAksi.value = null;
  };

  const handleMekanikChange = (
    idPemesanan: number,
    value: string | number | null,
  ) => {
    if (typeof value !== "number") {
      return;
    }

    const updatedSelection = {
      ...selectedMekaniks.value,
      [idPemesanan]: value,
    };

    onSelectedMekaniksChange(updatedSelection);
  };

  return {
    hasPemesanan,
    showStatusConfirmModal,
    activeStatusConfig,
    showPembayaranConfirmModal,
    handleConfirm,
    handleComplete,
    handleCancel,
    handleMarkPaid,
    handleMekanikChange,
    closeStatusConfirmModal,
    applyStatusChange,
    applyPembayaranChange,
    closePembayaranConfirmModal,
  };
}

