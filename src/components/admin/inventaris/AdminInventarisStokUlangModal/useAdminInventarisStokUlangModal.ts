import { computed } from "vue";
// Lock scroll saat modal restock terbuka.
import { scrollLock } from "@/composables/scrollLock";
import { getButtonClass } from "@/utils/buttonVariants";
import {
  FORM_HINT_CLASS,
  FORM_LABEL_CLASS,
  getFormCheckboxClass,
  getFormInputClass,
  getFormTextareaClass,
} from "@/utils/formVariants";
import type { InventarisSukuCadang } from "@/types/inventaris";

const MAX_RECEIPT_SIZE = 2 * 1024 * 1024;

// Props modal tambah stok.
export interface AdminInventarisStokUlangModalProps {
  show: boolean;
  selectedSukuCadang: InventarisSukuCadang | null;
  restockQuantity: number;
  restockUnitPrice: number;
  restockUpdateMasterPrice: boolean;
  restockNote: string;
  restockReceiptFile: File | null;
  loading: boolean;
}

// Event v-model dan submit modal tambah stok.
export interface AdminInventarisStokUlangModalEmit {
  (e: "close"): void;
  (e: "submit"): void;
  (e: "update:restockQuantity", value: number): void;
  (e: "update:restockUnitPrice", value: number): void;
  (e: "update:restockUpdateMasterPrice", value: boolean): void;
  (e: "update:restockNote", value: string): void;
  (e: "receiptChange", value: File | null): void;
}

// Class kartu field modal.
export const modalKartuClass =
  "rounded-2xl border border-gray-200 bg-gray-50 p-4";

// Class form dari formVariants.
export const inputClass = getFormInputClass(false, "rounded-xl px-4 py-3");
export const textareaClass = getFormTextareaClass(false, "rounded-xl px-4 py-3");
export const labelClass = FORM_LABEL_CLASS;
export const hintClass = FORM_HINT_CLASS;
export const checkboxClass = getFormCheckboxClass("mt-1");

// Class tombol modal.
export const buttonPrimaryClass = getButtonClass("success", "lg", "rounded-xl");

export const buttonSecondaryClass = getButtonClass("secondary", "lg", "rounded-xl");

// Composable logic modal tambah stok.
export function useAdminInventarisStokUlangModal(
  props: AdminInventarisStokUlangModalProps,
) {
  // Lock scroll halaman saat modal terbuka.
  scrollLock(() => props.show);

  // Total pengeluaran restock = jumlah tambahan x harga beli per unit.
  const totalPengeluaran = computed(
    () => props.restockQuantity * props.restockUnitPrice,
  );

  const handleReceiptSelected = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      return null;
    }

    if (!file.type.startsWith("image/")) {
      alert("File struk harus berupa gambar");
      input.value = "";
      return null;
    }

    if (file.size > MAX_RECEIPT_SIZE) {
      alert("Ukuran foto struk terlalu besar (maksimal 2MB)");
      input.value = "";
      return null;
    }

    return file;
  };

  // Nilai computed yang dipakai template.
  return {
    totalPengeluaran,
    handleReceiptSelected,
  };
}
