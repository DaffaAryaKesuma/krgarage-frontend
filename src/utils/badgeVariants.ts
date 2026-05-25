export const BADGE_BASE_CLASS =
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium";

export const META_LABEL_CLASS =
  "text-[11px] font-medium uppercase tracking-wide text-gray-500";

export const RANK_BADGE_BASE_CLASS =
  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white";

export const iconToneVariants = {
  primary: { bg: "bg-red-100", text: "text-red-600" },
  info: { bg: "bg-blue-100", text: "text-blue-600" },
  success: { bg: "bg-green-100", text: "text-green-600" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
  warning: { bg: "bg-amber-100", text: "text-amber-600" },
  danger: { bg: "bg-red-100", text: "text-red-600" },
  owner: { bg: "bg-purple-100", text: "text-purple-700" },
  neutral: { bg: "bg-gray-100", text: "text-gray-600" },
} as const;

export const gradientToneVariants = {
  primary: "from-red-500 to-red-600",
  info: "from-blue-500 to-blue-600",
  success: "from-green-500 to-green-600",
  emerald: "from-emerald-500 to-emerald-600",
  warning: "from-amber-500 to-amber-600",
  danger: "from-red-500 to-red-600",
  owner: "from-purple-500 to-purple-600",
  neutral: "from-gray-500 to-gray-600",
} as const;

export const solidToneVariants = {
  primary: "bg-red-600 border-red-700",
  info: "bg-blue-600 border-blue-700",
  success: "bg-green-600 border-green-700",
  emerald: "bg-emerald-600 border-emerald-700",
  warning: "bg-amber-600 border-amber-700",
  danger: "bg-red-600 border-red-700",
  owner: "bg-purple-600 border-purple-700",
  neutral: "bg-gray-600 border-gray-700",
} as const;

export const softHoverToneVariants = {
  primary: "hover:bg-red-50",
  info: "hover:bg-blue-50",
  success: "hover:bg-green-50",
  warning: "hover:bg-amber-50",
  danger: "hover:bg-red-50",
  neutral: "hover:bg-gray-50",
} as const;

export const alertBoxVariants = {
  success: {
    box: "border-green-300 bg-green-50 text-green-700",
    icon: "text-green-600",
  },
  warning: {
    box: "border-amber-300 bg-amber-50 text-amber-700",
    icon: "text-amber-600",
  },
  error: {
    box: "border-red-300 bg-red-50 text-red-700",
    icon: "text-red-600",
  },
  info: {
    box: "border-blue-300 bg-blue-50 text-blue-700",
    icon: "text-blue-600",
  },
  neutral: {
    box: "border-gray-200 bg-gray-50 text-gray-700",
    icon: "text-gray-600",
  },
} as const;

export const badgeVariants = {
  status: {
    menunggu: "border-gray-300 bg-gray-100 text-gray-600",
    dikonfirmasi: "border-blue-300 bg-blue-100 text-blue-700",
    dikerjakan: "border-amber-300 bg-amber-100 text-amber-700",
    selesai: "border-emerald-300 bg-emerald-100 text-emerald-700",
    batal: "border-red-300 bg-red-100 text-red-700",
  },
  payment: {
    lunas: "border-green-300 bg-green-100 text-green-700",
    belumLunas: "border-gray-300 bg-gray-100 text-gray-600",
  },
  inventory: {
    habis: "border-red-300 bg-red-100 text-red-800",
    kritis: "border-amber-300 bg-amber-100 text-amber-700",
    aman: "border-green-300 bg-green-100 text-green-700",
  },
  role: {
    admin: "border-red-300 bg-red-100 text-red-700",
    pemilik: "border-purple-300 bg-purple-100 text-purple-700",
    mekanik: "border-sky-300 bg-sky-100 text-sky-700",
    pelanggan: "border-gray-300 bg-gray-100 text-gray-600",
  },
  chip: {
    primary: "border-red-200 bg-red-50 text-red-700",
    neutral: "border-gray-200 bg-gray-50 text-gray-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
    success: "border-green-200 bg-green-50 text-green-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-red-200 bg-red-50 text-red-700",
  },
  rank: {
    primary: "bg-red-600",
    info: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-amber-500",
    neutral: "bg-gray-500",
  },
} as const;

export type RoleBadgeKey = keyof typeof badgeVariants.role;
export type InventoryBadgeKey = keyof typeof badgeVariants.inventory;
export type ChipBadgeKey = keyof typeof badgeVariants.chip;
export type RankBadgeKey = keyof typeof badgeVariants.rank;
export type IconToneKey = keyof typeof iconToneVariants;
export type GradientToneKey = keyof typeof gradientToneVariants;
export type SolidToneKey = keyof typeof solidToneVariants;
export type SoftHoverToneKey = keyof typeof softHoverToneVariants;
export type AlertBoxKey = keyof typeof alertBoxVariants;

export function buildBadgeClass(variantClass: string): string {
  return `${BADGE_BASE_CLASS} ${variantClass}`;
}

export function getRoleBadgeClass(role: string | null | undefined): string {
  const key = role?.toLowerCase() as RoleBadgeKey | undefined;
  const variant = key && badgeVariants.role[key]
    ? badgeVariants.role[key]
    : badgeVariants.role.pelanggan;

  return buildBadgeClass(variant);
}

export function getInventoryBadgeClass(status: InventoryBadgeKey): string {
  return buildBadgeClass(badgeVariants.inventory[status]);
}

export function getChipBadgeClass(variant: ChipBadgeKey = "neutral"): string {
  return buildBadgeClass(badgeVariants.chip[variant]);
}

export function getRankBadgeClass(variant: RankBadgeKey = "neutral"): string {
  return `${RANK_BADGE_BASE_CLASS} ${badgeVariants.rank[variant]}`;
}

export function getIconToneClass(variant: IconToneKey): string {
  const tone = iconToneVariants[variant];
  return `${tone.bg} ${tone.text}`;
}

export function getToneTextClass(variant: IconToneKey): string {
  return iconToneVariants[variant].text;
}

export function getGradientToneClass(variant: GradientToneKey): string {
  return gradientToneVariants[variant];
}

export function getSolidToneClass(variant: SolidToneKey): string {
  return solidToneVariants[variant];
}

export function getSoftHoverToneClass(variant: SoftHoverToneKey): string {
  return softHoverToneVariants[variant];
}

export function getAlertBoxClass(variant: AlertBoxKey): string {
  return `rounded-xl border p-4 shadow-sm ${alertBoxVariants[variant].box}`;
}

export function getAlertIconClass(variant: AlertBoxKey): string {
  return alertBoxVariants[variant].icon;
}
