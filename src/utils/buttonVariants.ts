export const BUTTON_BASE_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

export const BUTTON_SIZE_CLASS = {
  xs: "px-3 py-1.5 text-xs",
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-sm",
} as const;

export const BUTTON_VARIANT_CLASS = {
  primary: "bg-red-600 text-white hover:bg-red-700",
  secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  dangerOutline: "border border-red-400 bg-white text-red-600 hover:bg-red-50",
  warning: "bg-amber-600 text-white hover:bg-amber-700",
  warningOutline: "border border-amber-600 bg-white text-amber-700 hover:bg-amber-50",
  success: "bg-green-600 text-white hover:bg-green-700",
  successOutline: "border border-green-600 bg-white text-green-600 hover:bg-green-50",
  info: "bg-blue-600 text-white hover:bg-blue-700",
  infoOutline: "border border-blue-700 bg-white text-blue-700 hover:bg-blue-50",
  neutralOutline: "border border-gray-700 bg-white text-gray-700 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-50",
  link: "text-red-600 hover:text-red-700",
} as const;

export const ICON_BUTTON_BASE_CLASS =
  "inline-flex items-center justify-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-60";

export const ICON_BUTTON_SIZE_CLASS = {
  sm: "h-8 w-8 text-sm",
  md: "h-9 w-9 text-base",
  lg: "h-10 w-10 text-lg",
} as const;

export const ICON_BUTTON_VARIANT_CLASS = {
  neutral: "text-gray-600 hover:bg-gray-100",
  primary: "text-red-600 hover:bg-red-50",
  info: "text-blue-600 hover:bg-blue-100",
  success: "text-green-600 hover:bg-green-100",
  danger: "text-red-600 hover:bg-red-100",
  subtle: "text-gray-400 hover:text-red-600",
} as const;

export type ButtonSize = keyof typeof BUTTON_SIZE_CLASS;
export type ButtonVariant = keyof typeof BUTTON_VARIANT_CLASS;
export type IconButtonSize = keyof typeof ICON_BUTTON_SIZE_CLASS;
export type IconButtonVariant = keyof typeof ICON_BUTTON_VARIANT_CLASS;

export function getButtonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extraClass = "",
): string {
  return [
    BUTTON_BASE_CLASS,
    BUTTON_SIZE_CLASS[size],
    BUTTON_VARIANT_CLASS[variant],
    extraClass,
  ]
    .filter(Boolean)
    .join(" ");
}

export function getFullWidthButtonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extraClass = "",
): string {
  return getButtonClass(variant, size, `w-full ${extraClass}`.trim());
}

export function getIconButtonClass(
  variant: IconButtonVariant = "neutral",
  size: IconButtonSize = "md",
  extraClass = "",
): string {
  return [
    ICON_BUTTON_BASE_CLASS,
    ICON_BUTTON_SIZE_CLASS[size],
    ICON_BUTTON_VARIANT_CLASS[variant],
    extraClass,
  ]
    .filter(Boolean)
    .join(" ");
}
