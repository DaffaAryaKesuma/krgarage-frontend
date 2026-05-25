export const TABLE_WRAPPER_CLASS =
  "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm";

export const TABLE_CLASS = "w-full divide-y divide-gray-200";

export const TABLE_FIXED_CLASS = `${TABLE_CLASS} table-fixed`;

export const TABLE_HEAD_CLASS = "bg-gray-50";

export const TABLE_HEADER_CELL_CLASS =
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-6";

export const TABLE_COMFORTABLE_HEADER_CELL_CLASS =
  "px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500";

export const TABLE_BODY_CLASS = "divide-y divide-gray-100 bg-white";

export const TABLE_MOBILE_KARTU_CLASS = "space-y-4 bg-gray-50 p-4";

export const TABLE_MOBILE_CARD_CLASS =
  "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm";

export const TABLE_MOBILE_CARD_HEADER_CLASS =
  "flex items-start justify-between gap-3";

export const TABLE_MOBILE_CARD_DIVIDER_HEADER_CLASS =
  "mb-3 flex items-start justify-between gap-3 border-b border-gray-100 pb-3";

export const TABLE_MOBILE_CARD_GRID_CLASS =
  "mt-3 grid grid-cols-2 gap-3 text-sm";

export const TABLE_MOBILE_CARD_SINGLE_GRID_CLASS =
  "mt-3 grid grid-cols-1 gap-2 text-sm min-[380px]:grid-cols-2";

export const TABLE_MOBILE_CARD_STACK_CLASS = "mt-3 space-y-2 text-sm";

export const TABLE_MOBILE_CARD_FOOTER_CLASS =
  "mt-4 border-t border-gray-100 pt-3";

export const TABLE_ROW_HOVER_CLASS = "transition-colors hover:bg-gray-50";

export const TABLE_DANGER_ROW_HOVER_CLASS = "transition-colors hover:bg-red-50";

export function buildTableClass(extraClass = ""): string {
  return [TABLE_CLASS, extraClass].filter(Boolean).join(" ");
}

export function buildFixedTableClass(extraClass = ""): string {
  return [TABLE_FIXED_CLASS, extraClass].filter(Boolean).join(" ");
}

export function buildTableHeaderCellClass(extraClass = ""): string {
  return [TABLE_HEADER_CELL_CLASS, extraClass].filter(Boolean).join(" ");
}

export function buildComfortableTableHeaderCellClass(extraClass = ""): string {
  return [TABLE_COMFORTABLE_HEADER_CELL_CLASS, extraClass]
    .filter(Boolean)
    .join(" ");
}
