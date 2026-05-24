import { computed } from "vue";
import { scrollLock } from "@/composables/scrollLock";
import type { InventarisSukuCadang } from "@/types/inventaris";

export interface AdminInventarisStokUlangModalProps {
  show: boolean;
  selectedSukuCadang: InventarisSukuCadang | null;
  restockQuantity: number;
  restockUnitPrice: number;
  restockUpdateMasterPrice: boolean;
  restockNote: string;
  loading: boolean;
}

export interface AdminInventarisStokUlangModalEmit {
  (e: "close"): void;
  (e: "submit"): void;
  (e: "update:restockQuantity", value: number): void;
  (e: "update:restockUnitPrice", value: number): void;
  (e: "update:restockUpdateMasterPrice", value: boolean): void;
  (e: "update:restockNote", value: string): void;
}

export const modalKartuClass =
  "rounded-2xl border border-gray-200 bg-gray-50 p-4";

export const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 ";

const buttonBaseClass =
  "inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export const buttonPrimaryClass = `${buttonBaseClass} bg-green-600 text-white hover:bg-green-700`;

export const buttonSecondaryClass = `${buttonBaseClass} border border-gray-300 text-gray-700 hover:bg-gray-100`;

export function useAdminInventarisStokUlangModal(
  props: AdminInventarisStokUlangModalProps,
) {
  scrollLock(() => props.show);

  const totalPengeluaran = computed(
    () => props.restockQuantity * props.restockUnitPrice,
  );

  return {
    totalPengeluaran,
  };
}
