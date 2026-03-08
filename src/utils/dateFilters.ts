/**
 * Centralized date filter utilities for year and month selection
 */

export const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export interface FilterOption {
  value: number | string;
  label: string;
}

/**
 * Get month options with numeric values (1-12)
 * @returns Array of month options with value as number
 */
export function getMonthOptions(): FilterOption[] {
  return MONTH_NAMES.map((month, index) => ({
    value: index + 1,
    label: month,
  }));
}

/**
 * Get month options with "Semua Bulan" option
 * @returns Array of month options including "All" option
 */
export function getMonthOptionsWithAll(): FilterOption[] {
  return [{ value: "", label: "Semua Bulan" }, ...getMonthOptions()];
}

/**
 * Get month options with string values ("01"-"12")
 * @returns Array of month options with value as zero-padded string
 */
export function getMonthOptionsString(): FilterOption[] {
  return MONTH_NAMES.map((month, index) => ({
    value: String(index + 1).padStart(2, "0"),
    label: month,
  }));
}

/**
 * Get month options with string values including "Semua Bulan"
 * @returns Array of month options with string values including "All" option
 */
export function getMonthOptionsStringWithAll(): FilterOption[] {
  return [{ value: "", label: "Semua Bulan" }, ...getMonthOptionsString()];
}

/**
 * Generate year options for the last N years
 * @param count Number of years to generate (default: 5)
 * @param includeNext Whether to include next year (default: false)
 * @returns Array of year options with numeric values
 */
export function getYearOptions(
  count: number = 5,
  includeNext: boolean = false,
): FilterOption[] {
  const currentYear = new Date().getFullYear();
  const years: FilterOption[] = [];

  const startYear = includeNext ? currentYear + 1 : currentYear;
  const endYear = currentYear - count + (includeNext ? 2 : 1);

  for (let year = startYear; year >= endYear; year--) {
    years.push({
      value: year,
      label: year.toString(),
    });
  }

  return years;
}

/**
 * Generate year options with string values
 * @param count Number of years to generate (default: 5)
 * @returns Array of year options with string values
 */
export function getYearOptionsString(count: number = 5): FilterOption[] {
  return getYearOptions(count).map((option) => ({
    value: option.value.toString(),
    label: option.label,
  }));
}
