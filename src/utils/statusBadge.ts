// File ini menjadi pintu ekspor status.
// Komponen cukup import dari statusBadge tanpa perlu tahu statusCore/statusRules.
export {
  PEMESANAN_STATUS,
  STATUS_MAP,
  PEMESANAN_STATUS_FILTER_OPTIONS,
  MEKANIK_STATUS_FILTER_OPTIONS,
  STATUS_BADGE_BASE_CLASS,
  toPemesananStatus,
  matchesPemesananStatusFilter,
  mapMekanikFilterToPemesananStatus,
  type PemesananStatus,
  type PemesananStatusFilter,
  type MekanikStatusFilter,
} from "./statusCore";

export {
  isStatusMenunggu,
  isStatusDikonfirmasi,
  isStatusBatal,
  isPendingOrConfirmedStatus,
  isStatusDikerjakan,
  isStatusSelesai,
  isCompletedOrCancelledStatus,
  canPelangganCancelPemesanan,
  canAdminCancelPemesanan,
  canAdminConfirmPemesanan,
  canAdminAssignAndStart,
  canAdminCompletePemesanan,
  canMekanikUpdateStatus,
  canMekanikAddSukuCadang,
  getMekanikAksiButtonText,
  getMekanikNextStatus,
  getStatusBadge,
  getStatusBadgeClass,
  getStatusLabel,
  getStatusIcon,
} from "./statusRules";
