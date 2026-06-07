import { toIDR } from "@/utils/money";
import { formatNama } from "@/utils/format";
import { getChipBadgeClass, getRoleBadgeClass } from "@/utils/badgeVariants";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import type { LogAktivitasAdmin } from "@/types/inventaris";
import { computed } from "vue";

export interface PemilikAuditAktivitasTableProps {
  logs: LogAktivitasAdmin[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  title?: string;
  emptyMessage?: string;
}

export const AUDIT_TABLE_HEADERS = [
  "Waktu",
  "Aktor",
  "Aktivitas",
  "Target",
  "Deskripsi",
  "Perubahan",
];

export const AUDIT_TABLE_COLUMN_WIDTHS = [
  "18%",
  "13%",
  "15%",
  "17%",
  "23%",
  "26%",
];

export const AUDIT_TABLE_CELL_CLASS =
  "px-6 py-4 align-top text-sm text-gray-800";

export const AUDIT_TABLE_MUTED_CELL_CLASS =
  "px-6 py-4 align-top text-sm text-gray-500";

const MONEY_FIELDS = [
  "harga_beli",
  "harga_jual",
  "harga_beli_satuan_restok",
  "harga_saat_ini",
  "total_harga",
  "total_pengeluaran",
];

const NAME_FIELDS = ["nama_mekanik"];

const FIELD_LABELS: Record<string, string> = {
  catatan_mekanik: "Catatan",
  completed_at: "Waktu Selesai",
  harga_saat_ini: "Harga",
  id_mekanik: "ID Mekanik",
  id_suku_cadang: "ID Suku Cadang",
  jam_pemesanan: "Jam",
  jumlah: "Jumlah",
  jumlah_stok: "Jumlah Stok",
  kode_pemesanan: "Kode Pemesanan",
  nama_mekanik: "Mekanik",
  nama_suku_cadang: "Suku Cadang",
  status: "Status",
  status_pembayaran: "Status Pembayaran",
  tanggal_pemesanan: "Tanggal",
  total_harga: "Total",
};

const DEFAULT_VISIBLE_FIELDS = [
  "status",
  "status_pembayaran",
  "nama_mekanik",
  "catatan_mekanik",
  "jumlah_stok",
  "harga_beli",
  "harga_jual",
  "harga_beli_satuan_restok",
  "total_pengeluaran",
];

const TARGET_VISIBLE_FIELDS: Record<string, string[]> = {
  item_pemesanan: ["jumlah"],
};

const ACTION_VISIBLE_FIELDS: Record<string, string[]> = {
  batal: ["status"],
};

export const formatFieldLabel = (field: string) =>
  FIELD_LABELS[field] ||
  field
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const formatAuditValue = (field: string, value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";

  if (field === "status") {
    return getStatusLabel(String(value));
  }

  if (MONEY_FIELDS.includes(field)) {
    return toIDR(Number(value));
  }

  if (NAME_FIELDS.includes(field)) {
    return formatNama(String(value));
  }

  return String(value);
};

export const getAuditValueClass = (field: string, value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "text-gray-400";
  }

  if (field === "status") {
    return getStatusBadgeClass(String(value));
  }

  if (field === "nama_mekanik") {
    return getChipBadgeClass("info");
  }

  return "";
};

export const getAuditActionClass = (action: string) => {
  if (action === "edit") return "bg-blue-50 text-blue-700";
  if (action === "hapus") return "bg-red-50 text-red-700";
  if (action === "restok") return "bg-green-50 text-green-700";
  if (action === "tambah") return "bg-sky-50 text-sky-700";
  return "bg-gray-100 text-gray-700";
};

export const getAuditModuleClass = (module: string) => {
  if (module === "inventaris") return "bg-red-50 text-red-700";
  if (module === "keuangan") return "bg-green-50 text-green-700";
  if (module === "pemesanan") return "bg-blue-50 text-blue-700";
  if (module === "layanan") return "bg-purple-50 text-purple-700";
  if (module === "karyawan") return "bg-amber-50 text-amber-700";
  return "bg-gray-100 text-gray-700";
};

export const getAuditActorRoleClass = (role?: string | null) => {
  return getRoleBadgeClass(role);
};

export const getAuditActorName = (log: LogAktivitasAdmin) =>
  log.aktor?.nama || log.admin?.nama || "-";

export const getAuditActorRole = (log: LogAktivitasAdmin) =>
  log.role_pengguna || log.aktor?.role || log.admin?.role || "admin";

export const getChangedFields = (log: LogAktivitasAdmin) => {
  const before = log.data_sebelum || {};
  const after = log.data_sesudah || {};

  return Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));
};

export const getVisibleChangedFields = (log: LogAktivitasAdmin) => {
  const changedFields = getChangedFields(log);
  const preferredFields =
    ACTION_VISIBLE_FIELDS[log.aksi] ||
    TARGET_VISIBLE_FIELDS[log.target_tipe || ""] ||
    (log.role_pengguna === "pelanggan" && log.aksi === "tambah"
      ? ["status"]
      : DEFAULT_VISIBLE_FIELDS);

  const visibleFields = preferredFields.filter((field) =>
    changedFields.includes(field),
  );

  return visibleFields.length > 0 ? visibleFields : changedFields.slice(0, 2);
};

const isEmptyAuditValue = (value: unknown) =>
  value === null || value === undefined || value === "";

export const shouldShowAuditArrow = (log: LogAktivitasAdmin, field: string) => {
  const before = log.data_sebelum?.[field];
  const after = log.data_sesudah?.[field];

  if (log.aksi === "tambah" || log.aksi === "hapus") return false;
  if (field === "nama_mekanik") return false;

  return !isEmptyAuditValue(before) && !isEmptyAuditValue(after);
};

export const getSingleAuditValue = (log: LogAktivitasAdmin, field: string) => {
  const before = log.data_sebelum?.[field];
  const after = log.data_sesudah?.[field];
  const value = isEmptyAuditValue(after) ? before : after;

  return formatAuditValue(field, value);
};

export function usePemilikAuditAktivitasTable(
  props: PemilikAuditAktivitasTableProps,
) {
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(props.logs.length / props.itemsPerPage)),
  );

  const from = computed(() => {
    if (props.logs.length === 0) return 0;
    return (props.currentPage - 1) * props.itemsPerPage + 1;
  });

  const to = computed(() => {
    if (props.logs.length === 0) return 0;
    return Math.min(props.currentPage * props.itemsPerPage, props.logs.length);
  });

  const paginatedLogs = computed(() => {
    const start = (props.currentPage - 1) * props.itemsPerPage;
    return props.logs.slice(start, start + props.itemsPerPage);
  });

  return {
    totalPages,
    from,
    to,
    paginatedLogs,
  };
}
