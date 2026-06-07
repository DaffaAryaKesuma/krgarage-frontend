// Form Variants
// Sumber kebenaran tunggal untuk class form di KRGarage.
// Cakupan: input, label, textarea, select, error state, hint text, focus ring.
// Jangan masukkan badge, tombol, atau table ke file ini.
// Lihat: badgeVariants.ts, buttonVariants.ts, tableVariants.ts.

// Label standar untuk field form.
export const FORM_LABEL_CLASS =
  "mb-1.5 block text-sm font-medium text-gray-700";

// Tanda wajib (*) di dalam label.
export const FORM_REQUIRED_MARK_CLASS = "text-red-500";

// Teks petunjuk/keterangan di bawah field.
export const FORM_HINT_CLASS = "mt-1.5 text-xs text-gray-500";

// Teks pesan error di bawah field, muncul saat validasi gagal.
export const FORM_ERROR_CLASS =
  "mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600";

// Base class input: layout, radius, transisi, placeholder, dan disabled state.
export const FORM_INPUT_BASE_CLASS =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60";

// State normal: border abu, hover lebih gelap, focus ring abu-abu.
export const FORM_INPUT_NORMAL_CLASS =
  "border-gray-300 hover:border-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200/50";

// State error: border merah, background merah muda, focus ring merah.
export const FORM_INPUT_ERROR_CLASS =
  "border-red-400 bg-red-50/60 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200";

// Mengembalikan class lengkap untuk input atau textarea.
export function getFormInputClass(
  hasError = false,
  extraClass = "",
): string {
  // Pilih state class berdasarkan apakah field sedang error.
  const stateClass = hasError ? FORM_INPUT_ERROR_CLASS : FORM_INPUT_NORMAL_CLASS;
  return [FORM_INPUT_BASE_CLASS, stateClass, extraClass]
    .filter(Boolean)
    .join(" ");
}

// Base class textarea sama seperti input, tetapi resize dimatikan.
export const FORM_TEXTAREA_BASE_CLASS = `${FORM_INPUT_BASE_CLASS} resize-none`;

// Mengembalikan class lengkap untuk textarea.
export function getFormTextareaClass(
  hasError = false,
  extraClass = "",
): string {
  // Pilih state class berdasarkan apakah field sedang error.
  const stateClass = hasError ? FORM_INPUT_ERROR_CLASS : FORM_INPUT_NORMAL_CLASS;
  return [FORM_TEXTAREA_BASE_CLASS, stateClass, extraClass]
    .filter(Boolean)
    .join(" ");
}

// Base class untuk native select. Pakai CustomSelect.vue untuk dropdown kustom.
export const FORM_SELECT_BASE_CLASS =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60";

// Mengembalikan class lengkap untuk native select.
export function getFormSelectClass(
  hasError = false,
  extraClass = "",
): string {
  // Pilih state class berdasarkan apakah field sedang error.
  const stateClass = hasError ? FORM_INPUT_ERROR_CLASS : FORM_INPUT_NORMAL_CLASS;
  return [FORM_SELECT_BASE_CLASS, stateClass, extraClass]
    .filter(Boolean)
    .join(" ");
}

// Wrapper luar untuk input yang memiliki icon di kiri.
export const FORM_INPUT_ICON_WRAPPER_CLASS = "relative group";

// Posisi absolut icon prefix di kiri input.
export const FORM_INPUT_ICON_PREFIX_CLASS =
  "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-gray-600";

// Mengembalikan class input dengan padding kiri untuk icon prefix.
export function getFormInputWithIconClass(
  hasError = false,
  extraClass = "",
): string {
  // pl-10 memberi ruang agar teks input tidak menabrak icon.
  const plClass = ["pl-10", extraClass].filter(Boolean).join(" ");
  return getFormInputClass(hasError, plClass);
}

// Class checkbox standar.
export const FORM_CHECKBOX_CLASS =
  "h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500";

// Mengembalikan class checkbox dengan tambahan class opsional.
export function getFormCheckboxClass(extraClass = ""): string {
  return [FORM_CHECKBOX_CLASS, extraClass].filter(Boolean).join(" ");
}

// Type dokumentasi untuk state field form.
export type FormInputState = "normal" | "error" | "disabled";
