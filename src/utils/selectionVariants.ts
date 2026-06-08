// Tone warna yang tersedia untuk kartu pilihan.
type SelectionTone = "primary" | "info" | "success";

// Mapping warna untuk state kartu pilihan.
const selectionToneVariants: Record<
  SelectionTone,
  {
    selected: string;
    hover: string;
    check: string;
    unavailable: string;
  }
> = {
  primary: {
    selected: "border-red-500 bg-red-50 shadow-lg",
    hover: "hover:border-red-200",
    check: "bg-red-500 border-red-600",
    unavailable: "bg-red-100 border-red-300 text-red-600",
  },
  info: {
    selected: "border-blue-500 bg-blue-50 shadow-lg",
    hover: "hover:border-blue-200",
    check: "bg-blue-500 border-blue-600",
    unavailable: "bg-blue-100 border-blue-300 text-blue-600",
  },
  success: {
    selected: "border-green-500 bg-green-50 shadow-lg",
    hover: "hover:border-green-200 hover:bg-green-50",
    check: "bg-green-500 border-green-600",
    unavailable: "bg-red-100 border-red-300 text-red-600",
  },
};

// Class dasar kartu/tombol tambah data.
export const ADD_ACTION_CARD_BASE_CLASS =
  "group border-2 border-dashed border-gray-300 bg-transparent text-gray-400 transition-all hover:border-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-gray-200/50";

// Class icon tombol tambah.
export const ADD_ACTION_ICON_CLASS =
  "text-gray-400 transition-colors group-hover:text-red-600";

// Class wrapper icon tombol tambah.
export const ADD_ACTION_ICON_WRAPPER_CLASS =
  "flex items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors group-hover:bg-red-100 group-hover:text-red-600";

// Class judul tombol tambah.
export const ADD_ACTION_TITLE_CLASS =
  "font-semibold text-gray-500 transition-colors group-hover:text-red-600";

// Class subtitle tombol tambah.
export const ADD_ACTION_SUBTITLE_CLASS =
  "text-gray-400 transition-colors group-hover:text-red-400";

// Membuat class tombol tambah dalam bentuk card atau bar.
export function getAddActionCardClass(
  layout: "card" | "bar" = "card",
  extraClass = "",
): string {
  // Layout bar biasanya melebar horizontal, card biasanya kotak/grid.
  const layoutClass =
    layout === "bar"
      ? "flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-4"
      : "flex cursor-pointer flex-col items-center justify-center rounded-xl p-6";

  // Gabungkan base, layout, dan class tambahan.
  return [ADD_ACTION_CARD_BASE_CLASS, layoutClass, extraClass]
    .filter(Boolean)
    .join(" ");
}

// Membuat class kartu pilihan, misalnya layanan, Vespa, atau slot.
export function getSelectionCardClass({
  selected,
  disabled = false,
  tone = "primary",
  extraClass = "",
}: {
  selected: boolean;
  disabled?: boolean;
  tone?: SelectionTone;
  extraClass?: string;
}): string {
  const toneClass = selectionToneVariants[tone];
  // State disabled, selected, dan normal punya tampilan berbeda.
  const stateClass = disabled
    ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-75"
    : selected
      ? `${toneClass.selected} cursor-pointer`
      : `border-gray-200 bg-white ${toneClass.hover} cursor-pointer`;

  // Return class lengkap kartu pilihan.
  return ["rounded-lg border-2 transition-all", stateClass, extraClass]
    .filter(Boolean)
    .join(" ");
}

// Membuat class lingkaran check pada kartu pilihan.
export function getSelectionCheckClass(
  tone: SelectionTone,
  selected: boolean,
  extraClass = "",
): string {
  // Jika selected, pakai warna tone; jika belum, putih border abu.
  const stateClass = selected
    ? selectionToneVariants[tone].check
    : "border-gray-300 bg-white";

  // Return class lengkap icon check.
  return [
    "flex h-6 w-6 items-center justify-center rounded-full border-2",
    stateClass,
    extraClass,
  ]
    .filter(Boolean)
    .join(" ");
}

// Membuat class slot jam pemesanan.
export function getTimeSlotClass({
  booked,
  unavailable = false,
  selected,
}: {
  booked: boolean;
  unavailable?: boolean;
  selected: boolean;
}): string {
  // Slot yang sudah dibooking dibuat disabled dan dicoret.
  if (booked) {
    return `cursor-not-allowed opacity-50 line-through ${selectionToneVariants.success.unavailable}`;
  }

  if (unavailable) {
    return "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-70 line-through";
  }

  // Slot yang dipilih diberi warna hijau.
  if (selected) {
    return `${selectionToneVariants.success.check} text-white shadow-lg`;
  }

  // Slot normal bisa dipilih.
  return "border-gray-300 bg-white hover:border-green-400 hover:bg-green-50";
}
