// ─── Form Variants ────────────────────────────────────────────────────────────
// Sumber kebenaran tunggal untuk class form di KRGarage.
// Cakupan: input, label, textarea, select, error state, hint text, focus ring.
//
// Jangan masukkan badge, tombol, atau table ke file ini.
// Lihat: badgeVariants.ts, buttonVariants.ts, tableVariants.ts.

// ─── Label ────────────────────────────────────────────────────────────────────

/** Label standar untuk field form. */
export const FORM_LABEL_CLASS =
  "mb-1.5 block text-sm font-medium text-gray-700";

/** Tanda wajib (*) di dalam label. */
export const FORM_REQUIRED_MARK_CLASS = "text-red-500";

// ─── Hint & Error ─────────────────────────────────────────────────────────────

/** Teks petunjuk/keterangan di bawah field (opsional). */
export const FORM_HINT_CLASS = "mt-1.5 text-xs text-gray-500";

/** Teks pesan error di bawah field, muncul saat validasi gagal. */
export const FORM_ERROR_CLASS =
  "mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600";

// ─── Input Base ───────────────────────────────────────────────────────────────

/** Base class input — layout, radius, transisi. Selalu digabung dengan state class. */
export const FORM_INPUT_BASE_CLASS =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60";

// ─── Input States ─────────────────────────────────────────────────────────────

/** State normal: border abu, hover lebih gelap, focus ring merah brand. */
export const FORM_INPUT_NORMAL_CLASS =
  "border-gray-300 hover:border-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200";

/** State error: border merah, bg merah muda, focus ring merah. */
export const FORM_INPUT_ERROR_CLASS =
  "border-red-400 bg-red-50/60 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200";

// ─── Input Helper ─────────────────────────────────────────────────────────────

/**
 * Mengembalikan class lengkap untuk `<input>` atau `<textarea>`.
 *
 * @param hasError  - true jika field memiliki error validasi
 * @param extraClass - class tambahan opsional (misal: `pl-10` untuk icon prefix)
 */
export function getFormInputClass(
  hasError = false,
  extraClass = "",
): string {
  const stateClass = hasError ? FORM_INPUT_ERROR_CLASS : FORM_INPUT_NORMAL_CLASS;
  return [FORM_INPUT_BASE_CLASS, stateClass, extraClass]
    .filter(Boolean)
    .join(" ");
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

/** Base class textarea — sama dengan input tapi tambah resize-none. */
export const FORM_TEXTAREA_BASE_CLASS = `${FORM_INPUT_BASE_CLASS} resize-none`;

/**
 * Mengembalikan class lengkap untuk `<textarea>`.
 *
 * @param hasError  - true jika field memiliki error validasi
 * @param extraClass - class tambahan opsional
 */
export function getFormTextareaClass(
  hasError = false,
  extraClass = "",
): string {
  const stateClass = hasError ? FORM_INPUT_ERROR_CLASS : FORM_INPUT_NORMAL_CLASS;
  return [FORM_TEXTAREA_BASE_CLASS, stateClass, extraClass]
    .filter(Boolean)
    .join(" ");
}

// ─── Select (native <select>) ─────────────────────────────────────────────────

/** Base class untuk native `<select>`. Pakai `CustomSelect.vue` untuk dropdown kustom. */
export const FORM_SELECT_BASE_CLASS =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60";

/**
 * Mengembalikan class lengkap untuk native `<select>`.
 *
 * @param hasError  - true jika field memiliki error validasi
 * @param extraClass - class tambahan opsional
 */
export function getFormSelectClass(
  hasError = false,
  extraClass = "",
): string {
  const stateClass = hasError ? FORM_INPUT_ERROR_CLASS : FORM_INPUT_NORMAL_CLASS;
  return [FORM_SELECT_BASE_CLASS, stateClass, extraClass]
    .filter(Boolean)
    .join(" ");
}

// ─── Input dengan Icon Prefix ─────────────────────────────────────────────────

/** Wrapper luar untuk input yang memiliki icon di kiri. */
export const FORM_INPUT_ICON_WRAPPER_CLASS = "relative group";

/**
 * Posisi absolut icon prefix di kiri input.
 * Warna icon akan mengikuti `group-focus-within` jika diinginkan.
 */
export const FORM_INPUT_ICON_PREFIX_CLASS =
  "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-gray-600";

/**
 * Mengembalikan class input dengan padding kiri untuk icon prefix.
 *
 * @param hasError  - true jika field memiliki error validasi
 */
export function getFormInputWithIconClass(hasError = false): string {
  return getFormInputClass(hasError, "pl-10");
}

// ─── Type exports ─────────────────────────────────────────────────────────────

export type FormInputState = "normal" | "error" | "disabled";
