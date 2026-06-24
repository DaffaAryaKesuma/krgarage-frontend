import { computed, ref, watch } from "vue";
// Lock scroll saat modal restock terbuka.
import { scrollLock } from "@/composables/scrollLock";
import { getButtonClass } from "@/utils/buttonVariants";
import {
  FORM_HINT_CLASS,
  FORM_LABEL_CLASS,
  FORM_ERROR_CLASS,
  getFormCheckboxClass,
  getFormInputClass,
  getFormTextareaClass,
} from "@/utils/formVariants";
import type { InventarisSukuCadang } from "@/types/inventaris";

const MAX_RECEIPT_SIZE = 10 * 1024 * 1024;
const ALLOWED_RECEIPT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];
const ALLOWED_RECEIPT_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
  "heif",
];

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
export const errorClass = FORM_ERROR_CLASS;
export const checkboxClass = getFormCheckboxClass("mt-1");

// Class tombol modal.
export const buttonPrimaryClass = getButtonClass("success", "lg", "rounded-xl");

export const buttonSecondaryClass = getButtonClass("secondary", "lg", "rounded-xl");

// Composable logic modal tambah stok.
export function useAdminInventarisStokUlangModal(
  props: AdminInventarisStokUlangModalProps,
  emit: AdminInventarisStokUlangModalEmit,
) {
  // Lock scroll halaman saat modal terbuka.
  scrollLock(() => props.show);

  // Total pengeluaran restock = jumlah tambahan x harga beli per unit.
  const totalPengeluaran = computed(
    () => props.restockQuantity * props.restockUnitPrice,
  );
  const errors = ref({ quantity: "", unitPrice: "", receipt: "" });
  const touched = ref({ quantity: false, unitPrice: false });

  watch(() => props.show, (show) => {
    if (!show) return;
    errors.value = { quantity: "", unitPrice: "", receipt: "" };
    touched.value = { quantity: false, unitPrice: false };
  });

  const validateQuantity = () => {
    errors.value.quantity =
      !Number.isInteger(props.restockQuantity) || props.restockQuantity < 1
        ? "Jumlah tambahan minimal 1."
        : "";
    return !errors.value.quantity;
  };

  const validateUnitPrice = () => {
    errors.value.unitPrice =
      !Number.isInteger(props.restockUnitPrice) || props.restockUnitPrice < 0
        ? "Harga beli harus berupa bilangan bulat dan tidak boleh negatif."
        : "";
    return !errors.value.unitPrice;
  };

  const handleSubmit = () => {
    touched.value = { quantity: true, unitPrice: true };
    errors.value.receipt = props.restockReceiptFile
      ? ""
      : "Foto struk pembelian wajib diunggah.";
    if (
      !validateQuantity() ||
      !validateUnitPrice() ||
      errors.value.receipt
    ) {
      return;
    }
    emit("submit");
  };

  const quantityInputClass = computed(() =>
    getFormInputClass(
      touched.value.quantity && Boolean(errors.value.quantity),
      "rounded-xl px-4 py-3",
    ),
  );
  const unitPriceInputClass = computed(() =>
    getFormInputClass(
      touched.value.unitPrice && Boolean(errors.value.unitPrice),
      "rounded-xl px-4 py-3",
    ),
  );

  const handleReceiptSelected = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      errors.value.receipt = "";
      return null;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const typeValid =
      ALLOWED_RECEIPT_TYPES.includes(file.type.toLowerCase()) ||
      ALLOWED_RECEIPT_EXTENSIONS.includes(extension);

    if (!typeValid) {
      errors.value.receipt =
        "Format foto struk harus JPG, JPEG, PNG, WebP, HEIC, atau HEIF.";
      input.value = "";
      return null;
    }

    if (file.size > MAX_RECEIPT_SIZE) {
      errors.value.receipt = "Ukuran foto struk maksimal 10MB.";
      input.value = "";
      return null;
    }

    errors.value.receipt = "";
    return file;
  };

  // Nilai computed yang dipakai template.
  return {
    totalPengeluaran,
    handleReceiptSelected,
    errors,
    touched,
    validateQuantity,
    validateUnitPrice,
    handleSubmit,
    quantityInputClass,
    unitPriceInputClass,
  };
}
