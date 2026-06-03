import { computed, ref, watch } from "vue";
import { notifyKrGarageDataChanged } from "@/composables/useRealtimeRefresh";
import { useToast } from "@/utils/useToast";
import {
  PEMESANAN_STATUS,
  canAdminAssignAndStart,
  canAdminCancelPemesanan,
  canAdminCompletePemesanan,
  canAdminConfirmPemesanan,
  isStatusBatal,
  isStatusSelesai,
} from "@/utils/statusBadge";
import {
  getPembayaranStatusBadgeClass,
  getPembayaranStatusLabel,
  isPaidStatus,
} from "@/utils/pembayaranStatus";
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
import {
  assignMekanikToPemesanan,
  fetchAdminMekaniks,
  patchAdminPemesananStatus,
  patchAdminPembayaranStatus,
} from "@/components/admin/pemesanan-detail/AdminPemesananDetailControlPanel/adminPemesananControlPanelApi";

export {
  CANCEL_BUTTON_CLASS,
  COMPLETE_BUTTON_CLASS,
  CONFIRM_BUTTON_CLASS,
  MARK_PAID_BUTTON_CLASS,
};

export interface PropertiAdminPemesananControlPanel {
  pemesananId: number;
  currentStatus: string;
  currentPembayaranStatus?: string | null;
  currentMekanikId: number | null;
  currentMekanikName?: string;
}

export function useAdminPemesananControlPanel(
  properti: PropertiAdminPemesananControlPanel,
  onRefresh: () => void,
) {
  const toast = useToast();

  const availableMekaniks = ref<Mekanik[]>([]);
  const isProcessing = ref(false);
  const selectedMekanikId = ref<number | null>(properti.currentMekanikId);
  const showAksiConfirmation = ref(false);
  const pendingAksi = ref<PemesananAksiType | null>(null);

  watch(
    () => properti.currentMekanikId,
    (idMekanikBerikutnya) => {
      selectedMekanikId.value = idMekanikBerikutnya;
    },
  );

  const mekanikOptionsDaftar = computed(() =>
    availableMekaniks.value.map((mekanik) => ({
      value: mekanik.id,
      label: mekanik.nama,
    })),
  );

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

  const pembayaranStatusLabel = computed(() =>
    getPembayaranStatusLabel(properti.currentPembayaranStatus),
  );
  const pembayaranStatusBadgeClass = computed(() =>
    getPembayaranStatusBadgeClass(properti.currentPembayaranStatus),
  );

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

  const aksiConfirmationConfig = computed<AksiConfirmationConfig | null>(
    () => (pendingAksi.value ? AKSI_CONFIG[pendingAksi.value] : null),
  );

  const requestAksiConfirmation = (aksi: PemesananAksiType) => {
    pendingAksi.value = aksi;
    showAksiConfirmation.value = true;
  };

  const closeAksiConfirmation = () => {
    showAksiConfirmation.value = false;
    pendingAksi.value = null;
  };

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

  async function fetchMekaniks() {
    try {
      availableMekaniks.value = await fetchAdminMekaniks();
    } catch (error) {
      console.error("Gagal mengambil daftar mekanik:", error);
    }
  }

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

  const handleConfirm = () => requestAksiConfirmation("confirm");
  const handleComplete = () => requestAksiConfirmation("complete");
  const handleCancel = () => requestAksiConfirmation("cancel");
  const handleMarkAsPaid = () => requestAksiConfirmation("markPaid");

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
